---
version: 2.0
name: FESTA-design-system
description: 전국 대학 축제·페스티벌 라인업 아카이브 서비스 FESTA의 디자인 시스템. 홈은 06-D(풀블리드 · D-day 강조, node 707:574)를 기준으로 한다 — 1440 전폭 다크 스테이지(#0d0e13) 위에 포스터 3장(메인 640×700 + 좌우 320×560 + 양끝 peek 220×450)을 겹쳐 세우고, D-day를 뱃지가 아니라 64px 디스플레이 타입으로 포스터 위에 직접 얹는다. 히어로 아래로는 1280 컨테이너 / 80 마진 / 섹션 간격 64px의 정보 레이아웃으로 돌아온다. 인디고(#4f46e5)가 모든 primary 액션·활성 상태를 단독으로 담당하고, Pretendard 한 벌이 700/600/500/400 네 단계로 전체 위계를 만든다. 포스터는 radius 18(그리드 카드) / 20(히어로), 정보 카드·패널은 20, 칩과 검색은 pill.

colors:
  primary: "#4f46e5"
  primary-soft: "#eef2ff"
  secondary: "#7c6cff"
  accent: "#ff79c8"
  canvas: "#fafbff"
  surface: "#ffffff"
  surface-field: "#f3f4f6"
  hero-stage: "#0d0e13"
  border: "#e5e7eb"
  border-strong: "#d1d5db"
  divider: "#ececec"
  handle: "#d1d5db"
  ink: "#111827"
  body: "#4b5563"
  body-strong: "#374151"
  muted: "#6b7280"
  muted-soft: "#9ca3af"
  on-primary: "#ffffff"
  on-media: "#ffffff"
  success: "#22c55e"
  success-soft: "#dcfce7"
  success-ink: "#166534"
  scrim-hero-main: "rgba(0,0,0,0.55)"
  scrim-hero-side: "rgba(0,0,0,0.30)"
  scrim-25: "rgba(17,24,39,0.25)"
  scrim-30: "rgba(17,24,39,0.30)"
  scrim-35: "rgba(17,24,39,0.35)"
  media-placeholder: "#111827"

opacity:
  poster-side: 0.88
  poster-peek-l: 0.50
  poster-peek-r: 0.42
  on-media-strong: 1.00
  on-media-soft: 0.85
  on-media-weak: 0.75

typography:
  hero-dday:
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', system-ui, sans-serif"
    fontSize: 64px
    fontWeight: 700
    lineHeight: 1.21
    letterSpacing: 0
  hero:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.21
    letterSpacing: 0
  section-title:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.21
    letterSpacing: 0
  hero-name:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.21
    letterSpacing: 0
  dday-side:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.21
    letterSpacing: 0
  card-title:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.21
    letterSpacing: 0
  section-title-home:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 26px
    fontWeight: 700
    lineHeight: 1.21
    letterSpacing: 0
  sheet-title:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 26px
    fontWeight: 700
    lineHeight: 1.21
    letterSpacing: 0
  logo:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 26px
    fontWeight: 700
    lineHeight: 1.21
    letterSpacing: 0
  logo-footer:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.21
    letterSpacing: 0
  subtitle:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.21
    letterSpacing: 0
  row-title:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.21
    letterSpacing: 0
  block-title:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.21
    letterSpacing: 0
  entity-name:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 17px
    fontWeight: 700
    lineHeight: 1.21
    letterSpacing: 0
  body:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.21
    letterSpacing: 0
  nav-active:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.21
    letterSpacing: 0
  button:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.21
    letterSpacing: 0
  button-sm:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.21
    letterSpacing: 0
  caption:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.21
    letterSpacing: 0
  caption-strong:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.21
    letterSpacing: 0
  meta:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.21
    letterSpacing: 0
  meta-strong:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 13px
    fontWeight: 700
    lineHeight: 1.21
    letterSpacing: 0
  meta-medium:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.21
    letterSpacing: 0
  label:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.21
    letterSpacing: 0
  label-regular:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.21
    letterSpacing: 0
  micro:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 10px
    fontWeight: 600
    lineHeight: 1.21
    letterSpacing: 0

rounded:
  none: 0px
  pause: 2px
  xs: 4px
  social: 6px
  sm: 10px
  md: 12px
  cta-icon: 14px
  row: 16px
  media: 18px
  card: 20px
  hero-media: 20px
  sheet: 24px
  pill: 999px
  full: 999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  gutter: 40px
  section: 64px
  page-margin: 80px

elevation:
  card: "0 8px 30px rgba(0,0,0,0.08)"
  hover: "0 12px 40px rgba(0,0,0,0.12)"

layout:
  frame-width: 1440px
  container-width: 1280px
  page-margin: 80px
  nav-height: 72px
  footer-height: 208px
  hero-height: 952px
  section-gap: 64px
  card-gap: 25px
  panel-gap: 40px

components:
  nav:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    typography: "{typography.body}"
    size: 1440×72
    borderBottom: "1px {colors.border}"
  nav-menu-active:
    textColor: "{colors.primary}"
    typography: "{typography.nav-active}"
    indicator: "글자폭×2 {colors.primary}, 하단 y50"
  nav-search:
    backgroundColor: "{colors.surface-field}"
    textColor: "{colors.muted-soft}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    size: 280×40
  nav-profile:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.full}"
    size: 36
  footer:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    typography: "{typography.label-regular}"
    size: 1440×208
    borderTop: "1px {colors.border}"
  hero-stage:
    backgroundColor: "{colors.hero-stage}"
    size: 1440×952
    rounded: "{rounded.none}"
  hero-poster-main:
    backgroundColor: "{colors.media-placeholder}"
    textColor: "{colors.on-media}"
    typography: "{typography.hero-dday}"
    rounded: "{rounded.hero-media}"
    size: 640×700
    scrim: "640×250 {colors.scrim-hero-main} (하단 정렬)"
  hero-poster-side:
    backgroundColor: "{colors.media-placeholder}"
    textColor: "{colors.on-media}"
    typography: "{typography.dday-side}"
    rounded: "{rounded.hero-media}"
    size: 320×560
    opacity: "{opacity.poster-side}"
    scrim: "320×160 {colors.scrim-hero-side} (하단 정렬)"
  hero-poster-peek:
    backgroundColor: "{colors.media-placeholder}"
    rounded: "{rounded.hero-media}"
    size: 220×450
    opacity: "{opacity.poster-peek-l} / {opacity.poster-peek-r}"
  hero-arrow:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 48
    icon: "‹ › 20/400"
  hero-dots:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    size: 200×44
    dot: "6 {colors.handle} / active 8 {colors.ink}, 간격 16"
    pause: "16×16 {rounded.pause} {colors.ink}"
  recent-card:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.entity-name}"
    rounded: "{rounded.media}"
    size: 236×379
    media: "236×300 {rounded.media}"
  lost-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.row-title}"
    rounded: "{rounded.card}"
    border: "1px {colors.border}"
    size: 560×420
    padding: 32px
  lost-panel-row:
    textColor: "{colors.ink}"
    typography: "{typography.caption-strong}"
    height: 32
    numberColumn: "48px, {typography.meta-medium} {colors.muted-soft}"
  ad-slot:
    backgroundColor: "{colors.surface-field}"
    textColor: "{colors.muted-soft}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.card}"
    border: "1px {colors.border-strong}"
    size: 680×420
    padding: 20px
  ad-badge:
    backgroundColor: "{colors.muted-soft}"
    textColor: "{colors.on-primary}"
    typography: "{typography.micro}"
    rounded: "{rounded.xs}"
    size: 32×20
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    size: 180×48
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    border: "1px {colors.border}"
    size: 200×52
  button-reset:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    border: "1px {colors.border}"
    size: 120×52
  button-sheet-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.md}"
    height: 44px
  button-sheet-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.md}"
    border: "1px {colors.border}"
    height: 44px
  filter-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    typography: "{typography.caption-strong}"
    rounded: "{rounded.pill}"
    border: "1px {colors.border}"
    height: 36px
    padding: 0 20px
  filter-chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-strong}"
    rounded: "{rounded.pill}"
    height: 36px
  inline-filter:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.meta}"
    rounded: "{rounded.sm}"
    border: "1px {colors.border}"
    size: 104×36
  search-pill:
    backgroundColor: "{colors.surface-field}"
    textColor: "{colors.muted-soft}"
    typography: "{typography.meta}"
    rounded: "{rounded.pill}"
    height: 36px
  text-field:
    backgroundColor: "{colors.surface-field}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-strong}"
    rounded: "{rounded.md}"
    height: 48px
    padding: 0 16px
  badge-dday:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.meta-strong}"
    rounded: "{rounded.pill}"
    height: 28px
  badge-dday-on-media:
    backgroundColor: "rgba(255,255,255,0.20)"
    textColor: "{colors.on-media}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    border: "1px {colors.on-media}"
    height: 28px
  badge-status:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: 28px
  badge-day:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.meta-strong}"
    rounded: "{rounded.pill}"
    size: 64×28
  festival-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.entity-name}"
    rounded: "{rounded.media}"
    size: 236×400
    media: "236×320 {rounded.media}"
  artist-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.entity-name}"
    rounded: "{rounded.media}"
    size: 236×320
    media: "236×236 {rounded.media}"
  upcoming-host-card:
    backgroundColor: "{colors.media-placeholder}"
    textColor: "{colors.on-media}"
    typography: "{typography.card-title}"
    rounded: "{rounded.card}"
    size: 356×372
  lost-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.card}"
    border: "1px {colors.border}"
    size: 302×320
    padding: 16px
  day-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.meta}"
    rounded: "{rounded.card}"
    border: "1px {colors.border}"
    size: 410×200
    padding: 20px
  result-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.row-title}"
    rounded: "{rounded.card}"
    border: "1px {colors.border}"
    size: 1280×148
    padding: 24px
  search-result-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.row-title}"
    rounded: "{rounded.row}"
    border: "1px {colors.border}"
    size: 1280×120
    padding: 16px 20px
  past-lineup-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.row}"
    border: "1px {colors.border}"
    size: 1280×56
    padding: 0 24px
  search-filter-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    typography: "{typography.caption-strong}"
    rounded: "{rounded.card}"
    border: "1px {colors.border}"
    size: 1280×320
    padding: 32px
  bottom-cta-banner:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.block-title}"
    rounded: "{rounded.card}"
    size: 1280×96
    padding: 20px 32px
  bottom-sheet:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.sheet-title}"
    rounded: "{rounded.sheet}"
    size: 1280×400
    padding: 32px 48px
  sheet-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body-strong}"
    typography: "{typography.label-regular}"
    rounded: "{rounded.pill}"
    border: "1px {colors.border}"
    height: 30px
  avatar:
    backgroundColor: "{colors.border}"
    rounded: "{rounded.full}"
    size: 64
  artist-circle:
    backgroundColor: "{colors.media-placeholder}"
    rounded: "{rounded.full}"
    size: 122
  divider:
    backgroundColor: "{colors.divider}"
    height: 1px
