import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteChrome } from "@/components/layout/SiteChrome";
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
        <SiteChrome header={<Header />} footer={<Footer />}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
