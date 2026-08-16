## 제목

🔧 [설정][모킹] festa-mocks(MSW) 프로젝트 연결

## 본문

## 📝 작업 내용

- festa-mocks/ 폴더를 src/ 구조로 이동 (instrumentation.ts는 src/instrumentation.ts로, src/mocks/ 하위는 그대로 src/mocks/로)
- 이동 후 instrumentation.ts의 상대 import 경로 수정 (./src/mocks/server → ./mocks/server)
- msw를 pnpm으로 설치하고, npm install로 생성된 package-lock.json 제거
- NEXT_PUBLIC_API_MOCKING, NEXT_PUBLIC_API_BASE_URL은 로컬 .env.local 전용으로 문서화 (Vercel에는 등록하지 않음 — Preview/Production은 모킹 없이 그대로 동작)
- app/layout.tsx에 MockProvider 연결
- festa-mocks 하위 .DS_Store 파일 정리

## 🎯 필요한 이유

- 실제 백엔드 없이 프론트를 개발·테스트하기 위한 MSW 기반 모킹 계층(SSR용 instrumentation, CSR용 MockProvider)이 준비되어 있으나 아직 프로젝트에 연결되지 않아 동작하지 않는 상태
- pnpm 전용 프로젝트인데 npm으로 설치되면서 package-lock.json이 남아있었음 (CI가 깨질 수 있어 제거함)

## ⚠️ 영향 범위

- 개발 환경 (SSR/CSR 양쪽 fetch 모킹)
- 빌드 설정 (next.config.ts, package.json)

## 🙋‍♂️ 담당자

- 담당: 이름
