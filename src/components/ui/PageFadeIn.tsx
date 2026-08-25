"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * 화면에 진입하자마자(마운트 시점) 부드럽게 떠오른다. FadeInSection과 달리
 * 스크롤로 들어오는 걸 기다리지 않는다 — nav/footer에서 이동해 들어오는
 * 화면 자체가 뚝 뜨지 않고 나타나게 하는 용도다.
 *
 * 마운트 직후 곧바로 visible 상태로 바꾸면 브라우저가 초기 상태를 한 번도
 * 페인트하지 못해 트랜지션 없이 바로 최종 상태로 보일 수 있다 — rAF 두 번으로
 * 한 프레임을 확실히 흘려보낸 뒤 상태를 바꾼다.
 */
export function PageFadeIn({ children, className = "" }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  return (
    <div
      className={`transition-all duration-500 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
