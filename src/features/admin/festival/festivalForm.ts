import { enumOrNull } from "@/features/admin/_shared/enumField";
import type {
  AdminFestivalDetail,
  FestivalFormValues,
} from "@/features/admin/festival/types";

/**
 * 좌표 쌍 검증. 서버가 막는 것은 「발행된 축제의 좌표 비우기」(409) 하나뿐이고,
 * **미발행 축제의 반쪽 좌표는 서버가 안 막는다** — 위도만 채워 저장하면 새 값과
 * 옛 값이 한 좌표로 섞인다. 쌍으로만 의미를 갖는 값은 필드별로 병합하지 않는다.
 * 그래서 반쪽은 폼이 막는다.
 */
export function coordinateError(
  latitude: string,
  longitude: string,
  isPublished: boolean,
): string | null {
  const hasLat = latitude !== "";
  const hasLng = longitude !== "";
  if (hasLat !== hasLng) {
    return "좌표는 위도·경도를 함께 입력하거나 함께 비워야 합니다.";
  }
  if (!hasLat && isPublished) {
    return "발행된 축제는 좌표를 비울 수 없습니다. 먼저 발행을 해제해 주세요.";
  }
  return null;
}

/**
 * Instant(ISO, UTC) ↔ <input type="datetime-local"> 값("YYYY-MM-DDTHH:mm") 변환.
 * datetime-local에는 타임존이 없다 — 브라우저 로컬 시간대로 읽고 쓴다. 관리자
 * 화면은 국내 운영자가 KST 브라우저에서 쓰는 것을 전제한다.
 */
export function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function toInstantIso(local: string): string {
  return new Date(local).toISOString();
}

/**
 * 폼 상태 → 요청 본문.
 *
 * 타입마다 「비우기」의 표현이 다르다 (백엔드 실측 + Swagger):
 * - String: ""가 곧 비우기 — 그대로 보낸다
 * - 숫자·시각: null이 비우기 — ""를 null로 바꾸고, 값은 Number로 보낸다
 *   (문자열 "37.5"를 서버 coercion에 맡기지 않는다 — 여기서 확정한다)
 * - enum: ""는 400이다 — enumOrNull이 null로 바꾼다
 */
export function toFestivalRequestBody(values: FestivalFormValues) {
  return {
    hostId: Number(values.hostId),
    importKey: values.importKey,
    name: values.name,
    startDate: values.startDate,
    endDate: values.endDate,
    posterUrl: values.posterUrl,
    description: values.description,
    venueName: values.venueName,
    address: values.address,
    latitude: values.latitude === "" ? null : Number(values.latitude),
    longitude: values.longitude === "" ? null : Number(values.longitude),
    externalVisitor: enumOrNull(values.externalVisitor),
    verification: enumOrNull(values.verification),
    ticketType: enumOrNull(values.ticketType),
    ticketOpenAt: values.ticketOpenAt === "" ? null : toInstantIso(values.ticketOpenAt),
    admissionNote: values.admissionNote,
    instagramUrl: values.instagramUrl,
  };
}

export const EMPTY_FESTIVAL_FORM: FestivalFormValues = {
  hostId: "",
  importKey: "",
  name: "",
  startDate: "",
  endDate: "",
  posterUrl: "",
  description: "",
  venueName: "",
  address: "",
  latitude: "",
  longitude: "",
  externalVisitor: "",
  verification: "",
  ticketType: "",
  ticketOpenAt: "",
  admissionNote: "",
  instagramUrl: "",
};

/** 단건 조회 응답 → 폼 상태. null은 폼에서 전부 빈 문자열이다 */
export function toFestivalFormValues(detail: AdminFestivalDetail): FestivalFormValues {
  return {
    hostId: detail.hostId === null ? "" : String(detail.hostId),
    importKey: detail.importKey ?? "",
    name: detail.name,
    startDate: detail.startDate,
    endDate: detail.endDate,
    posterUrl: detail.posterUrl ?? "",
    description: detail.description ?? "",
    venueName: detail.venueName ?? "",
    address: detail.address ?? "",
    latitude: detail.latitude === null ? "" : String(detail.latitude),
    longitude: detail.longitude === null ? "" : String(detail.longitude),
    externalVisitor: detail.externalVisitor ?? "",
    verification: detail.verification ?? "",
    ticketType: detail.ticketType ?? "",
    ticketOpenAt: toDatetimeLocal(detail.ticketOpenAt),
    admissionNote: detail.admissionNote ?? "",
    instagramUrl: detail.instagramUrl ?? "",
  };
}
