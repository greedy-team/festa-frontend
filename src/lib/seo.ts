import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { parsePage } from "@/lib/searchParams";

export const SITE_URL = "https://www.every-festa.com";
export const SITE_TITLE = `${SITE_NAME} | 대학 축제 일정·라인업`;
export const NO_INDEX: Metadata = { robots: { index: false, follow: true } };

export function pageMetadata(
  path: string,
  title: string,
  description = SITE_DESCRIPTION,
): Metadata {
  const fullTitle = title === SITE_TITLE ? title : `${title} | ${SITE_NAME}`;
  const images = [{
    url: "/festa-og-image.jpg",
    width: 1729,
    height: 910,
    alt: "FESTA — 대학 축제 일정과 라인업",
  }];

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: SITE_NAME,
      url: path,
      title: fullTitle,
      description,
      images,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images },
  };
}

// 목록의 다음 페이지는 별도 URL로 유지한다. 검색·필터 조합은 수집하되 색인하지 않는다.
export function listingMetadata(
  path: string,
  title: string,
  description: string,
  params: Record<string, string | undefined>,
): Metadata {
  const query = new URLSearchParams();
  const page = parsePage(params.page);
  if (Number.isFinite(page) && page > 1) query.set("page", String(page));
  for (const key of ["sort", "genre", "q", "artistId", "year"]) {
    const value = params[key]?.trim();
    if (value) query.set(key, value);
  }
  const filtered = [...query.keys()].some((key) => key !== "page");
  const url = query.size ? `${path}?${query}` : path;
  return {
    ...pageMetadata(url, page > 1 ? `${title} - ${page}페이지` : title, description),
    ...(filtered ? NO_INDEX : {}),
  };
}
