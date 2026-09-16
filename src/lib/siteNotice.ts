// 로그인이 없는 서비스라 "계속 이용하면 약관에 동의한 것으로 본다"는 고지를
// 첫 방문에 한 번 보여준다. 여기 저장하는 값은 그 고지를 봤는지 여부뿐이고
// 이용자를 식별하지 않는다 — 개인정보 처리방침 제3조가 이 키를 그대로 적는다.
//
// 분석 동의(lib/analyticsConsent.ts)와 키·이벤트를 따로 둔다. 고지는 모든
// 배포에서 뜨지만 분석 동의는 ANALYTICS_ENABLED가 켜진 배포에서만 뜨므로,
// 한 값으로 합치면 분석을 켜는 순간 이미 고지를 본 사람에게 다시 뜬다.

export const SITE_NOTICE_KEY = "festa.site-notice.v1";
const CHANGE_EVENT = "festa:site-notice";
const ACKNOWLEDGED = "acknowledged";

// 저장소가 막힌 브라우저에서도 현재 문서 안에서는 선택을 유지한다.
let memoryAcknowledged = false;
let storageBlocked = false;

export function readSiteNoticeAcknowledged(): boolean {
  if (storageBlocked) return memoryAcknowledged;
  try {
    return localStorage.getItem(SITE_NOTICE_KEY) === ACKNOWLEDGED;
  } catch {
    return memoryAcknowledged;
  }
}

export function acknowledgeSiteNotice() {
  memoryAcknowledged = true;
  try {
    localStorage.setItem(SITE_NOTICE_KEY, ACKNOWLEDGED);
    storageBlocked = false;
  } catch {
    storageBlocked = true;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeSiteNotice(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === SITE_NOTICE_KEY || event.key === null) {
      storageBlocked = false;
      listener();
    }
  };
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener("storage", onStorage);
  };
}
