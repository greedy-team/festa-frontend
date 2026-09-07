# Changelog

**현재 버전:** 0.1.13  
**마지막 업데이트:** 2026-09-07T06:43:22Z  

---

## [0.1.13] - 2026-09-07

**PR:** #209  

**기타**
- Merge pull request from greedy-team/feat_201_검색_노출_기본_설정과_festa_공유_이미지_적용
- feat : 검색엔진 등록 후속 보고서 추가
- feat : SEO 공유 이미지 및 광고 적용 보고서 추가
- feat : 첫 번째 히어로 배경색 조정
- feat : 네이버 사이트 소유확인 메타태그 추가

---

## [0.1.12] - 2026-09-07

**PR:** #206  

**기타**
- Merge pull request from greedy-team/feat_202_연도가_없는_화면_세_곳에_연도를_노출한다
- Merge remote-tracking branch 'origin/develop' into feat_202_연도가_없는_화면_세_곳에_연도를_노출한다
- Merge pull request from greedy-team/feat_201_검색_노출_기본_설정과_festa_공유_이미지_적용
- fix : 날짜에 흔들리는 라인업 E2E 대상 고정
- feat : 축제 상세·검색 결과·관리자 검수 표의 날짜에 연도 노출
- feat : 광고 이미지와 랜덤 패널 및 신청 링크 적용
- fix : 교체한 파비콘 적용과 캐시 갱신
- feat : 공개 페이지 SEO와 FESTA 공유 이미지 적용

---

## [0.1.11] - 2026-09-06

**PR:** #197  

