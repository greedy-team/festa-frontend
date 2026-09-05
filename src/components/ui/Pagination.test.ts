import { describe, expect, it } from "vitest";
import { pageWindow } from "./Pagination";

// 목록 화면 7곳(축제·아티스트·주최 이력 + 관리자 4)이 공유하는 번호 창 계산.
// start = min(max(1, current - half), total - size + 1) 이 식이 비자명해서
// 리팩토링에 조용히 깨지기 쉬운 자리다.
describe("pageWindow", () => {
  it("전체가 창 크기 이하면 전부 보여준다", () => {
    expect(pageWindow(1, 1)).toEqual([1]);
    expect(pageWindow(2, 3)).toEqual([1, 2, 3]);
    expect(pageWindow(5, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("전체가 창보다 크고 앞쪽에 있으면 1부터 채운다", () => {
    expect(pageWindow(1, 10)).toEqual([1, 2, 3, 4, 5]);
    expect(pageWindow(3, 10)).toEqual([1, 2, 3, 4, 5]);
  });

  it("가운데에서는 현재 페이지가 창 한가운데에 온다", () => {
    expect(pageWindow(5, 10)).toEqual([3, 4, 5, 6, 7]);
    expect(pageWindow(6, 10)).toEqual([4, 5, 6, 7, 8]);
  });

  it("끝에 가까우면 창이 마지막에 붙어 멈춘다 — 총 개수를 넘는 번호를 만들지 않는다", () => {
    // total - size + 1 항이 하는 일. 이게 빠지면 [8,9,10,11,12]가 나온다.
    expect(pageWindow(9, 10)).toEqual([6, 7, 8, 9, 10]);
    expect(pageWindow(10, 10)).toEqual([6, 7, 8, 9, 10]);
  });

  it("현재 페이지가 범위를 벗어나도 창은 범위 안에 머문다", () => {
    // 주소창에 ?page=999를 넣은 경우. parsePage는 1 미만만 접으므로
    // 상한을 넘는 값은 여기까지 그대로 온다.
    expect(pageWindow(999, 10)).toEqual([6, 7, 8, 9, 10]);
    expect(pageWindow(0, 10)).toEqual([1, 2, 3, 4, 5]);
    expect(pageWindow(-5, 10)).toEqual([1, 2, 3, 4, 5]);
  });

  it("항상 창 크기만큼만 낸다", () => {
    for (const current of [1, 4, 7, 12]) {
      expect(pageWindow(current, 12)).toHaveLength(5);
    }
  });
});
