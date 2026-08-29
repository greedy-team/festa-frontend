import { defineConfig, devices } from "@playwright/test";

// 3000은 로컬 개발 서버(`pnpm dev`)나 다른 프로젝트가 이미 쓰고 있을 수 있는 포트다 —
// reuseExistingServer가 그 무관한 서버에 그대로 붙어버려 엉뚱한 페이지를 테스트하는
// 사고가 실제로 있었다. E2E 전용 포트로 분리한다.
const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

// `.env.local`의 NEXT_PUBLIC_API_MOCKING에 따라 실제 API 또는 MSW 목(서버 사이드,
// instrumentation.ts)을 친다 — 이 설정 자체는 어느 쪽이든 상관하지 않는다. 그래서
// 특정 축제 이름 같은 데이터 값이 아니라, URL 패턴·요소 존재 여부처럼 목/실제
// 데이터 어느 쪽이 와도 흔들리지 않는 것만 검증한다.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "html",
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
  },
});
