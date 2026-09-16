import { Container } from "@/components/layout/Container";
import { ContactLink } from "@/components/ui/ContactLink";
import { POLICY_EFFECTIVE_DATE } from "@/lib/policy";
import { NO_INDEX, pageMetadata } from "@/lib/seo";

// 문구는 festa-brain의 docs/legal/02-copyright-policy.md(조문 초안, 2026-09-14)를
// 그대로 옮긴다 — DEC-0191(포스터 이미지는 허락 없이 자체 서버에 저장, 방어선은
// 권리자 요청 시 삭제)을 반영해 작성된 문서다. 초안의 `{{저작권신고이메일}}`·
// `{{시행일}}`은 #238에서 실제 운영 정보로 채웠다.
//
// 법률 지식이 있는 사람의 검토가 끝나기 전까지는 검색에 노출하지 않는다.
export const metadata = { ...pageMetadata("/copyright", "저작권 정책"), ...NO_INDEX };

export default function CopyrightPage() {
  return (
    <Container className="mt-16 mb-20 max-w-[1200px] mx-auto flex flex-col gap-10">
      <h1 className="text-hero text-ink">페스타 저작권 정책</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">제1조 (서비스가 다루는 정보)</h2>
        <p className="text-body text-ink">
          1. 페스타는 전국 대학 축제의 축제명, 일정, 장소, 출연 아티스트 등
          공개된 사실 정보를 모아 제공합니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">제2조 (포스터 이미지)</h2>
        <p className="text-body text-ink">
          1. 축제 포스터 이미지의 저작권은 해당 축제를 주최한 총학생회 등 원
          권리자에게 있습니다. 페스타는 축제를 소개하기 위해 각 축제의 공식
          계정 등에 공개된 게시물을 바탕으로 포스터 이미지를 게시합니다.
        </p>
        <p className="text-body text-ink">
          2. 권리자가 이미지의 삭제 또는 수정을 요청하는 경우 아래 연락처로
          알려주시면 확인 후 신속히 조치하겠습니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">제3조 (명칭)</h2>
        <p className="text-body text-ink">
          1. 각 대학교와 축제의 명칭은 각 소유자의 자산이며, 페스타는 축제를
          안내하기 위한 목적으로만 사용합니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">제4조 (권리자 요청)</h2>
        <p className="text-body text-ink">
          1. 본인이 권리자이며 서비스에 게시된 이미지 또는 정보의 삭제·수정을
          원하는 경우, 대상 페이지와 요청 내용을 아래 연락처로 보내주세요.
        </p>
        <p className="text-body text-ink">
          문의: <ContactLink />
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">제5조 (정보의 정확성)</h2>
        <p className="text-body text-ink">
          1. 제공되는 정보는 정확성을 보장하지 않습니다. 정확한 내용은 각
          축제의 공식 채널에서 다시 확인하시기 바랍니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">부칙</h2>
        <p className="text-body text-ink">
          1. 이 정책은 {POLICY_EFFECTIVE_DATE}부터 시행합니다.
        </p>
      </section>
    </Container>
  );
}
