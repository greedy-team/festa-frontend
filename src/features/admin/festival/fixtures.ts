import type { AdminFestival } from "@/features/admin/festival/types";

// 백엔드가 붙는 날 이 파일을 지운다.
// 시안의 26/9/35는 목업 숫자다 — 칩 건수는 이 배열에서 파생하므로 실제로는
// 이 배열의 개수가 뜬다. 그것이 맞는 동작이다.
export const adminFestivalsFixture: AdminFestival[] = [
  {
    festivalId: 1, importKey: "연세대학교-2025", name: "아카라카 2025",
    hostId: 3, hostName: "연세대학교", startDate: "2025-05-21", endDate: "2025-05-23",
    published: false, discovery: "SITEMAP", sourceUrl: "https://blog.example.com/12345",
    lineupCount: 6, importedAt: "2025-05-22T06:40:00Z",
  },
  {
    festivalId: 2, importKey: "고려대학교-2025", name: "입실렌티 2025",
    hostId: 4, hostName: "고려대학교", startDate: "2025-05-25", endDate: "2025-05-27",
    published: false, discovery: "MANUAL", sourceUrl: "https://blog.example.com/12346",
    lineupCount: 8, importedAt: "2025-05-22T06:41:00Z",
  },
  {
    festivalId: 3, importKey: "성균관대학교-2025", name: "대동제 2025",
    hostId: 5, hostName: "성균관대학교", startDate: "2025-05-30", endDate: "2025-06-01",
    published: false, discovery: "SEARCH", sourceUrl: "https://blog.example.com/12347",
    lineupCount: 5, importedAt: "2025-05-22T06:42:00Z",
  },
  {
    // 라인업 0팀 — 발행 불가 케이스. 이 행이 있어야 blocker UI를 확인할 수 있다.
    festivalId: 4, importKey: "한양대학교-2025", name: "라치오스 2025",
    hostId: 6, hostName: "한양대학교", startDate: "2025-05-15", endDate: "2025-05-17",
    published: false, discovery: "SEARCH", sourceUrl: "https://blog.example.com/12348",
    lineupCount: 0, importedAt: "2025-05-22T06:43:00Z",
  },
  {
    festivalId: 5, importKey: "중앙대학교-2025", name: "청룡제 2025",
    hostId: 7, hostName: "중앙대학교", startDate: "2025-06-07", endDate: "2025-06-09",
    published: true, discovery: "SITEMAP", sourceUrl: "https://blog.example.com/12349",
    lineupCount: 7, importedAt: "2025-05-20T02:10:00Z",
  },
  {
    festivalId: 6, importKey: "세종대학교-2025", name: "대동제 2025",
    hostId: 8, hostName: "세종대학교", startDate: "2025-05-20", endDate: "2025-05-22",
    published: true, discovery: "MANUAL", sourceUrl: "https://blog.example.com/12350",
    lineupCount: 4, importedAt: "2025-05-20T02:11:00Z",
  },
  {
    // 주최 미연결 — 발행 불가 케이스. 라인업은 있어 HOST_NOT_LINKED만이 유일한
    // 차단 사유다. 이 행이 있어야 blocker UI를 확인할 수 있다.
    festivalId: 7, importKey: "미상-2025", name: "미상 대학 축제 2025",
    hostId: null, hostName: null, startDate: "2025-06-10", endDate: "2025-06-12",
    published: false, discovery: "SEARCH", sourceUrl: "https://blog.example.com/12351",
    lineupCount: 3, importedAt: "2025-05-22T06:44:00Z",
  },
];
