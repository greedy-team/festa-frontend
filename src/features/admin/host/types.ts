/**
 * GET /admin/hosts items[] · GET /admin/hosts/{id} — `HostResponse`.
 * 식별자는 `hostId`다 — backend#122가 `id`를 리네임해 아티스트·축제·라인업과 맞췄다.
 */
export type AdminHost = {
  hostId: number;
  name: string;
  shortName: string | null;
  region: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  homepageUrl: string | null;
  instagramUrl: string | null;
  festivalCount: number;
};

/** GET /admin/hosts — 등록 역순 고정. 검색·필터 파라미터가 없다 */
export type HostListParams = {
  /** 0-based — API가 받는 그대로. size 상한 50은 서버가 강제한다 */
  page: number;
  size: number;
};

/**
 * 폼이 들고 있는 값. DEC-0141에 따라 전체를 되보내므로 optional 필드가 없다.
 *
 * Swagger 계약 그대로다 — `name`·`region`은 필수이며 생략·null·공백이면 400,
 * 나머지 다섯은 공백을 삭제로 읽는다. 빈 `<input>`이 내는 `""`가 그대로 삭제가 된다.
 */
export type HostFormValues = {
  name: string;
  region: string;
  shortName: string;
  logoUrl: string;
  bannerUrl: string;
  homepageUrl: string;
  instagramUrl: string;
};
