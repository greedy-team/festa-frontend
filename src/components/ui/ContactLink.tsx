import { CONTACT_FORM_URL } from "@/lib/policy";

// 정책 문서 세 곳에서 같은 문의 창구를 가리킨다. 주소가 바뀌면 lib/policy.ts만 고친다.
export function ContactLink({ children = "문의 창구" }: { children?: React.ReactNode }) {
  return (
    <a
      href={CONTACT_FORM_URL}
      target="_blank"
      rel="noreferrer"
      className="text-primary underline"
    >
      {children}
    </a>
  );
}
