---
version: 3.0
name: FESTA-design-system
description: 전국 대학 축제·페스티벌 라인업 아카이브 서비스 FESTA의 디자인 시스템. 홈은 06-D(풀블리드 · D-day 강조, node 679:318)를 기준으로 한다 — 1440 전폭을 4등분한 360×952 히어로 패널 네 장이 각자의 어두운 포스터 색을 깔고 나란히 서고, 하단 364px에 검정 55% 스크림이 얹혀 그 위에 D-day를 56px 디스플레이 타입으로 직접 세운다. 히어로 아래로는 1280 컨테이너 / 80 마진 / 섹션 간격 64px의 정보 레이아웃으로 돌아온다. 인디고(#4f46e5)가 모든 primary 액션·활성 상태를 단독으로 담당하고, Pretendard 한 벌이 700/600/500/400 네 단계로 전체 위계를 만든다. 포스터는 radius 18(그리드) / 0(히어로 풀블리드), 정보 카드·패널은 20, 칩과 검색은 pill.

colors:
  primary: "#4f46e5"
  primary-soft: "#eef2ff"
  secondary: "#7c6cff"
  accent: "#ff79c8"
  canvas: "#fafbff"
  surface: "#ffffff"
  surface-field: "#f3f4f6"
  border: "#e5e7eb"
  border-strong: "#d1d5db"
  divider: "#ececec"
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
  scrim-hero: "rgba(0,0,0,0.55)"
  scrim-25: "rgba(17,24,39,0.25)"
  scrim-30: "rgba(17,24,39,0.30)"
  scrim-35: "rgba(17,24,39,0.35)"
  media-placeholder: "#111827"

poster-tints:
  hero-1: "#1e3a5f"
  hero-2: "#3b1f2e"
  hero-3: "#1f3a2e"
  hero-4: "#2a2340"
  grid-1: "#2f4f6e"
  grid-2: "#3a1f6b"
  grid-3: "#3e5f52"
  grid-4: "#6b2b3a"
  grid-5: "#374151"

opacity:
  on-media-strong: 1.00
  on-media-soft: 0.85
  on-media-weak: 0.75

typography:
  hero-dday:
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', system-ui, sans-serif"
    fontSize: 56px
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
  meta-medium:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.21
    letterSpacing: 0
  meta-strong:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 13px
    fontWeight: 700
    lineHeight: 1.21
    letterSpacing: 0
  nav-icon-label:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 13px
    fontWeight: 600
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
  frame-height-home: 2288px
  container-width: 1280px
  page-margin: 80px
  nav-height: 72px
  footer-height: 208px
  hero-height: 952px
  hero-panel-width: 360px
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
    indicator: "글자 폭 × 2px {colors.primary}, y50"
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
  hero-panel:
    backgroundColor: "{poster-tints.hero-1}"
    textColor: "{colors.on-media}"
    typography: "{typography.hero-dday}"
    rounded: "{rounded.none}"
    size: 360×952
    scrim: "360×364 {colors.scrim-hero} (하단 정렬)"
    padding: 40px
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
    dot: "6 {colors.border-strong} / active 8 {colors.ink}, 간격 16"
    pause: "16×16 {rounded.pause} {colors.ink}"
  section-header-row:
    textColor: "{colors.ink}"
    typography: "{typography.section-title-home}"
    size: 1280×32
    link: "{typography.caption-strong} {colors.muted} 우측 정렬"
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

**홈은 06-D (풀블리드 · D-day 강조) — node `679:318` 로 확정됐다.** 이 결정이 시스템의 성격을 한 번 꺾는다. 이전 홈은 1280 컨테이너 안에서 카드가 늘어서는 목록형이었고, 06-D는 그 위에 **1440 전폭을 4등분한 히어로**를 얹는다. 화면 상단 952px가 `360×952` 패널 네 장으로 완전히 채워지고, 패널마다 다른 어두운 포스터 색이 깔린다. 여백도 라운드도 없다 — 네 장이 맞닿아 화면을 가른다.

그리고 **D-day가 뱃지에서 타이포로 승격됐다.** 이전 시스템에서 D-day는 13/700 텍스트를 담은 28px pill이었다. 06-D에서는 각 패널 좌상단에 `{typography.hero-dday}` (56/700 흰색) 로 직접 얹힌다. 네 패널의 D-2 / D-7 / D-12 / D-15 가 **왼쪽에서 오른쪽으로 임박 순서를 만든다** — 이것이 "D-day 강조"의 실체다. 크기 차이가 아니라 배열 순서가 시간을 말한다.

히어로가 끝나는 y1024 아래부터는 원래의 정보 레이아웃으로 돌아온다. 1280 컨테이너, 80 마진, 섹션 간격 64px. **두 문법이 한 화면에서 위아래로 갈린다** — 위는 풀블리드 미디어, 아래는 컨테이너 정보.

타입은 **Pretendard 한 벌**로 700 / 600 / 500 / 400 네 단계. line-height는 전 스케일 **1.21 (Figma auto)** 고정, letter-spacing 전부 0.

**Key Characteristics:**
- **홈 프레임 배경은 `{colors.surface}` (#ffffff)** 다. 히어로가 상단을 덮으므로 캔버스 틴트가 보이지 않는다. 히어로가 없는 나머지 화면은 `{colors.canvas}` (#fafbff) 를 유지한다.
- **다크 면은 히어로 패널 네 장뿐이고, 공통 배경색이 아니라 패널별 포스터 틴트다.** 별도의 "스테이지" 색은 없다 — 패널 자체가 포스터 자리다.
- `{colors.primary}` (#4f46e5) 인디고 하나가 primary 버튼, 활성 nav 메뉴, nav 프로필 아바타, 링크 텍스트, D-day 뱃지, 강조 수치를 전부 담당한다.
- **홈 히어로에서는 인디고를 쓰지 않는다.** 포스터 위 요소는 전부 흰색 + 불투명도(100 / 85 / 75%)로만 위계를 만든다.
- 히어로 스크림은 **한 단계뿐**이다 — 패널 하단 364px에 순검정 55%. `{colors.scrim-25/30/35}` (ink 기반) 는 상세 화면 카드용으로 남는다.
- **히어로 패널에는 radius가 없다** (풀블리드). radius 18은 그리드 포스터 전용이다.
- 그림자는 카드 1단계 + hover 1단계, 총 2개뿐이다. 히어로에는 그림자가 없다.
- 5-up 카드 간격은 **25px** 이다 (236×5 + 25×4 = 1280, 컨테이너 정확히 채움).
- 데스크톱 우선. 모바일은 아직 설계되지 않았다.
- **적용 범위는 사용자 화면(00~23)까지다.** Admin(A0~A5) 화면은 이 시스템의 대상이 아니다 — 토큰을 참조해도 되지만 준수 의무는 없고, 이 문서도 Admin을 반영해 갱신하지 않는다.

## Home — 06-D 구조

기준 노드: **`679:318`** (1440×2288, 배경 `#ffffff`). 아래 좌표는 전부 프레임 상대값이다.

```
 y     0 ┌─ Nav ───────────────────────────────────── 1440×72   COMPONENT 679:319
      71 │   Bottom Border 1440×1  {colors.border}
      72 ├─ Hero ──────────────────────────────────── 1440×952
         │   Panel ×4   x0 / 360 / 720 / 1080   360×952   radius 0
     140 │     D-day        x+40    56/700  흰색 100%
     524 │   Arrow L/R      x32 / x1360    48 circle
     660 │     Scrim        360×364  검정 55%  (패널 하단 정렬)
     700 │     학교명       x+40    14/500  흰색 75%
     728 │     축제명       x+40    30/700  흰색 100%
     830 │     날짜·장소    x+40    14/500  흰색 85%
     880 │     자세히 보기  x+40    14/500  흰색 100%
     944 │   Dots Pill      x620    200×44
    1024 ├─ (섹션 간격 64) ─────────────────────────
    1088 ├─ "최근 등록된 축제" 26/700  +  "전체 보기 →" 우측 정렬
    1140 │   Poster ×5      236×300  r18   gap 25
    1456 │   Host / Name / Date   12 · 17 · 12
    1519 ├─ (섹션 간격 61) ─────────────────────────
    1580 ├─ Lost Panel  x80  560×420  │  AD Slot  x680  680×420   gap 40
    2000 ├─ (섹션 간격 64) ─────────────────────────
    2064 └─ Footer ────────────────────────────────── 1440×208   COMPONENT 679:428
    2272     (프레임 하단 여백 16)
```

### Hero (4분할 풀블리드 캐러셀)

**패널** — `360×952` ×4, x0 / 360 / 720 / 1080, y72. **radius 0, 여백 0, 서로 맞닿는다.** 각 패널은 포스터 이미지 자리이며, 현재는 축제별 톤을 잡아둔 단색 플레이스홀더다.

| 패널 | 틴트 | 예시 |
|---|---|---|
| 1 | `{poster-tints.hero-1}` #1E3A5F | 연세대 아카라카 · D-2 |
| 2 | `{poster-tints.hero-2}` #3B1F2E | 고려대 입실렌티 · D-7 |
| 3 | `{poster-tints.hero-3}` #1F3A2E | 성균관대 대동제 · D-12 |
| 4 | `{poster-tints.hero-4}` #2A2340 | 한양대 라치오스 · D-15 |

**스크림** — 패널마다 하단 `360×364` 순검정 55% (`{colors.scrim-hero}`). 단색 오버레이이며 그라데이션이 아니다. 패널 y660에서 시작해 y1024에서 패널과 함께 끝난다.

**패널 내부** — 좌우 인셋 **40px**, 텍스트 폭 280 고정.
- D-day `{typography.hero-dday}` 56/700 흰색 100% — y140 (패널 상단에서 68)
- 학교명 `{typography.caption-strong}` 14/500 흰색 **75%** — y700
- 축제명 `{typography.hero-name}` 30/700 흰색 100% — y728. 280 폭에서 자동 줄바꿈되며, 2줄까지 허용한다 (예: `인문사회과학 캠퍼스 대동제`).
- 날짜·장소 `{typography.caption-strong}` 14/500 흰색 **85%** — y830 (`05.21 ~ 05.23    노천극장`, 구분은 공백 4칸)
- 링크 `자세히 보기    →` 14/500 흰색 100% — y880. **패널 전체가 축제 상세로 가는 링크이고 이 텍스트는 그 어포던스다.** 요약 시트를 거치지 않는다

> D-day는 스크림 **밖**(y140)에, 나머지 정보는 스크림 **안**(y700~897)에 있다. 위아래로 갈라 붙여 패널 가운데를 비운다 — 실제 포스터 이미지가 들어갔을 때 주제가 드러나는 자리다.

**화살표** — `48` 원형 `{colors.surface}` 흰 채움, x32 / x1360, y524 (히어로 세로 중앙). 아이콘 `‹` `›` 20/400 `{colors.ink}`. 마진 80이 아니라 **32**에 붙는다.

**도트 인디케이터** — `200×44` 흰 pill, x620 (중앙), y944. 히어로 하단에서 36px 위에 떠 있다.
- 도트 8개, 6px `{colors.border-strong}`, 간격 16px, 시작 x648.
- 활성 도트만 `8px` `{colors.ink}` (현재 2번째).
- 우측 끝에 일시정지 `16×16` `{rounded.pause}` 2px `{colors.ink}`, x782.

> 패널은 4장이지만 도트는 8개다. **한 번에 4장씩, 총 8페이지를 넘기는 캐러셀**이라는 뜻이다.

### 최근 등록된 축제

`{component.section-header-row}` — 제목 `{typography.section-title-home}` 26/700 `{colors.ink}`, x80 y1088. 우측 끝 `전체 보기  →` 14/500 `{colors.muted}`, 우측 정렬 (x1200 폭 160, 끝 x1360).

`{component.recent-card}` 5장, 폭 236, **간격 25**, x80 / 341 / 602 / 863 / 1124.
- 포스터 `236×300` `{rounded.media}` 18, y1140. 틴트 `{poster-tints.grid-1~5}`.
- 학교명 12/400 `{colors.muted}` — y1456 (포스터에서 16px)
- 축제명 `{typography.entity-name}` 17/700 `{colors.ink}` — y1476
- 기간 12/400 `{colors.muted-soft}` — y1504 (카드 하단 y1519)

포스터 위에 상태 도트·D-day 뱃지를 얹지 않는다. **홈의 D-day는 히어로에만 있다.**

### 정보 행 (분실물 + 광고)

`{component.lost-panel}` 과 `{component.ad-slot}` 이 `{spacing.gutter}` 40px 간격으로 나란히 선다. 560 + 40 + 680 = 1280.

**`lost-panel`** (560×420, x80, y1580) — 흰 패널 + 1px `{colors.border}` + `{rounded.card}` 20, 패딩 32.
- 제목 `최근 분실물` `{typography.row-title}` 20/700, x112 y1612.
- `전체 보기 →` 13/500 `{colors.muted}`, 우측 정렬 (끝 x608 = 패널 우측 − 32).
- 번호 매김 리스트 10행, **행 간격 32px**, 첫 행 y1658 · 마지막 행 y1946:
  - 번호 `01`~`10` `{typography.meta-medium}` 13/500 `{colors.muted-soft}`, x112
  - 항목명 14/500 `{colors.ink}`, x160 (**번호 거터 48px**)
  - 형식: `품명 · 학교 축제명` (예: `에어팟 프로 2 · 연세대 아카라카 2025`)

**`ad-slot`** (680×420, x680, y1580) — `{colors.surface-field}` 채움 + **1px `{colors.border-strong}`** + r20. 정보 카드보다 한 단계 진한 테두리로 "콘텐츠가 아니다"를 표시한다.
- 좌상단 `{component.ad-badge}` `32×20` r4 `{colors.muted-soft}` + `AD` 10/600 흰색, 20px 인셋.
- 중앙에 플레이스홀더 `광고 배너 영역  ·  680 × 420` `{typography.button-sm}` 15/600 `{colors.muted-soft}`, y1780.

## Festival Detail — 08 구조

기준: 08/08-2 Festival Detail 시안 + 08-3(전체 라인업 바텀시트). 이 화면부터는 1440 좌표를
옮기지 않는다 — 시안의 픽셀은 비율과 위계의 근거일 뿐, 구현은 `Container`(유동 폭) 위에서
섹션을 세로로 쌓는 일반 원칙만 따른다. 폭·마진의 실제 값은 다른 목록·상세 화면과 동일하게
코드가 정한다.

**섹션 순서**: 히어로 → 라인업 → 입장 안내 → 오시는 길. 화면 전환 연출(카드→상세)은 미정이라
직행 링크만 건다.

**히어로** — `{component.upcoming-host-card}`와 같은 "포스터 전면형 + 3단 ink 스크림" 문법을
쓰되, 스크림은 상세 화면 카드용 3단 중 가장 진한 `{colors.scrim-35}` 한 단계만 쓴다(그라데이션
아님). 포스터가 없거나 로드에 실패하면 포스터 틴트만 남는 것을 정상 경로로 둔다(홈과 동일한
`PosterImage` 처리). 안에 담는 것: D-day 뱃지(`{component.badge-dday}` — 홈 히어로처럼 타이포로
키우지 않는다, 목록·상세 공용 규격 그대로), 진행중일 때만 상태 뱃지(`{component.badge-status}`
success 변형 — 예정·종료 색은 아직 정의되지 않아 배지를 만들지 않고 D-day 문구로 대신한다),
축제명, 날짜·장소·티켓 요약 3줄(아이콘 + 텍스트), 주최 이름(주최 상세로 링크하는 pill).
주최의 인스타그램·공식 사이트가 있으면 우상단에 아이콘 링크로 얹는다(둘 다 없으면 자리를
그리지 않는다).

**라인업** — 요약(그리드)과 전체(바텀시트) 두 레이어로 나눈다.
- 요약: `{component.day-card}`를 day 수만큼 가로로 늘어놓는다(좁은 화면에서는 세로로 쌓는다).
  하루당 아티스트를 앞에서 3명만 원형 아바타 + 이름으로 보여주고, 4명이 넘으면 카드 안에
  `+ 더보기`를 둔다. 시크릿 게스트(`id`가 null인 원소 — DEC-0116, 응답에 `revealed`
  불리언을 두지 않고 `id` null 여부로만 판별한다)는 원형을 `{colors.divider}`로,
  이름 대신 "공개 예정"을 `{colors.muted-soft}`로 낮춰서 자리를 그대로 보여준다 — 자리를
  비우면 "아직 공개 안 됨"과 "원래 라인업이 작음"이 구분되지 않는다.
- 전체: day-card의 `+더보기`나 섹션 헤더의 "전체 라인업 보기"를 누르면 바텀시트가 뜬다.
  DAY 탭(전체 포함)으로 필터하고, 각 아티스트를 번호·아바타·이름·장르로 나열한다(장르가
  없으면 자리를 그리지 않는다 — 아티스트 상세 화면과 같은 관례). 헤드라이너
  표시는 넣지 않는다 — 명세에 그런 필드가 없어서 만들 근거가 없다. 생기면 그때 얹는다.

**입장 안내** — 명세의 영문 상수(외부인 입장·신분 확인·티켓 종류)를 그대로 노출하지 않는다.
한글 문구 매핑 테이블을 라이브러리 함수로 두고 화면은 그 결과만 그린다(DEC-0081과 같은 원칙 —
열거값은 백엔드가 영문으로 내리고 표시 문구는 프론트가 갖는다). 예매 오픈 시각이 없으면
"미정"으로 떨어뜨린다.

**오시는 길** — 장소명·주소 텍스트 다음에 지도 자리를 둔다. 지도는 구글 맵 연동(#48, API
키·결제 별도 작업) 전까지 `{colors.surface-field}` 폴백 박스로 대체한다. 길찾기는 place id가
아니라 좌표(`latitude`/`longitude`)로 외부 지도 서비스에 넘긴다.

**뺀 것** — 요약 시트(카드를 누르면 요약 없이 이 화면으로 직행하는 것으로 확정됐다. 위
"히어로 클릭 인터랙션" 참고), 공지·교통편 안내, 분실물 연동, 과거 라인업(같은 축제명의 지난
회차 아카이브 — 시안엔 있지만 이 API 응답에 대응 데이터가 없어 임의로 만들지 않았다.
필요해지면 백엔드 스펙과 함께 다시 다룬다).

오시는 길 옆에는 DEC-0087에 따라 광고 슬롯을 둔다(로그인 없는 개인화 영역 대신 페이지당
광고 하나).

## Host Detail — 10 구조

기준: 10 School Detail 시안. 축제 상세와 같은 원칙 — 1440 좌표를 옮기지 않고, `Container`
위에 섹션을 세로로 쌓는다.

**섹션 순서**: 히어로 → 다가오는 축제 → 축제 이력 → 자주 온 아티스트. `host.type`은 확정된
ERD에 없는 필드라 화면 어디에도 쓰지 않는다 — 주최 표기는 이름·약칭·지역만으로 한다.

**히어로** — **배너도 로고도 그리지 않고, 배경 면 자체를 깔지 않는다.** 페이지 바탕
(`{colors.canvas}`) 위에 약칭·지역(`{typography.caption-strong}` 14/500 `{colors.muted}`) →
이름(`{typography.hero}` 48/700 `{colors.ink}`)만 쌓는다. 아티스트 상세 히어로와 같은 문법이며,
존재감은 타이포 크기와 여백으로만 낸다. 로고·배너는 호스팅 주체가 미결이라 값이 실제로 없고
(DEC-0093), 그 자리를 포스터 틴트로 채우면 빈자리가 해결되는 게 아니라 빈자리처럼 보인다
(DEC-0130). 값이 없는 자리는 비활성이 아니라 제거다(DEC-0129). 값이 생기면 그때 다시 넣으며,
복구 지점은 `HostHero.tsx` 주석에 있다 — 응답의 `logoUrl`·`bannerUrl`과 관리자 등록 화면의 입력
항목은 계약대로 살아 있다. 주최 공식 사이트(`homepageUrl`)가 있으면 이름 옆에 `36` 원형 아이콘
링크(흰 채움 + 1px `{colors.border}`)로 얹는다 — 없으면 자리를 그리지 않는다. 포스터 위가
아니므로 축제 상세 히어로의 반투명 흰 원이 아니다. 인스타그램은 이 응답 계약에 없어 자리를
만들지 않는다(DEC-0107).

같은 판정이 검색 결과의 학교 행에도 걸린다 — 로고 자리의 색 원을 그리지 않고 이름·메타·`›`만
남긴다.

**다가오는 축제** — `{component.upcoming-host-card}`(포스터 전면형 + 3단 ink 스크림, 우상단
반투명 D-day, 하단 축제명·날짜·`자세히 보기 →`)를 한 장씩 넘기는 캐러셀로 보여준다. 상태
뱃지는 넣지 않는다 — 이 응답엔 대응 필드가 없다. **D-day는 이 응답의
`upcomingFestivals[].dday`를 그대로 포맷만 해서 쓴다** — `GET /festivals/upcoming`과 달리
서버가 계산해 내려주는 자리라 프론트가 다시 계산하지 않는다(`formatDday`). 대학 축제는
봄·가을에 몰려 있어 0건인 시기가 더 흔하다 — 빈 상태 문구를 두고 섹션 자체는 감추지 않는다.

**축제 이력** — 응답이 미리보기 2건과 전체 건수만 준다. **페이지네이션도 연도 필터도 만들지
않는다** — 전체 목록·연도별 조회는 축제 목록 화면(`hostId`/`year` 파라미터)의 몫이다. 카드는
`{component.festival-card}`와 같은 고유 폭(236px) 카드이므로, 2장뿐이어도 그리드 칸을 늘려
채우지 않는다 — `grid-cols-2`로 폭을 채우면 세로 비율이 깨진다. `flex-wrap`으로 고유 폭을
유지한 채 나열한다.

**자주 온 아티스트** — 순위(`01`~`03`) + 원형 아바타 + 이름 + 출연 횟수 3장을 나열한다.
응답 배열이 비어 있으면(출연 이력이 없는 신생 학교 등) 섹션 자체를 그리지 않는다 — 빈 헤더만
남기지 않는다.

**뺀 것** — 주최 등록·수정(Admin 화면 범위, 이 시스템의 적용 대상 밖).

화면 하단에는 DEC-0087에 따라 광고 슬롯을 배너형으로 둔다(짝지을 섹션이 없는 화면의 관례).

## Artist Detail — 09 구조

기준: 09-2 Artist Detail 시안. 같은 원칙 — 1440 좌표를 옮기지 않는다.

**아티스트 자리에 아바타를 두지 않는다 — `artist-avatar`는 폐기됐다.** DEC-0063(초상권
문제로 아티스트 실사진을 쓰지 않는다)의 답으로 한때 이니셜 + 이름 해시 색상 아바타를 공용
컴포넌트로 뒀으나, DEC-0130이 이를 뒤집었다: **사진이 없는 자리를 색으로 채우지 않는다.**
빈자리를 색으로 덮는 것은 빈자리를 해결하는 게 아니라 빈자리처럼 보이게 만든다. 히어로·
목록에서 먼저 걷어냈고 검색 결과 행(#153)이 마지막 사용처였다 — 그 시점에 컴포넌트
(`ArtistAvatar`)와 이름 해시 헬퍼(`nameTint`)를 함께 지웠다. 사진을 못 쓰는 엔티티 자리는
새 색·새 컴포넌트를 만들지 않고 타이포와 여백으로만 존재감을 낸다.

**섹션 순서**: 히어로 → 예정 공연/출연 이력(좌우 2단, 넓은 쪽이 예정 공연). 사진이 없어
텍스트 중심 화면이 된다 — 이름 타이포와 장르 칩이 유일한 시각적 구분 요소다.

**히어로** — 장르 칩 → 이름 → 다른 이름(있으면) 순으로 쌓는다. 인스타그램이 있으면
이름 옆에 `36` 원형 아이콘 링크로 둔다. **장르가 없으면 칩 자리를 비워두지 않고 아예
그리지 않는다** — 실측 다수(133명 중 36명)가 빈 값이라 "미분류" 같은 대체 문구를 새로
만들지 않는다.

**예정 공연 / 출연 이력** — 둘 다 응답이 5건 + 전체 건수만 준다. 페이지네이션은 만들지
않지만, 5건을 넘는 건수가 있으면 "더 보기" 요소를 축제 목록 화면(`artistId` 필터)으로 가는
실제 링크로 둔다 — 건수가 5건 이하면 그 요소 자체를 그리지 않는다. **예정 공연의
D-day는 서버가 이미 공연일(축제 시작일이 아니라) 기준으로 계산해 내려준다** — 다시 계산하지
않고 포맷만 하며, 옆의 날짜도 축제 전체 기간이 아니라 그 공연일을 보여준다(둘이 다른 날짜를
가리키면 숫자가 안 맞아 보인다). 출연 이력은 이 응답 구조(1건 = 1행)에 맞춰 연도·축제명·학교·기간을 한 행에
쌓는 전용 행을 쓴다 — DESIGN.md의 `{component.past-lineup-row}`(연도 하나에 아티스트 여러
명을 나열하는 구조)는 반대 방향 데이터라 재사용하지 않는다.

**뺀 것** — 좋아요·알림(로그인 없음), 아티스트 사진(초상권).

화면 하단에는 DEC-0087에 따라 광고 슬롯을 배너형으로 둔다(짝지을 섹션이 없는 화면의 관례).

## Colors

### Brand
- **Primary** (`{colors.primary}` — #4F46E5): 유일한 액션 색. primary 버튼, 활성 nav 메뉴 + 인디케이터, **nav 프로필 아바타 채움**, 링크 텍스트, D-day 뱃지, 수치 강조.
- **Primary Soft** (`{colors.primary-soft}` — #EEF2FF): D-day/DAY 뱃지 배경, Bottom CTA Banner 배경.
- **Secondary** (`{colors.secondary}` — #7C6CFF): 팔레트에만 존재. 사용처 미정의.
- **Accent** (`{colors.accent}` — #FF79C8): 팔레트에만 존재. 현재 사용처 없음 (검색 결과 행의 매칭 도트가 유일한 사용처였으나 #153에서 제거).

### Surface
- **Surface** (`{colors.surface}` — #FFFFFF): 카드·패널·nav·footer·바텀시트·히어로 컨트롤(화살표·도트), **그리고 홈 프레임 배경**.
- **Canvas** (`{colors.canvas}` — #FAFBFF): 히어로가 없는 화면(07~23)의 바탕.
- **Surface Field** (`{colors.surface-field}` — #F3F4F6): 입력 필드, nav 검색 pill, 광고 슬롯 면.
- **Media Placeholder** (`{colors.media-placeholder}` — #111827): 상세 화면 포스터·사진 자리. 실제 이미지로 교체된다.

### Poster Tints
히어로 4장과 최근 축제 5장은 각각 다른 어두운 톤이 깔려 있다. **브랜드 토큰이 아니라 이미지 대역 플레이스홀더**다 — 실제 포스터가 들어오면 사라진다. 다만 "축제마다 색이 다르다"는 인상 자체는 유지할 값어치가 있으므로, 이미지 로딩 전 스켈레톤 색으로 재사용할 것을 권한다.

| 히어로 | 최근 축제 |
|---|---|
| #1E3A5F · #3B1F2E · #1F3A2E · #2A2340 | #2F4F6E · #3A1F6B · #3E5F52 · #6B2B3A · #374151 |

전부 명도가 낮고 채도가 억제된 계열이다. 흰색 텍스트 대비를 보장하기 위한 조건이므로, 새 틴트를 추가할 때도 **L값을 이 범위 안**에 둔다.

### Line
- **Border** (`{colors.border}` — #E5E7EB): 1px 카드/행/필드/칩 아웃라인, nav 하단선, footer 상단선, footer 소셜 아이콘 채움.
- **Border Strong** (`{colors.border-strong}` — #D1D5DB): **광고 슬롯 테두리**, 바텀시트 드래그 핸들, 히어로 비활성 도트.
- **Divider** (`{colors.divider}` — #ECECEC): 섹션·카드 내부·컬럼 구분선.

### Text
- **Ink** (`{colors.ink}` — #111827): 제목·엔티티명·메타 값, 히어로 화살표 아이콘·활성 도트. **nav/footer 로고도 ink** (인디고가 아니다).
- **Body** (#4B5563) / **Body Strong** (#374151): 본문 문단 / 시트 정보 칩.
- **Muted** (`{colors.muted}` — #6B7280): nav 비활성 메뉴, "전체 보기 →" 링크, 카드 학교명, footer 링크, 아이콘.
- **Muted Soft** (`{colors.muted-soft}` — #9CA3AF): placeholder, 기간, 리스트 번호, 광고 라벨, copyright.
- **On Media** (#FFFFFF): 포스터 위 전부.

### Scrim
두 계열이 공존한다.
- **히어로** — 순검정 단일 단계. `{colors.scrim-hero}` 55%, 패널 하단 364px. 그라데이션 아님.
- **상세 화면 카드** — ink 기반 3단 `{colors.scrim-25}` → `{colors.scrim-30}` → `{colors.scrim-35}`. `{component.upcoming-host-card}` 등에 유지.

### 포스터 위 텍스트 불투명도
스크림 위에서는 색을 바꾸지 않고 **흰색의 불투명도로 위계를 만든다.**

| 단계 | 값 | 용도 |
|---|---|---|
| `{opacity.on-media-strong}` | 100% | D-day, 축제명, CTA 링크 |
| `{opacity.on-media-soft}` | 85% | 날짜·장소 |
| `{opacity.on-media-weak}` | 75% | 학교명 |

## Typography

### Font Family
**Pretendard** 한 벌. Fallback: `-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", system-ui, sans-serif`.

무게 네 단계만 쓴다 — **700** (제목·엔티티명·D-day) / **600** (활성 메뉴·버튼·footer 헤더·AD 라벨) / **500** (본문·메타·링크) / **400** (caption·기간·placeholder·footer 링크). 300과 800 이상은 없다.

### Hierarchy

| Token | Size | Weight | Use |
|---|---|---|---|
| `{typography.hero-dday}` | 56px | 700 | **홈 히어로 D-day** |
| `{typography.hero}` | 48px | 700 | 내부 페이지 최상단 헤드라인 |
| `{typography.section-title}` | 36px | 700 | 내부 페이지 섹션 제목 |
| `{typography.hero-name}` | 30px | 700 | **홈 히어로 축제명** |
| `{typography.card-title}` | 28px | 700 | 대형 카드 제목 |
| `{typography.section-title-home}` | 26px | 700 | **홈 섹션 제목** ("최근 등록된 축제") |
| `{typography.sheet-title}` | 26px | 700 | 바텀시트 제목 |
| `{typography.logo}` | 26px | 700 | Nav 로고 "FESTA" |
| `{typography.logo-footer}` | 22px | 700 | Footer 로고 |
| `{typography.subtitle}` | 20px | 600 | 서브 헤드라인, 리스트 행 제목 |
| `{typography.row-title}` | 20px | 700 | 패널 제목, 검색 결과 축제명 |
| `{typography.block-title}` | 18px | 700 | 블록 제목 (바텀시트 "라인업" 등) |
| `{typography.entity-name}` | 17px | 700 | 카드 안 축제명/아티스트명 |
| `{typography.body}` | 16px | 500 | 본문, nav 비활성 메뉴 |
| `{typography.nav-active}` | 16px | 600 | **nav 활성 메뉴** |
| `{typography.button}` | 16px | 600 | 버튼 라벨 |
| `{typography.button-sm}` | 15px | 600 | 시트 버튼, 광고 플레이스홀더 |
| `{typography.caption}` | 14px | 400 | 날짜, 카테고리, nav 검색 placeholder |
| `{typography.caption-strong}` | 14px | 500 | 메타 값, 히어로 학교명·날짜·링크, 분실물 항목명, "전체 보기 →" |
| `{typography.meta}` | 13px | 400 | 인라인 필터, footer 태그라인 |
| `{typography.meta-medium}` | 13px | 500 | **분실물 번호**, 패널 내 링크 |
| `{typography.meta-strong}` | 13px | 700 | DAY 뱃지, D-day 뱃지 |
| `{typography.nav-icon-label}` | 13px | 600 | footer 컬럼 헤더 |
| `{typography.label}` | 12px | 500 | 상태 뱃지 |
| `{typography.label-regular}` | 12px | 400 | footer 링크·copyright, 카드 학교명·기간 |
| `{typography.micro}` | 10px | 600 | **AD 뱃지** |

### Principles
- **line-height 전 스케일 1.21 고정** (Figma auto). 별도의 1.5 본문 행간을 쓰지 않는다.
- **letter-spacing 전부 0.** 한글이 주 언어이기 때문.
- **UPPERCASE 없음.** `FESTA` 와 `AD` 만 대문자다.
- 위계는 크기로 만든다. 홈 히어로의 56 → 30 → 14 세 단계가 그 원칙의 가장 큰 사례다.
- 카드 안 엔티티명은 17/700 고정.

## Layout

### Grid & Container
- **프레임 폭:** 1440px / **홈 프레임 높이:** 2288px
- **컨테이너:** 1280px 중앙 정렬 (x80 ~ x1360)
- **좌우 마진:** 80px
- **Nav 높이:** 72px / **Footer 높이:** 208px / **Hero 높이:** 952px
- 반응형 정의: `Desktop 1440 · Laptop 1280 · Tablet 768 · Mobile 추후 제작 예정`

### 풀블리드 규칙
컨테이너를 벗어나도 되는 요소는 **두 가지뿐**이다:

1. `{component.hero-panel}` ×4 — 1440을 4등분해 전폭을 채운다.
2. `{component.nav}` / `{component.footer}` 의 배경면과 1px 경계선 — 배경만 전폭, **내용물은 1280 안**에 정렬한다.

그 외 모든 콘텐츠는 x80 ~ x1360 안에 들어온다. 히어로 화살표는 예외적으로 마진 32에 놓이는데, 히어로 위에 떠 있는 컨트롤이지 콘텐츠가 아니기 때문이다.

### Spacing System
- **섹션 간격:** `{spacing.section}` 64px
- **패널 간격:** `{spacing.gutter}` 40px (분실물 ↔ 광고)
- **카드 간격:** `{spacing.card-gap}` 25px (5-up 기준)
- **히어로 패널 인셋:** 40px
- **카드 내부 패딩:** 카드 16–20px, 패널 32px, 광고 20px, 바텀시트 32×48px
- 토큰: `{spacing.xxs}` 4 · `{spacing.xs}` 8 · `{spacing.sm}` 12 · `{spacing.md}` 16 · `{spacing.lg}` 20 · `{spacing.xl}` 24 · `{spacing.xxl}` 32 · `{spacing.gutter}` 40 · `{spacing.section}` 64 · `{spacing.page-margin}` 80

### 카드/패널 폭 규칙
컨테이너 1280 안에서 폭이 고정값으로 떨어진다:
- **236px × 5, gap 25** — 축제/아티스트/최근 카드. 236×5 + 25×4 = **1280 정확히**.
- **560 + 40 + 680** — 홈 정보 행 (분실물 패널 + 광고 슬롯).
- **302px × 4** — 분실물 카드.
- **356 / 410px** — 상세 화면 전용 대형 카드.
- **1280px** — 리스트 행·필터 패널·CTA 배너·바텀시트.
- **360px × 4** — 히어로 패널. 유일하게 1440(컨테이너 아님) 을 나눈 값이다.

### 히어로 좌표 규칙
- 패널은 **1440을 정확히 4등분**한다 (360 × 4). 컨테이너 마진 80을 무시한다.
- 패널 내부 인셋은 40 — 컨테이너 마진 80의 절반이다. 1번 패널 텍스트가 x40에서 시작해 페이지 마진보다 40 바깥에 놓인다.
- 텍스트 블록은 패널 상단(D-day y140)과 하단(y700~897)에 붙고 가운데를 비운다.
- 화살표는 히어로 세로 중앙(y524 = 72 + 952/2 − 24)에 정렬한다.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | 그림자 없음 | nav, footer, 배경, 히어로 패널, 미디어 카드 |
| Outline | 1px `{colors.border}` | 정보 카드, 리스트 행, 필드, 칩, 패널 |
| Outline Strong | 1px `{colors.border-strong}` | 광고 슬롯 |
| Card | `{elevation.card}` — 0 8px 30px rgba(0,0,0,0.08) | 떠 있는 카드 |
| Hover | `{elevation.hover}` — 0 12px 40px rgba(0,0,0,0.12) | 카드 hover |
| Scrim | 히어로 55%, 상세 카드 25→30→35% | 미디어 위 텍스트 영역 |

**outline과 shadow는 배타적**으로 쓴다. **히어로에서는 둘 다 쓰지 않는다** — 깊이는 스크림 하나로만 낸다. 히어로 위에 떠 있는 컨트롤(화살표·도트 pill)도 그림자 없이 흰 채움만으로 분리한다.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | 구분선, 활성 메뉴 인디케이터, **히어로 패널·스크림** |
| `{rounded.pause}` | 2px | 히어로 일시정지 아이콘 |
| `{rounded.xs}` | 4px | 아이콘 플레이스홀더, AD 뱃지 |
| `{rounded.social}` | 6px | footer 소셜 아이콘 |
| `{rounded.sm}` | 10px | 인라인 필터 |
| `{rounded.md}` | 12px | 버튼, 입력 필드, 썸네일 |
| `{rounded.cta-icon}` | 14px | CTA 배너 아이콘 카드 |
| `{rounded.row}` | 16px | 리스트 행 |
| `{rounded.media}` | 18px | **그리드 포스터·아티스트 사진** |
| `{rounded.card}` | 20px | **정보 카드·패널·배너** |
| `{rounded.sheet}` | 24px | 바텀시트 |
| `{rounded.pill}` | 999px | 칩, 뱃지, 검색 pill, 아바타, 히어로 도트·화살표 |

**radius가 역할을 말한다.** 0은 "풀블리드 미디어", 18은 "그리드 안의 미디어", 20은 "정보 컨테이너", pill은 "필터·상태·컨트롤".

> `04 Elevation & Radius` 프레임에는 `12 Chip / 18 Festival Card / 20 Card / Pill Search` 네 개만 예시로 올라와 있다. 12–18–20 세 값이 육안으로 거의 구분되지 않는 문제는 [Known Gaps](#known-gaps) 참고.

## Components

### Shell

**`nav`** — `1440×72`, `{colors.surface}`, 하단 1px `{colors.border}` (y71). 06-D에서 `COMPONENT` (`679:319`) 로 정의됨.
- 좌측: `FESTA` `{typography.logo}` 26/700 **`{colors.ink}`**, x80 y20. **태그라인 없음.**
- 메뉴 4개, y26: 홈 x240 · 축제 x295 · 아티스트 x365 · 분실물 x464. 비활성 `{typography.body}` 16/500 `{colors.muted}`, 활성 `{typography.nav-active}` 16/600 `{colors.primary}`.
- 활성 인디케이터: **글자 폭과 같은 너비 × 2px** `{colors.primary}`, 메뉴 x와 동일, y50. (홈 = 15×2)
- 우측: `{component.nav-search}` `280×40` pill x820 y16 (검색 아이콘 `16` `{colors.muted-soft}` 은 pill **우측** x1060), 벨/북마크 `24` r4 `{colors.muted}` x1180/1224, `{component.nav-profile}` `36` 원형 **`{colors.primary}` 채움** x1268 y18.

**`footer`** — `1440×208`, `{colors.surface}`, 상단 1px `{colors.border}`. 06-D에서 `COMPONENT` (`679:428`) 로 정의됨. 좌표는 footer 기준.
- 좌측: 로고 `{typography.logo-footer}` 22/700 `{colors.ink}` y40 → 태그라인 13/400 `{colors.muted}` y82 → copyright 12/400 `{colors.muted-soft}` y108.
- 3열 링크 x560 / 760 / 960. 헤더 `{typography.nav-icon-label}` 13/600 `{colors.ink}` y40, 항목 12/400 `{colors.muted}` y70부터 **행 간격 24**.
  - 서비스: 축제 · 아티스트 · 커뮤니티 · 분실물 · 캘린더
  - 회사: 소개 · 공지사항 · 이용약관 · 개인정보처리방침
  - 고객센터: 문의하기
- 우상단 소셜 `28` `{rounded.social}` `{colors.border}` ×3, x1240/1280/1320 y40.

### Hero

**`hero-panel`** — `360×952`, radius 0, 인셋 40. 포스터 틴트 채움 + 하단 `360×364` 검정 55% 스크림. 텍스트 폭 280 고정, 흰색 100 / 85 / 75%.

**`hero-arrow`** — `48` 흰 원, 아이콘 20/400 `{colors.ink}`. 좌우 마진 32, 히어로 세로 중앙.

**`hero-dots`** — `200×44` 흰 pill. 도트 6 (`{colors.border-strong}`) / 활성 8 (`{colors.ink}`) / 간격 16, 일시정지 `16` r2. **8페이지 × 4장** 구성.

### Content

**`section-header-row`** (1280×32) — 제목 26/700 `{colors.ink}` 좌측 + `전체 보기 →` 14/500 `{colors.muted}` 우측 정렬. 홈 섹션 상단마다 반복된다.

**`recent-card`** (236×379) — 포스터 `236×300` `{rounded.media}` 18 + 학교명 12/400 `{colors.muted}` + 축제명 17/700 `{colors.ink}` + 기간 12/400 `{colors.muted-soft}`. 오버레이 없음.

**`lost-panel`** (560×420) — 흰 패널 + border + r20, 패딩 32. 제목 20/700 + 우측 `전체 보기 →` 13/500 `{colors.muted}`. 번호 리스트 10행, 행 간격 32, 번호 거터 48.

**`ad-slot`** (680×420) — `{colors.surface-field}` + 1px `{colors.border-strong}` + r20. `{component.ad-badge}` 좌상단 20 인셋, 중앙 플레이스홀더 `{typography.button-sm}` 15/600 `{colors.muted-soft}`.

**`ad-badge`** — `32×20` r4 `{colors.muted-soft}` + `AD` `{typography.micro}` 10/600 흰색.

### Buttons

**`button-primary`** — 180×48, 인디고 채움, 흰 텍스트 16/600, r12. 유일한 채움형 CTA.

**`button-secondary`** — 200×52, 흰 배경 + border, **텍스트 인디고** 16/600, r12.

**`button-reset`** — 120×52, secondary 형태 + `{colors.muted}` `{typography.button}` 16/600 텍스트.

**`button-sheet-primary` / `-secondary`** — 높이 44, 15/600. primary 인디고 채움 / secondary 흰 배경 + border + ink.

### Chips & Filters

**`filter-chip`** — h36 pill, 패딩 0 20. 비활성 흰 배경 + border + `{colors.muted}` 14/500 / 활성 인디고 채움 + 흰 텍스트.

**`inline-filter`** — 104×36, r10 (이 컴포넌트만 10), `{typography.meta}` 13/400 `{colors.ink}` + `˅`.

**`search-pill`** — 상세/검색 화면 320×36 `{colors.surface-field}` pill. **nav 안에서는 `{component.nav-search}` 280×40** 을 쓴다.

**`sheet-chip`** — h30 pill, 흰 배경 + border, 12/400 `{colors.body-strong}`.

### Badges

**`badge-dday`** — h28 pill, `{colors.primary-soft}` + `{colors.primary}` 13/700. **홈 히어로에서는 쓰지 않는다** (타이포로 대체). 목록·상세·검색 화면 전용.

**`badge-dday-on-media`** — rgba(255,255,255,0.20) + 1px 흰 테두리 + 흰 `{typography.caption}` 14/400. `{component.upcoming-host-card}` 등 상세 화면 포스터용.

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

**`search-result-row`** (1280×120) — 80×88 포스터 r12, 축제명 20/700, 메타 14/400. 우측 상태 뱃지 → D-day → `›`. (시안의 매칭 하이라이트 줄은 구현에서 뺐다 — #153)

**`past-lineup-row`** (1280×56) — 연도 16/700 인디고 + 아티스트 나열 14/400 + `›`, r16.

### Panels & Overlay

**`search-filter-panel`** (1280×320) — 흰 패널 + border + r20, 패딩 32. 3열×2행 필드 그리드 (389×48, `{colors.surface-field}`, r12), 라벨 14/500 `{colors.muted}`. 우하단 초기화(120×52) + 검색하기(160×52).

**`bottom-cta-banner`** (1280×96) — `{colors.primary-soft}` r20. 56×56 흰 아이콘 카드 r14 + 타이틀 18/700 인디고 + 서브 14/400 + 우측 primary 버튼.

**`bottom-sheet`** (1280×400) — r24 흰 시트, 상단 중앙 48×5 `{colors.border-strong}` 핸들, 우상단 `×`. 좌우 2단, 가운데 1px `{colors.divider}` 세로 구분선 (x616, h336).
- 좌: D-day 뱃지 52×26 → 제목 26/700 → 장소 + `지도 보기` → 정보 칩 4개(h30) → 설명 14/400 → 해시태그 13/500 인디고 → 공유하기 536×44.
- 우: `라인업` 18/700 → 122px 원형 아티스트 4개 + 이름 15/700 → CTA `상세 정보 보기 →` 584×44 인디고.
- 시크릿 게스트(`id`가 null인 원소 — DEC-0116)는 원형을 `{colors.divider}` 로, 이름을 `{colors.muted-soft}` 로 낮춘다.
- **홈에서 이 시트를 띄우지 않는다.** 카드를 누르면 요약 없이 축제 상세로 직행하는 것으로 확정됐다. `06-D-1 Home D-day (요약 시트)` (node `683:482`) 프레임은 현행 4분할 히어로 위에 그려져 있어 06-D와 형태는 맞지만, **현행 흐름에서 쓰이지 않는다.** 스펙을 지우지 않고 남기는 것은 폐기가 아니라 보류이기 때문이다 — 요약 UI가 다시 필요해지면 이 정의를 쓴다.

## 컴포넌트 시트

`05 Components` (**`371:338`**, 1440×4824) 가 실제 화면에서 쓰이는 컴포넌트를 실측 복제해 모아둔 단일 소스다. `05 Components (구버전)` (`56:98`) 은 참조하지 않는다.

섹션: **Cards · List Rows · Chips & Buttons · Panels · Navigation · Overlay · Home Hero**

조판 규칙 (전부 Inter, x=80 기준):
- 섹션 헤더 Bold 20 `{colors.ink}` → 32px 아래 1280×1 `{colors.divider}` 디바이더
- 컴포넌트 라벨 Medium 12 `{colors.muted-soft}`, 컴포넌트 **22px 위**
- 라벨 포맷 `<이름> · <W>×<H> (<사용처 화면번호>)`

**시트에 아직 없는 것** — 21/23 공지(Notice Row · Notice Badge 3종 · Pagination · Breadcrumb), 14-2/14-3/16-5 분실물 신규(Quiz Modal · Quiz Option · Category Tile · Photo Dropzone · Info Banner · Primary Button 아이콘/풀폭 변형). Admin(A0~A5)은 의도적으로 제외한다.

## Do's and Don'ts

### Do
- 홈 상단은 `{component.hero-panel}` 4장으로 1440 전폭을 덮고, 히어로가 끝나면 즉시 1280 컨테이너로 복귀한다.
- 히어로 패널은 여백 없이 맞닿게 배치한다 (360 × 4 = 1440).
- 포스터 위 텍스트 위계는 흰색 불투명도 100 / 85 / 75% 세 단계로 낸다.
- 히어로 패널은 radius 0, 그리드 포스터는 18, 정보 카드는 20 — 이 구분을 지킨다.
- 5-up 그리드는 236 × 5 + **25** × 4 = 1280 으로 맞춘다.
- 정보 카드는 1px `{colors.border}`, 광고·비콘텐츠 슬롯은 1px `{colors.border-strong}` 로 구분한다.
- nav/footer 로고는 `{colors.ink}` 다. 인디고 로고를 쓰지 않는다.
- 카드 안 엔티티명은 17/700 고정.
- 섹션 간격 64 · 패널 간격 40 · 마진 80 · 히어로 인셋 40 을 지킨다.
- 새 컴포넌트를 만들면 `05 Components` 에 **실측 치수 라벨과 함께** 추가한다.

### Don't
- **히어로 안에 인디고를 넣지 않는다.** 흰색과 불투명도만 쓴다.
- **홈 히어로에 D-day pill 뱃지를 쓰지 않는다.** D-day는 56/700 타이포다.
- 히어로 패널에 radius·그림자·테두리를 주지 않는다.
- 히어로 스크림을 ink 계열(`{colors.scrim-25/30/35}`)로 바꾸지 않는다 — 히어로는 순검정 55% 단일 단계다.
- 컨테이너 규칙을 히어로 밖의 요소에 풀어주지 않는다. 풀블리드는 히어로 패널과 shell 배경뿐이다.
- 포스터 틴트를 브랜드 색처럼 재사용하지 않는다 — 이미지 대역 플레이스홀더다.
- 무게 300이나 800을 쓰지 않는다.
- letter-spacing을 조정하지 않는다. line-height를 1.5로 늘리지 않는다.
- 새 radius 값을 임의로 만들지 않는다 — 0 / 12 / 16 / 18 / 20 / 24 / pill 안에서 고른다.
- UI 문구를 영어로 쓰지 않는다. `FESTA` 와 `AD` 만 예외다.

## Responsive Behavior

| Name | Width | Status |
|---|---|---|
| Desktop | 1440px | 기준 캔버스. 컨테이너 1280, 마진 80, 카드 5-up, 히어로 4분할 952 |
| Laptop | 1280px | 마진 축소, 컨테이너 가변. 히어로는 4 → 3분할 축소 예상 |
| Tablet | 768px | 히어로 2분할 또는 1장 예상, 카드 2-up, 정보 행 1열 스택 예상 |
| Mobile | — | **추후 제작 예정** |

### Touch Targets
- `{component.hero-arrow}` 48 / `{component.nav-search}` 40 / `{component.nav-profile}` 36.
- `{component.button-primary}` 48, `{component.button-secondary}` 52, `{component.text-field}` 48 — 44px 충족.
- 칩 36, 시트 칩 30, nav 프로필 36, 히어로 도트 6–8 — **모바일 전환 시 44px 확보가 필요한 지점.**

### 미정의 영역
히어로의 반응형 축소 규칙(4분할 → 3 → 2 → 1 전환 시점), Tablet 이하 레이아웃, 정보 행 스택 순서, nav 햄버거 전환, 바텀시트 전폭 전환은 아직 Figma에 없다.

## Iteration Guide

1. 컴포넌트 하나씩 다룬다. YAML 키를 직접 참조한다 (`{component.hero-panel}`, `{component.recent-card}`).
   **산문의 수치와 상단 YAML이 어긋나면 YAML이 정본이다.** 산문은 읽기 쉬우라고 풀어 쓴
   것이고, 구현이 참조하는 단일 출처는 `components:` 블록의 토큰 키다. 산문에 수치를 적을
   때는 토큰 키를 함께 적어 어긋남이 눈에 띄게 한다 (예: `{typography.caption}` 14/400).
   실제로 2026-08-15에 네 곳(`ad-slot`·`button-reset`·`inline-filter`·`badge-dday-on-media`)이
   굵기에서 갈려 있었고, 전부 YAML 기준으로 산문을 고쳤다.
2. 새 컴포넌트의 기본 radius는 `{rounded.card}` (20). 그리드 미디어면 18, 풀블리드 미디어면 0, 필터/상태/컨트롤이면 pill.
3. 히어로에 무언가를 추가할 때는 먼저 물어본다 — "이게 흰색 + 불투명도로 표현되는가?" 아니면 히어로 밖에 놓는다.
4. 변형(`-active`, `-on-media`)은 `components:` 블록에 별도 항목으로 둔다.
5. 색은 항상 `{token.refs}` 로 참조한다 — hex 인라인 금지. 예외는 `poster-tints:` 뿐이며, 이건 이미지로 대체될 값이다.
6. 상태는 Default / Active / Hover(그림자만) 세 가지만 정의되어 있다. focus·disabled·error는 미정의다.
7. UI 문구는 한국어로 유지한다.
8. 치수는 **반드시 Figma 실측값**을 쓴다. 추정값을 문서에 넣지 않는다.

## Known Gaps

### 미결 결정
- **radius 스케일 12 / 18 / 20 이 육안으로 구분되지 않는다.** 236px 카드에서 18과 20은 사실상 같아 보인다. 16 / 20 으로 정리하거나 20으로 통일하는 안이 있으나 미결. 바꾸면 Festival / Artist / Upcoming / Recent 포스터 4종 + 06-C/06-D/17/18/20/22 실화면을 함께 수정해야 한다.
- **홈 프레임 배경이 `#ffffff` 인데 나머지 화면은 `#fafbff` 다.** 의도된 분기로 문서화했으나, 홈 하단부도 canvas 로 통일할지 결정이 필요하다.
- **섹션 제목이 홈 26 / 내부 36 으로 갈려 있다.** `{typography.section-title-home}` 과 `{typography.section-title}` 을 둘 다 두었으나, 한쪽으로 통일할지 결정해야 한다.
- **홈에 아티스트 섹션이 없다.** 이전 홈에 있던 "인기 아티스트 TOP 10" 이 06-D에서 빠졌다. 의도된 제거인지 확인 필요.

### 반영 대기
- **히어로 카드 클릭 인터랙션은 확정됐다 — 카드를 누르면 요약 없이 축제 상세로 간다.** 후보 다섯(바텀시트 · 측면 슬라이드 · 상단 커튼 · 호버 미리보기 · 직행)이 실제로 경합했고, 앞의 넷은 되돌아가는 방법을 설계하지 못했거나 모바일에 호버가 없다는 이유로 떨어졌다. **피그마에는 아직 반영되지 않았다** — 캔버스 메모(`734:734`)의 세 안과 `06-D-1 Home D-day (요약 시트)` 프레임(`683:482`)이 그대로 남아 있어, 피그마만 보고 오면 이 결정을 되돌리게 된다. 실제로 그럴 뻔한 적이 있다. **피그마 정리가 필요하다.**
- **nav / footer 가 06-D에서만 `COMPONENT` 이고 다른 화면은 복제본이다.** 06-D 기준 변경 사항: 로고 24→26 / ink, 검색 pill 200×36→280×40, 프로필 32 회색→36 인디고, footer 180→208, footer 로고 20→22, nav 태그라인 제거, 메뉴 4개(커뮤니티·캘린더 제거). **07~23 화면 일괄 반영이 필요하다.**
- **카드 간격이 24(구 문서) / 25(06-D 실측) 로 갈려 있다.** 06-D의 25가 1280을 정확히 채우므로 25를 기준으로 잡았다. 내부 화면들의 5-up 그리드도 25로 맞춰야 한다.
- **컴포넌트 시트에 공지(21/23)·분실물 신규(14-2/14-3/16-5) 컴포넌트가 빠져 있다.** 목록은 [컴포넌트 시트](#컴포넌트-시트) 참고.

### 시스템 미비
- **Figma Local Styles / Variables 가 비어 있다.** 색·타입이 스타일로 등록되어 있지 않아 전부 하드코딩이다 (`get_styles` → 전부 빈 배열). 토큰화가 첫 번째 정비 대상.
- **폰트가 Pretendard 로 명시되어 있으나 실제 렌더 패밀리는 Inter 다.** Figma에 Pretendard 미설치. 구현 시 Pretendard 로드 필요 — 한글 자간·행간이 달라진다.
- **광고 슬롯의 정책이 없다.** 680×420 1구좌만 정의되어 있고, 다른 화면의 광고 위치·크기·빈도가 미정의다.
- **`{colors.secondary}` / `{colors.accent}` 의 사용 규칙이 없다.** 실제 사용처가 없다 (accent는 #153에서 마지막 사용처였던 검색 매칭 도트가 빠졌다).
- **semantic 색이 success 한 계열뿐이다.** warning / error / info, 폼 검증 상태 미정의. (Admin 화면에는 amber/pink 상태 필이 이미 쓰이고 있으나 시스템 대상 밖이다.)
- **hover 외의 인터랙션 상태가 없다.** focus ring, disabled, loading, empty state 미정의. 히어로 캐러셀의 전환 방식(슬라이드/페이드)·자동재생 주기도 미정의.
- **아이콘 시스템이 없다.** 모든 아이콘이 radius 4 사각형 플레이스홀더다.
- **도트 8개 ↔ 패널 4장의 관계가 데이터로 확정되지 않았다.** 8페이지 × 4장 = 32개 축제를 전제하는데, 축제 수가 그보다 적거나 많을 때의 규칙이 없다.
