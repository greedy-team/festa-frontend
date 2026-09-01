### 📌 작업 개요

PR #144 (`chore : LineupArtist 판별자를 revealed에서 id로 교체 #142`)의 리뷰 결과와 리뷰어 코멘트를 분석하고, 지적된 후속 항목을 별도 이슈로 등록했다.

- PR #144: `LineupArtist` 판별 유니온의 판별자를 `revealed` → `id`로 교체, 목 픽스처·핸들러에서 `revealed` 파생 필드 제거. 근거는 festa-brain 볼트 DEC-0116.
- 리뷰 결과: EM-H20 APPROVED. 유일한 지적(`DESIGN.md:665` 옛 필드 서술)은 별건으로 분리 요청.
- 후속 조치: 지적 사항을 이슈 #146 (`type: docs`)으로 등록, PR #144에 답글 게시.

### 🔍 PR #144 분석

#### 변경 내용

| 파일 | 변경 |
| --- | --- |
| `src/features/festivals/types.ts` | `LineupArtist` 유니온에서 `revealed` 필드 제거, 판별자를 `id`로 |
| `src/features/festivals/components/LineupSheet.tsx` | `artist.revealed` → `artist.id !== null` (5곳) |
| `src/features/festivals/components/DayCard.tsx` | `artist.revealed` → `artist.id !== null` (4곳) |
| `src/mocks/fixtures/db.ts` | 픽스처 타입·데이터에서 `revealed` 제거 |
| `src/mocks/fixtures/appearances.ts` | 불필요해진 `&& a.revealed` 제거 |
| `src/mocks/handlers/festivals.ts` | `GET /festivals/:id` + `:id/summary` 응답에서 `revealed` 제거, `artistId === null`로 분기 |

#### 타당성 판단

- 판별자 교체가 안전한 이유: TypeScript는 판별자 낱말이 아니라 유니온 구조로 좁힌다. `null`은 unit type이라 `id !== null` 가드로 `revealed` 때와 동일하게 좁혀지고, `gridTint(artist.id)`도 non-null assertion 없이 `number`로 내려간다. DEC-0116 문서가 같은 근거를 명시.
- 런타임 영향 없음: `fetchJson<T>`는 런타임 스키마 검증이 없는 타입 단언이다. 이 변경은 컴파일 타임 + 목 픽스처 한정. 응답 파서가 없어 `revealed` 키 제거로 깨지는 지점이 없다.
- `appearances.ts`의 `&& a.revealed` 제거는 이미 죽은 조건 정리. `findAppearances(artistId: number)`에서 인자는 항상 실제 번호이고 시크릿 게스트는 `artistId === null`이라 `=== artistId` 비교에서 이미 제외된다. 동작 변화 없음.
- `/summary` 핸들러까지 정리한 것은 이슈 체크리스트 범위를 넘었지만 정당하다. 유니온에서 `revealed`를 지우면 summary 핸들러도 컴파일이 깨지고, DEC-0116 원칙("어떤 응답에도 파생 불리언 없음")이 동일 적용된다.

#### CI·머지 상태 (확인 시점)

- 빌드 검증 · 유닛테스트 · E2E 테스트 전부 SUCCESS
- `MERGEABLE` / `CLEAN` (develop과 충돌 없음), `reviewDecision: APPROVED`

### 💬 리뷰어 코멘트 분석 (EM-H20)

리뷰어가 남긴 코멘트의 핵심 3가지:

1. BASE/HEAD 양쪽 목 서버를 실제로 띄워 응답을 diff했고, `revealed` 키가 빠진 것 외 차이 없음을 확인. "외부 동작 변경 없음"을 리뷰어가 직접 검증.
2. 시크릿 게스트 원소가 여전히 `lineupTotal` 카운트에 포함됨을 확인. 응답에서 시크릿 원소를 빼면 라인업 규모가 실제보다 작아 보이는데, ISS-0057이 확정한 "자리 유지" 원칙을 이 PR이 지켰다는 뜻.
3. `.claude/rules/DESIGN.md:665`가 아직 `revealed: false`로 라인업 요약(day-card) 규칙을 서술. 에이전트·개발자가 라인업 화면을 만들기 전에 읽는 규칙 파일이라, 다음 구현자가 응답에 없는 필드로 다시 분기를 넣을 위험. DEC-0116이 없애려던 바로 그 버그의 재발 경로.

리뷰어는 3번을 승인 조건이 아닌 별건으로 분리 요청했다.

### ✅ 후속 조치

#### 이슈 #146 등록

- **파일**: `docs/issues/20260901_문서_design_md_라인업_revealed_필드_갱신.md`
- **이슈**: [#146](https://github.com/greedy-team/festa-frontend/issues/146) — `📄 [문서][축제상세] DESIGN.md 라인업 규칙의 revealed 필드 서술 갱신 (DEC-0116)`
- **라벨**: `작업전`, `type: docs`
- **봇 발급 브랜치**: `docs_146_design_md_라인업_규칙의_revealed_필드_서술_갱신_dec_0116`
- **작업 범위**: `.claude/rules/DESIGN.md` 665행 부근의 `revealed: false` 서술을 `id` null 여부 기준(시크릿 게스트 = 전 필드 null 원소)으로 교체 + 라인업 섹션의 다른 `revealed` 잔존 표현 확인

#### PR #144 답글

- 리뷰 감사 및 BASE/HEAD 검증에 대한 확인
- `DESIGN.md:665`는 #146으로 분리 등록했음을 안내
- 이 PR은 그대로 진행

### 🧭 결정 기록 (ADR)

해당 없음 — 리뷰 분석·이슈 등록 작업이며 새로운 구현 결정은 없다. PR #144의 구현 근거는 볼트 DEC-0116에 이미 기록되어 있다.

### 📌 참고사항

- PR #144는 머지 가능 상태이며, `develop` 머지 시 이슈 #142 자동 종료.
- DEC-0116 문서의 "결과(부정)"가 "파생값을 빼면 문서가 뒤늦게 따라온다"를 예고했고, #146이 그 자리에 해당한다.
- DEC-0116은 노션 API 명세의 `/festivals/{id}` 응답 예시에도 `order`·`revealed`가 남아 있다고 기록. 이는 백엔드·노션 쪽 항목으로 이 프론트 이슈 범위 밖.
