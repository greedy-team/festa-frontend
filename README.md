This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

목 데이터로 화면을 보려면 `.env.local`에 아래 두 줄이 필요합니다. Vercel에도 같은
이름으로 등록하면 배포 환경에서도 동일하게 목 데이터로 동작합니다.

```bash
NEXT_PUBLIC_API_MOCKING=true
NEXT_PUBLIC_API_BASE_URL=https://api.every-festa.com
```

없어도 화면은 뜹니다 — 데이터가 빈 상태로 그려집니다.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## SEO 및 공유 이미지

- 대표 주소: `https://www.every-festa.com` (`src/lib/seo.ts`). 루트 도메인은 현재 www로 리다이렉트됩니다.
- 파비콘: `public/festa_symbol.png`에 정사각 PNG를 넣습니다. 최소 48×48, 권장 192×192 이상입니다. 교체하면 `src/app/layout.tsx`의 아이콘 URL 두 곳에 있는 `v` 값을 새 파일의 SHA-256 앞 8자리로 갱신해 이전 캐시와 구분합니다.
- 공유 이미지: `public/festa-og-image.jpg` (1729×910, 약 312KB). 모든 공개 페이지가 이 이미지를 사용하며 제목·설명은 페이지별로 달라집니다. 교체할 때 실제 크기와 `src/lib/seo.ts`의 크기 정보를 맞춥니다.
- `/sitemap.xml`은 공개 축제·아티스트 전체 목록과 축제가 등록된 학교·학교 이력을 포함합니다. 별도 공개 학교 목록 API가 없어 축제가 없는 학교는 사이트맵에 포함하지 않습니다.
- 관리자·showcase·내부 검색·검색 필터 조합은 검색에서 제외합니다. 기본 목록의 페이지네이션은 별도 대표 URL을 유지합니다. Vercel의 production 외 환경은 응답 헤더로 전체 검색 제외합니다.
- 배포 후 이미지 두 URL의 200 응답과 링크 미리보기를 확인하고, Google Search Console과 네이버 서치어드바이저에서 대표 도메인 소유권 확인 후 `/sitemap.xml`을 제출합니다. 인증 파일/태그는 각 콘솔에서 발급받은 실제 값이 필요합니다.

기술 기준: [Next.js Metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [Google noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

<!-- AUTO-VERSION-SECTION: DO NOT EDIT MANUALLY -->
## 최신 버전 : v0.1.11 (2026-09-06)

[전체 버전 기록 보기](CHANGELOG.md)
