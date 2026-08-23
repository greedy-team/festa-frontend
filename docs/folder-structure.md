# FESTA Frontend 폴더 구조

FESTA는 **feature-first** 구조를 사용한다. `app/`은 라우팅만 맡고, 화면 로직은
`features/`에 도메인별로 모은다.

## 핵심 원칙

1. `app/`에는 라우트와 레이아웃만 둔다.
2. 컴포넌트·API·쿼리·화면 타입은 해당 `features/{도메인}/`에 둔다.
3. 두 개 이상의 도메인이 실제로 공유할 때만 공용 폴더로 옮긴다.
4. 서비스와 관리자 기능은 `features/` 아래에서도 분리한다.
5. 빈 폴더나 빈 `api.ts`·`types.ts`를 미리 만들지 않는다.

## 기본 구조

```text
src/
├── app/                       # 라우팅과 레이아웃
│   ├── admin/                # 관리자 화면 — login/, (console)/ 라우트 그룹, providers.tsx
│   ├── layout.tsx            # SiteChrome으로 공개 화면 셸(Header·Footer)을 감싼다
│   └── globals.css
│   # 일반 사용자 화면(축제·아티스트·분실물 등)은 각자 app/ 바로 아래에 있다
│   # — (main) 그룹으로 묶지 않는다. 이유는 아래 참고.
├── features/                  # 도메인별 실제 화면과 로직
│   ├── {domain}/
│   │   ├── components/
│   │   ├── api.ts            # 순수 fetch 함수
│   │   ├── queries.ts        # useQuery·useMutation 훅
│   │   ├── types.ts          # 화면 전용 타입
│   │   └── store/            # 도메인 전역 상태가 필요할 때만
│   └── admin/{domain}/       # 관리자 기능
├── components/
│   ├── ui/                   # 도메인과 무관한 공용 UI
│   └── layout/               # Header, Footer, AdminSidebar, SiteChrome
├── hooks/                    # 여러 도메인이 공유하는 훅
├── lib/                      # fetcher, QueryClient, 순수 유틸
├── stores/                   # 앱 전체 클라이언트 상태
├── types/api.ts              # 백엔드 응답 타입
└── constants/                # 여러 도메인이 공유하는 상수
```

이 트리는 생성 목록이 아니다. 파일이 처음 필요할 때 해당 폴더를 만든다.

관리자 화면은 `app/admin/`(라우트 접두어)과 그 안의 `(console)` 라우트 그룹(로그인 이후
사이드바가 붙는 화면들)으로 구성되고, `app/admin/providers.tsx`가 관리자 전용
QueryClientProvider를 둔다. 공개/관리자 셸을 가르는 것은 `(main)` 라우트 그룹이 아니라
`components/layout/SiteChrome.tsx`다 — 현재 경로(`usePathname`)로 판단해 `/admin` 이하면
자체 셸(사이드바)에 맡기고, 그 외에는 Header·Footer를 그린다. 공개 화면을 `(main)` 그룹으로
옮기는 안은 검토됐으나, 이 작업 시점에 그 폴더들을 건드리는 PR이 여러 개 열려 있어
보류했다 — 실수로 빠뜨린 게 아니라 의도된 유예다.

## 배치 기준

| 대상 | 한 도메인에서 사용 | 여러 도메인에서 사용 |
| --- | --- | --- |
| 컴포넌트 | `features/{도메인}/components/` | `components/ui/` 또는 `components/layout/` |
| 훅 | `features/{도메인}/hooks/` | `hooks/` |
| API 함수 | `features/{도메인}/api.ts` | 필요한 경우 `lib/` |
| Query 훅 | `features/{도메인}/queries.ts` | 해당 없음 |
| 화면 전용 타입 | `features/{도메인}/types.ts` | 해당 없음 |
| 백엔드 응답 타입 | `types/api.ts` | `types/api.ts` |
| 상태 | `features/{도메인}/store/` | `stores/` |
| 상수 | `features/{도메인}/` | `constants/` |

판단이 어렵다면 `features/{도메인}/`에 먼저 둔다. 두 번째 도메인이 import할 때
공용 폴더로 옮긴다. 백엔드 응답 타입은 여러 화면이 같은 계약을 사용하므로 처음부터
`types/api.ts`에 둔다.

## `app/`과 `features/`의 역할

`app/`의 `page.tsx`는 URL 파라미터를 받고 feature 컴포넌트를 조립하는 역할만 한다.
데이터 요청, 상태 관리, 화면 컴포넌트는 `features/`에서 관리한다.

```tsx
import { FestivalDetail } from '@/features/festival/components/FestivalDetail';

export default async function Page({
  params,
}: {
  params: Promise<{ festivalId: string }>;
}) {
  const { festivalId } = await params;
  return <FestivalDetail festivalId={festivalId} />;
}
```

## 상태 관리

| 상태 | 도구와 위치 |
| --- | --- |
| 서버 데이터 | TanStack Query |
| 한 화면 안에서 끝나는 상태 | `useState` |
| 여러 화면이 공유하는 도메인 상태 | `features/{도메인}/store/`의 Zustand |
| 앱 전체 클라이언트 상태 | `stores/`의 Zustand |

서버 데이터를 Zustand에 복사하지 않는다. 서버 데이터 캐시는 TanStack Query 한 곳에서
관리한다.

## import 경로

`@/*`는 `src/*`를 가리킨다. 상대 경로 대신 별칭을 사용한다.

```tsx
import { FestivalCard } from '@/features/festival/components/FestivalCard';
```
