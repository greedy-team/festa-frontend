import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import { CONTACT_FORM_URL, OPERATOR_NAME, POLICY_EFFECTIVE_DATE } from "@/lib/policy";
import CopyrightPage from "./copyright/page";
import PrivacyPage from "./privacy/page";
import TermsPage from "./terms/page";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const pages = [
  ["개인정보 처리방침", PrivacyPage],
  ["이용약관", TermsPage],
  ["저작권 정책", CopyrightPage],
] as const;

// 정책 문서에 값이 비어 있으면 화면에 "(항목명 확정 전)"이 그대로 찍힌다.
// 그 상태로 배포되면 분석 수집을 켤 수 없고, 무엇보다 고지가 고지를 하지 않는다.
it.each(pages)("%s에는 미확정 자리가 남아 있지 않다", (_, Page) => {
  const html = renderToStaticMarkup(<Page />);
  expect(html).not.toContain("확정 전");
  expect(html).not.toMatch(/\{\{|\}\}/);
});

it.each(pages)("%s는 운영자와 시행일을 밝힌다", (_, Page) => {
  const html = renderToStaticMarkup(<Page />);
  expect(html).toContain(POLICY_EFFECTIVE_DATE);
  expect(html).toContain(CONTACT_FORM_URL);
});

it("개인정보 처리방침은 국외 이전 대상과 분석 도구를 모두 적는다", () => {
  const html = renderToStaticMarkup(<PrivacyPage />);
  for (const name of ["Google LLC", "Microsoft Corporation", "Oracle Corporation", "Vercel Inc."]) {
    expect(html).toContain(name);
  }
  expect(html).toContain(OPERATOR_NAME);
  // 실제로 저장하는 브라우저 저장소 키를 그대로 고지한다.
  expect(html).toContain("festa.site-notice.v1");
  expect(html).toContain("festa.analytics-consent.v1");
});
