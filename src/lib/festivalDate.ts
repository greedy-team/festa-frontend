/**
 * 한국 시각 기준 오늘 날짜를 'YYYY-MM-DD'로 반환한다.
 *
 * 실행 환경의 타임존을 쓰면 안 된다 — 이 함수는 서버(Vercel 기본 UTC)와
 * 브라우저(대개 KST) 양쪽에서 실행되고, KST 00~09시에는 두 곳의 "오늘"이
 * 하루 달라 D-day가 틀리고 하이드레이션이 깨진다.
 * 축제는 전부 한국에서 열리므로 KST가 유일한 기준이다.
 * (같은 함정을 목 계층이 먼저 밟았다 — src/mocks/fixtures/date.ts 참조)
 *
 * 'sv-SE' 로케일은 'YYYY-MM-DD' 형식을 그대로 준다.
 */
function todayInSeoul(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
}

/**
 * 'YYYY-MM-DD' 시작일까지 남은 일수.
 * 두 값 모두 날짜 문자열이라 시각이 섞이지 않는다.
 */
export function dDay(startDate: string, today = todayInSeoul()): string {
  const toUtc = (s: string) => {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  const days = Math.round((toUtc(startDate) - toUtc(today)) / 86_400_000);

  return days > 0 ? `D-${days}` : days === 0 ? "D-DAY" : `D+${-days}`;
}

/** '2026-08-19' + '2026-08-21' → '08.19 ~ 08.21' */
export function dateRange(startDate: string, endDate: string): string {
  const short = (s: string) => s.slice(5).replace("-", ".");
  return `${short(startDate)} ~ ${short(endDate)}`;
}

/** '2026-05-21' → '2026년 봄' (1~6월), '2026-09-24' → '2026년 가을' (7~12월) */
export function festivalSeason(startDate: string): string {
  const [year, month] = startDate.split("-").map(Number);
  return `${year}년 ${month <= 6 ? "봄" : "가을"}`;
}
