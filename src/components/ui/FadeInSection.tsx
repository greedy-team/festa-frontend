"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * 스크롤해서 뷰포트에 들어오면 부드럽게 페이드인한다. 히어로 밑으로
 * 내려올 때 다음 섹션이 뚝 끊기지 않고 자연스럽게 나타나게 하는 용도다
 * (스크롤재킹 없이 가벼운 느낌만).
 *
 * 기본 상태(JS 실행 전·비활성 시)는 항상 보이는 쪽이다 — 애니메이션은
 * "켜졌을 때 더해지는 것"이지 콘텐츠를 가리는 전제 조건이 아니다.
 */
export function FadeInSection({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "hidden" | "visible">("idle");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        state === "hidden" ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"
      } ${className}`}
    >
      {children}
    </div>
  );
}
