import type { Metadata } from "next";
import { MockProvider } from "@/mocks/MockProvider";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-canvas font-sans">
        <Header />
        <main className="flex-1">
          {/* MockProvider는 워커가 준비될 때까지 자식을 렌더하지 않는다.
              children만 감싸서 셸(Header·Footer)은 그 동안에도 보이게 한다. */}
          {process.env.NEXT_PUBLIC_API_MOCKING === "enabled" ? (
            <MockProvider>{children}</MockProvider>
          ) : (
            children
          )}
        </main>
        <Footer />
      </body>
    </html>
  );
}
