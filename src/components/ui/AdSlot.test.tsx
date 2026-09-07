import { randomInt } from "node:crypto";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import { AdSlot } from "./AdSlot";

vi.mock("node:crypto", () => ({ randomInt: vi.fn() }));

it("패널 소재를 무작위로 고르고 모든 광고를 같은 신청 폼에 연결한다", () => {
  vi.mocked(randomInt).mockReturnValueOnce(0).mockReturnValueOnce(1);

  const banner = renderToStaticMarkup(<AdSlot variant="banner" />);
  const panel1 = renderToStaticMarkup(<AdSlot variant="panel" />);
  const panel2 = renderToStaticMarkup(<AdSlot variant="panel" />);

  expect(banner).toContain(
    'href="https://docs.google.com/forms/d/1z2Cvhk7p7ef6-TFNesqUrpqeg8Ha5OjQoyAVfvVeX7M/edit"',
  );
  expect(banner).toContain("%2Fads%2Fbanner.png");
  expect(panel1).toContain("%2Fads%2Fpanel1.png");
  expect(panel2).toContain("%2Fads%2Fpanel2.png");
  expect(panel1).toContain(
    'href="https://docs.google.com/forms/d/1z2Cvhk7p7ef6-TFNesqUrpqeg8Ha5OjQoyAVfvVeX7M/edit"',
  );
});
