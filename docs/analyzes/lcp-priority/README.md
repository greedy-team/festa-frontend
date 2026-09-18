# LCP 우선순위 힌트 — 측정 원본 (#252)

홈 히어로 첫 포스터에 `fetchpriority=high`를 추가한 변경의 전/후 Lighthouse 측정 원본이다.

## 측정 조건

- 대상: `https://www.every-festa.com/`
- 도구: Lighthouse CLI 13.4.1(개별 5회 측정 JSON) / 13.5.0(전체 카테고리 스크린샷용 단발 실행)
- 브라우저: **확장 프로그램 없는 헤드리스 Chrome** (`--chrome-flags="--headless=new --no-sandbox"`)
- 모바일: `--form-factor=mobile --screenEmulation.mobile` / 데스크톱: `--preset=desktop`
- 각 조건 5회 측정 후 중앙값을 대표값으로 쓴다(DEC-0202)

**측정 환경: 확장 프로그램 없는 Chrome(헤드리스)에서 5회 측정 후 중앙값 사용. 확장 프로그램이
설치된 일반 브라우저에서는 Best Practices·Accessibility 점수가 다르게 나올 수 있다.**

확장 프로그램이 깔린 일반 브라우저로 측정하면 그 확장이 남기는 `chrome-extension://` 요청
때문에 서드파티 쿠키·DevTools Issue 감사가 실패해서 Best Practices 점수가 실제보다 낮게
잡힌다. 그래서 before/after를 비교할 때는 항상 같은 조건 — 확장 프로그램 없는 깨끗한 환경 —
에서 재서 비교한다. 같은 현상을 `DOC-0015`가 2026-09-15 초기 진단에서 이미 확인했다
(확장 있을 때 Best Practices 77점, 없을 때 100점, 코드는 동일).

## 파일

| 파일 | 내용 |
| --- | --- |
| `prod-before-{1..5}.json` | 배포 전 모바일 Performance 5회 측정 (중앙값: P 76 · LCP 7.52s · resourceLoadDelay 794ms · discovery FAIL 0/5) |
| `prod-before-desktop-{1..5}.json` | 배포 전 데스크톱 Performance 5회 측정 (중앙값: P 94 · LCP 1.24s) |
| `prod-before-mobile-score.png` / `prod-before-desktop-score.png` | 전체 카테고리(Performance·Accessibility·Best Practices·SEO) 점수 화면 |
| `prod-before-mobile-site.jpg` / `prod-before-desktop-site.jpg` | Lighthouse가 실제로 캡처한 사이트 화면 (250×498 / 500×348) |

배포 후 같은 조건으로 재측정해 `prod-after-*` 접두로 추가하고 전후를 비교한다.
