import { defineConfig, devices } from "@playwright/test";

// 3000은 로컬 개발 서버(`pnpm dev`)나 다른 프로젝트가 이미 쓰고 있을 수 있는 포트다 —
// reuseExistingServer가 그 무관한 서버에 그대로 붙어버려 엉뚱한 페이지를 테스트하는
// 사고가 실제로 있었다. E2E 전용 포트로 분리한다.
const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

// 스펙은 목/실제 데이터 어느 쪽이 와도 흔들리지 않는 것(URL 패턴·요소 존재 여부)만
// 검증하므로 이 설정 자체는 어느 쪽이든 상관하지 않는다. 다만 `pnpm build`가
// `.env.local`을 읽기 때문에, 로컬에서 그 파일을 실제 백엔드용으로 바꿔둔 사람이
// `pnpm test:e2e`를 돌리면 CI(FESTA-E2E.yaml)와 다른 데이터로 테스트가 돈다 —
// 같은 명령인데 결과가 사람마다 갈리는 자리라 여기서 강제로 고정한다. Next는
// `process.env`에 이미 있는 값을 `.env.local`로 덮지 않으므로 이걸로 충분하다.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  // CI는 github 리포터만 켜면 playwright-report/가 아예 안 만들어져서, 실패 시
  // 업로드하려는 트레이스·스크린샷이 애초에 없다 — html도 같이 켠다.
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `pnpm build && pnpm start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_API_MOCKING: "true",
    },
  },
});
