# GA4·Clarity 운영 연결 (#233)

## 활성화 조건

Vercel Production에 아래 설정을 적용한 뒤 새로 빌드한다.

| Key | 값 |
| --- | --- |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 웹 스트림의 `G-…` 측정 ID |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Clarity 프로젝트 ID |
| `ANALYTICS_ENABLED` | 아래 검증과 고지 확정 후 `true` |

Production 환경이며 모킹이 꺼져 있어야 한다. `ANALYTICS_ENABLED`가 없으면 수집하지 않는다.
이미 등록된 ID만으로 미확정 동의문이 운영에 활성화되지 않도록 두는 배포 스위치다.

## 관리 화면 확인

- GA4 향상된 측정을 끈다. 코드가 `page_view`를 관리하므로 자동 히스토리 조회와 중복시키지 않는다.
- GA4 사용자·이벤트 데이터 보관 기간을 확정하고 고지와 맞춘다. 제안은 2개월이며 실제 계정 설정은 별도 확인한다. 기간을 고정하려면 ‘새 활동 발생 시 재설정’도 끈다. 이 설정은 표준 집계 보고서의 보관 기간을 제한하지 않는다.
- Clarity 보관 기간은 일반 재생 30일, 라벨·즐겨찾기 재생 및 히트맵·클릭 집계 9개월이다(공식 문서 2026-09-16 확인).
- Clarity 마스킹 모드는 **Relaxed**로 둔다(DEC-0211). 재생에서 실제 화면 내용을 봐야 하기 때문이다.
  코드의 body 전체 마스킹(`data-clarity-mask`)은 제거했다 — 이 속성은 값이 아니라 존재 여부로
  판정되므로 `"false"`로 두면 마스킹이 그대로 걸린다(`clarity-js/src/layout/dom.ts`).
  입력창·드롭다운은 모드와 무관하게 Clarity가 강제로 마스킹하며 해제할 수 없다.
  검색어는 마스킹이 아니라 `analyticsRecordingAllowed`가 막는다 — `/search`와 쿼리·해시가 있는
  URL에서는 Clarity를 아예 로드하지 않는다.
- Clarity가 안내하는 만 18세 미만 대상 서비스 제한에 FESTA가 해당하는지 운영자가 확인한다.
- 처리방침의 분석 도구·항목·보유 기간·문의처·국외 이전 내역을 확정한다.

## 구현 동작

- GA4와 Clarity를 개별 선택하며 처음에는 모두 꺼져 있다.
- 선택은 `festa.analytics-consent.v1`에 `ga`, `clarity`, `all`, `denied` 중 하나로 저장된다.
- 푸터의 분석 설정에서 변경·철회한다. 저장소 차단 시 현재 문서에서만 선택을 유지한다.
- 이미 태그를 불러온 상태에서 동의를 줄이면 분석 쿠키를 정리하고 새로고침한다. 지연 로딩 중인 태그도 기존 문서와 함께 종료하기 위해서다.
- GA4는 허용된 공개 경로와 고정 화면 분류만 전송한다. 쿼리·해시·검색어·원문 referrer는 제외한다.
- Clarity는 검색 화면, 쿼리·해시가 있는 화면과 민감한 referrer가 있는 진입에서 로드하지 않는다.
- 태그 로딩 이후 수집 제외 화면으로 이동하면 전체 문서 탐색으로 SDK를 정리한다. 일반 공개 화면 간 이동은 SPA를 유지한다.
- `page_view`, `select_content`, `search_results_view`, `official_link_click`을 수집한다. 검색 결과 이벤트는 결과 개수·분류만, 콘텐츠 선택은 숫자 ID·유형만 전송한다.

## 검증

- `pnpm test`, `pnpm lint`, `pnpm build`
- `pnpm test:e2e analytics-consent` — 개별 선택·새로고침·철회·모바일·Escape
- `ANALYTICS_E2E=true pnpm test:e2e --workers=1` — 3110 포트에서 운영 조건으로 빌드·기동하고 지연 태그 철회까지 검사한다. 실제 백엔드 접근과 Clarity 태그 다운로드가 필요하다. GA ID는 테스트 값이며 테스트에서 두 도구의 수집 요청을 가로채므로 운영 분석에 테스트 방문을 보내지 않는다.
- 실제 SDK 검증: 로컬에서 가짜 GA ID를 사용하고 GA `/g/collect`, Clarity `/collect` 요청을 가로챈다. 요청이 한 건 이상 발생했음을 확인한 뒤 테스트 검색어가 없는지 검사한다.
- 지연된 태그 응답을 철회 후 해제해도 새 문서에 태그가 실행되지 않는지 확인한다.
- 운영 활성화 후 GA4 실시간/DebugView와 Clarity 프로젝트에서 수신·마스킹을 확인한다.
- 분석 동의 전/후를 같은 조건으로 Lighthouse 측정해 태그 비용을 기록한다.

현재 로컬 확인: 개별 동의·철회, 실제 Clarity SDK 로딩, 정책 화면 이동 후 태그 부재,
GA 이벤트 4종의 실제 전송과 검색어·쿼리 미전송. 실제 검색→축제 상세→공식 링크 클릭에서
`page_view`, `search_results_view`(결과 4건), `select_content`(축제 82),
`official_link_click`(homepage)을 확인했다(2026-09-16의 데이터 기준).
Clarity는 압축 해제한 JSON에 본문 텍스트가 실제로 담기는지(마스킹 해제 검증)와 검색 입력의
테스트 문자열이 빠졌는지를 검사한다. 이 회귀 검사를 포함한 E2E 7개가
프로덕션 서버에서 통과했다. 운영 프로젝트 수신과 관리 화면 설정은 아직 미검증이다.

분석 비활성/활성 모바일 Lighthouse를 같은 로컬 프로덕션 빌드에서 각각 5회 측정했다.
중앙값은 비활성 Performance 80·LCP 4.138초·TBT 5ms, 활성 82·3.835초·4.5ms였다.
악화는 관찰되지 않았지만 활성 LCP 개선처럼 보이는 차이는 실행 변동이며 태그의 성능 개선으로
해석하지 않는다. 원본과 조건은 `docs/analyzes/analytics-tag-cost/` 및
`docs/reports/20260916_233_분석_동의와_ga4_clarity_활성화.md`에 기록했다.

## 참고

- 브레인 DEC-0203, DOC-0016 및 `docs/legal/05-analytics-consent-draft.md`
- [Clarity 동의 API](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2)
- [Clarity FAQ: 사용 제한·URL 마스킹](https://learn.microsoft.com/en-us/clarity/faq)
- [GA4 수동 페이지 조회](https://developers.google.com/analytics/devguides/collection/ga4/views)
- [GA4 데이터 보관](https://support.google.com/analytics/answer/7667196?hl=ko)
- [Clarity 데이터 보관](https://learn.microsoft.com/en-us/clarity/setup-and-installation/data-retention)