**기타**
- Merge pull request from greedy-team/feat_187_축제_개수에_따른_히어로_레이아웃과_빈_상태_화면_정리
- docs : 리포트 문서 작성
- docs : DESIGN.md 히어로 절에 개수별 조판 규칙 반영
- feat : 쇼케이스 히어로 표본을 개수별 조판(1~4건)으로 갱신
- feat : 히어로 패널 조판을 축제 개수에 따라 좌우 분할·세로 스택으로 나눈다
- feat : 오시는 길을 지도 우선 레이아웃으로 바꾼다
- feat : 히어로 개수별 레이아웃 이슈 초안 추가
- feat : 헤더 메뉴를 중앙 정렬하고 스크롤 전환 시점을 앞당긴다
- feat : 축제 2건 이상일 때 히어로가 크래시하는 문제 수정
- feat : 히어로 포스터를 자르지 않고 원본 비율로 보여준다
- Merge pull request from greedy-team/fix_194_다가오는_순_정렬이_실제로는_오래된순으로_동작한다
- docs : 다가오는 순 정렬 status 필터 결합 구현 보고서 추가
- fix : "다가오는 순" 정렬에 status=UPCOMING 필터를 함께 보내 지난 축제를 제외한다
- Merge pull request from greedy-team/docs_192_190_구현_보고서의_결정_노트_참조를_dec_0173으로_정정
- docs : 구현 보고서의 결정 노트 참조를 DEC-0173으로 정정
- Merge pull request from greedy-team/feat_190_축제_상세_히어로_인스타_링크를_축제_계정으로_교체
- feat : 축제 상세 히어로 인스타 링크를 축제 계정으로 교체
- Merge pull request from greedy-team/fix_188_축제_전체_페이지에서_검색이_동작하지_않는다
- docs : 리포트 문서 작성
- fix : 축제 전체 페이지 검색 기능 연결
- Merge pull request from greedy-team/fix_181_실데이터_연동과_홈_스크롤_경계_점검
- docs : 관리자 실서버 인증 검증 결과 기록
- Merge pull request from greedy-team/docs_184_design_md_카드_스펙에_연도_줄을_반영한다
- docs : 리포트 문서 작성
- docs : DESIGN.md 카드 스펙에 연도 줄 반영
- Merge pull request from greedy-team/feat_182_축제_카드_기간_위에_연도를_표시한다
- docs : 리포트 문서 작성
- feat : 축제 목록·홈 최근 카드 기간 위에 연도 표시
- docs : 프로덕션 빌드와 전체 E2E 검증 결과 기록
- fix : 홈 스크롤 경계와 입장 안내 null 계약 보정
- Merge pull request from greedy-team/docs_178_홈_히어로_빈_상태_구현_보고서
- docs : 홈 히어로 빈 상태 구현 보고서 추가
- Merge pull request from greedy-team/feat_178_다가오는_축제가_0건일_때_히어로에_아티스트_이름을_조판한다
- feat : 홈 히어로 스크롤 애니메이션 추가
- feat : 다가오는 축제가 0건일 때 히어로 배경을 아티스트 이름 벽으로 교체
- Merge pull request from greedy-team/docs_176_e2e_구현_보고서에_리뷰_반영_내용_누락
- docs : E2E 보고서에 타임존 하루 밀림 수정과 href 단언 반영
- Merge pull request from greedy-team/chore_174_e2e가_안_덮는_흐름_추가
- Merge pull request from greedy-team/chore_172_테스트가_없는_순수_함수에_유닛테스트_추가
- docs : 순수 함수 유닛테스트 추가 구현 보고서 작성
- fix : daysFromToday 서쪽 타임존 하루 밀림 수정, 라인업 href 모양 단언 추가
- chore : 리뷰 반영 - 요청 URL·옵션과 일시 포맷 결과를 단언해 살아남던 변이 차단
- docs : CI 경쟁 상태 수정과 재현 절차를 구현 보고서에 반영
- fix : CI에서 렌더 전 count()가 0을 읽어 스펙이 대상을 건너뛰던 문제 수정
- docs : E2E 흐름 추가 구현 보고서 작성
- chore : E2E가 안 덮던 흐름 8개 스펙 추가와 스킵 해소 (17 → 36건)
- chore : 테스트 없던 순수 함수 9곳에 유닛테스트 추가 (74 → 126건)
- Merge pull request from greedy-team/chore_48_구글_맵_키_결제_설정과_축제_상세_지도_임베드
- docs : 구글 맵 임베드 구현 보고서와 결과물 보존 규칙 추가
- chore : 축제 상세 오시는 길 폴백 박스를 구글 맵 임베드로 교체
- Merge pull request from greedy-team/chore_116_관리자_화면_e2e_테스트_도입
- docs : 관리자 E2E 구현 보고서 갱신과 실행 결과물 보존
- chore : 축제 검수 E2E를 실 API 화면 기준으로 재작성 — 발행·해제·차단 3건
- chore : 관리자 검수 목록·발행·해제 MSW 핸들러와 실서버 캡처 픽스처 추가
- Merge remote-tracking branch 'origin/develop' into chore_116_관리자_화면_e2e_테스트_도입
- Merge pull request from greedy-team/feat_165_축제_상세_화면_텍스트가_작고_흐려_읽기_어려운_문제_개선
- feat : 주최·아티스트 상세에 상세 화면 텍스트 규칙 적용, 검색 결과 행 스펙 정정
- feat : 축제 상세 텍스트 대비·크기 개선, 라인업 바텀시트 제거와 아티스트 링크
- Merge pull request from greedy-team/docs_166_design_md_day_card_라인업_바텀시트_자주_온_아티스트_스펙을_아바타_제거_반영해_갱신
- docs : DESIGN.md day-card·라인업 바텀시트·자주 온 아티스트 스펙을 아바타 제거 반영해 갱신

---

## [0.1.10] - 2026-08-24

**PR:** #77  

**기타**
- Merge pull request from greedy-team/fix_75_vercel_배포_환경에서_서버_사이드_api_모킹이_동작하지_않음
- docs : 리포트 문서 작성
- fix : Vercel 서버리스에서 API 모킹이 동작하지 않는 문제 수정

---

## [0.1.9] - 2026-08-24

**PR:** #74  

