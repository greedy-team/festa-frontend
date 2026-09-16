import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ContactLink } from "@/components/ui/ContactLink";
import { OPERATOR_NAME, POLICY_EFFECTIVE_DATE } from "@/lib/policy";
import { NO_INDEX, pageMetadata } from "@/lib/seo";

// 문구는 festa-brain의 docs/legal/01-terms-of-service.md(조문 초안, 2026-09-14)를
// 그대로 옮긴다. 초안의 `{{...}}` 자리는 #238에서 실제 운영 정보로 채웠다.
//
// 법률 지식이 있는 사람의 검토가 끝나기 전까지는 검색에 노출하지 않는다.
export const metadata = { ...pageMetadata("/terms", "이용약관"), ...NO_INDEX };

export default function TermsPage() {
  return (
    <Container className="mt-16 mb-20 max-w-[1200px] mx-auto flex flex-col gap-10">
      <h1 className="text-hero text-ink">페스타 이용약관</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">제1조 (목적 및 운영자)</h2>
        <p className="text-body text-ink">
          1. 이 약관은 {OPERATOR_NAME}
          (이하 “운영자”)이 제공하는 페스타(FESTA, https://www.every-festa.com,
          이하 “서비스”)의 이용 조건, 운영자와 이용자의 권리·의무 및 분쟁 처리
          기준을 정합니다.
        </p>
        <ul className="flex flex-col gap-1 text-body text-ink">
          <li>운영자: {OPERATOR_NAME}</li>
          <li>
            고객 문의·권리침해 신고: <ContactLink />
          </li>
          <li>
            전화와 우편 주소는 따로 운영하지 않습니다. 위 문의 창구로 접수한
            내용에 회신합니다.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">제2조 (서비스의 내용)</h2>
        <p className="text-body text-ink">
          1. 페스타는 대학 축제를 중심으로 일정, 개최 장소, 출연진, 입장
          정보 및 주최 측의 공개 정보를 모아 탐색할 수 있게 하는 정보
          서비스입니다. 축제·아티스트·학교별 정보와 검색, 지도 및 외부
          사이트 연결을 제공합니다.
        </p>
        <p className="text-body text-ink">
          2. 일반 이용자는 회원가입 없이 공개 정보를 무료로 열람할 수
          있습니다. 운영자용 관리자 계정은 일반 이용자 계정과 구분됩니다.
        </p>
        <p className="text-body text-ink">
          3. 페스타는 개별 축제의 주최자·주관자 또는 티켓 판매자가 아닙니다.
          현재 서비스 안에서 티켓 주문, 결제, 환불을 처리하지 않습니다. 행사
          참여나 외부 사이트의 거래는 해당 주최자 또는 판매자가 정한 조건을
          확인하여 진행해야 합니다.
        </p>
        <p className="text-body text-ink">
          4. 행사명, 학교명, 아티스트명, 포스터 또는 공식 사이트 링크의
          표시는 페스타에 대한 후원·공인·제휴를 뜻하지 않습니다. 실제 제휴나
          광고가 있는 경우 이용자가 알아볼 수 있게 구분합니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">
          제3조 (약관의 안내 및 변경)
        </h2>
        <p className="text-body text-ink">
          1. 운영자는 이 약관을 서비스에서 쉽게 확인하고 저장할 수 있도록
          게시합니다. 이용계약의 체결과 약관의 편입은 관련 법령에 따르며,
          법령상 설명이나 별도 동의가 필요한 사항에는 해당 절차를 거칩니다.
        </p>
        <p className="text-body text-ink">
          2. 단순한 페이지 방문, 침묵 또는 개인정보 처리방침의 열람을
          개인정보 수집 동의나 제3자 저작물의 이용허락으로 취급하지
          않습니다.
        </p>
        <p className="text-body text-ink">
          3. 약관을 변경할 때에는 변경 내용, 이유 및 시행일을 원칙적으로
          시행 7일 전부터 공지합니다. 이용자에게 불리하거나 중요한 변경은
          원칙적으로 30일 전부터 공지하고, 개별 안내가 가능한 경우 함께
          안내합니다. 법령상 긴급 조치가 필요한 경우 사유와 내용을 지체 없이
          알립니다.
        </p>
        <p className="text-body text-ink">
          4. 공지 후 이의를 제기하지 않았다는 이유만으로 변경에 동의한
          것으로 보지 않습니다. 동의가 필요한 변경은 별도로 동의를 받으며,
          이미 발생한 이용자의 권리를 소급하여 제한하지 않습니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">제4조 (정보의 이용)</h2>
        <p className="text-body text-ink">
          1. 일정, 출연진, 입장 자격·비용, 장소 등은 주최 측 사정에 따라
          변경될 수 있고, 원자료의 오류 또는 반영 시차가 있을 수 있습니다.
          페스타의 정보는 현장 입장이나 특정 출연자의 공연을 보장하는
          확인서가 아닙니다.
        </p>
        <p className="text-body text-ink">
          2. 방문·예매 전에는 해당 축제의 최신 공식 공지와 판매 조건을
          확인해 주세요. 운영자는 오류를 알게 된 경우 중요도와 확인
          가능성을 고려하여 정정, 주의 안내 또는 임시 비공개 조치를 합니다.
        </p>
        <p className="text-body text-ink">
          3. 지도는 행사 장소 확인을 위한 참고 정보입니다. 길찾기를 위해
          외부 지도 서비스로 이동하면 그 서비스의 조건이 적용됩니다.
        </p>
        <p className="text-body text-ink">
          4. 출처 확인, 정보 정정 또는 삭제를 원하는 경우 고객 문의나
          권리침해 신고 창구를 이용할 수 있습니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">제5조 (콘텐츠의 권리)</h2>
        <p className="text-body text-ink">
          1. 페스타가 직접 작성한 설명·디자인·소프트웨어 등에 관한 권리는
          운영자 또는 정당한 권리자에게 있습니다. 오픈소스 및 별도
          이용허락이 있는 자료에는 그 조건이 적용됩니다.
        </p>
        <p className="text-body text-ink">
          2. 외부 포스터·사진·로고 등의 권리는 각각의 권리자에게 있습니다.
          서비스에서 열람할 수 있다는 사실이 이용자에게 재배포·가공·광고
          이용 권한을 부여하지는 않습니다.
        </p>
        <p className="text-body text-ink">
          3. 운영자는 개별 일정, 장소, 출연진 등 사실 자체에 대한 독점권을
          주장하지 않습니다. 이용자는 법령이 허용하는 범위에서 사실을
          활용하거나 서비스 페이지의 주소를 공유할 수 있습니다.
        </p>
        <p className="text-body text-ink">
          4. 정당한 인용 등 법령상 허용되는 이용을 제한하지 않습니다. 다만
          보호되는 표현이나 데이터베이스를 법령에 위반하여 복제·재배포할 수는
          없습니다.
        </p>
        <p className="text-body text-ink">
          5. 외부 자료의 이용 및 권리자 요청에 관한 사항은{" "}
          <Link href="/copyright" className="text-primary underline">
            저작권 정책
          </Link>
          에 따릅니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">
          제6조 (제보 및 자료 제공)
        </h2>
        <p className="text-body text-ink">
          1. 이용자는 공개된 문의 창구를 통해 행사 정보의 정정이나 자료
          제공을 제안할 수 있습니다. 제보만으로 공개 게시가 보장되지는
          않습니다.
        </p>
        <p className="text-body text-ink">
          2. 타인의 연락처, 신분증, 비공개 대화 등 불필요한 개인정보를 보내지
          말아 주세요. 타인을 사칭하거나 권한 없이 저작물을 제공해서는 안
          됩니다.
        </p>
        <p className="text-body text-ink">
          3. 자료를 보냈다는 사실만으로 저작권이 양도되거나 영구적·무제한
          이용권이 설정되지는 않습니다. 공개 이용이 필요한 자료는 대상, 이용
          범위, 기간 등을 별도로 확인합니다.
        </p>
        <p className="text-body text-ink">
          4. 권리침해 신고 자료는 신고 처리 목적으로 사용하며, 홍보물이나
          일반 게시물로 전환하지 않습니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">
          제7조 (금지행위 및 이용 제한)
        </h2>
        <p className="text-body text-ink">
          1. 이용자는 서비스나 타인의 권리를 침해하는 불법행위, 관리자 권한
          탈취·사칭, 악성코드 전송, 접근 제한 우회, 서비스에 장애를
          일으키는 과도한 요청, 허위 신고의 반복 등을 해서는 안 됩니다.
        </p>
        <p className="text-body text-ink">
          2. 운영자는 위반의 정도·반복 여부와 피해를 고려하여 관련 요청을
          차단하거나 이용을 필요한 범위에서 제한할 수 있습니다. 가능한 경우
          사유·범위·기간 및 이의제기 방법을 안내합니다. 즉시 대응이 필요한
          경우 먼저 조치하고, 안내 가능한 수단으로 사후 통지합니다.
        </p>
        <p className="text-body text-ink">
          3. 이용자는 고객 문의 창구로 이의를 제기할 수 있으며, 운영자는
          오인에 따른 제한이 확인되면 해제 또는 정정합니다.
        </p>
        <p className="text-body text-ink">
          4. 이 조항은 정당한 비판, 오류 제보, 권리침해 신고 또는 법령상
          허용되는 이용을 제한하는 근거로 사용하지 않습니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">
          제8조 (광고 및 외부 서비스)
        </h2>
        <p className="text-body text-ink">
          1. 서비스에는 광고 또는 제휴 안내가 표시될 수 있습니다. 광고임을
          쉽게 알 수 있도록 표시하며, 광고라는 이유로 사실과 다른 행사
          정보를 게재하지 않습니다.
        </p>
        <p className="text-body text-ink">
          2. 외부 사이트의 상품·행사 또는 거래에 관한 조건은 해당 제공자가
          정합니다. 운영자가 해당 거래에 실제로 관여하여 법령상 책임을
          부담하는 경우에는 그 책임을 배제하지 않습니다.
        </p>
        <p className="text-body text-ink">
          3. 지도·이미지 등 외부 콘텐츠를 불러오거나 외부 링크를 이용할 때의
          개인정보 처리에 관한 사항은{" "}
          <Link href="/privacy" className="text-primary underline">
            개인정보 처리방침
          </Link>
          에서 안내합니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">
          제9조 (서비스의 변경 및 중단)
        </h2>
        <p className="text-body text-ink">
          1. 운영자는 점검, 장애 대응, 보안 조치, 권리 보호 또는 운영상
          사유로 서비스의 일부를 변경하거나 중단할 수 있습니다. 계획된
          중단은 가능한 범위에서 사전 공지하고, 긴급 중단은 사유를 지체 없이
          안내합니다.
        </p>
        <p className="text-body text-ink">
          2. 서비스 전체를 종료하는 경우 원칙적으로 30일 전부터 종료일과
          문의 방법을 공지합니다. 보유 개인정보는 법령과 개인정보
          처리방침에 따라 처리합니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">제10조 (책임의 범위)</h2>
        <p className="text-body text-ink">
          1. 운영자 또는 이용자가 고의·과실로 상대방에게 손해를 발생시킨
          경우에는 관련 법령에 따라 책임을 부담합니다.
        </p>
        <p className="text-body text-ink">
          2. 운영자는 직접 관여하지 않은 행사 운영, 주최 측의 일정 변경,
          외부 판매자의 거래 이행을 보장하지 않습니다. 다만 운영자의 허위
          안내, 필요한 정정의 부당한 지연 등 운영자에게 귀책사유가 있는
          부분은 법령에 따라 판단합니다.
        </p>
        <p className="text-body text-ink">
          3. 천재지변, 통신망 장애 등 운영자가 합리적으로 통제할 수 없는
          사유에 대해서는 그 사유와 운영자의 예방·대응 의무 이행 여부를
          고려하여 관련 법령에 따라 책임을 판단합니다.
        </p>
        <p className="text-body text-ink">
          4. 이 약관은 관련 법령에 따른 운영자 및 이용자의 책임을 제한하지
          않습니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">
          제11조 (개인정보 및 분쟁 처리)
        </h2>
        <p className="text-body text-ink">
          1. 개인정보 처리에 관한 사항은 개인정보 처리방침에서 안내합니다.
          동의가 필요한 처리는 이용약관 동의와 구분하여 처리합니다.
        </p>
        <p className="text-body text-ink">
          2. 이 약관은 대한민국 법령에 따라 해석합니다. 분쟁 발생 시 고객
          문의를 통해 해결을 협의할 수 있으며, 이는 이용자의 소송·조정·신고
          권리를 제한하지 않습니다.
        </p>
        <p className="text-body text-ink">
          3. 소송의 관할은 민사소송법 등 관련 법령에 따릅니다.
        </p>
        <p className="text-body text-ink">
          4. 일부 조항이 무효이거나 적용되지 않더라도 나머지 조항은 법령이
          허용하는 범위에서 효력을 유지합니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">부칙</h2>
        <p className="text-body text-ink">
          1. 이 약관은 {POLICY_EFFECTIVE_DATE}부터 시행합니다. 최초 시행본이며, 이후 변경 시 이전 버전과 변경
          내용을 함께 공개합니다.
        </p>
      </section>
    </Container>
  );
}
