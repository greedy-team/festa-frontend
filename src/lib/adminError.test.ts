import { describe, expect, it } from "vitest";
import { ADMIN_ERROR_CODE, adminErrorMessage } from "./adminError";

describe("adminErrorMessage", () => {
  it("정의된 에러 코드는 문구로 매핑한다", () => {
    expect(adminErrorMessage(ADMIN_ERROR_CODE.INVALID_CREDENTIALS)).toBe(
      "아이디 또는 비밀번호가 올바르지 않습니다.",
    );
    expect(adminErrorMessage(ADMIN_ERROR_CODE.TOKEN_EXPIRED)).toBe(
      "세션이 만료되었습니다. 다시 로그인해 주세요.",
    );
    expect(adminErrorMessage(ADMIN_ERROR_CODE.UNAUTHORIZED)).toBe(
      "인증이 필요합니다. 다시 로그인해 주세요.",
    );
    expect(adminErrorMessage(ADMIN_ERROR_CODE.STORAGE_UNAVAILABLE)).toBe(
      "브라우저 저장소를 사용할 수 없어 로그인 상태를 유지할 수 없습니다. 사이트 데이터 허용 여부를 확인하거나 시크릿 모드를 해제해 주세요.",
    );
    expect(adminErrorMessage(ADMIN_ERROR_CODE.NETWORK)).toBe(
      "서버에 연결할 수 없습니다. 네트워크 상태를 확인한 뒤 다시 시도해 주세요.",
    );
  });

  it("UNKNOWN 코드는 정의된 문구로 떨어진다 — 미정의 코드 폴백과 달리 괄호에 코드를 안 붙인다", () => {
    // ADMIN_UNKNOWN_ERROR는 MESSAGES에 정의된 코드다. 아래 "정의되지 않은 코드"
    // 테스트와 이름이 비슷해 보이지만(둘 다 "모르는 에러") 결과가 다른 두 갈래라
    // 나란히 고정해둔다 — 폴백 문구를 손댈 때 둘을 헷갈리지 않게.
    expect(adminErrorMessage(ADMIN_ERROR_CODE.UNKNOWN)).toBe(
      "처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    );
  });

  it("모든 ADMIN_ERROR_CODE에 문구가 있다", () => {
    // 코드만 추가하고 MESSAGES를 빠뜨리면 조용히 "(CODE)" 폴백으로 떨어져
    // 운영자가 영문 코드를 보게 된다 — 실패가 조용한 자리라 여기서 못박는다.
    const missing = Object.values(ADMIN_ERROR_CODE).filter(
      (code) => adminErrorMessage(code) === `처리 중 문제가 발생했습니다 (${code})`,
    );
    expect(missing).toEqual([]);
  });

  it("정의되지 않은 코드는 코드를 괄호에 남긴 문구로 떨어진다", () => {
    expect(adminErrorMessage("SOME_UNKNOWN_CODE")).toBe(
      "처리 중 문제가 발생했습니다 (SOME_UNKNOWN_CODE)",
    );
  });
});
