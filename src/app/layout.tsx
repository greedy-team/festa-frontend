import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { MockProvider } from "@/mocks/MockProvider";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full antialiased">
      {/* flex 컬럼은 남긴다 — SiteChrome과 관리자 셸이 flex-1로 채운다.
          bg-canvas는 body에도 다시 둔다 — body가 비어 있으면 iOS/macOS Safari·Chrome의
          오버스크롤(러버밴드) 영역이 흰 배경으로 뜬다. SiteChrome에도 그대로 남겨
          관리자 셸이 자기 배경으로 덮을 수 있게 한다. */}
      {/* Header·Footer를 SiteChrome이 import하지 않고 여기서 넘긴다 —
          그래야 Footer(와 Container)가 서버 컴포넌트로 남는다. */}
      <body className="flex min-h-full flex-col bg-canvas font-sans">
        {/* 관리자 로그인이 실제 API를 부르게 되면서 목이 필요해졌다 — 워커는 공개·관리자
            양쪽에서 돌아야 하므로 여기서 감싼다. 워커가 준비될 때까지 자식을 렌더하지
            않으므로, 초기 렌더에 실제 네트워크로 요청이 새지 않는다. */}
        <SiteChrome header={<Header />} footer={<Footer />}>
          {process.env.NEXT_PUBLIC_API_MOCKING === "enabled" ? (
            <MockProvider>{children}</MockProvider>
          ) : (
            children
          )}
        </SiteChrome>
      </body>
    </html>
  );
}
