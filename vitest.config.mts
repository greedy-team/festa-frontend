import { defineConfig } from "vitest/config";

// tsconfig.json의 "@/*" 경로를 그대로 재사용한다 — 별칭을 여기 또 적으면
// tsconfig와 두 곳을 맞춰야 한다(coding-principles: 같은 규칙을 두 곳에 적지 않는다).
// Vite가 이제 tsconfig paths를 네이티브로 지원해서 별도 플러그인 없이 켠다.
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
