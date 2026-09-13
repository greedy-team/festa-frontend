import { Container } from "@/components/layout/Container";
import { NO_INDEX, pageMetadata } from "@/lib/seo";

// 문구는 아직 없다 (#221) — 포스터 이미지를 실제로 어떻게 다루는지(원본 임베드 vs
// 자체 서버 저장)가 DEC-0018과 상충하는 것으로 보여 먼저 정리해야 하고, 권리자 요청
// 절차·광고 관련 표현은 법률 지식이 있는 사람의 검토가 필요하다. 이 커밋은 구조(섹션
// 제목)만 세운다. 문구가 없는 상태로는 검색에 노출하지 않는다.
export const metadata = { ...pageMetadata("/copyright", "저작권 정책"), ...NO_INDEX };

const SECTIONS = [
  "서비스가 다루는 정보",
  "포스터 이미지",
  "아티스트 이미지",
  "명칭·로고",
  "권리자 요청",
  "면책",
];

export default function CopyrightPage() {
  return (
    <Container className="mt-16 mb-20 max-w-[1200px] mx-auto flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-hero text-ink">저작권 정책</h1>
        <p className="text-body text-muted">내용은 준비 중입니다.</p>
      </div>

      <div className="flex flex-col gap-8">
        {SECTIONS.map((title) => (
          <h2 key={title} className="text-block-title text-ink">
            {title}
          </h2>
        ))}
      </div>
    </Container>
  );
}
