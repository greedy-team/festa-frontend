/**
 * 별칭 입력(textarea)과 API의 `otherNames: string[]` 사이 변환.
 *
 * 줄 단위로 가른다 — 쉼표는 아티스트 이름에 실제로 들어갈 수 있어 구분자로 못 쓴다.
 * 빈 줄과 앞뒤 공백을 버리는 이유는 서버가 `ARTIST_INVALID_ALIAS`로 거절하기 때문이다.
 */
export function parseOtherNames(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function formatOtherNames(names: string[] | null | undefined): string {
  return (names ?? []).join("\n");
}
