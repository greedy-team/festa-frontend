import type { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

// 폭 상한을 두지 않는다. 화면이 주는 만큼 쓰고, 좌우 여백만 화면 크기에 따라 벌린다.
// DESIGN.md의 1440/마진 80은 그 프레임에서의 한 사례이지 상한이 아니다.
export function Container({ className = "", children }: Props) {
  return (
    <div className={`w-full px-4 sm:px-8 lg:px-12 xl:px-20 ${className}`}>
      {children}
    </div>
  );
}
