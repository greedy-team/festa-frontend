import { nameTint } from "@/lib/posterTint";

type Shape = "circle" | "square";

type Props = {
  name: string;
  /** px 단위. 아바타가 쓰이는 자리마다 크기가 달라 리터럴 값을 그대로 받는다 */
  size?: number;
  shape?: Shape;
  className?: string;
};

const RADIUS: Record<Shape, string> = {
  circle: "rounded-pill",
  square: "rounded-media",
};

/**
 * 아티스트 실사진 대신 쓰는 대체 이미지 (#47 확정 결정).
 * DEC-0063(초상권 문제로 실사진 미사용)에 대한 답으로, 이름을 해시해 고른 색 위에
 * 이니셜을 얹는다 — 포스터 틴트(id 해시)와 같은 원리를 이름에 적용한 것이다.
 * 라인업·주최 상세 등 아티스트 아바타가 쓰이는 곳 어디서나 재사용한다.
 */
export function ArtistAvatar({ name, size = 64, shape = "circle", className = "" }: Props) {
  const initial = name.trim().charAt(0) || "?";

  return (
    <div
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      className={`flex shrink-0 items-center justify-center font-bold text-on-media ${RADIUS[shape]} ${nameTint(name)} ${className}`}
    >
      {initial}
    </div>
  );
}
