"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { usePathname } from "next/navigation";

/**
 * 경로가 바뀌면 초기값으로 되돌아가는 로컬 상태.
 *
 * 셸(Header·SiteChrome·AdminShell)은 라우트 이동에도 언마운트되지 않아서 열린 메뉴·
 * 서랍 같은 상태가 그대로 남는다. effect에서 되돌리면 이동 후 한 프레임이 옛 상태로
 * 그려지고 `react-hooks/set-state-in-effect`에도 걸리므로, 렌더 중 이전 경로와 비교해
 * 되돌린다 — React가 권장하는 "파생 상태 조정" 패턴이라 추가 렌더 한 번으로 끝난다.
 *
 * `computeInitial`은 경로를 받아 그 경로에서의 초기값을 돌려준다(경로와 무관하면 무시).
 */
export function useRouteResetState<T>(
  computeInitial: (pathname: string) => T,
): [T, Dispatch<SetStateAction<T>>] {
  const pathname = usePathname();
  const [value, setValue] = useState(() => computeInitial(pathname));
  const [renderedPathname, setRenderedPathname] = useState(pathname);

  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname);
    setValue(computeInitial(pathname));
  }

  return [value, setValue];
}
