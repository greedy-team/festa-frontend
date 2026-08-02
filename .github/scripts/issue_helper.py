#!/usr/bin/env python3
"""ISSUE-HELPER — 이슈 생성/제목수정 시 브랜치명·커밋 메시지 댓글 생성 (내재화 버전).

구 외부 액션(Cassiiopeia/github-issue-helper@deploy)을 대체한다. stdlib 전용.

브랜치 규칙: `{타입}_{이슈번호}_{영문-슬러그}`  (예: feat_112_install-banner)
  타입은 이슈 제목의 [태그]에서 추론한다 — COMMIT_TYPE_MAP 참조.
  슬러그는 ASCII 소문자 kebab-case. 한글은 넣지 않는다 — 한글 브랜치명은
  GitHub API PR 생성 시 `422 Validation Failed: head invalid`를 유발한다.

⚠️ 불변 계약 — 아래 형식을 기계 파싱하는 소비자가 있으므로 절대 깨지 마라:
  1. 이슈 번호가 `_숫자_`(또는 끝)로 구분돼 등장할 것
     - scripts/common/issue_number.py : (?:^|[/_-])(\\d+)(?:[/_-]|$)  ← 커밋/보고서/리뷰 스킬
  2. 댓글 본문의 `### 브랜치` 제목 + 코드블록

설정: version.yml metadata.template.options.issue_helper (없으면 전부 기본값).
"""
from __future__ import annotations

import json
import os
import re
import sys
import unicodedata
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

# ── 기본 설정 (version.yml에 issue_helper 섹션이 없을 때) ─────────────────
DEFAULT_CONFIG = {
    "branch_prefix": "",
    "max_branch_length": 100,
    "timezone": "Asia/Seoul",
    "commit_template": "${issueTitle} : ${commitType} : {변경 사항에 대한 설명} ${issueUrl}",
    "commit_type_map": {},
    "comment_marker": "<!-- ISSUE-HELPER -->",
    "show_guide": True,
}

# 제목 태그 → 타입 (브랜치명·커밋 메시지 공용). 설정 commit_type_map이 병합됨.
DEFAULT_COMMIT_TYPE_MAP = {
    "버그": "fix",
    "기능요청": "feat",
    "기능추가": "feat",
    "기능개선": "feat",
    "리팩토링": "refactor",
    "설정": "chore",
    "문서": "docs",
    "디자인": "design",
    "시험요청": "test",
}

FALLBACK_TYPE = "feat"   # 제목에 타입 태그가 없을 때. 경고와 함께 쓴다.

_TAG = re.compile(r"\[([^\]]*)\]")
_NON_SLUG = re.compile(r"[^a-z0-9]+")   # ASCII 소문자/숫자 외 → -


def _strip_emoji(text: str) -> str:
    """이모지(So)·제어문자(C*)·변형선택자 제거 — 구 TS \\p{So}|\\p{C}|\\uFE0F|\\u200D 패리티."""
    out = []
    for ch in text:
        if ch in ("️", "‍"):
            continue
        cat = unicodedata.category(ch)
        if cat == "So" or cat.startswith("C"):
            continue
        out.append(ch)
    return "".join(out)


def extract_issue_title(raw_title: str) -> str:
    """[태그]·이모지 제거. 결과가 비면 원본 trim 반환 (구 동작 보존)."""
    title = _TAG.sub("", raw_title).strip()
    title = _strip_emoji(title).strip()
    return title if title else raw_title.strip()


def slugify(title: str) -> str:
    """ASCII 소문자 kebab-case. 한글 등 비ASCII는 버린다 (전부 버려지면 빈 문자열)."""
    return _NON_SLUG.sub("-", title.lower()).strip("-")


def infer_commit_type(raw_title: str, type_map: dict | None = None) -> str | None:
    """원본 제목의 [태그]들을 순서대로 매핑 조회. 매치되는 태그가 없으면 None.

    None을 기본값으로 뭉개지 않는 이유: 태그 없는 제목에 feat을 붙이면 버그 이슈가
    feat_ 브랜치를 받고도 아무도 모른다. 호출부가 FALLBACK_TYPE과 경고를 함께 붙인다.
    """
    merged = dict(DEFAULT_COMMIT_TYPE_MAP)
    if type_map:
        merged.update(type_map)
    for tag in _TAG.findall(raw_title):
        commit_type = merged.get(tag.strip())
        if commit_type:
            return commit_type
    return None