---

## Overview

FESTA는 **전국 대학 축제·페스티벌 라인업 아카이브** 서비스다. 커버에 명시된 방향은 `"정보 서비스의 신뢰감 + 축제의 감성"`, 키워드는 Modern · Clean · Premium · Archive · Campus · Festival · Friendly.

**홈은 06-D (풀블리드 · D-day 강조)로 확정됐다.** 이 결정이 시스템 전체의 성격을 한 번 꺾는다. 이전 홈은 1280 컨테이너 안에서 카드가 늘어서는 목록형이었고, 06-D는 그 위에 **1440 전폭 다크 스테이지**를 얹는다. 화면 상단 952px가 통째로 `{colors.hero-stage}` (#0d0e13) 로 덮이고 그 위에 포스터 세 장이 원근으로 겹쳐 선다 — 가운데 640×700, 좌우 320×560, 화면 밖으로 잘려나가는 양끝 220×450.

그리고 **D-day가 뱃지에서 타이포로 승격됐다.** 이전 시스템에서 D-day는 13/700 텍스트를 담은 28px pill이었다. 06-D에서는 메인 포스터 좌상단에 `{typography.hero-dday}` (64/700 흰색) 로 직접 얹히고, 좌우 포스터에는 `{typography.dday-side}` (30/700, 85% 불투명) 로 축소되어 따라붙는다. 세 장의 D-3 / D-7 / D-12 가 크기 차이로 시간 순서를 만든다 — 이것이 "D-day 강조"의 실체다.

히어로가 끝나는 y1024 아래부터는 원래의 정보 레이아웃으로 돌아온다. 1280 컨테이너, 80 마진, 섹션 간격 64px. **두 문법이 한 화면에서 위아래로 갈린다** — 위는 풀블리드 미디어, 아래는 컨테이너 정보.

타입은 **Pretendard 한 벌**로 700 / 600 / 500 / 400 네 단계. line-height는 전 스케일 **1.21 (Figma auto)** 고정, letter-spacing 전부 0.

**Key Characteristics:**
- **홈 프레임 배경은 `{colors.surface}` (#ffffff)** 다. 히어로가 상단을 덮으므로 캔버스 틴트가 보이지 않는다. 히어로가 없는 나머지 화면은 `{colors.canvas}` (#fafbff) 를 유지한다.
- 히어로 스테이지 `{colors.hero-stage}` (#0d0e13) 는 이 시스템의 유일한 다크 면이다. 순검정이 아니라 아주 살짝 푸른 기가 있는 먹색.
- `{colors.primary}` (#4f46e5) 인디고 하나가 primary 버튼, 활성 nav 메뉴, nav 프로필 아바타, 링크 텍스트, D-day 뱃지, 강조 수치를 전부 담당한다.
- **홈 히어로에서는 인디고를 쓰지 않는다.** 포스터 위 요소는 전부 흰색 + 불투명도(100 / 85 / 75%)로만 위계를 만든다.
- 스크림은 순검정 2단 — 메인 55%, 사이드 30%. 기존 `{colors.scrim-25/30/35}` (ink 기반) 은 상세 화면 카드용으로 남는다.
- 포스터 radius가 두 값으로 갈린다: **히어로 포스터 20**, **그리드 포스터 18**.
- 그림자는 카드 1단계 + hover 1단계, 총 2개뿐이다. 히어로 포스터에는 그림자가 없다 — 겹침과 불투명도로 깊이를 낸다.
- 5-up 카드 간격은 **25px** 이다 (236×5 + 25×4 = 1280, 컨테이너 정확히 채움).
- 데스크톱 우선. 모바일은 아직 설계되지 않았다.
- **적용 범위는 사용자 화면(00~23)까지다.** Admin(A0~A5) 화면은 이 시스템의 대상이 아니다 — 토큰을 참조해도 되지만 준수 의무는 없고, 이 문서도 Admin을 반영해 갱신하지 않는다.

## Home — 06-D 구조

기준 노드: `707:574` (1440×2288). 아래 좌표는 전부 프레임 상대값이다.

```
 y     0 ┌─ Nav ─────────────────────────────────── 1440×72
      72 ├─ Hero Stage ──────────────────────────── 1440×952   #0d0e13
     198 │   Main Poster        x400   640×700  r20
     268 │   Side Poster L/R    x120 / x1000   320×560  r20  @88%
     323 │   Peek L/R           x-80 / x1300   220×450  r20  @50 / 42%
     524 │   Arrow L/R          x32 / x1360    48 circle
     944 │   Dots Pill          x620           200×44
    1024 ├─ (섹션 간격 64) ───────────────────────
    1088 ├─ "최근 등록된 축제" 26/700  +  "전체 보기 →" 우측 정렬
    1140 │   Poster ×5          236×300  r18   gap 25
    1456 │   Host / Name / Date  12·17·12
    1519 ├─ (섹션 간격 ~61) ──────────────────────
    1580 ├─ Lost Panel  x80  560×420  │  AD Slot  x680  680×420   gap 40
    2000 ├─ (섹션 간격 64) ───────────────────────
    2064 └─ Footer ───────────────────────────────── 1440×208
```

### Hero (풀블리드 캐러셀)

**스테이지** — `1440×952`, `{colors.hero-stage}` 단색. radius 없음, 좌우 마진 없음. 컨테이너 규칙을 무시하는 유일한 영역이다.

**메인 포스터** — `640×700`, x400 (프레임 중앙 정렬), y198, `{rounded.hero-media}` 20. 하단에 `640×250` `{colors.scrim-hero-main}` 스크림.
- 좌상단 D-day: `{typography.hero-dday}` 64/700 흰색 100%, 포스터 좌상단에서 **36px 인셋** (x436 / y228).
- 하단 정보 블록 (동일 x436):
  - 학교명 `{typography.caption-strong}` 14/500 흰색 **75%** — y706
  - 축제명 `{typography.hero-name}` 32/700 흰색 100% — y730
  - 날짜·장소 `{typography.caption-strong}` 14/500 흰색 **85%** — y786 (`05.21 ~ 05.23    노천극장`, 구분은 공백 4칸)
  - 링크 `자세히 보기    →` 14/500 흰색 100% — y822

**사이드 포스터** — `320×560`, x120 / x1000, y268, r20, 채움 불투명도 **88%**. 하단에 `320×160` `{colors.scrim-hero-side}` 스크림.
- D-day `{typography.dday-side}` 30/700 흰색 85%, **24px 인셋** (x144 / y294).
- 축제명 `{typography.block-title}` 18/700 흰색 85%, y782.
- 학교명·날짜·링크는 **없다.** 사이드는 D-day와 이름만 남긴다.

**peek 포스터** — `220×450`, x−80 / x1300, y323, r20. 좌 50% / 우 42% 불투명도. 텍스트 없음. 프레임 밖으로 80px 잘려나가 캐러셀이 계속된다는 신호만 준다.

> 세 단계 스케일(700 / 560 / 450)과 세 단계 불투명도(100 / 88 / ~46%)가 원근을 만든다. 그림자·블러는 쓰지 않는다.

**화살표** — `48` 원형 `{colors.surface}` 흰 채움, x32 / x1360, y524 (스테이지 세로 중앙). 아이콘 `‹` `›` 20/400 `{colors.ink}`. **스테이지 안쪽이 아니라 화면 가장자리**에 붙는다 (마진 32).

**도트 인디케이터** — `200×44` 흰 pill, x620 (중앙), y944. 스테이지 하단에서 36px 위에 떠 있다.
- 도트 8개, 6px `{colors.handle}`, 간격 16px, 시작 x648.
- 활성 도트만 `8px` `{colors.ink}`.
- 우측 끝에 일시정지 `16×16` `{rounded.pause}` 2px `{colors.ink}`, x782.

### 최근 등록된 축제

섹션 제목 `{typography.section-title-home}` 26/700 `{colors.ink}`, x80 y1088. 우측 끝 `전체 보기  →` 14/500 `{colors.muted}`, 우측 정렬 x1360.

`{component.recent-card}` 5장, 폭 236, **간격 25**, x80 / 341 / 602 / 863 / 1124.
- 포스터 `236×300` `{rounded.media}` 18, y1140.
- 학교명 12/400 `{colors.muted}` — y1456 (포스터에서 16px)
- 축제명 `{typography.entity-name}` 17/700 `{colors.ink}` — y1476
- 기간 12/400 `{colors.muted-soft}` — y1504

포스터 위에 상태 도트·D-day 뱃지를 얹지 않는다. **홈의 D-day는 히어로에만 있다.**

### 정보 행 (분실물 + 광고)

`{component.lost-panel}` 과 `{component.ad-slot}` 이 `{spacing.gutter}` 40px 간격으로 나란히 선다. 560 + 40 + 680 = 1280.

**`lost-panel`** (560×420, x80, y1580) — 흰 패널 + 1px `{colors.border}` + `{rounded.card}` 20, 패딩 32.
- 제목 `최근 분실물` `{typography.row-title}` 20/700, y1612.
- `전체 보기 →` 13/500 `{colors.muted}`, 우측 정렬 (패널 우측 패딩까지).
- 번호 매김 리스트 10행, **행 간격 32px**, 첫 행 y1658:
  - 번호 `01`~`10` `{typography.meta-medium}` 13/500 `{colors.muted-soft}`, x112
  - 항목명 14/500 `{colors.ink}`, x160 (**번호 거터 48px**)
  - 형식: `품명 · 학교 축제명` (예: `에어팟 프로 2 · 연세대 아카라카 2025`)

**`ad-slot`** (680×420, x680, y1580) — `{colors.surface-field}` 채움 + **1px `{colors.border-strong}`** + r20. 정보 카드보다 한 단계 진한 테두리로 "콘텐츠가 아니다"를 표시한다.
- 좌상단 `{component.ad-badge}` `32×20` r4 `{colors.muted-soft}` + `AD` 10/600 흰색, 20px 인셋.
- 중앙에 플레이스홀더 `광고 배너 영역  ·  680 × 420` 15/500 `{colors.muted-soft}`.

## Colors

### Brand
- **Primary** (`{colors.primary}` — #4F46E5): 유일한 액션 색. primary 버튼, 활성 nav 메뉴 + 인디케이터, **nav 프로필 아바타 채움**, 링크 텍스트, D-day 뱃지, 수치 강조.
- **Primary Soft** (`{colors.primary-soft}` — #EEF2FF): D-day/DAY 뱃지 배경, Bottom CTA Banner 배경.
- **Secondary** (`{colors.secondary}` — #7C6CFF): 팔레트에만 존재. 사용처 미정의.
- **Accent** (`{colors.accent}` — #FF79C8): 검색 결과 행의 매칭 도트(4×4) 전용.

### Surface
- **Surface** (`{colors.surface}` — #FFFFFF): 카드·패널·nav·footer·바텀시트, **그리고 홈 프레임 배경**.
- **Canvas** (`{colors.canvas}` — #FAFBFF): 히어로가 없는 화면(07~23)의 바탕.
- **Surface Field** (`{colors.surface-field}` — #F3F4F6): 입력 필드, nav 검색 pill, 광고 슬롯 면.
- **Hero Stage** (`{colors.hero-stage}` — #0D0E13): 홈 히어로 전폭 배경. 시스템 유일 다크 면.
- **Media Placeholder** (`{colors.media-placeholder}` — #111827): 포스터·사진 자리. 실제 이미지로 교체된다.

### Line
- **Border** (`{colors.border}` — #E5E7EB): 1px 카드/행/필드/칩 아웃라인, nav 하단선, footer 상단선, footer 소셜 아이콘 채움.
- **Border Strong** (`{colors.border-strong}` — #D1D5DB): **광고 슬롯 테두리**, 바텀시트 드래그 핸들, 히어로 비활성 도트. (`{colors.handle}` 과 같은 값이며, 앞으로는 `border-strong` 으로 통일한다.)
- **Divider** (`{colors.divider}` — #ECECEC): 섹션·카드 내부·컬럼 구분선.

### Text
- **Ink** (`{colors.ink}` — #111827): 제목·엔티티명·메타 값. **nav/footer 로고도 ink** (인디고가 아니다).
- **Body** (#4B5563) / **Body Strong** (#374151): 본문 문단 / 시트 정보 칩.
- **Muted** (`{colors.muted}` — #6B7280): nav 비활성 메뉴, "전체 보기 →" 링크, 학교명, footer 링크, 아이콘.
- **Muted Soft** (`{colors.muted-soft}` — #9CA3AF): placeholder, 기간, 리스트 번호, 광고 라벨, copyright.
- **On Media** (#FFFFFF): 포스터 위 전부.

### Semantic
- **Success** (#22C55E) / **Success Soft** (#DCFCE7) / **Success Ink** (#166534): "라인업 확정" 상태 한 세트.
- warning / error / info 는 미정의.

### Scrim
두 계열이 공존한다.
- **히어로** — 순검정. `{colors.scrim-hero-main}` 55% (메인 포스터 하단 250px), `{colors.scrim-hero-side}` 30% (사이드 하단 160px). 단색 오버레이이며 그라데이션이 아니다.
- **상세 화면 카드** — ink 기반 3단 `{colors.scrim-25}` → `{colors.scrim-30}` → `{colors.scrim-35}`. `{component.upcoming-host-card}` 등에 유지.

### 포스터 위 텍스트 불투명도
스크림 위에서는 색을 바꾸지 않고 **흰색의 불투명도로 위계를 만든다.**

| 단계 | 값 | 용도 |
|---|---|---|
| `{opacity.on-media-strong}` | 100% | D-day, 축제명, CTA 링크 |
| `{opacity.on-media-soft}` | 85% | 날짜·장소, 사이드 포스터 전체 |
| `{opacity.on-media-weak}` | 75% | 학교명 |

## Typography

### Font Family
**Pretendard** 한 벌. Fallback: `-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", system-ui, sans-serif`.

무게 네 단계만 쓴다 — **700** (제목·엔티티명·D-day) / **600** (활성 메뉴·버튼·footer 헤더·AD 라벨) / **500** (본문·메타·링크) / **400** (caption·기간·placeholder·footer 링크). 300과 800 이상은 없다.

### Hierarchy

| Token | Size | Weight | Use |
|---|---|---|---|
| `{typography.hero-dday}` | 64px | 700 | **홈 히어로 메인 D-day** |
| `{typography.hero}` | 48px | 700 | 내부 페이지 최상단 헤드라인 |
| `{typography.section-title}` | 36px | 700 | 내부 페이지 섹션 제목 |
| `{typography.hero-name}` | 32px | 700 | **홈 히어로 메인 축제명** |
| `{typography.dday-side}` | 30px | 700 | **홈 히어로 사이드 D-day** |
| `{typography.card-title}` | 28px | 700 | 대형 카드 제목 |
| `{typography.section-title-home}` | 26px | 700 | **홈 섹션 제목** ("최근 등록된 축제") |
| `{typography.sheet-title}` | 26px | 700 | 바텀시트 제목 |
| `{typography.logo}` | 26px | 700 | Nav 로고 "FESTA" |
| `{typography.logo-footer}` | 22px | 700 | Footer 로고 |
| `{typography.subtitle}` | 20px | 600 | 서브 헤드라인 |
| `{typography.row-title}` | 20px | 700 | 리스트 행 제목, 패널 제목 |
| `{typography.block-title}` | 18px | 700 | 블록 제목, **히어로 사이드 축제명** |
| `{typography.entity-name}` | 17px | 700 | 카드 안 축제명/아티스트명 |
| `{typography.body}` | 16px | 500 | 본문, nav 비활성 메뉴 |
| `{typography.nav-active}` | 16px | 600 | **nav 활성 메뉴** |
| `{typography.button}` | 16px | 600 | 버튼 라벨 |
| `{typography.button-sm}` | 15px | 600 | 시트 버튼, 광고 플레이스홀더 |
| `{typography.caption}` | 14px | 400 | 날짜, 카테고리, nav 검색 placeholder |
| `{typography.caption-strong}` | 14px | 500 | 메타 값, 히어로 학교명·날짜, 분실물 항목명, "전체 보기 →" |
| `{typography.meta}` | 13px | 400 | footer 링크(구), 인라인 필터 |
| `{typography.meta-medium}` | 13px | 500 | **분실물 번호**, 패널 내 링크 |
| `{typography.meta-strong}` | 13px | 700 | DAY 뱃지, D-day 뱃지 |
| `{typography.label}` | 12px | 500 | 상태 뱃지 |
| `{typography.label-regular}` | 12px | 400 | footer 링크·copyright, 카드 학교명·기간 |
| `{typography.micro}` | 10px | 600 | **AD 뱃지** |

### Principles
- **line-height 전 스케일 1.21 고정** (Figma auto). 별도의 1.5 본문 행간을 쓰지 않는다.
- **letter-spacing 전부 0.** 한글이 주 언어이기 때문.
- **UPPERCASE 없음.** `FESTA` 와 `AD` 만 대문자다.
- 위계는 크기로 만든다. 홈 히어로의 64 → 32 → 18 세 단계가 그 원칙의 가장 큰 사례다.
- 카드 안 엔티티명은 17/700 고정.

## Layout

### Grid & Container
- **프레임 폭:** 1440px
- **컨테이너:** 1280px 중앙 정렬 (x80 ~ x1360)
- **좌우 마진:** 80px
- **Nav 높이:** 72px / **Footer 높이:** 208px / **Hero 높이:** 952px
- 반응형 정의: `Desktop 1440 · Laptop 1280 · Tablet 768 · Mobile 추후 제작 예정`

### 풀블리드 규칙
컨테이너를 벗어나도 되는 요소는 **세 가지뿐**이다:

1. `{component.hero-stage}` — 1440 전폭 다크 면.
2. 히어로 포스터·peek — 프레임 밖(x−80, x1300)까지 나가 잘린다.
3. `{component.nav}` / `{component.footer}` 의 배경면과 1px 경계선 — 배경만 전폭, **내용물은 1280 안**에 정렬한다.

그 외 모든 콘텐츠는 x80 ~ x1360 안에 들어온다. 히어로 화살표는 예외적으로 마진 32에 놓이는데, 스테이지 위에 떠 있는 컨트롤이지 콘텐츠가 아니기 때문이다.

### Spacing System
- **섹션 간격:** `{spacing.section}` 64px
- **패널 간격:** `{spacing.gutter}` 40px (분실물 ↔ 광고)
- **카드 간격:** `{spacing.card-gap}` 25px (5-up 기준)
- **카드 내부 패딩:** 카드 16–20px, 패널 32px, 광고 20px, 바텀시트 32×48px
- 토큰: `{spacing.xxs}` 4 · `{spacing.xs}` 8 · `{spacing.sm}` 12 · `{spacing.md}` 16 · `{spacing.lg}` 20 · `{spacing.xl}` 24 · `{spacing.xxl}` 32 · `{spacing.gutter}` 40 · `{spacing.section}` 64 · `{spacing.page-margin}` 80

### 카드/패널 폭 규칙
컨테이너 1280 안에서 폭이 고정값으로 떨어진다:
- **236px × 5, gap 25** — 축제/아티스트/최근 카드. 236×5 + 25×4 = **1280 정확히**.
- **560 + 40 + 680** — 홈 정보 행 (분실물 패널 + 광고 슬롯).
- **302px × 4** — 분실물 카드.
- **356 / 410px** — 상세 화면 전용 대형 카드.
- **1280px** — 리스트 행·필터 패널·CTA 배너·바텀시트.

### 히어로 좌표 규칙
- 메인 포스터는 **프레임 중앙 정렬**이다 (컨테이너 중앙이 아니라 1440의 중앙 — 둘은 같다).
- 사이드 포스터 좌우 x120 / x1000 은 마진 80보다 **40 안쪽**이다. 컨테이너에 맞추지 않고 시각 균형으로 잡혀 있다.
- 세로는 셋 다 다른 y에서 시작해 다른 y에서 끝난다 (198–898 / 268–828 / 323–773). **중앙 정렬로 계단이 만들어진다.**

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | 그림자 없음 | nav, footer, 배경, 미디어 카드 |
| Outline | 1px `{colors.border}` | 정보 카드, 리스트 행, 필드, 칩, 패널 |
| Outline Strong | 1px `{colors.border-strong}` | 광고 슬롯 |
| Occlusion | 겹침 + 불투명도 88 / 50 / 42% | **히어로 포스터 원근** |
| Card | `{elevation.card}` — 0 8px 30px rgba(0,0,0,0.08) | 떠 있는 카드 |
| Hover | `{elevation.hover}` — 0 12px 40px rgba(0,0,0,0.12) | 카드 hover |
| Scrim | 히어로 55/30%, 상세 카드 25→30→35% | 미디어 위 텍스트 영역 |

**outline과 shadow는 배타적**으로 쓴다. 그리고 **히어로에서는 둘 다 쓰지 않는다** — 깊이는 오직 겹침·크기·불투명도로 낸다.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | 구분선, 활성 메뉴 인디케이터, 히어로 스테이지 |
| `{rounded.pause}` | 2px | 히어로 일시정지 아이콘 |
| `{rounded.xs}` | 4px | 아이콘 플레이스홀더, AD 뱃지 |
| `{rounded.social}` | 6px | footer 소셜 아이콘 |
| `{rounded.sm}` | 10px | 인라인 필터 |
| `{rounded.md}` | 12px | 버튼, 입력 필드, 썸네일 |
| `{rounded.cta-icon}` | 14px | CTA 배너 아이콘 카드 |
| `{rounded.row}` | 16px | 리스트 행 |
| `{rounded.media}` | 18px | **그리드 포스터·아티스트 사진** |
| `{rounded.card}` / `{rounded.hero-media}` | 20px | **정보 카드·패널·배너, 그리고 히어로 포스터** |
| `{rounded.sheet}` | 24px | 바텀시트 |
| `{rounded.pill}` | 999px | 칩, 뱃지, 검색 pill, 아바타, 히어로 도트·화살표 |

**radius가 역할을 말한다.** 18은 "그리드 안의 미디어", 20은 "정보 컨테이너 + 히어로 미디어", pill은 "필터·상태·컨트롤".

## Components

### Shell

**`nav`** — `1440×72`, `{colors.surface}`, 하단 1px `{colors.border}`. 06-D 기준으로 갱신됨.
- 좌측: `FESTA` `{typography.logo}` 26/700 **`{colors.ink}`**, x80. **태그라인 없음.**
- 중앙 메뉴 x240부터: 홈 · 축제 · 아티스트 · 분실물. 비활성 `{typography.body}` 16/500 `{colors.muted}`, 활성 `{typography.nav-active}` 16/600 `{colors.primary}` + **글자 폭과 같은 2px 인디케이터** (y50).
- 우측: `{component.nav-search}` `280×40` pill x820 (검색 아이콘은 pill **우측** x1060), 벨/북마크 24px `{colors.muted}` x1180/1224, `{component.nav-profile}` `36` 원형 **`{colors.primary}` 채움** x1268.

**`footer`** — `1440×208`, `{colors.surface}`, 상단 1px `{colors.border}`.
- 좌측: 로고 `{typography.logo-footer}` 22/700 `{colors.ink}` → 태그라인 13/400 `{colors.muted}` → copyright 12/400 `{colors.muted-soft}`.
- 3열 링크 x560 / 760 / 960 — 서비스(축제·아티스트·커뮤니티·분실물·캘린더) / 회사(소개·공지사항·이용약관·개인정보처리방침) / 고객센터(문의하기). 헤더 13/600 `{colors.ink}`, 항목 12/400 `{colors.muted}`, **행 간격 24px**.
- 우상단 소셜 `28` `{rounded.social}` `{colors.border}` ×3, x1240/1280/1320.

### Hero

**`hero-stage`** — `1440×952` `{colors.hero-stage}`. 자식은 좌표 절대 배치 (auto-layout 아님).

**`hero-poster-main`** — `640×700` r20 + 하단 `640×250` 55% 검정 스크림. 텍스트 인셋 36.

**`hero-poster-side`** — `320×560` r20, 채움 88% + 하단 `320×160` 30% 검정 스크림. 텍스트 인셋 24. 흰색 85% 고정.

**`hero-poster-peek`** — `220×450` r20, 50% / 42%. 텍스트 없음.

**`hero-arrow`** — `48` 흰 원, 아이콘 20/400 `{colors.ink}`. 좌우 마진 32.

**`hero-dots`** — `200×44` 흰 pill. 도트 6 (`{colors.border-strong}`) / 활성 8 (`{colors.ink}`) / 간격 16, 일시정지 `16` r2.

### Content

**`recent-card`** (236×379) — 포스터 `236×300` `{rounded.media}` 18 + 학교명 12/400 `{colors.muted}` + 축제명 17/700 `{colors.ink}` + 기간 12/400 `{colors.muted-soft}`. 오버레이 없음.

**`lost-panel`** (560×420) — 흰 패널 + border + r20, 패딩 32. 제목 20/700 + 우측 `전체 보기 →` 13/500 `{colors.muted}`. 번호 리스트 10행, 행 간격 32, 번호 거터 48.

**`ad-slot`** (680×420) — `{colors.surface-field}` + 1px `{colors.border-strong}` + r20. `{component.ad-badge}` 좌상단 20 인셋, 중앙 플레이스홀더 15/500 `{colors.muted-soft}`.

**`ad-badge`** — `32×20` r4 `{colors.muted-soft}` + `AD` `{typography.micro}` 10/600 흰색.

### Buttons

**`button-primary`** — 180×48, 인디고 채움, 흰 텍스트 16/600, r12. 유일한 채움형 CTA.

**`button-secondary`** — 200×52, 흰 배경 + border, **텍스트 인디고** 16/600, r12.

**`button-reset`** — 120×52, secondary 형태 + `{colors.muted}` 500 텍스트.

**`button-sheet-primary` / `-secondary`** — 높이 44, 15/600. primary 인디고 채움 / secondary 흰 배경 + border + ink.

### Chips & Filters

**`filter-chip`** — h36 pill, 패딩 0 20. 비활성 흰 배경 + border + `{colors.muted}` 14/500 / 활성 인디고 채움 + 흰 텍스트.

**`inline-filter`** — 104×36, r10 (이 컴포넌트만 10), 13/500 `{colors.ink}` + `˅`.

**`search-pill`** — 상세/검색 화면 320×36 `{colors.surface-field}` pill. **nav 안에서는 `{component.nav-search}` 280×40** 을 쓴다.

**`sheet-chip`** — h30 pill, 흰 배경 + border, 12/400 `{colors.body-strong}`.

### Badges

**`badge-dday`** — h28 pill, `{colors.primary-soft}` + `{colors.primary}` 13/700. **홈 히어로에서는 쓰지 않는다** (타이포로 대체). 목록·상세·검색 화면 전용.

**`badge-dday-on-media`** — rgba(255,255,255,0.20) + 1px 흰 테두리 + 흰 14/700. `{component.upcoming-host-card}` 등 상세 화면 포스터용.

**`badge-status`** — h28, `{colors.success-soft}` + `{colors.success-ink}` 12/500. 포스터 위에서는 6×6 `{colors.success}` 도트 + 흰 12/500 로 축약.

**`badge-day`** — 64×28, `{colors.primary-soft}` + `{colors.primary}` 13/700.

### Cards (내부 화면)

**`festival-card`** (236×400) — 포스터 236×320 r18 + 좌상단 상태 도트, 아래 학교명 12/400 → 축제명 17/700 → 기간 12/400.

**`artist-card`** (236×320) — 정사각 236×236 r18 + 이름 17/700 → 메타 12/400 → 최근 출연 12/400.

**`upcoming-host-card`** (356×372) — 포스터 전면형 r20 + 3단 ink 스크림 + 축제명 28/700 흰색 → 날짜 14/500 → 상태 뱃지 → `자세히 보기 →` 14/600. 우상단 반투명 D-day.

**`lost-card`** (302×320) — 흰 카드 + border + r20, 패딩 16. 썸네일 270×150 r12, 제목 16/600, 카테고리/습득일 14/400, divider, `자세히 보기 →`.

**`day-card`** (410×200) — DAY 뱃지 + 날짜 13/400, 64px 아바타 3개 + 이름 13/500, 하단 `+ 더보기` 13/500 인디고.

### List Rows

**`result-row`** (1280×148) — 100×100 썸네일 r12, 제목 20/600, 라벨/값 2열 그리드 3세트 (라벨 14/400 `{colors.muted-soft}` / 값 14/500 `{colors.ink}`), 우측 `자세히 보기 →`.

**`search-result-row`** (1280×120) — 80×88 포스터 r12, 축제명 20/700, 메타 14/400, 4px `{colors.accent}` 도트 + 매칭 하이라이트 13/500 인디고. 우측 상태 뱃지 → D-day → `›`.

**`past-lineup-row`** (1280×56) — 연도 16/700 인디고 + 아티스트 나열 14/400 + `›`, r16.

### Panels & Overlay

**`search-filter-panel`** (1280×320) — 흰 패널 + border + r20, 패딩 32. 3열×2행 필드 그리드 (389×48, `{colors.surface-field}`, r12), 라벨 14/500 `{colors.muted}`. 우하단 초기화(120×52) + 검색하기(160×52).

**`bottom-cta-banner`** (1280×96) — `{colors.primary-soft}` r20. 56×56 흰 아이콘 카드 r14 + 타이틀 18/700 인디고 + 서브 14/400 + 우측 primary 버튼.

**`bottom-sheet`** (1280×400) — r24 흰 시트, 상단 중앙 48×5 `{colors.border-strong}` 핸들, 우상단 `×`. 좌우 2단, 가운데 1px `{colors.divider}` 세로 구분선 (x616, h336).
- 좌: D-day 뱃지 52×26 → 제목 26/700 → 장소 + `지도 보기` → 정보 칩 4개(h30) → 설명 14/400 → 해시태그 13/500 인디고 → 공유하기 536×44.
- 우: `라인업` 18/700 → 122px 원형 아티스트 4개 + 이름 15/700 → CTA `상세 정보 보기 →` 584×44 인디고.
- 미공개 아티스트는 원형을 `{colors.divider}` 로, 이름을 `{colors.muted-soft}` 로 낮춘다.
- 홈에서 축제를 눌렀을 때 이 시트가 뜬다 (`06-D-1 Home D-day (요약 시트)`, node `683:482`).

## Do's and Don'ts

### Do
- 홈 상단은 `{component.hero-stage}` 로 1440 전폭을 덮고, 히어로가 끝나면 즉시 1280 컨테이너로 복귀한다.
- 히어로 포스터의 깊이는 **크기 + 불투명도 + 겹침**으로만 만든다.
- 포스터 위 텍스트 위계는 흰색 불투명도 100 / 85 / 75% 세 단계로 낸다.
- 히어로 포스터는 r20, 그리드 포스터는 r18 — 이 구분을 지킨다.
- 5-up 그리드는 236 × 5 + **25** × 4 = 1280 으로 맞춘다.
- 정보 카드는 1px `{colors.border}`, 광고·비콘텐츠 슬롯은 1px `{colors.border-strong}` 로 구분한다.
- nav/footer 로고는 `{colors.ink}` 다. 인디고 로고를 쓰지 않는다.
- 카드 안 엔티티명은 17/700 고정.
- 섹션 간격 64 · 패널 간격 40 · 마진 80 을 지킨다.

### Don't
- **히어로 안에 인디고를 넣지 않는다.** 흰색과 불투명도만 쓴다.
- **홈 히어로에 D-day pill 뱃지를 쓰지 않는다.** D-day는 타이포(64 / 30)로 표현한다.
- 히어로 포스터에 그림자나 테두리를 주지 않는다.
- 히어로 스크림을 ink 계열(`{colors.scrim-25/30/35}`)로 바꾸지 않는다 — 히어로는 순검정 55 / 30% 다.
- 컨테이너 규칙을 히어로 밖의 요소에 풀어주지 않는다. 풀블리드는 스테이지·포스터·shell 배경뿐이다.
- 무게 300이나 800을 쓰지 않는다.
- letter-spacing을 조정하지 않는다. line-height를 1.5로 늘리지 않는다.
- 새 radius 값을 임의로 만들지 않는다 — 12 / 16 / 18 / 20 / 24 / pill 안에서 고른다.
- UI 문구를 영어로 쓰지 않는다. `FESTA` 와 `AD` 만 예외다.

## Responsive Behavior

| Name | Width | Status |
|---|---|---|
| Desktop | 1440px | 기준 캔버스. 컨테이너 1280, 마진 80, 카드 5-up, 히어로 952 |
| Laptop | 1280px | 마진 축소, 컨테이너 가변. 히어로 peek 포스터가 먼저 잘린다 |
| Tablet | 768px | 카드 2-up 예상, 정보 행 1열 스택 예상 |
| Mobile | — | **추후 제작 예정** |

### Touch Targets
- `{component.hero-arrow}` 48 / `{component.nav-search}` 40 / `{component.nav-profile}` 36.
- `{component.button-primary}` 48, `{component.button-secondary}` 52, `{component.text-field}` 48 — 44px 충족.
- 칩 36, 시트 칩 30, nav 프로필 36, 히어로 도트 6–8 — **모바일 전환 시 44px 확보가 필요한 지점.**

### 미정의 영역
히어로의 반응형 축소 규칙(포스터 3장 → 1장 전환 시점), Tablet 이하 레이아웃, 정보 행 스택 순서, nav 햄버거 전환, 바텀시트 전폭 전환은 아직 Figma에 없다.

## Iteration Guide

1. 컴포넌트 하나씩 다룬다. YAML 키를 직접 참조한다 (`{component.hero-poster-main}`, `{component.recent-card}`).
2. 새 컴포넌트의 기본 radius는 `{rounded.card}` (20). 그리드 미디어면 18, 필터/상태/컨트롤이면 pill.
3. 히어로에 무언가를 추가할 때는 먼저 물어본다 — "이게 흰색 + 불투명도로 표현되는가?" 아니면 히어로 밖에 놓는다.
4. 변형(`-active`, `-on-media`, `-side`, `-peek`)은 `components:` 블록에 별도 항목으로 둔다.
5. 색은 항상 `{token.refs}` 로 참조한다 — hex 인라인 금지.
6. 상태는 Default / Active / Hover(그림자만) 세 가지만 정의되어 있다. focus·disabled·error는 미정의다.
7. UI 문구는 한국어로 유지한다.

## Known Gaps

- **`06-D Home (풀블리드 · D-day 강조)` 프레임이 두 개다.** `679:318` 은 히어로가 4분할(360×952 ×4) 인 구버전, `707:574` 가 3장 포스터 스테이지인 현행이다. **이 문서는 `707:574` 기준이다.** `679:318` 은 삭제 대상.
- **`06-D-1 Home D-day (요약 시트)` (`683:482`) 는 구버전 히어로 위에 만들어져 있다.** 시트 자체(1280×400)는 현행과 일치하지만 배경 히어로가 4분할이다. `707:574` 기준으로 다시 떠야 한다.
- **홈 프레임 배경이 `#ffffff` 인데 나머지 화면은 `#fafbff` 다.** 의도된 분기로 문서화했으나, 홈 하단부도 canvas 로 통일할지 결정이 필요하다.
- **nav / footer 가 06-D에서 갱신됐고 다른 화면은 구버전을 쓴다.** 로고 24→26 / ink, 검색 pill 200×36→280×40, 프로필 32 회색→36 인디고, footer 180→208, footer 로고 20→22, nav 태그라인 제거, 메뉴에서 커뮤니티·캘린더 제거(4개). 07~23 화면 일괄 반영이 필요하다.
- **섹션 제목이 홈 26 / 내부 36 으로 갈려 있다.** `{typography.section-title-home}` 과 `{typography.section-title}` 을 둘 다 두었으나, 한쪽으로 통일할지 결정해야 한다.
- **카드 간격이 24(구 문서) / 25(06-D 실측) 로 갈려 있다.** 06-D의 25가 1280을 정확히 채우므로 25를 기준으로 잡았다. 내부 화면들의 5-up 그리드도 25로 맞춰야 한다.
- **Figma Local Styles / Variables 가 비어 있다.** 색·타입이 스타일로 등록되어 있지 않아 전부 하드코딩이다 (`get_styles` → 전부 빈 배열). 토큰화가 첫 번째 정비 대상.
- **폰트가 Pretendard 로 명시되어 있으나 실제 렌더 패밀리는 Inter 다.** Figma에 Pretendard 미설치. 구현 시 Pretendard 로드 필요 — 한글 자간·행간이 달라진다.
- **홈에 아티스트 섹션이 없다.** 이전 홈에 있던 "인기 아티스트 TOP 10" 이 06-D에서 빠졌다. 의도된 제거인지 확인 필요.
- **광고 슬롯의 정책이 없다.** 680×420 1구좌만 정의되어 있고, 다른 화면의 광고 위치·크기·빈도가 미정의다.
- **`{colors.secondary}` / `{colors.accent}` 의 사용 규칙이 없다.** 실제 사용처가 4px 도트 하나뿐이다.
- **semantic 색이 success 한 계열뿐이다.** warning / error / info, 폼 검증 상태 미정의.
- **hover 외의 인터랙션 상태가 없다.** focus ring, disabled, loading, empty state 미정의. 히어로 캐러셀의 전환 방식(슬라이드/페이드)·자동재생 주기도 미정의.
- **아이콘 시스템이 없다.** 모든 아이콘이 radius 4 사각형 플레이스홀더다.