**기타**
- Merge pull request from greedy-team/chore_72_브라우저_지원_범위에_삼성인터넷_추가_browserslist
- chore : 브라우저 지원 범위에 오페라 추가
- chore : 브라우저 지원 범위에 삼성인터넷 추가
- Merge pull request from greedy-team/docs_70_이슈_68_구현_보고서_추가
- docs : 이슈 구현 보고서 추가
- Merge pull request from greedy-team/fix_68_히어로_자세히_보기_링크가_클릭되지_않음
- fix : 홈 히어로 자세히 보기 링크가 도트 래퍼에 가려 클릭되지 않던 문제 수정
- Merge pull request from greedy-team/feat_61_관리자_셸_로그인_라우트_구성
- docs : 코드 리뷰 반영 구현 보고서 추가
- fix : PR 코드 리뷰 반영 — 로그인 파싱·드로어 접근성·해제 확인·year 배선 정리
- Merge pull request from greedy-team/feat_61_관리자_셸_로그인_라우트_구성
- feat : 축제 검수 화면 추가
- feat : 관리자 공용 UI 컴포넌트 추가
- feat : 관리자 데이터 계층 기반 추가
- feat : 관리자 로그인과 라우트 가드 추가
- feat : 관리자 셸과 라우트 구조 추가
- refactor : parsePage 중복 추출과 SortDropdown 파라미터 일반화
- docs : 세션 작업 이슈 9건 구현 보고서 추가
- Merge pull request from greedy-team/feat_47_아티스트_상세_화면
- docs : DESIGN.md 아티스트 상세 섹션을 실제 구현에 맞춰 갱신
- fix : 리뷰 반영 — 실패 상태 구분, 연도 누락, 컴포넌트 재사용, artistId 필터
- fix : 인스타그램 아이콘을 아바타 모서리 배지로 이동
- fix : 하단 더보기 요소 추가, 광고를 두 컬럼 전체 폭으로 수정
- feat : 예정 공연 컬럼 아래에 광고 슬롯 추가
- fix : 아티스트 상세 레이아웃을 시안대로 2단 좌우 배치로 수정
- docs : DESIGN.md에 아티스트 상세 화면(09) 구성 원칙 추가
- feat : 아티스트 상세 화면 조립 — 예정 공연·출연 이력 ()
- Merge pull request from greedy-team/feat_46_주최_상세_화면
- docs : DESIGN.md 주최 상세 섹션을 실제 구현에 맞춰 갱신
- fix : 리뷰 반영 — 실패 상태 구분, 캐러셀 크래시 수정, 컴포넌트 재사용
- docs : 축제 이력 더보기를 실제 링크로 바꿀 지점에 주석 추가
- fix : 다가오는 축제를 그리드 대신 시안대로 캐러셀로 구현
- feat : 화면 하단에 광고 슬롯 추가
- docs : DESIGN.md에 주최 상세 화면(10) 구성 원칙 추가
- fix : 축제 이력 카드가 2열 그리드에서 세로로 늘어나는 문제 수정
- feat : 주최 상세 화면 조립 — 다가오는 축제·축제 이력·자주 온 아티스트 ()
- Merge pull request from greedy-team/feat_45_축제_상세_화면
- fix : 축제 상세로 가는 임시 홈 링크를 실제 링크로 교체
- docs : DESIGN.md 축제 상세 섹션을 실제 구현에 맞춰 갱신
- fix : 리뷰 반영 — 실패 상태 구분, 빈 라인업 가드, 네이티브 dialog, 컴포넌트 재사용
- fix : 히어로 인스타그램·공식 사이트 아이콘 추가, day-card 아바타를 가로 배치로 수정
- feat : 오시는 길에 광고 슬롯 추가
- fix : 전체 라인업 바텀시트에 아티스트 장르 표시
- fix : 축제 상세 D-day를 서버 값으로 표시 (재계산하지 않음)
- docs : DESIGN.md에 축제 상세 화면(08) 구성 원칙 추가
- feat : 축제 상세 화면 조립 — 라인업·입장 안내·오시는 길 ()
- Merge pull request from greedy-team/feat_53_통합_검색_결과_화면_조립_12_2_시안
- Merge pull request from greedy-team/feat_49_아티스트_목록_화면_조립_18_시안
- fix : 리뷰 반영 — 실패 상태 구분, 접근성 라벨, 날짜 포맷 통일, 학교명 매칭 검증
- feat : 통합 검색 결과 화면 조립 (12-2 시안)
- refactor : Nav 검색을 실제 검색 폼으로 교체
- docs : 통합 검색 결과 화면 조립 이슈 문서 추가
- fix : 리뷰 반영 — 실패/빈 상태 구분, 반응형 그리드, page 파싱·범위초과 redirect
- fix : 동적 라우트 세그먼트를 hostId에서 id로 통일
- feat : 학교별 축제 이력 화면 조립 (20 시안)
- docs : 학교별 축제 이력 화면 조립 이슈 문서 추가
- fix : 리뷰 반영 — 실패/빈 상태 구분, 반응형 그리드, page 파싱·범위초과 redirect, 미상 장르 폴백
- refactor : SortDropdown을 네이티브 select 기반 GET 폼으로 교체
- Merge pull request from greedy-team/feat_42_메인_홈_화면_조립_06_d_시안
- docs : 이슈 에 프로필 플레이스홀더 확인 필요 섹션 추가

