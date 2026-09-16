import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import { Analytics } from "./Analytics";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Next Script가 호출되면 표식을 출력한다. deny 상태에서는 호출 자체가 없어야 한다.
vi.mock("next/script", () => ({ default: () => <span>tracking-script</span> }));

it("Production ID가 있어도 동의 기능 연결 전에는 태그를 렌더하지 않는다", () => {
  expect(renderToStaticMarkup(<Analytics enabled consent={null} gaMeasurementId="G-TEST" clarityProjectId="test" />)).toBe("");
  expect(renderToStaticMarkup(<Analytics enabled={false} consent="all" gaMeasurementId="G-TEST" clarityProjectId="test" />)).toBe("");
  expect(renderToStaticMarkup(<Analytics enabled consent="ga" gaMeasurementId="G-TEST" clarityProjectId="test" />)).toContain("tracking-script");
});
