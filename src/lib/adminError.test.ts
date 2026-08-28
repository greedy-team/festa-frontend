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
  });

  it("정의되지 않은 코드는 코드를 괄호에 남긴 문구로 떨어진다", () => {
    expect(adminErrorMessage("SOME_UNKNOWN_CODE")).toBe(
      "처리 중 문제가 발생했습니다 (SOME_UNKNOWN_CODE)",
    );
  });
});
