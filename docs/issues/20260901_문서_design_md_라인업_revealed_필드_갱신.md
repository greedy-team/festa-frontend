## 제목

📄 [문서][축제상세] DESIGN.md 라인업 규칙의 revealed 필드 서술 갱신 (DEC-0116)

## 본문

## 🔍 현재 문제점

- `.claude/rules/DESIGN.md:665`가 라인업 요약(day-card) 규칙을 아직 옛 필드로 서술한다: "미공개(`revealed: false`) 아티스트는 원형을 `{colors.divider}`로, 이름 대신 공개 예정을 `{colors.muted-soft}`로 낮춰서 자리를 그대로 보여준다".
- DEC-0116(#142, PR #144)으로 `LineupArtist` 응답 계약에서 `revealed` 파생 불리언이 제거됐고, 시크릿 게스트 판별은 `id`(전 필드 null) 여부로 바뀌었다. 코드(`src/`)는 정리됐으나 이 규칙 파일만 남았다.
- 에이전트 규칙 파일이라, 다음에 이 문서를 참조해 라인업 화면을 만드는 사람이 응답에 존재하지 않는 `revealed` 필드로 다시 분기를 넣을 수 있다 — DEC-0116이 막으려던 바로 그 버그다.
- PR #144 리뷰에서 EM-H20이 승인 조건이 아닌 별건으로 분리해 지적했다.

## 💡 해결 방안 / 제안 기능

- 위치: `.claude/rules/DESIGN.md` 라인업 섹션(요약 day-card 서술, 665행 부근).
- `revealed: false` 표현을 시크릿 게스트 판별 기준(`id`가 null인 원소 = 시크릿 게스트)으로 바꾼다. 화면 규칙(원형 `{colors.divider}`, 이름 대신 "공개 예정" `{colors.muted-soft}`, 자리 유지)은 그대로 둔다.
- 같은 문서 내 라인업 관련 다른 서술에도 `revealed` 잔존 표현이 있는지 함께 훑는다.
- 문서만 수정한다. 코드·동작 변경 없음.

## 🔧 작업 내용

- [ ] `.claude/rules/DESIGN.md`에서 `revealed` 필드 기준 서술을 `id` null 여부 기준으로 갱신
- [ ] 라인업 섹션 전체에서 `revealed` 잔존 표현 확인 후 정리
- [ ] DEC-0116과 정합되는지 최종 확인

## 👤 담당자

- 담당: 이름
