import { Container } from "@/components/layout/Container";
import { ContactLink } from "@/components/ui/ContactLink";
import {
  OPERATOR_NAME,
  POLICY_EFFECTIVE_DATE,
  PRIVACY_OFFICER,
} from "@/lib/policy";
import { NO_INDEX, pageMetadata } from "@/lib/seo";

// 문구는 festa-brain의 docs/legal/03-privacy-policy.md(조문 초안, 2026-09-14)를
// 그대로 옮긴다. 초안의 `{{...}}` 자리는 #238에서 실제 운영 정보로 채웠다.
//
// 코드에서 확인해 적은 값이 있다 — 접속 기록 항목은 AccessLogFilter(백엔드),
// 보관 기준은 application.yml의 logging.logback.rollingpolicy, 쿠키·저장소 키는
// lib/analyticsConsent.ts와 lib/siteNotice.ts가 근거다. 그 코드가 바뀌면 이 문서도
// 같이 고쳐야 한다.
//
// 법률 지식이 있는 사람의 검토가 끝나기 전까지는 검색에 노출하지 않는다.
export const metadata = { ...pageMetadata("/privacy", "개인정보 처리방침"), ...NO_INDEX };

// 표 셀 공통 스타일 — 이 페이지 안에서만 쓰는 정책 문서 표라 공용 컴포넌트로
// 빼지 않고 그대로 반복한다.
const th = "border border-border p-3 text-left text-caption-strong text-ink";
const td = "border border-border p-3 align-top text-caption text-ink";

