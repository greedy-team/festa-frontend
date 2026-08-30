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
  // type 필드(UNIVERSITY 등)는 뺐다 — 확정된 ERD에 없는 필드라 화면 어디서도
  // 참조하지 않는다 (features/hosts/types.ts, HostHero.tsx 주석, #46/#64 참고).
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
  imageUrl: string | null; // DEC-0063: 초상권 문제로 항상 null — 프론트 기본 이미지로 대체. DEC-0081/명세 수정 #11: 필드명은 imageUrl로 통일
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
  posterUrl: string | null; // DEC-0036: 대표 이미지 한 장만 — 갤러리 없음
  venueName: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  admission: {
    externalVisitor: 'ALLOWED' | 'CONDITIONAL' | 'DENIED';
    verification: 'NONE' | 'STUDENT_ID' | 'PRE_BOOKING' | 'INVITATION' | 'OTHER';
    ticketType: 'FREE' | 'PAID';
    ticketOpenAt: string | null; // DEC-0068: timestamptz → UTC ISO-8601 ('YYYY-MM-DDTHH:mm:ssZ')
    note: string | null;
  };
  description: string;
  hashtags: string[];
  lineup: { day: number; date: string; artists: LineupArtist[] }[];
};

// ── hosts ───────────────────────────────────────────────
export const hostsDb: HostRecord[] = [
  {
    id: 3,
    name: '연세대학교 신촌 캠퍼스',
    shortName: '연세대',
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
    region: '서울 광진구',
    logoUrl: 'https://cdn.festa.kr/hosts/7/logo.png',
    bannerUrl: 'https://cdn.festa.kr/hosts/7/banner.jpg',
    homepageUrl: 'https://sejong.ac.kr',
    instagramUrl: 'https://instagram.com/sejong_univ',
  },
  {
    id: 8,
    name: '한양대학교 서울 캠퍼스',
    shortName: '한양대',
    region: '서울 성동구',
    logoUrl: null,
    bannerUrl: null,
    homepageUrl: 'https://hanyang.ac.kr',
    instagramUrl: 'https://instagram.com/hanyang_univ',
  },
  {
    id: 9,
    name: '중앙대학교 서울 캠퍼스',
    shortName: '중앙대',
    region: '서울 동작구',
    logoUrl: null,
    bannerUrl: null,
    homepageUrl: 'https://cau.ac.kr',
    instagramUrl: 'https://instagram.com/cau_official',
  },
  {
    id: 10,
    name: '경희대학교 서울 캠퍼스',
    shortName: '경희대',
    region: '서울 동대문구',
    logoUrl: null,
    bannerUrl: null,
    homepageUrl: 'https://khu.ac.kr',
    instagramUrl: 'https://instagram.com/khu_official',
  },
  {
    id: 11,
    name: '건국대학교 서울 캠퍼스',
    shortName: '건국대',
    region: '서울 광진구',
    logoUrl: null,
    bannerUrl: null,
    homepageUrl: 'https://konkuk.ac.kr',
    instagramUrl: 'https://instagram.com/konkuk_univ',
  },
  {
    id: 12,
    name: '홍익대학교 서울 캠퍼스',
    shortName: '홍익대',
    region: '서울 마포구',
    logoUrl: null,
    bannerUrl: null,
    homepageUrl: 'https://hongik.ac.kr',
    instagramUrl: 'https://instagram.com/hongik_univ',
  },
  {
    id: 13,
    name: '숭실대학교',
    shortName: '숭실대',
    region: '서울 동작구',
    logoUrl: null,
    bannerUrl: null,
    homepageUrl: 'https://ssu.ac.kr',
    instagramUrl: 'https://instagram.com/ssu_official',
  },
  {
    id: 14,
    name: '서울대학교 관악 캠퍼스',
    shortName: '서울대',
    region: '서울 관악구',
    logoUrl: null,
    bannerUrl: null,
    homepageUrl: 'https://snu.ac.kr',
    instagramUrl: 'https://instagram.com/snu_official',
  },
];

// ── artists ─────────────────────────────────────────────
export const artistsDb: ArtistRecord[] = [
  { id: 3, name: '청하', otherNames: ['CHUNG HA'], genre: 'DANCE', imageUrl: null, instagramUrl: 'https://instagram.com/chungha_official' },
  { id: 4, name: '크러쉬', otherNames: ['Crush'], genre: 'BALLAD_RNB', imageUrl: null, instagramUrl: 'https://instagram.com/hicrush' },
  { id: 5, name: '잔나비', otherNames: ['JANNABI'], genre: 'BAND', imageUrl: null, instagramUrl: 'https://instagram.com/jannabi_official' },
  { id: 7, name: '아이유', otherNames: ['IU', '이지은'], genre: 'BALLAD_RNB', imageUrl: null, instagramUrl: null },
  { id: 9, name: '10CM', otherNames: ['십센치'], genre: 'BAND', imageUrl: null, instagramUrl: 'https://instagram.com/10cm_official' },
  { id: 12, name: '싸이', otherNames: ['PSY'], genre: 'HIPHOP', imageUrl: null, instagramUrl: 'https://instagram.com/42psy42' },
  { id: 21, name: 'ZICO', otherNames: ['지코'], genre: 'HIPHOP', imageUrl: null, instagramUrl: 'https://instagram.com/woozico0914' },
];

