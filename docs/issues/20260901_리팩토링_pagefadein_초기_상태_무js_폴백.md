## 제목

♻️ [리팩토링][모션] PageFadeIn 초기 상태를 보이는 쪽으로 뒤집어 무JS 폴백 확보

## 본문

## 🔍 현재 문제점

- `PageFadeIn`(`src/components/ui/PageFadeIn.tsx`)은 `useState(false)`로 시작해 초기 렌더가 `translate-y-4 opacity-0`(안 보이는 쪽)이다. `useEffect` + `requestAnimationFrame` 2번이 돈 뒤에야 `visible = true`로 바뀌어 콘텐츠가 나타난다.
- 즉 SSR HTML이 `opacity-0`로 나가고, 클라이언트 JS가 실행돼야만 콘텐츠가 보인다. JS 번들 로드 실패·하이드레이션 중단·JS 비활성 등으로 `useEffect`가 안 돌면 콘텐츠가 `opacity-0`인 채로 영구히 빈 화면이 된다.
- `motion-reduce:opacity-100`은 `prefers-reduced-motion`을 켠 사용자만 구제한다. 그 설정 없이 JS만 깨진 사용자는 빈 화면 그대로다.
- 같은 화면군의 `FadeInSection`은 반대로 `"idle"`(= `opacity-100`, 보이는 쪽)로 시작해 JS가 없어도 콘텐츠가 남는다. 두 컴포넌트의 초기 상태 전략이 어긋나 있다.
- 특히 `/hosts/[id]/history`는 연도 칩·페이지네이션이 전부 `<Link>`, 정렬도 네이티브 GET 폼이라 원래 무JS로 완결되는 화면인데, `PageFadeIn` 래핑으로 JS 한 번 삐끗하면 멀쩡히 작동하던 페이지가 백지가 된다.

## 💡 해결 방안 / 제안 기능

- `PageFadeIn`의 초기 상태를 `FadeInSection`처럼 보이는 쪽으로 뒤집는다. 초기 렌더는 `opacity-100`, "방금 진입" 페이드업은 상태(`useState`)가 아니라 CSS 애니메이션(`@starting-style` 또는 mount 시 `animation`)으로 얹는다.
- JS가 실행되지 않아도 최종 상태(콘텐츠 보임)로 남게 한다.
- 외부 동작 변경 내용: JS 번들이 실행되지 않는 환경에서 빈 화면 대신 콘텐츠가 표시된다. 정상 환경의 진입 페이드업 연출은 동일하게 유지한다.
- 적용 범위: `PageFadeIn`을 쓰는 6개 화면 (축제 목록·상세, 아티스트 목록·상세, 학교 상세, 축제 이력). 컴포넌트 한 곳만 고치면 전체에 반영된다.

## 🔧 작업 내용

- [ ] `src/components/ui/PageFadeIn.tsx`: 초기 상태를 보이는 쪽으로 두고, 진입 페이드업을 CSS 애니메이션 기반으로 재구성
- [ ] `prefers-reduced-motion` 대응 유지 확인
- [ ] `PageFadeIn` 사용 6개 화면에서 진입 연출이 그대로인지 확인
- [ ] JS를 끈 상태(또는 번들 차단)에서 6개 화면이 빈 화면 없이 렌더되는지 확인

## 👤 담당자

- 담당: 이름
