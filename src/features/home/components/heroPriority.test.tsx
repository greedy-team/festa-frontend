import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import type { UpcomingFestival } from "@/features/home/types";
import { Hero } from "./Hero";

vi.mock("next/link", () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

const festival = (festivalId: number): UpcomingFestival => ({
  festivalId,
  name: `축제 ${festivalId}`,
  venueName: "장소",
  startDate: "2026-10-01",
  endDate: "2026-10-02",
  posterUrl: `https://example.test/poster-${festivalId}.webp`,
  host: { id: festivalId, name: `학교 ${festivalId}`, logoUrl: null },
});

const preloads = (html: string) =>
  [...html.matchAll(/<link[^>]*rel="preload"[^>]*as="image"[^>]*>/gi)].map((m) => m[0]);
const prioritisedImgs = (html: string) =>
  [...html.matchAll(/<img[^>]*fetchpriority="high"[^>]*>/gi)].map((m) => m[0]);

// 운영 모바일 LCP 관측 합계의 약 60%가 resourceLoadDelay였고(5회 중앙값 794ms),
// Lighthouse가 실패로 잡은 항목은 fetchpriority=high 하나였다 (#252). 힌트가 빠져도 화면은 멀쩡해
// 보이므로 렌더 결과에서 직접 센다.
//
// React 19는 <img>마다 <link rel="preload" as="image">를 문서로 끌어올린다. 따라서
// 문제는 preload의 부재가 아니라 **전부 동등해서 서로 대역폭을 다투는 것**이었다
// (운영 HTML에 동등한 preload 5개 = 약 900KB). 그중 LCP 하나만 high로 갈라 준다.
it("히어로 포스터 preload 중 첫 패널 것만 high로 갈라 준다", () => {
  const html = renderToStaticMarkup(<Hero festivals={[festival(1), festival(2), festival(3)]} />);

  // 축제마다 하나씩 — preload 자체는 React가 알아서 만든다
  expect(preloads(html)).toHaveLength(3);

  const high = preloads(html).filter((l) => /fetchpriority="high"/i.test(l));
  expect(high).toHaveLength(1);
  expect(high[0]).toContain("poster-1.webp");

  // 첫 패널은 같은 URL을 흐린 배경 + 전면 원본으로 두 번 그린다(요청은 1개).
  const imgs = prioritisedImgs(html);
  expect(imgs).toHaveLength(2);
  for (const tag of imgs) expect(tag).toContain("poster-1.webp");
});

it("히어로가 하나뿐이어도 그 포스터를 high로 표시한다", () => {
  const html = renderToStaticMarkup(<Hero festivals={[festival(9)]} />);
  const high = preloads(html).filter((l) => /fetchpriority="high"/i.test(l));
  expect(high).toHaveLength(1);
  expect(high[0]).toContain("poster-9.webp");
  expect(prioritisedImgs(html)).toHaveLength(2);
});
