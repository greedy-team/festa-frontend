/**
 * sourceUrl은 크롤러가 서드파티 블로그에서 그대로 긁어온 값이다. React는 렌더링되는
 * 텍스트를 이스케이프하지만 `href`의 스킴은 검사하지 않는다 — 저장된 `javascript:`나
 * `data:` URL을 그대로 href에 꽂으면 클릭 시 그 자리에서 실행된다. 관리자 콘솔은
 * localStorage에 토큰을 들고 있어 그 실행 컨텍스트가 그대로 노출된다.
 *
 * http(s)가 아니면 null을 돌려준다 — 호출부가 앵커 대신 평문으로 렌더한다.
 */
export function safeHttpUrl(url: string): string | null {
  return /^https?:\/\//i.test(url) ? url : null;
}
