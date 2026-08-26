/**
 * 현재 경로가 이 링크의 화면(또는 그 하위 화면)인가.
 *
 * 경계를 명시한다 — `pathname.startsWith(href)`만으로는 나중에 `/festivals-archive`가
 * 생겼을 때 `/festivals` 메뉴가 같이 켜진다. 슬래시까지 포함해 비교해야 하위 경로
 * (`/festivals/12`)만 잡힌다.
 */
export function isActiveRoute(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
