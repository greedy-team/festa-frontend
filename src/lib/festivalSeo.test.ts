import { describe, expect, it } from "vitest";
import type { FestivalDetail } from "@/features/festivals/types";
import { festivalEventJsonLd, festivalHeadingParts, festivalListJsonLd, festivalSeoTitle, hostSeoTitle, serializeJsonLd, siteTitle } from "./festivalSeo";

const festival = (over: Partial<FestivalDetail> = {}): FestivalDetail => ({
  id: 88,
  name: "오름",
  host: { id: 4, name: "한양대학교", logoUrl: null, instagramUrl: null, homepageUrl: "https://www.hanyang.ac.kr" },
  instagramUrl: null,
  startDate: "2026-10-01",
  endDate: "2026-10-02",
  dday: 11,
  posterUrl: "https://example.test/poster.webp",
  lineup: [
    { day: 1, date: "2026-10-01", artists: [
      { id: 1, name: "잔나비", imageUrl: null, genre: "BAND" },
      { id: null, name: null, imageUrl: null, genre: null },
    ] },
    { day: 2, date: "2026-10-02", artists: [
      { id: 2, name: "CHANGMO", imageUrl: null, genre: "HIPHOP" },
      { id: 1, name: "잔나비", imageUrl: null, genre: "BAND" },
    ] },
  ],
  admission: { externalVisitor: "ALLOWED", verification: "NONE", ticketType: "FREE", ticketOpenAt: null, note: null },
  location: { venueName: "노천극장", address: "서울 성동구 왕십리로 222", latitude: 37.5558, longitude: 127.0448 },
  ...over,
});

// 사람들은 축제명이 아니라 "학교 이름 + 축제 + 라인업"으로 찾는다. 제목에 학교명·연도가
// 없던 동안 "건국대 일감연 라인업"은 구글 1페이지에 나오지 않았다 (#259).
describe("축제 상세 검색 제목", () => {
  it("학교명과 연도를 축제명 앞뒤에 붙인다", () => {
    expect(festivalSeoTitle(festival())).toBe("한양대학교 오름 2026 라인업·일정·입장 안내");
  });

  it("축제명에 이미 들어 있는 학교명·연도는 다시 붙이지 않는다", () => {
    expect(festivalSeoTitle(festival({ name: "2026 한양대학교 가을 대동제" }))).toBe("2026 한양대학교 가을 대동제 라인업·일정·입장 안내");
  });

  it("해를 걸치는 축제는 두 연도를 모두 적는다", () => {
    expect(festivalSeoTitle(festival({ startDate: "2025-12-30", endDate: "2026-01-02" }))).toBe("한양대학교 오름 2025 ~ 2026 라인업·일정·입장 안내");
  });

  it("대표 제목은 화면 글자(축제명)를 그대로 두고 앞뒤 보조 텍스트만 돌려준다", () => {
    expect(festivalHeadingParts(festival())).toEqual({ before: "한양대학교", name: "오름", after: "2026" });
    expect(festivalHeadingParts(festival({ name: "2026 한양대학교 가을 대동제" }))).toEqual({ before: null, name: "2026 한양대학교 가을 대동제", after: null });
  });
});

describe("학교·홈 검색 제목", () => {
  it("학교 제목은 다가오는 축제가 있으면 그 연도를 담는다", () => {
    expect(hostSeoTitle("한양대학교", [{ startDate: "2026-10-01", endDate: "2026-10-02" }])).toBe("한양대학교 축제 2026 라인업·일정");
    expect(hostSeoTitle("한양대학교", [])).toBe("한양대학교 축제 라인업·일정");
  });

  it("홈 제목의 연도는 한국 시간 기준으로 계산한다 — 고정값으로 적지 않는다", () => {
    // 2026-12-31 15:30 UTC = 2027-01-01 00:30 KST
    expect(siteTitle(new Date("2026-12-31T15:30:00Z"))).toBe("FESTA | 2027 대학 축제 모음 · 일정·라인업");
    expect(siteTitle(new Date("2026-09-20T03:00:00Z"))).toBe("FESTA | 2026 대학 축제 모음 · 일정·라인업");
  });
});

describe("구조화 데이터", () => {
  it("축제를 행사로 기술한다 — 날짜·장소·주최·포스터", () => {
    const data = festivalEventJsonLd(festival());
    expect(data).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Festival",
      name: "한양대학교 오름 2026",
      startDate: "2026-10-01",
      endDate: "2026-10-02",
      url: "https://www.every-festa.com/festivals/88",
      image: ["https://example.test/poster.webp"],
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      isAccessibleForFree: true,
      location: {
        "@type": "Place", name: "노천극장", address: "서울 성동구 왕십리로 222",
        geo: { "@type": "GeoCoordinates", latitude: 37.5558, longitude: 127.0448 },
      },
      organizer: { "@type": "CollegeOrUniversity", name: "한양대학교", url: "https://www.hanyang.ac.kr" },
    });
  });

  // DEC-0116: 시크릿 게스트는 id가 null이다. 공개 전 출연자를 검색엔진에 먼저 넘기지 않는다.
  it("출연자는 공개된 아티스트만, 중복 없이 넣는다", () => {
    const data = festivalEventJsonLd(festival());
    expect(data.performer).toEqual([
      { "@type": "MusicGroup", name: "잔나비", url: "https://www.every-festa.com/artists/1" },
      { "@type": "MusicGroup", name: "CHANGMO", url: "https://www.every-festa.com/artists/2" },
    ]);
  });

  it("값이 없는 항목은 빈 값으로 채우지 않고 뺀다", () => {
    const data = festivalEventJsonLd(festival({
      posterUrl: null, lineup: [],
      location: { venueName: null, address: null, latitude: null, longitude: null },
      admission: { externalVisitor: null, verification: null, ticketType: null, ticketOpenAt: null, note: null },
    }));
    expect(data).not.toHaveProperty("image");
    expect(data).not.toHaveProperty("performer");
    expect(data).not.toHaveProperty("location");
    expect(data).not.toHaveProperty("isAccessibleForFree");
  });

  it("목록은 순서가 있는 항목 목록으로 기술한다", () => {
    const data = festivalListJsonLd([
      { festivalId: 88, name: "오름", startDate: "2026-10-01", endDate: "2026-10-02", posterUrl: null, host: { id: 4, name: "한양대학교", logoUrl: null } },
      { festivalId: 83, name: "일감연", startDate: "2026-09-30", endDate: "2026-10-01", posterUrl: null, host: { id: 7, name: "건국대학교", logoUrl: null } },
    ]);
    expect(data["@type"]).toBe("ItemList");
    expect(data.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "한양대학교 오름 2026", url: "https://www.every-festa.com/festivals/88" },
      { "@type": "ListItem", position: 2, name: "건국대학교 일감연 2026", url: "https://www.every-festa.com/festivals/83" },
    ]);
  });

  // 축제명·장소는 외부에서 들어온 값이다. script 안에 그대로 넣으면 "</script>"로 태그를 닫고 나올 수 있다.
  it("직렬화는 script 태그를 닫을 수 있는 문자를 이스케이프한다", () => {
    const out = serializeJsonLd(festivalEventJsonLd(festival({ name: '</script><script>alert(1)</script>' })));
    expect(out).not.toContain("</script>");
    expect(out).not.toContain("<");
    expect(JSON.parse(out).name).toContain("</script><script>alert(1)</script>");
  });
});
