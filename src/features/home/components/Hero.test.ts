import { describe, expect, it } from "vitest";
import { slideBasisClass, wallNameClass } from "./Hero";

// 히어로 패널이 몇 장 보이는지는 JS로 잰 화면 폭이 아니라 데이터 개수 +
// CSS 브레이크포인트로만 정한다(LSN-0020: 폭을 JS로 재면 SSR과 하이드레이션이
// 어긋난다). 목표 슬롯 1 / sm 2 / lg 4는 docs/demoday/target-environment.md가
// 타겟 환경으로 명시하는 값이라, 문서의 주장을 코드에 못박는 자리이기도 하다.
describe("slideBasisClass", () => {
  it("1장이면 폭을 꽉 채운다 — 빈 칸을 남기지 않는다", () => {
    expect(slideBasisClass(1)).toBe("shrink-0 basis-full");
  });

  it("2장이면 sm(640)부터 2등분한다", () => {
    expect(slideBasisClass(2)).toBe("shrink-0 basis-full sm:basis-1/2");
  });

  it("3장이면 lg(1024)에서 3등분한다 — 4칸을 만들고 한 칸을 비우지 않는다", () => {
    expect(slideBasisClass(3)).toBe("shrink-0 basis-full sm:basis-1/2 lg:basis-1/3");
  });

  it("4장이면 lg에서 4등분한다 — 시안의 기본 구성", () => {
    expect(slideBasisClass(4)).toBe("shrink-0 basis-full sm:basis-1/2 lg:basis-1/4");
  });

  it("4장을 넘으면 4로 묶는다 — 슬롯은 4가 상한이고 나머지는 캐러셀이 넘긴다", () => {
    expect(slideBasisClass(5)).toBe(slideBasisClass(4));
    expect(slideBasisClass(32)).toBe(slideBasisClass(4));
  });

  it("0장이어도 클래스가 비지 않는다", () => {
    // Hero는 0건에서 다른 화면으로 빠지지만, 클래스 조회가 undefined를
    // 문자열에 섞어 "shrink-0 undefined"를 만들지 않는지 본다.
    expect(slideBasisClass(0)).toBe(slideBasisClass(1));
  });
});

// 다가오는 축제가 0건일 때 히어로 배경을 채우는 아티스트 이름 벽. 어느 이름이
// 크게 보일지는 배열 위치로만 갈린다 — 화면 폭으로 갈리면 slideBasisClass와
// 같은 이유로 SSR과 하이드레이션이 어긋난다(LSN-0020). 클래스가 리터럴 표에
// 들어 있는 것도 같은 이유다 — 템플릿 문자열로 만들면 Tailwind가 빌드 시점에
// 클래스를 못 찾는다.
describe("wallNameClass", () => {
  it("첫 이름은 가장 큰 단계다 — 벽에 밀도 차이를 만드는 기준점", () => {
    expect(wallNameClass(0)).toBe("text-hero-dday text-on-media/15");
  });

  it("이웃한 이름은 서로 다른 단계다 — 같은 크기가 붙으면 벽이 표처럼 보인다", () => {
    expect(wallNameClass(0)).not.toBe(wallNameClass(1));
    expect(wallNameClass(1)).not.toBe(wallNameClass(2));
  });

  it("표를 넘어가면 순환한다 — 아티스트 수는 133팀이고 표는 그보다 짧다", () => {
    expect(wallNameClass(5)).toBe(wallNameClass(0));
    expect(wallNameClass(132)).toBe(wallNameClass(132 % 5));
  });

  it("크기 토큰과 불투명도를 항상 함께 돌려준다 — undefined가 섞이지 않는다", () => {
    for (const i of [0, 1, 2, 3, 4, 5, 50, 132]) {
      expect(wallNameClass(i)).toMatch(/^text-\S+ text-on-media\/\d+$/);
    }
  });

  it("음수 인덱스에서도 클래스가 비지 않는다", () => {
    // 배열을 역순으로 훑는 코드가 생겨도 "undefined"를 화면에 내지 않는다.
    expect(wallNameClass(-1)).toMatch(/^text-\S+ text-on-media\/\d+$/);
  });
});
