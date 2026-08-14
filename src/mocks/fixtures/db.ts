/**
 * 모든 fixture의 단일 진실 소스(source of truth).
 *
 * 왜 이렇게 분리하나:
 * - festivals.ts / artists.ts / hosts.ts / search.ts 핸들러가 각자 하드코딩된 JSON을 들고 있으면
 *   "아카라카 2025"의 주최명이 파일마다 다르게 적히는 사고가 난다.
 * - F-13 순환탐색(축제→아티스트→축제) E2E가 실제로 의미 있으려면
 *   축제 A의 라인업에 있는 아티스트 ID가 진짜 아티스트 DB에도 존재해야 한다.
 * - 여기 있는 것만 수정하면 festivals/artists/hosts/search 응답이 전부 같이 갱신된다.
 */

export type HostRecord = {
  id: number;
  name: string;
  shortName: string;
  type: 'UNIVERSITY' | 'LOCAL_GOV' | 'AGENCY' | 'ORGANIZATION';
  region: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  homepageUrl: string | null;
  instagramUrl: string | null;
};

export type ArtistRecord = {
  id: number;
  name: string;
  otherNames: string[];
  genre: 'HIPHOP' | 'BALLAD_RNB' | 'BAND' | 'DANCE' | null;
  category: string; // "가수 · 싱어송라이터" 같은 자유 텍스트, 히어로 뱃지용
  portraitUrl: string | null;
  instagramUrl: string | null;
};

export type LineupArtist = {
  artistId: number | null; // null이면 revealed=false (시크릿)
  order: number;
  revealed: boolean;
};

export type FestivalRecord = {
  id: number;
  name: string;
  hostId: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  posterUrl: string | null;
  images: { url: string; order: number }[];
  venueName: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  kakaoPlaceId: string | null;
  admission: {
    externalVisitor: 'ALLOWED' | 'CONDITIONAL' | 'DENIED';
    verification: 'NONE' | 'STUDENT_ID' | 'PRE_BOOKING' | 'INVITATION' | 'OTHER';
    ticketType: 'FREE' | 'PAID';
    ticketOpenAt: string | null;
    note: string | null;
  };
  description: string;
  hashtags: string[];
  lineup: { day: number; date: string; artists: LineupArtist[] }[];
  notices: { id: number; type: 'INFO' | 'NOTICE'; title: string; content: string; publishedAt: string }[];
};

// ── hosts ───────────────────────────────────────────────
export const hostsDb: HostRecord[] = [
  {
    id: 3,
    name: '연세대학교 신촌 캠퍼스',
    shortName: '연세대',
    type: 'UNIVERSITY',
    region: '서울 서대문구',
    logoUrl: 'https://cdn.festa.kr/hosts/3/logo.png',
    bannerUrl: 'https://cdn.festa.kr/hosts/3/banner.jpg',
    homepageUrl: 'https://yonsei.ac.kr',
    instagramUrl: 'https://instagram.com/yonsei_univ',
  },
  {
    id: 4,
    name: '고려대학교',
    shortName: '고려대',
    type: 'UNIVERSITY',
    region: '서울 성북구',
    logoUrl: 'https://cdn.festa.kr/hosts/4/logo.png',
    bannerUrl: 'https://cdn.festa.kr/hosts/4/banner.jpg',
    homepageUrl: 'https://korea.ac.kr',
    instagramUrl: 'https://instagram.com/korea_univ',
  },
  {
    id: 5,
    name: '성균관대학교',
    shortName: '성균관대',
    type: 'UNIVERSITY',
    region: '서울 종로구',
    logoUrl: 'https://cdn.festa.kr/hosts/5/logo.png',
    bannerUrl: 'https://cdn.festa.kr/hosts/5/banner.jpg',
    homepageUrl: 'https://skku.edu',
    instagramUrl: 'https://instagram.com/skku_official',
  },
  {
    id: 7,
    name: '세종대학교',
    shortName: '세종대',
    type: 'UNIVERSITY',
    region: '서울 광진구',
    logoUrl: 'https://cdn.festa.kr/hosts/7/logo.png',
    bannerUrl: 'https://cdn.festa.kr/hosts/7/banner.jpg',
    homepageUrl: 'https://sejong.ac.kr',
    instagramUrl: 'https://instagram.com/sejong_univ',
  },
];

// ── artists ─────────────────────────────────────────────
export const artistsDb: ArtistRecord[] = [
  { id: 3, name: '청하', otherNames: ['CHUNG HA'], genre: 'DANCE', category: '가수 · 댄서', portraitUrl: 'https://cdn.festa.kr/artists/3/portrait.jpg', instagramUrl: 'https://instagram.com/chungha_official' },
  { id: 4, name: '크러쉬', otherNames: ['Crush'], genre: 'BALLAD_RNB', category: '가수 · 싱어송라이터', portraitUrl: 'https://cdn.festa.kr/artists/4/portrait.jpg', instagramUrl: 'https://instagram.com/hicrush' },
  { id: 5, name: '잔나비', otherNames: ['JANNABI'], genre: 'BAND', category: '밴드', portraitUrl: 'https://cdn.festa.kr/artists/5/portrait.jpg', instagramUrl: 'https://instagram.com/jannabi_official' },
  { id: 7, name: '아이유', otherNames: ['IU', '이지은'], genre: 'BALLAD_RNB', category: '가수 · 싱어송라이터', portraitUrl: 'https://cdn.festa.kr/artists/7/portrait.jpg', instagramUrl: null },
  { id: 9, name: '10CM', otherNames: ['십센치'], genre: 'BAND', category: '밴드', portraitUrl: 'https://cdn.festa.kr/artists/9/portrait.jpg', instagramUrl: 'https://instagram.com/10cm_official' },
  { id: 12, name: '싸이', otherNames: ['PSY'], genre: 'HIPHOP', category: '가수', portraitUrl: 'https://cdn.festa.kr/artists/12/portrait.jpg', instagramUrl: 'https://instagram.com/42psy42' },
  { id: 21, name: 'ZICO', otherNames: ['지코'], genre: 'HIPHOP', category: '래퍼 · 프로듀서', portraitUrl: 'https://cdn.festa.kr/artists/21/portrait.jpg', instagramUrl: 'https://instagram.com/woozico0914' },
];

