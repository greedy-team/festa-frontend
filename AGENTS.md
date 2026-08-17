# festa-frontend

축제 정보 서비스 프론트엔드. Next.js App Router 기반이며 Vercel에 배포합니다.

## 빠른 시작

```bash
pnpm install
pnpm dev          # 개발 서버
pnpm build        # 프로덕션 빌드 (CI가 PR에서 검증)
pnpm lint         # ESLint
```

로컬 환경변수는 직접 만들지 말고 당겨옵니다.

```bash
vercel env pull .env.local
```

## 작업 원칙

**코드를 만지기 전에 [`.claude/rules/coding-principles.md`](./.claude/rules/coding-principles.md)를 읽으세요.**

가정을 말하고 시작하기 / 최소한으로 만들기 / 외과적으로 바꾸기 / 검증 기준 먼저 세우기 /
같은 규칙을 두 곳에 적지 않기 — 다섯 가지이며, 각각 이 프로젝트에서 실제로 터진 사례가
근거로 붙어 있습니다.

같은 파일 뒤쪽의 **코드 규약**은 이 스택에서의 표기 규칙입니다 — 치수는 리터럴로·색과
타이포는 토큰으로 / 조건부 렌더는 삼중연산자로 / CSS Module을 기본으로 쓰지 않기.

## 지침 파일 지도

**내용은 전부 `.claude/` 아래에 둡니다. 다른 도구는 그것을 읽습니다.**
같은 규칙을 두 벌로 관리하면 반드시 어긋나기 때문입니다.

| 파일 | 담는 것 | Claude Code | Codex |
| --- | --- | --- | --- |
| `AGENTS.md` | 프로젝트 사실·제약 (이 파일) | `CLAUDE.md`가 import | 세션 시작 시 자동 |
| `.claude/rules/coding-principles.md` | 작업 원칙 · 코드 규약 | `CLAUDE.md`가 import | **이 파일의 링크를 따라 읽으세요** |
| `TEAM-CONVENTIONS.md` | 이슈·브랜치·커밋·PR 규칙 | 필요 시 | 필요 시 |
| `.claude/commands/*.md` | 커맨드 워크플로우 | 슬래시 커맨드 | `.agents/skills/`가 가리킴 |

Codex는 `AGENTS.md`와 `.agents/skills/`만 자동으로 읽습니다. `.claude/` 아래 파일은
자동으로 열리지 않으니, 위 표의 경로를 직접 읽으세요.

## 하드 제약

깨면 안 되는 것들입니다. 어긴 채 진행하지 마세요.

- **패키지 매니저는 pnpm.** `npm`·`yarn` 금지 — `package-lock.json`이 생기면 CI가 깨집니다
- **`main`에 직접 푸시 금지.** `main` 푸시는 곧 Vercel Production 배포입니다
- **앱 환경변수는 Vercel에 등록.** 빌드가 Vercel에서 돌기 때문에 GitHub Secrets에 넣어도 앱에 들어가지 않습니다
- **커밋 메시지에 AI 태그 금지.** `Co-Authored-By: Claude`·`Generated with …`·GPT 서명 등 전부 — 규칙 원본은 [`TEAM-CONVENTIONS.md`](./TEAM-CONVENTIONS.md) §4
- **커밋·푸시는 사용자가 요청할 때만.** 알아서 하지 않습니다

## 기술 스택

- Next.js 16 (App Router) · React 19 · TypeScript 5
- Tailwind CSS 4 · ESLint 9
- pnpm 10 (`packageManager` 필드로 고정 — CI가 이 값을 읽습니다)

## 코드 스타일

- 기존 파일의 스타일을 따릅니다. 주변 코드와 다른 방식을 새로 들이지 않습니다
- 컴포넌트·유틸을 새로 만들기 전에 이미 있는지 먼저 찾습니다
- 요청하지 않은 리팩터링·추상화를 끼워 넣지 않습니다

## 작업 흐름

이슈 → 브랜치 → 커밋 → PR → 릴리스가 GitHub Actions로 이어집니다.
**규칙 원본은 [`TEAM-CONVENTIONS.md`](./TEAM-CONVENTIONS.md)입니다.** 여기서 반복하지 않습니다.

요약하면:

- 작업은 **이슈부터** 만듭니다. 봇이 브랜치명과 커밋 메시지를 댓글로 알려줍니다
- 브랜치는 `develop`에서 분기하고, **커밋 전에 빈 채로 먼저 푸시**합니다
- 브랜치명은 `타입_이슈번호_슬러그` (한글 그대로 씁니다)
- 커밋은 `<타입> : <변경 사항 설명> #<이슈번호>`
- PR은 `develop`으로. 머지하면 이슈가 자동으로 닫힙니다

`main`으로 가는 PR은 `develop`에서만 엽니다. 이것만 워크플로우로 강제됩니다.

## 커맨드

위 흐름을 대신 실행하는 커맨드가 있습니다.

| | |
| --- | --- |
| Claude Code | `.claude/commands/*.md` — `/issue` `/issue-branch` `/commit` `/report` `/pr-description` `/rp` `/cr` |
| Codex | `.agents/skills/*/SKILL.md` — 같은 파일을 읽습니다 |

**규칙 원본은 `.claude/commands/` 한 곳뿐입니다.** Codex 스킬은 내용을 복사하지 않고 그 파일을 가리킵니다. 커맨드를 고치면 양쪽에 동시에 반영됩니다.

산출물은 레포에 커밋합니다 (숨김 폴더 아님):

```
docs/issues/    이슈 초안
docs/reports/   구현 보고서
docs/pr/        PR 본문 초안
```

## CI/CD

| 언제 | 무엇이 |
| --- | --- |
| PR → `main`/`develop` | 빌드 검증 (`pnpm install --frozen-lockfile && pnpm build`) |
| push `develop` | Vercel Preview 배포 |
| push `main` | Vercel Production 배포 + 버전 태그 + README 갱신 |
| 이슈 생성·라벨 변경 | 브랜치명·커밋 메시지 댓글 |
| PR → `develop` 머지 | 이슈 자동 종료 |
| `develop` → `main` PR | CHANGELOG 생성 후 자동 머지 |

워크플로우가 **어느 브랜치에서 읽히는지**가 중요합니다. `issues`·`issue_comment`·
`pull_request_target`은 기본 브랜치(`main`)에서 읽습니다. 봇 설정을 `develop`에만 두면
이슈 이벤트에는 반영되지 않습니다.

## 주의할 점

- 릴리스 워크플로우는 `git add -A`로 커밋합니다. 워킹 트리에 남긴 임시 파일이 릴리스 커밋에 쓸려 들어갑니다
- `.github/scripts/`와 워크플로우는 `npx projectops` 업데이트 시 덮어써집니다. 설정은 코드 기본값이 아니라 `version.yml`에 둡니다
- `version.yml`의 `deploy:` 블록은 런타임에 아무도 읽지 않습니다. `npx projectops` 재실행 때만 쓰이는 메모입니다
