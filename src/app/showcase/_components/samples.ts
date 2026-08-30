import type { RecentFestival, UpcomingFestival } from "@/features/home/types";

/**
 * 표본용 고정 데이터.
 *
 * 카탈로그는 네트워크에 의존하지 않는다 — 목이 꺼져 있거나 HMR로 서버측 모킹이
 * 풀려도 컴포넌트 표본은 그대로 보여야 한다. 실제 데이터로 그린 모습은
 * 「조립 예시」 절에서 본다.
 */
const SAMPLE_HOST = {
  id: 3,
  name: "연세대학교 신촌 캠퍼스",
  type: "UNIVERSITY",
  logoUrl: null,
};

export const SAMPLE_UPCOMING: UpcomingFestival = {
  festivalId: 21,
  name: "아카라카 2026",
  venueName: "신촌캠퍼스 노천극장",
  startDate: "2026-09-04",
  endDate: "2026-09-06",
  posterUrl: null,
  host: SAMPLE_HOST,
};

/** 히어로가 축제 개수에 따라 패널 폭을 어떻게 채우는지 보여주는 표본용 — 1·2·3개로 잘라 쓴다 */
export const SAMPLE_UPCOMING_LIST: UpcomingFestival[] = [
  SAMPLE_UPCOMING,
  {
    festivalId: 22,
    name: "입실렌티 2026",
    venueName: "안암캠퍼스 화정체육관",
    startDate: "2026-09-11",
    endDate: "2026-09-13",
    posterUrl: null,
    host: { id: 4, name: "고려대학교 안암 캠퍼스", type: "UNIVERSITY", logoUrl: null },
  },
  {
    festivalId: 23,
    name: "대동제 2026",
    venueName: "명륜캠퍼스 금잔디광장",
    startDate: "2026-09-18",
    endDate: "2026-09-20",
    posterUrl: null,
    host: { id: 5, name: "성균관대학교 명륜 캠퍼스", type: "UNIVERSITY", logoUrl: null },
  },
];

export const SAMPLE_RECENT: RecentFestival = {
  festivalId: 52,
  name: "라치오스 2026",
  startDate: "2026-08-24",
  endDate: "2026-08-26",
  posterUrl: null,
  host: {
    id: 8,
    name: "한양대학교 서울 캠퍼스",
    type: "UNIVERSITY",
    logoUrl: null,
  },
};

/** 카드 그리드 표본용 — 틴트가 축제 id마다 다르다는 것을 보여준다 */
export const SAMPLE_RECENT_LIST: RecentFestival[] = [
  SAMPLE_RECENT,
  {
    festivalId: 53,
    name: "루카스 2026",
    startDate: "2026-08-28",
    endDate: "2026-08-30",
    posterUrl: null,
    host: { id: 9, name: "중앙대학교 서울 캠퍼스", type: "UNIVERSITY", logoUrl: null },
  },
  {
    festivalId: 54,
    name: "고연전 응원제 2026",
    startDate: "2026-09-02",
    endDate: "2026-09-03",
    posterUrl: null,
    host: { id: 10, name: "경희대학교 서울 캠퍼스", type: "UNIVERSITY", logoUrl: null },
  },
  {
    festivalId: 55,
    name: "녹지원 축제 2026",
    startDate: "2026-09-08",
    endDate: "2026-09-10",
    posterUrl: null,
    host: { id: 11, name: "건국대학교 서울 캠퍼스", type: "UNIVERSITY", logoUrl: null },
  },
  {
    festivalId: 56,
    name: "와우제 2026",
    startDate: "2026-09-14",
    endDate: "2026-09-16",
    posterUrl: null,
    host: { id: 12, name: "홍익대학교 서울 캠퍼스", type: "UNIVERSITY", logoUrl: null },
  },
];
