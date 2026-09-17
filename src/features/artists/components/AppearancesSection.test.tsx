import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { AppearancesSection } from "./AppearancesSection";
import type { Appearance } from "@/features/artists/types";

const items: Appearance[] = [
  { festivalId: 82, name: "대동제", hostName: "세종대학교", startDate: "2026-05-07", endDate: "2026-05-09" },
  { festivalId: 17, name: "축제한마당", hostName: "한양대학교", startDate: "2025-09-24", endDate: "2025-09-26" },
];

it("출연 이력 항목마다 그 축제 상세로 가는 링크를 건다", () => {
  const markup = renderToStaticMarkup(
    <AppearancesSection artistId={3} items={items} total={2} />,
  );

  expect(markup).toContain('href="/festivals/82"');
  expect(markup).toContain('href="/festivals/17"');
});

// 전체 목록으로 가는 기존 경로(#242 범위 밖)가 링크 추가로 바뀌지 않았는지 같이 본다.
it("더 볼 이력이 남으면 축제 목록 링크를 그대로 유지한다", () => {
  const markup = renderToStaticMarkup(
    <AppearancesSection artistId={3} items={items} total={9} />,
  );

  expect(markup).toContain('href="/festivals?artistId=3"');
});
