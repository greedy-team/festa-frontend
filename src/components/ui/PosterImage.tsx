"use client";

import { useState } from "react";

type Props = {
  src: string | null;
  className?: string;
};

/**
 * 포스터 이미지. 로드에 실패하면 아무것도 그리지 않는다.
 *
 * 포스터 URL은 우리가 호스팅하지 않는 외부 주소라 404·핫링크 차단으로 실패하는
 * 것이 정상 경로다. 실패한 <img>를 그대로 두면 브라우저가 깨진 아이콘을 그려
 * 밑에 깔아 둔 포스터 틴트를 가린다. 실패하면 스스로 사라져서 틴트만 남긴다.
 */
export function PosterImage({ src, className = "" }: Props) {
  const [failed, setFailed] = useState(false);

  return src !== null && !failed ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      onError={() => setFailed(true)}
      className={className}
    />
  ) : null;
}
