### 📌 작업 개요

`PageFadeIn`(`src/components/ui/PageFadeIn.tsx`)은 `useState(false)`로 시작해 초기 렌더가
`opacity-0`(안 보이는 쪽)이었다. `useEffect` + `requestAnimationFrame` 2번이 돈 뒤에야
`visible = true`로 바뀌어 콘텐츠가 나타난다. 즉 SSR HTML이 `opacity-0`로 나가고,
클라이언트 JS가 실행돼야만 콘텐츠가 보였다 — JS 번들 로드 실패·하이드레이션 중단·JS
비활성 등으로 `useEffect`가 안 돌면 콘텐츠가 `opacity-0`인 채로 영구히 빈 화면이 된다.

같은 화면군의 `FadeInSection`은 반대로 `"idle"`(= `opacity-100`, 보이는 쪽)로 시작해 JS가
없어도 콘텐츠가 남는다. 두 컴포넌트의 초기 상태 전략이 어긋나 있었고, 이를 `FadeInSection`
쪽으로 통일한다.

### 🎯 구현 목표

- `PageFadeIn`의 초기 상태를 보이는 쪽으로 뒤집는다 (기본 렌더 `opacity-100`)
- 진입 페이드업은 상태(`useState`)가 아니라 CSS 애니메이션으로 얹는다
- JS가 실행되지 않아도 최종 상태(콘텐츠 보임)로 남는다
- `prefers-reduced-motion` 대응 유지
- 정상 환경의 진입 페이드업 연출은 유지
- 컴포넌트 한 곳 수정으로 `PageFadeIn` 사용 6개 화면 전체에 반영

### ✅ 구현 내용

#### PageFadeIn을 CSS 애니메이션 기반으로 재구성

- **파일**: `src/components/ui/PageFadeIn.tsx`
- **변경 내용**:
  - `"use client"` · `useState` · `useEffect` · `requestAnimationFrame` 제거
  - 렌더를 `<div className="animate-fade-up motion-reduce:animate-none ...">` 한 줄로 축소
  - 기본(애니메이션 비활성) 상태는 `opacity-100` — `opacity-0` 유틸리티를 아예 걸지 않는다
  - JSDoc을 새 전략(FadeInSection과 동일)으로 갱신
- **이유**: `animate-fade-up`은 이미 `globals.css`의 `@theme`에 정의돼 있고
  (`fade-up 0.7s ease-out both`, 키프레임 `opacity 0→1` · `translateY(16px)→0`)
  `Hero.tsx`가 같은 방식(`animate-fade-up` + `motion-reduce:animate-none`)으로 쓰고 있다.
  새 메커니즘을 만들지 않고 기존 토큰·패턴을 재사용한다

### 🧭 결정 기록 (ADR)

#### `@starting-style` 대신 기존 `animate-fade-up` 유틸리티 사용

- **문제**: 이슈는 초기 상태 뒤집기의 구현 방식으로 `@starting-style` 또는 mount 시
  `animation` 두 가지를 제시했다
- **선택**: 이미 `globals.css`에 있고 `Hero.tsx`에서 검증된 `animate-fade-up` 유틸리티를
  그대로 쓴다
- **대안**: `@starting-style` — 새 CSS를 추가해야 하고, `browserslist`에 명시된
  삼성인터넷 19+ 지원 여부가 불확실하다 (Baseline 2024). `animate-fade-up`은 순수
  `@keyframes`라 지원 범위 전체에서 동작한다
- **트레이드오프**: 진입 지속 시간이 500ms → 700ms로 바뀐다. 대신 홈 히어로와 진입
  연출이 통일되고, 애니메이션 정의가 코드베이스에 하나만 남는다

#### `"use client"` 제거

- **문제**: 상태·이펙트가 없어지면서 클라이언트 컴포넌트일 이유가 사라졌다
- **선택**: `"use client"`를 떼고 순수 래퍼로 둔다. 6개 사용처는 전부 서버
  컴포넌트(`page.tsx`)이며, 서버·클라이언트 양쪽에서 그대로 import 가능하다
- **이유**: 「내 변경 때문에 안 쓰이게 된 것은 치운다」 — `useEffect`가 사라지면
  `"use client"`는 죽은 지시자다. `pnpm build` 통과로 SSR/RSC 경로 확인

### 🔧 주요 변경사항 상세

빌드 산출 CSS 확인:

```css
.animate-fade-up{animation:var(--animate-fade-up)}
/* --animate-fade-up: fade-up .7s ease-out both */
@keyframes fade-up{0%{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
```

- 애니메이션은 순수 CSS이므로 JS 없이도 재생된다
- 애니메이션이 아예 적용되지 않는 환경에서도 기본 상태가 `opacity:1`이라 콘텐츠가 남는다
- `motion-reduce:animate-none`이 `prefers-reduced-motion: reduce`에서 애니메이션을 끈다
  (이 경우에도 기본 상태가 보이는 쪽)

**영향 범위** — `PageFadeIn` 사용 6개 화면 (컴포넌트 한 곳 수정으로 전부 반영):
축제 목록(`/festivals`) · 축제 상세(`/festivals/[id]`) · 아티스트 목록(`/artists`) ·
아티스트 상세(`/artists/[id]`) · 학교 상세(`/hosts/[id]`) · 축제 이력(`/hosts/[id]/history`)

### 📦 의존성 변경

없음

### 🧪 테스트 및 검증

- `pnpm lint` 통과 (무관한 기존 warning 1건 — `public/mockServiceWorker.js`)
- `pnpm build` 통과 (16개 라우트 정상 생성, `PageFadeIn` 사용 6개 라우트 포함)
- `pnpm test` 55개 통과
- 빌드 산출 CSS에서 `animate-fade-up` 규칙이 `opacity:1` 종료 + `@keyframes`
  `opacity 0→1`로 컴파일됨을 확인 — SSR HTML의 래퍼 `<div>`에 `opacity-0`
  유틸리티가 없으므로 JS 미실행 시에도 최종 상태로 렌더된다
- `PageFadeIn` 사용처 6곳이 전부 서버 컴포넌트임을 확인 — `"use client"` 제거가
  안전하고 빌드가 이를 검증

### 📌 참고사항

- 진입 연출 지속 시간이 500ms → 700ms(`--animate-fade-up`)로 통일됐다. 홈 히어로와
  동일한 값·이징이다
- 컴포넌트 렌더 테스트를 붙이지 않은 이유: 이 저장소는 `vitest` 환경이 `node`이고
  컴포넌트 테스트 하네스(jsdom·testing-library)가 없다. 검증은 빌드 산출 CSS 대조로 대신했다
- `docs/issues/`·`docs/pr/` 산출물 규칙상 이 이슈의 브랜치명 슬러그는 봇 댓글 그대로
  `refactor_143_pagefadein_초기_상태를_보이는_쪽으로_뒤집어_무js_폴백_확보`
- 관련 이슈: #143 (리뷰 지적은 #135 PR) / 근거: `festa-brain` 볼트 ISS-0106 · LSN-0054