// ── festivals ───────────────────────────────────────────
export const festivalsDb: FestivalRecord[] = [
  {
    id: 21,
    name: '아카라카 2026',
    hostId: 3,
    startDate: '2026-05-21',
    endDate: '2026-05-23',
    posterUrl: 'https://cdn.festa.kr/festivals/21/poster.jpg',
    images: [
      { url: 'https://cdn.festa.kr/festivals/21/1.jpg', order: 1 },
      { url: 'https://cdn.festa.kr/festivals/21/2.jpg', order: 2 },
    ],
    venueName: '신촌캠퍼스 노천극장',
    address: '서울 서대문구 연세로 50',
    latitude: 37.5665,
    longitude: 126.9386,
    kakaoPlaceId: '13139493',
    admission: {
      externalVisitor: 'ALLOWED',
      verification: 'STUDENT_ID',
      ticketType: 'PAID',
      ticketOpenAt: '2026-05-07',
      note: '재학생 우선존 별도 운영',
    },
    description: "연세대학교의 대표 축제 '아카라카'가 돌아왔습니다! 다채로운 공연과 이벤트가 준비되어 있어요.",
    hashtags: ['연세대축제', '아카라카', 'AKARAKA'],
    lineup: [
      { day: 1, date: '2026-05-21', artists: [
        { artistId: 7, order: 1, revealed: true },
        { artistId: 9, order: 2, revealed: true },
        { artistId: 4, order: 3, revealed: true },
        { artistId: null, order: 4, revealed: false },
      ]},
      { day: 2, date: '2026-05-22', artists: [
        { artistId: 21, order: 1, revealed: true },
      ]},
    ],
    notices: [
      { id: 88, type: 'INFO', title: '대동제 교통 통제 안내', content: '5월 21일 09:00부터 캠퍼스 내 차량 통행이 제한됩니다.', publishedAt: '2026-05-19' },
      { id: 87, type: 'NOTICE', title: '우천 시 운영 안내', content: '기상 상황에 따라 공연 순서가 조정될 수 있습니다.', publishedAt: '2026-05-18' },
    ],
  },
  {
    id: 31,
    name: '인문사회과학 캠퍼스 대동제',
    hostId: 5,
    startDate: '2026-05-30',
    endDate: '2026-06-01',
    posterUrl: 'https://cdn.festa.kr/festivals/31/poster.jpg',
    images: [{ url: 'https://cdn.festa.kr/festivals/31/1.jpg', order: 1 }],
    venueName: '성균관대학교 인문사회과학 캠퍼스',
    address: '서울 종로구 성균관로 25-2',
    latitude: 37.5883,
    longitude: 126.9936,
    kakaoPlaceId: '8154256',
    admission: {
      externalVisitor: 'CONDITIONAL',
      verification: 'PRE_BOOKING',
      ticketType: 'PAID',
      ticketOpenAt: '2026-05-07',
      note: '재학생 우선존 별도 운영',
    },
    description: '성균관대학교의 인문사회과학 캠퍼스 대동제입니다.',
    hashtags: ['성균관대축제', '대동제'],
    lineup: [
      { day: 1, date: '2026-05-30', artists: [
        { artistId: 3, order: 1, revealed: true },
        { artistId: 7, order: 2, revealed: true },
      ]},
    ],
    notices: [],
  },
  {
    id: 41,
    name: '입실렌티 2026',
    hostId: 4,
    startDate: '2026-05-25',
    endDate: '2026-05-27',
    posterUrl: 'https://cdn.festa.kr/festivals/41/poster.jpg',
    images: [{ url: 'https://cdn.festa.kr/festivals/41/1.jpg', order: 1 }],
    venueName: '고려대학교 화정체육관',
    address: '서울 성북구 안암로 145',
    latitude: 37.5895,
    longitude: 127.0324,
    kakaoPlaceId: null,
    admission: {
      externalVisitor: 'DENIED',
      verification: 'NONE',
      ticketType: 'FREE',
      ticketOpenAt: null,
      note: null,
    },
    description: '고려대학교의 대표 축제 입실렌티입니다.',
    hashtags: ['고려대축제', '입실렌티'],
    lineup: [
      { day: 1, date: '2026-05-25', artists: [
        { artistId: 5, order: 1, revealed: true },
        { artistId: 12, order: 2, revealed: true },
      ]},
    ],
    notices: [],
  },
];