// ── festivals ───────────────────────────────────────────
// 아카라카(ONGOING)·대동제(UPCOMING)·입실렌티(ENDED)로 상태를 분산시켜뒀다 — 셋 다 같은 계절에
// 몰려있으면 시간이 지나 오늘 날짜를 지나칠 때마다 /upcoming 등이 다시 빈 배열이 된다.
export const festivalsDb: FestivalRecord[] = [
  {
    id: 21,
    name: '아카라카 2026',
    hostId: 3,
    startDate: '2026-08-14',
    endDate: '2026-08-16',
    posterUrl: 'https://cdn.festa.kr/festivals/21/poster.jpg',
    venueName: '신촌캠퍼스 노천극장',
    address: '서울 서대문구 연세로 50',
    latitude: 37.5665,
    longitude: 126.9386,
    admission: {
      externalVisitor: 'ALLOWED',
      verification: 'STUDENT_ID',
      ticketType: 'PAID',
      ticketOpenAt: '2026-08-01T00:00:00Z',
      note: '재학생 우선존 별도 운영',
    },
    description: "연세대학교의 대표 축제 '아카라카'가 돌아왔습니다! 다채로운 공연과 이벤트가 준비되어 있어요.",
    hashtags: ['연세대축제', '아카라카', 'AKARAKA'],
    lineup: [
      { day: 1, date: '2026-08-14', artists: [
        { artistId: 7, order: 1, revealed: true },
        { artistId: 9, order: 2, revealed: true },
        { artistId: 4, order: 3, revealed: true },
        { artistId: null, order: 4, revealed: false },
      ]},
      { day: 2, date: '2026-08-15', artists: [
        { artistId: 21, order: 1, revealed: true },
      ]},
    ],
  },
  {
    id: 31,
    name: '인문사회과학 캠퍼스 대동제',
    hostId: 5,
    startDate: '2026-09-04',
    endDate: '2026-09-06',
    posterUrl: 'https://cdn.festa.kr/festivals/31/poster.jpg',
    venueName: '성균관대학교 인문사회과학 캠퍼스',
    address: '서울 종로구 성균관로 25-2',
    latitude: 37.5883,
    longitude: 126.9936,
    admission: {
      externalVisitor: 'CONDITIONAL',
      verification: 'PRE_BOOKING',
      ticketType: 'PAID',
      ticketOpenAt: '2026-08-25T00:00:00Z',
      note: '재학생 우선존 별도 운영',
    },
    description: '성균관대학교의 인문사회과학 캠퍼스 대동제입니다.',
    hashtags: ['성균관대축제', '대동제'],
    lineup: [
      { day: 1, date: '2026-09-04', artists: [
        { artistId: 3, order: 1, revealed: true },
        { artistId: 7, order: 2, revealed: true },
      ]},
    ],
  },
  {
    id: 41,
    name: '입실렌티 2026',
    hostId: 4,
    startDate: '2026-05-25',
    endDate: '2026-05-27',
    posterUrl: 'https://cdn.festa.kr/festivals/41/poster.jpg',
    venueName: '고려대학교 화정체육관',
    address: '서울 성북구 안암로 145',
    latitude: 37.5895,
    longitude: 127.0324,
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
  },
  {
    id: 51,
    name: '대동제 2026',
    hostId: 7,
    startDate: '2026-08-19',
    endDate: '2026-08-21',
    posterUrl: null,
    venueName: '세종대 대양홀 앞 광장',
    address: '서울 광진구 능동로 209',
    latitude: 37.5503,
    longitude: 127.0745,
    admission: {
      externalVisitor: 'ALLOWED',
      verification: 'NONE',
      ticketType: 'FREE',
      ticketOpenAt: null,
      note: null,
    },
    description: '세종대학교 대동제.',
    hashtags: ['세종대축제', '대동제'],
    lineup: [],
  },
  {
    id: 52,
    name: '라치오스 2026',
    hostId: 8,
    startDate: '2026-08-24',
    endDate: '2026-08-26',
    posterUrl: null,
    venueName: '한양대 노천극장',
    address: '서울 성동구 왕십리로 222',
    latitude: 37.5573,
    longitude: 127.0453,
    admission: {
      externalVisitor: 'CONDITIONAL',
      verification: 'STUDENT_ID',
      ticketType: 'FREE',
      ticketOpenAt: null,
      note: '외부인은 재학생 동반 시 입장',
    },
    description: '한양대학교 축제 라치오스. 노천극장에서 열립니다.',
    hashtags: ['한양대축제', '라치오스'],
    lineup: [],
  },
  {
    id: 53,
    name: '루카스 2026',
    hostId: 9,
    startDate: '2026-08-28',
    endDate: '2026-08-30',
    posterUrl: null,
    venueName: '중앙대 서울캠퍼스 운동장',
    address: '서울 동작구 흑석로 84',
    latitude: 37.5049,
    longitude: 126.9574,
    admission: {
      externalVisitor: 'ALLOWED',
      verification: 'NONE',
      ticketType: 'FREE',
      ticketOpenAt: null,
      note: null,
    },
    description: '중앙대학교 대동제 루카스.',
    hashtags: ['중앙대축제', '루카스'],
    lineup: [],
  },
  {
    id: 54,
    name: '고연전 응원제 2026',
    hostId: 10,
    startDate: '2026-09-02',
    endDate: '2026-09-03',
    posterUrl: null,
    venueName: '경희대 평화의전당',
    address: '서울 동대문구 경희대로 26',
    latitude: 37.5966,
    longitude: 127.0524,
    admission: {
      externalVisitor: 'ALLOWED',
      verification: 'NONE',
      ticketType: 'PAID',
      ticketOpenAt: '2026-08-20T00:00:00Z',
      note: null,
    },
    description: '경희대학교 가을 응원제.',
    hashtags: ['경희대축제'],
    lineup: [],
  },
  {
    id: 55,
    name: '녹지원 축제 2026',
    hostId: 11,
    startDate: '2026-09-08',
    endDate: '2026-09-10',
    posterUrl: null,
    venueName: '건국대 노천극장',
    address: '서울 광진구 능동로 120',
    latitude: 37.5426,
    longitude: 127.0793,
    admission: {
      externalVisitor: 'ALLOWED',
      verification: 'NONE',
      ticketType: 'FREE',
      ticketOpenAt: null,
      note: null,
    },
    description: '건국대학교 가을 축제.',
    hashtags: ['건국대축제', '녹지원'],
    lineup: [],
  },
  {
    id: 56,
    name: '와우제 2026',
    hostId: 12,
    startDate: '2026-09-14',
    endDate: '2026-09-16',
    posterUrl: null,
    venueName: '홍익대 대운동장',
    address: '서울 마포구 와우산로 94',
    latitude: 37.5511,
    longitude: 126.9250,
    admission: {
      externalVisitor: 'ALLOWED',
      verification: 'NONE',
      ticketType: 'FREE',
      ticketOpenAt: null,
      note: null,
    },
    description: '홍익대학교 축제 와우제.',
    hashtags: ['홍익대축제', '와우제'],
    lineup: [],
  },
  {
    id: 57,
    name: '청람 2026',
    hostId: 13,
    startDate: '2026-09-21',
    endDate: '2026-09-23',
    posterUrl: null,
    venueName: '숭실대 교내 일대',
    address: '서울 동작구 상도로 369',
    latitude: 37.4963,
    longitude: 126.9572,
    admission: {
      externalVisitor: 'ALLOWED',
      verification: 'NONE',
      ticketType: 'FREE',
      ticketOpenAt: null,
      note: null,
    },
    description: '숭실대학교 대동제 청람.',
    hashtags: ['숭실대축제', '청람'],
    lineup: [],
  },
  {
    id: 58,
    name: '샤인 페스티벌 2026',
    hostId: 14,
    startDate: '2026-09-25',
    endDate: '2026-09-26',
    posterUrl: null,
    venueName: '서울대 대운동장',
    address: '서울 관악구 관악로 1',
    latitude: 37.4601,
    longitude: 126.9520,
    admission: {
      externalVisitor: 'ALLOWED',
      verification: 'NONE',
      ticketType: 'FREE',
      ticketOpenAt: null,
      note: null,
    },
    description: '서울대학교 가을 축제.',
    hashtags: ['서울대축제'],
    lineup: [],
  },
  {
    id: 59,
    name: '대동제 2026 가을',
    hostId: 5,
    startDate: '2026-09-29',
    endDate: '2026-10-01',
    posterUrl: null,
    venueName: '성균관대 금잔디광장',
    address: '서울 종로구 성균관로 25-2',
    latitude: 37.5878,
    longitude: 126.9938,
    admission: {
      externalVisitor: 'ALLOWED',
      verification: 'NONE',
      ticketType: 'FREE',
      ticketOpenAt: null,
      note: null,
    },
    description: '성균관대학교 가을 대동제.',
    hashtags: ['성균관대축제', '대동제'],
    lineup: [],
  },
];
