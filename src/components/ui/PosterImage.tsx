"use client";

import { useState } from "react";

type Props = {
  src: string | null;
  className?: string;
  /** 첫 화면의 LCP 포스터에만 켠다. 요청 시작을 앞당기는 힌트라 여러 곳에 걸면 서로 경쟁한다. */
  priority?: boolean;
};

/**
 * 포스터 이미지. 로드에 실패하면 아무것도 그리지 않는다.
 *
 * 포스터 URL은 우리가 호스팅하지 않는 외부 주소라 404·핫링크 차단으로 실패하는
 * 것이 정상 경로다. 실패한 <img>를 그대로 두면 브라우저가 깨진 아이콘을 그려
 * 밑에 깔아 둔 포스터 틴트를 가린다. 실패하면 스스로 사라져서 틴트만 남긴다.
 */
export function PosterImage({ src, className = "", priority = false }: Props) {
  const [failed, setFailed] = useState(false);

  // falsy 검사다. 백엔드가 "포스터 없음"을 null이 아니라 ""로 내려도
  // <img src="">가 현재 문서를 다시 요청하는 일이 없다.
  return src && !failed ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      onError={() => setFailed(true)}
      // 브라우저가 스스로 올리는 네트워크 priority(High)와는 다른 손잡이다. 이건 요청을
      // 더 일찍 "시작"시킨다 — 운영 모바일 LCP 관측 합계의 약 60%가 resourceLoadDelay였다(5회 중앙값 794ms · #252).
      fetchPriority={priority ? "high" : undefined}
      className={className}
    />
  ) : null;
}
