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
 * 기본 상태(JS 실행 전·비활성 시)는 항상 보이는 쪽이다 — 진입 페이드업은
 * 상태가 아니라 CSS 애니메이션(animate-fade-up)으로만 얹는다. 클라이언트 JS가
 * 실행되지 않아도 콘텐츠는 최종 상태(보임)로 남는다. FadeInSection과 같은 전략이다.
 * prefers-reduced-motion에서는 motion-reduce:로 애니메이션을 끈다.
 */
export function PageFadeIn({ children, className = "" }: Props) {
  return (
    <div className={`animate-fade-up motion-reduce:animate-none ${className}`}>
      {children}
    </div>
  );
}
