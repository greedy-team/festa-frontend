import { serializeJsonLd } from "@/lib/festivalSeo";

/** 검색엔진만 읽는 구조화 데이터. 값에 외부 입력이 섞이므로 직렬화는 반드시 serializeJsonLd를 거친다. */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
