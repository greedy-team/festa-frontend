/**
 * 관리자 폼의 enum 필드 직렬화.
 *
 * 다른 타입과 달리 **enum만 빈 문자열을 거절한다.** 백엔드 실측 결과(Boot 4 +
 * Jackson 3 기본값, coercion 커스터마이징 없음):
 *
 * | 입력 | 결과 |
 * | --- | --- |
 * | `name: ""` (String) | `""` 보존 → 비우기 |
 * | `startDate: ""` · `hostId: ""` (날짜·숫자) | `null`로 강제 변환 → 비우기 |
 * | `ticketType: ""` (enum) | **`InvalidFormatException` → 400** |
 *
 * 그래서 「선택 안 함」은 `""`가 아니라 `null`로 보내야 한다. `<select>`가 내는 값은
 * 언제나 문자열이므로 요청을 만들 때 이 함수를 한 번 거친다.
 *
 * 비운 결과는 도메인마다 다르다 — `Festival.update`는 전부 무조건 대입이라 `null`이
 * 곧 비우기지만, `Artist.update`는 `if (genre != null)` 가드가 있어 `null`이 「변경
 * 없음」이다. 즉 아티스트 장르는 API로 비울 수 없다.
 */
export function enumOrNull<T extends string>(value: T | ""): T | null {
  return value === "" ? null : value;
}