---

## [0.1.8] - 2026-08-03

**PR:** #31  

**기타**
- Merge pull request from greedy-team/chore_29_agents_md_claude_md_작성
- Merge pull request from greedy-team/docs_27_projectops_마이그레이션_로그_제거
- chore : 작업 원칙을 .claude/rules로 분리하고 지침 파일 지도 추가
- docs : TEAM-CONVENTIONS.md 커밋
- chore : AGENTS.md·CLAUDE.md 작성
- docs : projectops 마이그레이션 로그 제거

---

## [0.1.7] - 2026-08-02

**PR:** #26  

**기타**
- Merge pull request from greedy-team/chore_24_codex에서도_프로젝트_커맨드를_쓸_수_있게_설정
- chore : Codex 프로젝트 커맨드 지원
- Merge pull request from greedy-team/chore_22_issue_branch가_브랜치_생성_직후_원격에_푸시하도록_수정
- chore : /issue-branch가 브랜치 생성 직후 빈 상태로 원격에 푸시하도록 수정
- Merge pull request from greedy-team/chore_19_작업_pr_머지_시_이슈_자동_종료
- chore : 작업 PR 머지 시 이슈 자동 종료 워크플로우 추가
- Merge pull request from greedy-team/chore_17_claude_커맨드_정리_및_프로젝트_규칙_정합화
- chore : 산출물 경로를 docs/ 아래로 옮기고 추적 서술 정정
- chore : 커밋 메시지의 이슈 참조를 URL에서 #번호로 교체
- chore : /rp·/cr에 이슈번호 추출·산출물 경로·관련 이슈 표기 반영
- chore : /pr-description의 타입 목록을 유효 5종으로 정리
- chore : /pr-description의 Closes #N을 관련 이슈 표기로 교체
- chore : 커밋 메시지 형식에서 선행 이슈 제목 제거
- chore : /report에 결정 기록(ADR) 섹션 추가
- chore : /issue-branch를 develop 분기와 새 브랜치 규칙으로 교체
- chore : /issue 출력 템플릿을 실제 이슈 템플릿 파일과 일치시킴
- chore : /issue를 현재 이슈 템플릿 5종에 맞춰 재작성
- chore : commit.md에 남은 구 형식 커밋 메시지 예시 정리
- chore : /commit의 이슈번호 추출과 커밋 메시지 형식을 현재 규칙으로 교체
- chore : .claude 커맨드를 이 프로젝트에 쓰는 7개로 정리
- chore : Superpowers 산출물과 SDD 워크스페이스를 gitignore

---

## [0.1.6] - 2026-08-02

**PR:** #16  

**버그 수정**
- README 버전 커밋을 develop에도 역병합

---

## [0.1.5] - 2026-08-02

**PR:** #15  

**문서**
- 봇 가이드의 낡은 '영문-슬러그' 표현 수정

**기타**
- origin/develop 동기화

---

## [0.1.4] - 2026-08-02

**PR:** #14  

**새 기능**
- 브랜치 슬러그에 한글 허용, 구분자를 밑줄로 통일

---

## [0.1.3] - 2026-08-02

**PR:** #11  

**새 기능**
- type 라벨로 브랜치 타입 결정 (org owner 권한 없이 동작)

**기타**
- origin/develop 동기화

---

## [0.1.2] - 2026-08-02

**PR:** #10  

**새 기능**
- GitHub 이슈 타입으로 브랜치 타입 결정 + 템플릿 5종으로 축소

**기타**
- 릴리스 워크플로우 임시 파일 pr_body.md 제거 및 무시
- origin/develop 동기화

---

## [0.1.1] - 2026-08-02

**PR:** #9  

**버그 수정**
- 이슈 제목에 타입 태그가 없을 때 브랜치 타입이 잘못 잡히던 문제

---