export default function PrivacyPage() {
  return (
    <Container className="mt-16 mb-20 max-w-[1200px] mx-auto flex flex-col gap-10">
      <h1 className="text-hero text-ink">페스타 개인정보 처리방침</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">
          제1조 (서비스의 개인정보 처리 범위)
        </h2>
        <p className="text-body text-ink">
          1. {OPERATOR_NAME}
          (이하 “운영자”)은 페스타(FESTA, https://www.every-festa.com)를
          제공하면서 다음과 같이 개인정보를 처리합니다.
        </p>
        <p className="text-body text-ink">
          2. 일반 이용자는 회원가입 없이 축제 정보를 열람할 수 있습니다.
          페스타는 일반 이용자 회원 계정을 운영하지 않습니다. 관리자 인증,
          문의·권리침해 신고, 서비스 제공 과정의 기술적 처리 및 공개된 행사
          정보의 정리를 각각 구분합니다.
        </p>
        <p className="text-body text-ink">
          3. 지도에 표시하는 좌표는 행사장의 위치입니다. 페스타는 현재
          브라우저의 위치 권한을 요청하여 이용자의 GPS 위치를 수집하는
          기능을 제공하지 않습니다. 외부 지도 서비스로 이동하여 이용자가
          직접 사용하는 위치 기능은 해당 서비스의 안내를 확인해 주세요.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-block-title text-ink">
          제2조 (처리 목적·항목·근거·기간)
        </h2>

        <div className="flex flex-col gap-2">
          <h3 className="text-subtitle text-ink">
            1. 동의 이외의 근거로 처리하는 정보
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr>
                  <th className={th}>처리 구분·목적</th>
                  <th className={th}>개인정보 또는 관련 처리 항목</th>
                  <th className={th}>수집 방법</th>
                  <th className={th}>처리 근거</th>
                  <th className={th}>보유 기간</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={td}>웹페이지·API 제공, 장애·보안 대응</td>
                  <td className={td}>
                    요청 시각·경로·메서드·응답 상태·처리 시간·요청 식별자,
                    관리자 요청인 경우 계정 식별자. IP 주소와 브라우저 정보
                    (User-Agent)는 접속 기록에 남기지 않습니다.
                  </td>
                  <td className={td}>서비스 요청 및 시스템 기록</td>
                  <td className={td}>
                    개인정보 보호법 제15조제1항제4호(계약의 이행), 제6호(정당한
                    이익)
                  </td>
                  <td className={td}>
                    접속 기록은 다음 배포 시점까지 보관하며 컨테이너 로그 30MB를
                    넘으면 오래된 것부터 지워집니다. 오류 기록은 파일로 남기고
                    하루 단위로 새 파일을 만들어 90주기가 지난 파일과 총 200MB를
                    넘는 오래된 파일을 지웁니다(최대 약 90일이며 기록량이 많으면
                    더 짧아집니다).
                  </td>
                </tr>
                <tr>
                  <td className={td}>관리자 계정 운영·인증</td>
                  <td className={td}>
                    관리자 아이디, 비밀번호 해시, 계정 생성 시각, 인증 토큰,
                    관리 작업 기록, 실패 시 입력 아이디
                  </td>
                  <td className={td}>
                    운영자 계정 등록, 로그인 및 관리 작업
                  </td>
                  <td className={td}>
                    개인정보 보호법 제15조제1항제4호(계약의 이행)
                  </td>
                  <td className={td}>
                    계정 정보는 삭제 요청 또는 운영 종료 시까지, 인증 토큰은 발급
                    후 1시간, 관리 작업 기록은 위 오류 기록과 같은 기준으로
                    보관합니다.
                  </td>
                </tr>
                <tr>
                  <td className={td}>요청한 문의 응답·행사 정정</td>
                  <td className={td}>
                    회신 이메일, 요청 내용, 제출자가 기재한 성명·소속, 필요한
                    첨부자료
                  </td>
                  <td className={td}>운영자가 안내한 문의 창구</td>
                  <td className={td}>
                    개인정보 보호법 제15조제1항제1호(동의), 제4호(계약의 이행)
                  </td>
                  <td className={td}>문의 처리 완료 후 1년</td>
                </tr>
                <tr>
                  <td className={td}>권리침해 신고·법정 요청의 처리</td>
                  <td className={td}>
                    신고인·대리인의 성명 또는 단체명, 연락처, 권리관계 및
                    대리권 증빙, 대상 URL, 처리·통지 기록
                  </td>
                  <td className={td}>신고 접수 및 필요한 보완</td>
                  <td className={td}>
                    개인정보 보호법 제15조제1항제2호(법령상 의무 준수), 제6호
                    (정당한 이익)
                  </td>
                  <td className={td}>처리 완료 후 3년</td>
                </tr>
                <tr>
                  <td className={td}>자료 이용허락의 체결·관리</td>
                  <td className={td}>
                    권리자·제공자의 성명·소속·연락처, 권한 증빙, 대상 자료와
                    허락 조건, 합의·철회 기록
                  </td>
                  <td className={td}>
                    권리자 또는 권한 있는 제공자와의 연락
                  </td>
                  <td className={td}>
                    개인정보 보호법 제15조제1항제4호(계약의 이행)
                  </td>
                  <td className={td}>허락이 끝난 후 3년</td>
                </tr>
                <tr>
                  <td className={td}>공개된 축제·출연 정보의 제공</td>
                  <td className={td}>
                    공개 활동명·출연 이력·공식 공개 계정 등 행사 안내에
                    필요한 공개 정보
                  </td>
                  <td className={td}>
                    공식 공지, 공개 페이지, 권한 있는 제보
                  </td>
                  <td className={td}>
                    개인정보 보호법 제15조제1항제6호(정당한 이익). 공식 공지 등
                    으로 이미 공개된 정보를 행사 안내 목적으로만 처리합니다.
                  </td>
                  <td className={td}>
                    해당 축제 정보를 게시하는 동안 보관하며, 삭제·정정 요청을
                    받으면 지체 없이 처리합니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-subtitle text-ink">2. 동의에 근거한 선택적 처리</h3>
          <p className="text-body text-ink">
            이용자가 동의한 경우에만 아래 분석 도구를 실행합니다. 동의하기
            전에는 도구를 내려받지 않으며 관련 쿠키도 만들지 않습니다. 도구별로
            따로 동의하거나 거부할 수 있습니다.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr>
                  <th className={th}>도구</th>
                  <th className={th}>목적</th>
                  <th className={th}>처리 항목</th>
                  <th className={th}>보유 기간</th>
                  <th className={th}>거부·철회 방법</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={td}>
                    Google Analytics 4 (Google LLC)
                  </td>
                  <td className={td}>
                    방문 경로와 화면 이용 흐름을 파악해 서비스를 개선
                  </td>
                  <td className={td}>
                    쿠키 식별자, 화면 경로·화면 분류, 검색 결과 수와 검색 유형,
                    선택한 축제·아티스트 식별자, 공식 링크 이동 여부,
                    브라우저·기기 정보, 대략적인 접속 지역
                  </td>
                  <td className={td}>14개월</td>
                  <td className={td}>
                    동의 화면 또는 화면 하단 ‘분석 설정’에서 언제든 거부하거나
                    철회할 수 있습니다.
                  </td>
                </tr>
                <tr>
                  <td className={td}>
                    Microsoft Clarity (Microsoft Corporation)
                  </td>
                  <td className={td}>
                    클릭·스크롤 등 화면 이용 장면을 확인해 사용성을 개선
                  </td>
                  <td className={td}>
                    쿠키 식별자, 화면 경로, 마우스·터치·스크롤 위치, 글자를 모두
                    가린 화면 구조
                  </td>
                  <td className={td}>13개월</td>
                  <td className={td}>
                    동의 화면 또는 화면 하단 ‘분석 설정’에서 언제든 거부하거나
                    철회할 수 있습니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-body text-ink">
            두 도구 모두 검색어 원문과 이용자가 입력한 글자는 보내지 않습니다.
            화면 주소에서 검색어가 담길 수 있는 부분을 지운 뒤 전송하며, 관리자·
            로그인·정책 화면과 검색 결과 화면에서는 화면 이용 분석을 실행하지
            않습니다.
          </p>
          <p className="text-body text-ink">
            선택적 개인정보 처리에 동의하지 않아도 기본 축제 정보를 열람할
            수 있습니다.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-block-title text-ink">
          제3조 (브라우저 저장소 및 외부 콘텐츠)
        </h2>

        <div className="flex flex-col gap-2">
          <h3 className="text-subtitle text-ink">1. 페스타의 저장소</h3>
          <p className="text-body text-ink">
            관리자 로그인 시 인증 토큰을 해당 브라우저의 로컬 저장소에
            보관합니다. 토큰의 인증 유효시간은 발급 후 1시간입니다. 저장
            값은 로그아웃, 인증 실패 시 정리되는 흐름 또는 이용자가 사이트
            데이터를 삭제하는 방법으로 제거할 수 있습니다. 브라우저 저장소를
            차단하면 관리자 로그인 유지가 제한될 수 있습니다.
          </p>
          <p className="text-body text-ink">
            일반 방문자에 대한 쿠키 및 유사 기술의 사용 내역과 거부 방법은
            다음과 같습니다.
          </p>
          <p className="text-body text-ink">
            분석에 동의하기 전에는 쿠키를 만들지 않습니다. 동의한 경우에만
            Google Analytics 쿠키(<code>_ga</code>, <code>_ga_</code>로 시작하는
            쿠키)와 Microsoft Clarity 쿠키(<code>_clck</code>,{" "}
            <code>_clsk</code>)를 사용합니다. 화면 하단 ‘분석 설정’에서 철회하면
            해당 쿠키를 지우고 실행 중인 도구를 중단합니다. 브라우저 설정에서
            쿠키를 차단해도 축제 정보를 볼 수 있습니다.
          </p>
          <p className="text-body text-ink">
            쿠키 외에 이 브라우저의 로컬 저장소도 사용합니다. 이용약관·개인정보
            처리방침 안내를 확인했는지 여부는{" "}
            <code>festa.site-notice.v1</code>에, 분석 도구 선택은{" "}
            <code>festa.analytics-consent.v1</code>에 저장합니다. 두 값 모두
            이용자를 식별하지 않으며, 브라우저의 사이트 데이터를 삭제하면 함께
            지워집니다.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-subtitle text-ink">
            2. 포스터 제공·지도·외부 링크
          </h3>
          <p className="text-body text-ink">
            페스타가 저장한 포스터는 운영자가 사용하는 저장소·CDN을 통해
            제공합니다. 관련 개인정보 처리위탁, 제3자 제공 및 국외 이전에
            관한 사항은 제4조부터 제6조까지에서 안내합니다.
          </p>
          <p className="text-body text-ink">
            외부 포스터 이미지가 표시되면 브라우저는 그 이미지가 있는
            서버에 요청을 보냅니다. Google 지도가 표시되면 Google의 서버에
            요청을 보냅니다. 이 과정에서 IP 주소, 브라우저·기기 관련 정보
            및 브라우저의 전송 정책에 따른 참조 정보가 상대 서버에 전달될
            수 있습니다. 각 서비스의 처리 항목과 정책은 아래에서
            안내합니다.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th className={th}>연결 대상</th>
                  <th className={th}>실행되는 시점·목적</th>
                  <th className={th}>개인정보 처리 안내</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={td}>외부 포스터 서버</td>
                  <td className={td}>해당 이미지 요청 시, 포스터 표시</td>
                  <td className={td}>
                    페스타가 저장한 포스터는 Oracle Cloud Infrastructure Object
                    Storage(Oracle Corporation, 일본 리전)에서 제공합니다.
                    이미지를 요청하면 IP 주소와 브라우저 정보가 해당 서버에
                    전달됩니다.{" "}
                    <a
                      href="https://www.oracle.com/kr/legal/privacy/privacy-policy/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline"
                    >
                      Oracle 개인정보처리방침
                    </a>
                    . 외부 사이트의 이미지를 그대로 표시하는 경우에는 그 사이트의
                    서버와 정책이 적용됩니다.
                  </td>
                </tr>
                <tr>
                  <td className={td}>Google Maps</td>
                  <td className={td}>
                    지도 프레임을 불러올 때, 행사장 표시
                  </td>
                  <td className={td}>
                    Google Maps Platform(Google LLC). 지도를 불러올 때 IP 주소,
                    브라우저·기기 정보와 지도 이용 기록이 Google에 전달됩니다.{" "}
                    <a
                      href="https://policies.google.com/privacy?hl=ko"
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline"
                    >
                      Google 개인정보처리방침
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className={td}>
                    공식 홈페이지·SNS·길찾기·광고 링크
                  </td>
                  <td className={td}>
                    이용자가 링크를 선택해 외부로 이동할 때
                  </td>
                  <td className={td}>이동한 사이트의 개인정보 안내</td>
                </tr>
                <tr>
                  <td className={td}>
                    페스타가 운영하는 외부 문의·제휴 신청 폼
                  </td>
                  <td className={td}>이용자가 해당 폼에서 제출할 때</td>
                  <td className={td}>
                    문의·제휴 신청은 Google Forms(Google LLC)로 받습니다.
                    제출자가 입력한 회신 수단과 문의 내용을 수집해 문의 처리
                    완료 후 1년간 보관하며, 응답은 {OPERATOR_NAME}만 확인합니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-body text-ink">
            브라우저에서 외부 콘텐츠 또는 쿠키를 차단할 수 있으나 해당
            이미지·지도 표시가 제한될 수 있습니다.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">제4조 (처리위탁)</h2>
        <p className="text-body text-ink">
          1. 운영자는 개인정보 처리업무를 위탁하는 경우 목적 외 처리 금지,
          안전조치, 재위탁 및 감독에 관한 사항을 계약 등에 반영하고 수탁자를
          관리합니다.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse">
            <thead>
              <tr>
                <th className={th}>수탁자</th>
                <th className={th}>위탁업무</th>
                <th className={th}>보유·이용 기간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={td}>Oracle Corporation</td>
                <td className={td}>
                  서버·데이터베이스 운영, 포스터 저장소 제공
                </td>
                <td className={td}>위탁 계약이 끝날 때까지</td>
              </tr>
              <tr>
                <td className={td}>Vercel Inc.</td>
                <td className={td}>웹 화면 호스팅·배포</td>
                <td className={td}>위탁 계약이 끝날 때까지</td>
              </tr>
              <tr>
                <td className={td}>Google LLC</td>
                <td className={td}>
                  문의·제휴 신청 폼 운영(Google Forms), 지도 표시(Google Maps)
                </td>
                <td className={td}>위탁 계약이 끝날 때까지</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">제5조 (제3자 제공)</h2>
        <p className="text-body text-ink">
          1. 운영자는 법령상 근거 없이 개인정보를 제3자에게 제공하지
          않습니다. 독립된 목적의 제공이 있으면 제공받는 자, 목적, 항목,
          보유·이용 기간 및 법적 근거를 공개하고, 동의가 필요한 경우 별도로
          동의를 받습니다.
        </p>
        <p className="text-body text-ink">
          현재 독립된 목적으로 개인정보를 제3자에게 제공하는 경우는 없습니다.
          제공이 생기면 이 방침을 고쳐 미리 알립니다.
        </p>
        <p className="text-body text-ink">
          2. 신고 상대방에게 필요한 내용을 통지하거나 수사기관·법원 등에
          자료를 제출하는 경우에도 적법한 근거, 요청 주체 및 범위를 확인하고
          필요한 정보만 전달합니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">
          제6조 (개인정보의 국외 이전)
        </h2>
        <p className="text-body text-ink">
          1. 개인정보의 국외 이전에 관한 사항은 다음과 같습니다. 별도 동의가
          필요한 이전은 이용자의 동의를 받은 후 수행합니다.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr>
                <th className={th}>이전받는 법인·연락처</th>
                <th className={th}>국가</th>
                <th className={th}>항목</th>
                <th className={th}>시기·방법</th>
                <th className={th}>목적</th>
                <th className={th}>보유·이용 기간</th>
                <th className={th}>법적 근거</th>
                <th className={th}>거부 방법·효과</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={td}>
                  Oracle Corporation (privacy_ww@oracle.com)
                </td>
                <td className={td}>일본</td>
                <td className={td}>
                  요청 기록(접속 정보), 저장한 포스터 이미지
                </td>
                <td className={td}>
                  서비스를 이용할 때 네트워크를 통해 전송
                </td>
                <td className={td}>서버·데이터베이스·저장소 운영</td>
                <td className={td}>위탁 계약이 끝날 때까지</td>
                <td className={td}>
                  개인정보 보호법 제28조의8제1항제3호(계약 이행을 위한 위탁·보관)
                </td>
                <td className={td}>
                  서비스 이용을 멈추면 이전도 멈춥니다. 서비스 제공에 꼭 필요한
                  이전이라 이전만 따로 거부하면 서비스를 이용할 수 없습니다.
                </td>
              </tr>
              <tr>
                <td className={td}>Vercel Inc. (privacy@vercel.com)</td>
                <td className={td}>미국</td>
                <td className={td}>요청 기록(접속 정보)</td>
                <td className={td}>화면을 요청할 때 네트워크를 통해 전송</td>
                <td className={td}>웹 화면 호스팅·배포</td>
                <td className={td}>위탁 계약이 끝날 때까지</td>
                <td className={td}>
                  개인정보 보호법 제28조의8제1항제3호(계약 이행을 위한 위탁·보관)
                </td>
                <td className={td}>
                  서비스 이용을 멈추면 이전도 멈춥니다. 서비스 제공에 꼭 필요한
                  이전이라 이전만 따로 거부하면 서비스를 이용할 수 없습니다.
                </td>
              </tr>
              <tr>
                <td className={td}>
                  Google LLC (
                  <a
                    href="https://support.google.com/policies/contact/general_privacy_form"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline"
                  >
                    개인정보 문의 양식
                  </a>
                  )
                </td>
                <td className={td}>미국</td>
                <td className={td}>
                  지도·문의 폼 이용 시 IP 주소와 브라우저·기기 정보, 문의 폼에
                  입력한 내용. 분석에 동의한 경우 제2조 제2항의 Google Analytics
                  처리 항목
                </td>
                <td className={td}>
                  해당 기능을 이용할 때 또는 분석에 동의한 뒤 화면을 이용할 때
                  네트워크를 통해 전송
                </td>
                <td className={td}>
                  지도 표시, 문의·제휴 신청 폼 운영, 동의한 경우 이용 통계 분석
                </td>
                <td className={td}>
                  지도·폼은 위탁 계약이 끝날 때까지, 분석은 14개월
                </td>
                <td className={td}>
                  지도·폼은 개인정보 보호법 제28조의8제1항제3호, 분석은 같은 항
                  제1호(별도 동의)
                </td>
                <td className={td}>
                  분석은 ‘분석 설정’에서 거부하거나 철회할 수 있고, 거부해도 축제
                  정보를 볼 수 있습니다. 지도·폼 이전을 거부하면 해당 기능만
                  이용이 제한됩니다.
                </td>
              </tr>
              <tr>
                <td className={td}>
                  Microsoft Corporation (
                  <a
                    href="https://go.microsoft.com/fwlink/?LinkId=521839"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline"
                  >
                    Microsoft 개인정보처리방침
                  </a>
                  )
                </td>
                <td className={td}>미국</td>
                <td className={td}>
                  분석에 동의한 경우 제2조 제2항의 Microsoft Clarity 처리 항목
                </td>
                <td className={td}>
                  분석에 동의한 뒤 화면을 이용할 때 네트워크를 통해 전송
                </td>
                <td className={td}>화면 이용 장면 분석</td>
                <td className={td}>13개월</td>
                <td className={td}>
                  개인정보 보호법 제28조의8제1항제1호(별도 동의)
                </td>
                <td className={td}>
                  ‘분석 설정’에서 거부하거나 철회할 수 있고, 거부해도 축제 정보를
                  볼 수 있습니다.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">
          제7조 (보유기간 종료 및 파기)
        </h2>
        <p className="text-body text-ink">
          1. 목적을 달성하거나 보유기간이 끝난 개인정보는 지체 없이
          파기합니다. 동의 철회 시에는 다른 적법한 보유 근거가 없는 범위에서
          해당 정보를 파기합니다.
        </p>
        <p className="text-body text-ink">
          2. 다른 법령에 따른 보존 의무가 있는 경우에는 해당 법령에서 정한
          기간 동안 다른 정보와 분리하여 보관합니다. 분쟁 대응에 필요한
          자료는 적법한 근거에 따라 필요한 범위에서 보관합니다.
        </p>
        <p className="text-body text-ink">
          3. 전자파일은 복구하기 어려운 방법으로 삭제하고, 종이 문서는 파쇄
          등으로 파기합니다. 백업에 남는 경우 접근을 제한하고 백업 보관 주기
          (최대 30일)에 따라 제거하며 복구 시 삭제 대상이 다시 사용되지 않도록
          합니다.
        </p>
        <p className="text-body text-ink">
          4. 문의 이메일, 첨부파일, 신고 증빙, 관리자 로그 및 외부 폼의
          사본에도 같은 보유 기준을 적용합니다.
        </p>
        <p className="text-body text-ink">
          법령에 따른 별도 보존 내역: 현재 다른 법령에 따라 따로 보존하는
          개인정보는 없습니다. 보존 의무가 생기면 항목과 기간을 이 방침에
          적습니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">제8조 (정보주체의 권리)</h2>
        <p className="text-body text-ink">
          1. 이용자와 공개 행사 정보에 포함된 개인은 운영자에게 본인
          개인정보의 열람, 정정·삭제, 처리정지 및 동의 철회를 요청할 수
          있습니다. 본인이 아닌 경로에서 수집한 정보에 대해서는 적용
          법령에 따른 수집 출처 등 안내도 요청할 수 있습니다.
        </p>
        <ul className="flex flex-col gap-1 text-body text-ink">
          <li>
            접수: <ContactLink />로 요청해 주세요.
          </li>
          <li>
            방법: 요청 내용과 회신 수단을 알려주세요. 권리 확인에 필요한
            경우에 한하여 최소한의 본인·대리권 확인을 요청합니다.
          </li>
          <li>
            처리: 법정 기한 내 조치하고 결과를 안내합니다. 법령에 따라
            일부 제한되는 경우에는 그 사유와 이의제기 방법을 설명합니다.
          </li>
        </ul>
        <p className="text-body text-ink">
          2. 회원가입을 하지 않았다는 이유로 권리행사를 거절하지 않습니다.
          선택적 개인정보 처리 동의를 거부하거나 철회해도 기본 정보 열람에
          불이익을 주지 않습니다. 만 14세 미만 아동의 개인정보에 동의가
          필요한 처리를 하는 경우 법정대리인 동의 등 법령상 절차를 먼저
          갖춥니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">
          제9조 (안전성 확보조치)
        </h2>
        <p className="text-body text-ink">
          1. 운영자는 개인정보의 안전성 확보를 위해 다음과 같은 조치를
          이행합니다.
        </p>
        <ul className="flex flex-col gap-1 text-body text-ink">
          <li>
            모든 요청을 HTTPS로 암호화해 주고받습니다.
          </li>
          <li>
            개인정보에 접근할 수 있는 권한을 관리자 계정으로 한정하고, 비밀번호는
            원래 값으로 되돌릴 수 없는 형태로 저장합니다.
          </li>
          <li>관리자 인증 토큰의 유효시간을 발급 후 1시간으로 제한합니다.</li>
          <li>
            접속 기록에 IP 주소와 브라우저 정보를 남기지 않고, 화면 이용 분석에서는
            입력값과 화면의 글자를 모두 가린 뒤 전송합니다.
          </li>
          <li>목적에 필요한 최소한의 항목만 수집합니다.</li>
        </ul>
        <p className="text-body text-ink">
          2. 개인정보 유출 등이 발생하면 피해 방지 조치와 함께 법령상
          통지·신고 의무를 이행합니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">
          제10조 (책임자 및 피해구제)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse">
            <tbody>
              <tr>
                <th className={th}>개인정보처리자</th>
                <td className={td}>{OPERATOR_NAME}</td>
              </tr>
              <tr>
                <th className={th}>
                  개인정보 보호책임자 또는 담당 부서
                </th>
                <td className={td}>{PRIVACY_OFFICER}</td>
              </tr>
              <tr>
                <th className={th}>문의 창구</th>
                <td className={td}>
                  <ContactLink />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-body text-ink">
          전화와 우편 주소는 따로 운영하지 않습니다. 위 문의 창구로 접수한 내용에
          회신합니다.
        </p>
        <p className="text-body text-ink">
          1. 운영자를 통한 해결 외에도{" "}
          <a
            href="https://privacy.kisa.or.kr"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline"
          >
            개인정보침해신고센터
          </a>
          (118),{" "}
          <a
            href="https://www.kopico.go.kr"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline"
          >
            개인정보분쟁조정위원회
          </a>
          (1833-6972)를 통해 상담·구제를 신청할 수 있습니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-block-title text-ink">제11조 (변경 안내)</h2>
        <p className="text-body text-ink">
          1. 방침 변경 시 적용일과 변경 내용을 알리고 이전 방침을 확인할 수
          있도록 합니다. 새로운 동의가 필요한 처리는 방침 변경 공지만으로
          시작하지 않습니다.
        </p>
        <ul className="flex flex-col gap-1 text-body text-ink">
          <li>시행일: {POLICY_EFFECTIVE_DATE}</li>
          <li>이전 방침: 최초 시행본이라 이전 방침이 없습니다.</li>
        </ul>
      </section>
    </Container>
  );
}