def create_branch_name(
    title: str,
    issue_number: int | str,
    commit_type: str,
    branch_prefix: str = "",
    max_branch_length: int = 100,
) -> str:
    """`{타입}_{번호}_{슬러그}`. 슬러그가 비면(한글 전용 제목) 타입_번호까지만."""
    slug = slugify(title)
    base = f"{commit_type}_{issue_number}"
    if slug:
        base = f"{base}_{slug}"
    if max_branch_length > 0:
        base = base[:max_branch_length].rstrip("-_")
    return f"{branch_prefix}{base}"


def render_commit_message(template: str, ctx: dict) -> str:
    """${변수} 치환 — 기존 5종 + commitType/labels/assignees. 미지 변수는 그대로 둔다."""
    out = template
    for key in ("issueTitle", "issueUrl", "issueNumber", "branchName",
                "date", "commitType", "labels", "assignees"):
        out = out.replace("${" + key + "}", str(ctx.get(key, "")))
    return out.strip()


# ── 설정 로드 (version.yml — pyyaml 없이 이 섹션만 파싱) ────────────────────
def _unquote(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in ("'", '"'):
        return value[1:-1]
    return value


def load_config(repo_root: str = ".") -> dict:
    """version.yml의 issue_helper 블록을 파싱해 DEFAULT_CONFIG에 병합한다.

    파일/섹션이 없으면 기본값 그대로 — 기존 통합 레포의 무설정 동작을 보존한다.
    향후 마법사 '설정 중앙관리' 메뉴가 이 섹션을 읽고 쓴다 (플랫 스칼라 + 얕은 맵 1개 유지).
    """
    cfg = dict(DEFAULT_CONFIG)
    cfg["commit_type_map"] = dict(DEFAULT_CONFIG["commit_type_map"])
    path = Path(repo_root) / "version.yml"
    if not path.exists():
        return cfg

    lines = path.read_text(encoding="utf-8").splitlines()
    section_indent = None
    in_type_map = False
    type_map_indent = 0
    for line in lines:
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        indent = len(line) - len(line.lstrip())

        if section_indent is None:
            if re.match(r"^issue_helper:\s*(#.*)?$", stripped):
                section_indent = indent
            continue

        if indent <= section_indent:  # 섹션 종료
            break

        m = re.match(r"""^["']?([^"':]+)["']?\s*:\s*(.*?)\s*$""", stripped)
        if not m:
            continue
        key, raw = m.group(1).strip(), re.sub(r"\s+#.*$", "", m.group(2))

        if in_type_map and indent > type_map_indent:
            cfg["commit_type_map"][key] = _unquote(raw)
            continue
        in_type_map = False

        if key == "commit_type_map":
            in_type_map = True
            type_map_indent = indent
        elif key == "max_branch_length":
            try:
                cfg[key] = int(_unquote(raw))
            except ValueError:
                pass  # 잘못된 값은 기본값 유지
        elif key == "show_guide":
            cfg[key] = _unquote(raw).lower() != "false"
        elif key in ("branch_prefix", "timezone", "commit_template", "comment_marker"):
            cfg[key] = _unquote(raw)
    return cfg


# ── 동적 가이드 — 레포에 실존하는 워크플로우만 안내 (거짓 안내 원천 차단) ────
# ⚠️ 확장 규칙: 새 워크플로우가 브랜치 규칙(YYYYMMDD_#번호_)에 의존하게 되면 여기 한 줄 추가.
#    파일 실존 기반이므로 마법사 setting에서 타입 변경 시 자동 추종된다.
GUIDE_LINES = [
    ("PROJECT-FLUTTER-PROJECTOPS-APP-BUILD-TRIGGER.yaml",
     "`@projectops app build` 댓글 빌드 — 이 댓글의 브랜치를 자동 인식해서 빌드"),
    ("PROJECT-FLUTTER-ANDROID-TEST-APK.yaml",
     "테스트 APK 빌드 — 브랜치의 `#이슈번호`로 이슈 정보를 빌드 노트에 자동 포함"),
    ("PROJECT-FLUTTER-IOS-TEST-TESTFLIGHT.yaml",
     "테스트 TestFlight 빌드 — 브랜치의 `#이슈번호`로 이슈 정보를 자동 연동"),
]

_GUIDE_ALWAYS = [
    "커밋/보고서/리뷰 스킬 — 브랜치명에서 이슈 번호를 자동 추출해 커밋 메시지·보고서 완성",
]

_BRANCH_STRATEGY = (
    "**브랜치 전략**\n"
    "- `main` — 배포 트리거. 푸시하면 Vercel **Production** 자동 배포\n"
    "- `develop` — 배포 전 통합. 푸시하면 Vercel **Preview** 자동 생성\n"
    "- 작업 브랜치는 `develop`에서 따고 `develop`으로 PR을 올립니다\n"
)


def build_guide(workflows_dir: Path) -> str:
    """접이식(details) 안내 본문. 레포에 의존 기능이 있으면 그 목록을, 없으면 권장 한 줄만."""
    active = [text for fname, text in GUIDE_LINES if (workflows_dir / fname).exists()]
    items = "\n".join(f"- {t}" for t in active + _GUIDE_ALWAYS)
    return (
        "<details>\n"
        "<summary>💡 브랜치 규칙</summary>\n\n"
        f"{_BRANCH_STRATEGY}\n"
        "**이름 규칙** — `타입_이슈번호_영문-슬러그` (타입은 이슈 제목의 `[태그]`에서 결정)\n\n"
        "| 태그 | 타입 | 예시 |\n"
        "| --- | --- | --- |\n"
        "| `[기능요청]` `[기능추가]` `[기능개선]` | `feat` | `feat_112_install-banner` |\n"
        "| `[버그]` | `fix` | `fix_118_icon-404` |\n"
        "| `[리팩토링]` | `refactor` | `refactor_125_api-client` |\n"
        "| `[설정]` | `chore` | `chore_131_ci-setup` |\n"
        "| `[문서]` | `docs` | `docs_132_ground-rule` |\n\n"
        "슬러그는 영문 소문자 kebab-case만 씁니다 — 한글 브랜치명은 PR 생성 시 "
        "`422 Validation Failed`를 일으킵니다. 제목이 한글뿐이면 뒤에 영문 요약을 직접 붙이세요.\n\n"
        "이 형식을 쓰면 아래가 자동으로 연동됩니다:\n"
        f"{items}\n"
        "</details>"
    )


def build_comment_body(cfg: dict, branch_name: str, commit_message: str,
                       guide: str, notice: str = "") -> str:
    """불변 계약 2: 서명 한 줄 + ### 브랜치 코드블록 구조 유지 (구 파서 하위호환)."""
    marker = cfg["comment_marker"]
    guide_block = f"\n{guide}\n" if (cfg.get("show_guide", True) and guide) else ""
    return (
        f"{marker}\n\n"
        "이슈 브랜치 가이드\n"
        "---\n\n"
        f"{notice}"
        "### 브랜치\n"
        f"```\n{branch_name}\n```\n\n"
        "### 커밋 메시지\n"
        f"```\n{commit_message}\n```\n"
        f"{guide_block}\n"
        f"{marker}"
    )


# ── 이벤트 처리 ──────────────────────────────────────────────────────────
def should_process(payload: dict) -> bool:
    """opened 또는 edited(제목 변경)만 처리 — 구 워크플로우 if 조건과 동일."""
    action = payload.get("action")
    if action == "opened":
        return True
    return action == "edited" and bool(payload.get("changes", {}).get("title"))


def today_yyyymmdd(tz_name: str) -> str:
    """설정 타임존 기준 오늘 날짜. 구 액션의 UTC 러너 시각 오차(한국 새벽 -9h)를 개선."""
    try:
        from zoneinfo import ZoneInfo
        return datetime.now(ZoneInfo(tz_name)).strftime("%Y%m%d")
    except Exception:
        return datetime.now(timezone.utc).strftime("%Y%m%d")


def prepare_comment(payload: dict, cfg: dict, workflows_dir: Path, date_yyyymmdd: str):
    """페이로드 → (브랜치명, 커밋 메시지, 댓글 본문). 네트워크 무의존 — 테스트 가능 단위."""
    issue = payload["issue"]
    raw_title = issue["title"]
    title = extract_issue_title(raw_title)
    issue_number = str(issue["number"])

    commit_type = infer_commit_type(raw_title, cfg["commit_type_map"])
    notice = ""
    if commit_type is None:
        commit_type = FALLBACK_TYPE
        tags = " ".join(f"`[{t}]`" for t in sorted(set(DEFAULT_COMMIT_TYPE_MAP)))
        notice = (
            f"> ⚠️ 제목에 타입 태그가 없어 `{FALLBACK_TYPE}`으로 추정했습니다.\n"
            f"> 제목 앞에 {tags} 중 하나를 붙이면 타입이 정확해집니다 "
            "(제목을 수정하면 이 댓글도 갱신됩니다).\n\n"
        )

    branch = create_branch_name(
        title, issue_number, commit_type,
        branch_prefix=cfg["branch_prefix"], max_branch_length=cfg["max_branch_length"])

    ctx = {
        "issueTitle": title,
        "issueUrl": issue["html_url"],
        "issueNumber": issue_number,
        "branchName": branch,
        "date": date_yyyymmdd,
        "commitType": commit_type,
        "labels": ", ".join(l["name"] for l in issue.get("labels", [])),
        "assignees": ", ".join(a["login"] for a in issue.get("assignees", [])),
    }
    commit_message = render_commit_message(cfg["commit_template"], ctx)
    body = build_comment_body(cfg, branch, commit_message, build_guide(workflows_dir), notice)
    return branch, commit_message, body


# ── GitHub API (urllib — 같은 레포 이슈 댓글이라 redirect 없음) ──────────────
_API = "https://api.github.com"

# 구 액션이 남긴 댓글도 upsert 대상으로 매칭 (중복 댓글 방지 — 하위호환)
LEGACY_MARKER_HINTS = ("github-issue-helper", "<!-- SUH-ISSUE-HELPER -->")


def _request(method: str, url: str, token: str, data: dict | None = None):
    req = urllib.request.Request(url, method=method)
    req.add_header("Authorization", f"token {token}")
    req.add_header("Accept", "application/vnd.github+json")
    payload = None
    if data is not None:
        payload = json.dumps(data).encode("utf-8")
        req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req, payload) as res:
        return json.loads(res.read().decode("utf-8"))


