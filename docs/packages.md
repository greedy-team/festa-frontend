# FESTA Frontend 패키지 가이드

패키지 매니저는 **pnpm만** 사용한다. 정확한 설치 버전은 `package.json`과
`pnpm-lock.yaml`을 기준으로 확인한다.

## 원칙

1. 화면을 만들 때 필요한 패키지만 설치한다.
2. 브라우저·React·CSS 표준 기능으로 해결되면 패키지를 추가하지 않는다.
3. UI 컴포넌트는 직접 조립하지 않고 shadcn/ui에서 필요한 것만 가져온다.
4. 설치 후 `package.json`과 `pnpm-lock.yaml`을 함께 커밋한다.

## 도입 기준

| 패키지 | 도입할 때 |
| --- | --- |
| `@tanstack/react-query` | 클라이언트에서 서버 데이터 캐시·무효화가 필요할 때 |
| `zustand` | 여러 화면이 공유하는 클라이언트 상태가 생길 때 |
| `react-hook-form` | 입력 항목이 많은 폼을 만들 때 |
| `zod` | 폼 입력 스키마 검증이 필요할 때 |
| `@hookform/resolvers` | React Hook Form과 Zod를 함께 쓸 때 |
| `sonner` | 토스트·스낵바가 필요할 때 shadcn/ui로 추가 |
| `prettier` | 팀 포맷 검사를 도입할 때 |
| `prettier-plugin-tailwindcss` | Tailwind 클래스 자동 정렬이 필요할 때 |
| `@tanstack/react-query-devtools` | Query 디버깅이 필요할 때만 개발 의존성으로 추가 |

상태의 위치와 도구 구분은 [폴더 구조 가이드](./folder-structure.md#상태-관리)를 따른다.

## 설치 명령

필요한 줄만 실행한다.

```bash
pnpm add @tanstack/react-query
pnpm add zustand
pnpm add react-hook-form zod @hookform/resolvers
pnpm add -D prettier prettier-plugin-tailwindcss
pnpm add -D @tanstack/react-query-devtools
```

## shadcn/ui

shadcn/ui는 패키지를 사용하는 대신 컴포넌트 코드를 `components/ui/`에 복사한다.
초기 설정은 한 번만 하고, 이후 필요한 컴포넌트만 추가한다.

```bash
pnpm dlx shadcn@latest init --base radix
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add sonner
```

`shadcn init`이 Radix와 필요한 의존성을 설정하므로 하위 패키지를 따로 조립하지 않는다.
토스트·스낵바는 Sonner의 동작을 함께 사용하고, `components/ui/sonner.tsx`에 FESTA 디자인
시스템 스타일을 적용한다.

## 우선 설치하지 않는 패키지

| 후보 | 먼저 사용할 것 | 패키지가 필요한 시점 |
| --- | --- | --- |
| `date-fns` | `Date`, `Intl.DateTimeFormat` | 날짜 로직이 표준 API로 감당하기 어려워질 때 |
| `embla-carousel-react` | CSS scroll snap | 자동재생·인디케이터가 필요할 때 |
| 지도 SDK | 지도 Embed와 외부 길찾기 링크 | 마커 상호작용이 필요할 때 |
| `msw` | feature의 API 함수가 목 데이터를 반환 | 실제 API 연동 테스트가 필요할 때 |

Next.js 16 · React 19 · Tailwind CSS 4와 호환되는 버전인지 설치 전에 확인한다.
