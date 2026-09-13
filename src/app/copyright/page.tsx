import { Container } from "@/components/layout/Container";
import { NO_INDEX, pageMetadata } from "@/lib/seo";

// 문구는 DEC-0191(포스터 이미지는 허락 없이 자체 서버에 저장, 방어선은 권리자 요청 시
// 삭제)을 반영한다. 아티스트 사진·주최 로고는 서비스에서 아예 쓰지 않아(DEC-0063,
// DEC-0129) 별도 섹션을 두지 않았다.
//
// 권리자 요청 연락처는 아직 확정되지 않아 자리만 두었다(#223). 법률 지식이 있는
// 사람의 검토가 끝나기 전까지는 검색에 노출하지 않는다.
export const metadata = { ...pageMetadata("/copyright", "저작권 정책"), ...NO_INDEX };

export default function CopyrightPage() {
  return (
    <Container className="mt-16 mb-20 max-w-[1200px] mx-auto flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-hero text-ink">저작권 정책</h1>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">서비스가 다루는 정보</h2>
        <p className="text-body text-ink">
          FESTA는 전국 대학 축제의 축제명, 일정, 장소, 출연 아티스트 등 사실
          정보를 모아 제공합니다. 이러한 사실 정보는 저작권의 보호 대상이
          아닙니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">포스터 이미지</h2>
        <p className="text-body text-ink">
          축제 포스터 이미지의 저작권은 해당 축제를 주최한 총학생회 등
          원저작자에게 있습니다. FESTA는 축제를 소개할 목적으로, 각 축제의
          공식 계정 등 공개된 게시물에 게시된 포스터 이미지를 가져와
          서비스에 함께 게시합니다.
        </p>
        <p className="text-body text-ink">
          저작권자가 본인의 이미지에 대한 삭제 또는 수정을 원하시는 경우
          아래 [권리자 요청]에 따라 연락해 주시면 확인 즉시 조치하겠습니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">명칭</h2>
        <p className="text-body text-ink">
          각 대학교 및 축제의 명칭은 각 소유자의 자산이며, FESTA는 축제를
          안내하기 위한 목적으로만 사용합니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">권리자 요청</h2>
        <p className="text-body text-ink">
          본인이 저작권자이며 서비스에 게시된 이미지 또는 정보의 삭제·수정을
          원하시는 경우 아래 연락처로 문의해 주세요. 확인 후 신속히
          조치하겠습니다.
        </p>
        {/* 실제 연락처 확정 전 — #223 */}
        <p className="text-body text-muted">
          문의: 연락처 준비 중입니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">면책</h2>
        <p className="text-body text-ink">
          제공되는 정보는 정확성을 보장하지 않습니다. 정확한 내용은 각
          축제의 공식 채널을 통해 다시 확인하시기 바랍니다.
        </p>
      </section>
    </Container>
  );
}