def find_existing_comment(comments: list, marker: str):
    """신형 마커 우선, 없으면 구 액션 마커 힌트로 매칭."""
    for c in comments:
        if marker in (c.get("body") or ""):
            return c
    for c in comments:
        body = c.get("body") or ""
        if any(hint in body for hint in LEGACY_MARKER_HINTS):
            return c
    return None


def upsert_comment(owner: str, repo: str, issue_number: int, marker: str, body: str, token: str):
    comments = []
    page = 1
    while True:
        batch = _request(
            "GET",
            f"{_API}/repos/{owner}/{repo}/issues/{issue_number}/comments?per_page=100&page={page}",
            token)
        comments.extend(batch)
        if len(batch) < 100:
            break
        page += 1

    existing = find_existing_comment(comments, marker)
    if existing:
        _request("PATCH", f"{_API}/repos/{owner}/{repo}/issues/comments/{existing['id']}",
                 token, {"body": body})
        return "updated"
    _request("POST", f"{_API}/repos/{owner}/{repo}/issues/{issue_number}/comments",
             token, {"body": body})
    return "created"


def main() -> int:
    event_path = os.environ.get("GITHUB_EVENT_PATH", "")
    token = os.environ.get("GITHUB_TOKEN", "")
    if not event_path or not Path(event_path).exists():
        print("❌ GITHUB_EVENT_PATH가 없습니다 (Actions 환경 전용)", file=sys.stderr)
        return 1
    if not token:
        print("❌ GITHUB_TOKEN이 없습니다", file=sys.stderr)
        return 1

    payload = json.loads(Path(event_path).read_text(encoding="utf-8"))
    if not should_process(payload):
        print("ℹ️ 처리 대상 이벤트가 아님 (opened/제목 edited만) → 종료", file=sys.stderr)
        return 0

    cfg = load_config(".")
    branch, commit_message, body = prepare_comment(
        payload, cfg, Path(".github") / "workflows", today_yyyymmdd(cfg["timezone"]))

    owner = payload["repository"]["owner"]["login"]
    repo = payload["repository"]["name"]
    result = upsert_comment(
        owner, repo, payload["issue"]["number"], cfg["comment_marker"], body, token)
    print(f"✅ 댓글 {result}: {branch}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
