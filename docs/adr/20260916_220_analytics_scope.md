# ADR: GA4·Clarity 연결 준비와 화면별 수집 범위

- 날짜: 2026-09-16
- 작업: #220
- 상태: 연결 기반 구현, 운영 수집 비활성. 동의 UI·활성화는 [#233](https://github.com/greedy-team/festa-frontend/issues/233).
- 기준 코드: develop `aa36de9`를 #220 브랜치에 fast-forward 반영.
- 상위 근거: festa 지식 볼트 DOC-0014, DEC-0202(Lighthouse), DEC-0203(GA4·Clarity).

## 문제와 결정

FESTA는 로그인 없는 축제 정보 서비스다. GA4로 유입과 탐색 경로를 집계하고,
Clarity로 클릭·스크롤·이용 장면을 관찰해 개선 가설을 찾는다. 도구 설치 자체가
사용성 개선 완료는 아니다. 필요한 화면을 명시적으로 허용하고 새 경로는 기본 제외한다.

사용자 요청에 따라 코드 연결을 먼저 준비하고 동의 기능은 별도 이슈로 진행한다.
현재 RootLayout의 `consentGranted={false}`는 실제 수집을 막는 명시적 배포 차단 장치다.
Vercel 환경변수 등록·재배포만으로 수집이 시작되지 않는다. 배너나 모달은 이번에 추가하지 않는다.
방문·계속 이용을 동의로 간주하지 않는 현재 `/terms` 및 선택 거부에도 기본 열람을 허용하는
`/privacy`를 유지한다. 후속 작업에서 명시적 동의·거부·철회를 연결한다.

## 화면별 수집 이유

아래 표는 동의 기능 연결 후 적용할 허용 범위다. 현재 운영에서는 전부 비활성이다.

| 화면 | GA4 분류 | 분석을 넣는 이유·확인할 질문 |
| --- | --- | --- |
| 홈 `/` | home | 대표 진입 화면. 방문자가 목록·상세 탐색을 시작하는가? Clarity로 포스터·메뉴 클릭과 스크롤 관찰 |
| 축제 목록 `/festivals` | festival_list | 핵심 탐색. 원하는 축제를 발견하고 상세로 넘어가는가? 카드 배치·필터 이용의 불편 확인 |
| 축제 상세 `/festivals/{숫자 ID}` | festival_detail | 일정·라인업·장소 확인이 핵심 목적. 상세 직접 유입도 정상 이용으로 취급하고 홈 시작 퍼널을 강요하지 않음 |
| 아티스트 목록·상세 | artist_list / artist_detail | 관심 아티스트에서 축제로 이동하는 보조 탐색 경로. 축제 중심 제품 목적을 보완 |
| 학교 상세·축제 이력 | host_detail / host_history | 특정 학교 축제의 현재·과거 정보를 탐색하는 경로 |
| 검색 `/search` | search | 검색 후 결과 탐색 여부 확인. 검색어 원문 없이 경로만 전송. Clarity 녹화는 URL·본문 마스킹 검증 완료가 활성화 전제 |
| 관리자·로그인 | 제외 | 운영자 업무와 인증 정보는 공개 방문 분석 대상이 아님 |
| showcase | 제외 | 내부 시안 확인·테스트를 실제 방문으로 집계하지 않음 |
| 약관·개인정보·저작권 정책 | 제외 | 고지 확인은 축제 탐색 분석 질문의 대상이 아님 |
| 알 수 없는 경로·문자열 ID | 제외 | 의도하지 않은 경로와 개인정보가 포함될 수 있는 임의 문자열 전송 방지 |

페이지 조회만으로 만족도·이탈 원인을 확정하지 않는다. 정보를 확인하고 바로 떠나는 것도
정상적인 완료일 수 있다. 재생에서 반복 불편을 찾고 재현한 뒤 개선 후보 1~2개를 고른다.

## 도구와 기술 선택

| 비교 기준 | Hotjar/Contentsquare | Clarity | 선택 근거 |
| --- | --- | --- | --- |
| 히트맵·재생 | 제공 | 제공 | Clarity로 현재 행동 관찰 목적 충족 |
| 설문 | 제공 | 이번 요구의 우선순위 아님 | 정기 설문이 필요해지면 Contentsquare 재검토 |
| 비용 | 무료 플랜 제공 | 무료 제공 | 무료라는 점만으로 우열을 주장하지 않고 필요한 기능 충족 여부로 선택 |

Next.js의 기존 `next/script`를 사용한다. NPM 분석 SDK·GTM·별도 수집 서버는 추가하지 않는다.
GA4와 Clarity 두 재생 도구를 설치하는 것이 아니라, 통계 도구 하나와 재생 도구 하나를 조합한다.

- 서버에서 `VERCEL_ENV === production`과 모킹 비활성 여부를 검사한다.
- ID가 없거나 형식이 잘못된 도구는 로드하지 않는다. ID는 공개 설정값이며 비밀키가 아니다.
- GA4 페이지 조회는 코드에서 관리하고 `send_page_view: false`로 초기 자동 전송을 막는다.
- 경로·쿼리 변경을 탐색으로 인식하되 전송 데이터에서는 쿼리·해시를 제거한다.
- 페이지 제목은 실제 검색어·문서 제목 대신 고정 화면 분류를 전송한다.
- referrer는 origin만 남긴다. 외부 유입 도메인 분석은 가능하지만 유입 페이지 상세와 UTM 캠페인 분석은 이번 범위에서 제한된다.
- 광고용 동의·Google Signals·광고 개인 최적화는 활성화하지 않는다.

## 활성화 전에 반드시 연결·검증할 항목

현재 `false`를 단순히 `true`로 바꾸어 운영 활성화하지 않는다. 아래 항목은 후속 #233의 완료 조건이다.

1. 후속 이슈에서 실제 동의 상태와 거부·철회를 구현하고 처리방침의 분석 도구·항목·기간을 확정한다.
2. GA4 관리 화면의 향상된 측정을 끈다. 특히 브라우저 기록 기반 자동 page_view는
   `send_page_view: false`만으로 꺼지지 않으므로 중복과 원문 URL 자동 전송을 별도로 막아야 한다.
   이전 계정 생성 안내에서 켜둔 설정은 활성화 전에 변경한다.
3. Clarity Strict 마스킹, 검색어가 담긴 본문·링크·URL·referrer 검증을 마친다.
   DOM 마스킹만으로 URL까지 정제된다고 간주하지 않는다. 안전한 정제가 확인되지 않는 화면은 녹화에서 제외한다.
4. SPA 공개→관리자/정책/검색 이동 시 이미 로드된 SDK가 전송하는 요청, 지연 로드 중 거부,
   철회·재동의를 실제 브라우저에서 검증한다. 현재 경로 변경 시 stop 호출만으로 모든 경쟁 상태를 해결했다고 주장하지 않는다.
5. GA4 DebugView와 Clarity 프로젝트에서 실제 수신·마스킹 확인 후 수집 활성화와 Lighthouse 재측정을 진행한다.

## 이번 구현 범위와 후속 범위

이번에는 환경변수 연결, 동의 차단, 허용 경로 분류, GA4 수동 page_view,
Clarity 초기 로드 코드를 준비했다. 공개 UI는 바꾸지 않았다.
동의·마스킹·SPA SDK 생명주기와 실제 수신 검증은 활성화 이슈에 남긴다.
`select_content`, `search_results_view`, `official_link_click`은 DOC-0014의 #220 후속 구현 항목이며
이번 페이지 조회 코드로 구현됐다고 간주하지 않는다.

네이버 robots.txt는 별도 진단 결과 운영에서 HTTP 200·Allow /·sitemap을 확인했다.
현재 코드에도 동일한 robots 응답이 있어 중복 파일을 추가하지 않는다. 서치어드바이저 재수집 확인은 남아 있다.

## 공식 근거

- [Clarity](https://clarity.microsoft.com/) · [Hotjar/Contentsquare](https://contentsquare.com/hotjar/)
- [GA4 페이지 조회와 자동 측정 중복](https://developers.google.com/analytics/devguides/collection/ga4/views)
- [GA4 page_location·page_referrer 설정](https://developers.google.com/analytics/devguides/collection/ga4/reference/config)
- [Clarity consentv2](https://learn.microsoft.com/en-gb/clarity/setup-and-installation/clarity-consent-api-v2)
- [Clarity start·stop 구현](https://github.com/microsoft/clarity/blob/master/packages/clarity-js/src/clarity.ts)
