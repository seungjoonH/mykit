# 컴포넌트 규칙

## 규칙
- 렌더링 로직과 상태 전이 로직을 분리한다.
- 컴포넌트 하나는 명확한 책임 하나만 가진다.
- 반복되는 UI 블록은 하위 컴포넌트나 훅으로 추출한다.
- 네트워크 요청과 파생 상태(validation, 계산된 값)가 2개 이상이면 훅으로 옮긴다.
- 컴포넌트는 항상 가벼운 형태를 유지한다. 복잡한 로직은 컴포넌트 밖으로 훅으로 옮긴다.
- 훅의 책임은 상태나 effect 개수가 아니라 기능이나 도메인 단위로 판단한다. 하나의 기능에 속한 상태, effect, 이벤트 리스너는 여러 개여도 한 훅에 있어도 된다. 서로 무관한 기능을 한 훅에 섞지 않는 것이 진짜 기준이다. 훅 내부가 복잡해도 반환하는 값과 함수는 간단하게 유지한다.
- 책임 경계를 한 번 정했으면 로직을 훅 안팎으로 반복해서 옮기지 않는다.
- Store를 쓰는 프로젝트에서 컴포넌트가 Store에서 값을 꺼내 다른 훅에 파라미터로 다시 주입하지 않는다. 도메인 훅이 내부에서 직접 Store를 쓰고, Store API를 그대로 재노출하지 않고 행위 단위 API로 변환해서 반환한다.
- 기능 훅(하나의 기능을 전담하는 훅)에 `onSuccess`/`onError` 콜백을 주입해 컴포넌트의 UI 동작을 그 안에서 실행시키지 않는다. 훅은 결과 상태만 반환하고, 호출부가 그 결과로 무엇을 할지 결정한다.
- Store API는 상태 이름과 그 상태를 바꾸는 동사로만 구성한다. `checkout`, `applyCoupon`처럼 여러 단계로 이뤄진 도메인 행위는 Store가 아니라 도메인 훅에 둔다.
- 기능 훅과 Store의 반환 형태는 프로젝트 전체에서 일관되게 유지한다. Store의 action은 상태 변경을, 도메인 훅의 action은 사용자 행위를 표현한다. 이 둘을 같은 반환값에 섞지 않는다.
- 컴포넌트가 도메인 전체가 아니라 일부만 필요하면 더 좁은 목적의 훅을 따로 둘 수 있다(예: `useCartSummary()`).
- 훅, 컴포넌트, Store를 설계하거나 리뷰할 때마다 이 param과 return이 정말 필요한지 되묻는다.

## Do
- JSX 반환 전에 계산 값과 핸들러를 미리 정리한다.

## Don't
- JSX 안에 복잡한 IIFE나 중첩 분기를 직접 넣지 않는다.
- 함수 시그니처에 인라인 객체 타입 리터럴로 props를 받지 않는다. 항상 이름 있는 타입으로 정의한다.
- 컴포넌트 본문에서 `fetch`를 직접 호출하지 않는다. 도메인 서비스 함수(예: `UserService.update()`)를 통해 호출하고, URL, method, header 조립을 컴포넌트에 노출하지 않는다.
- 부수효과 없는 표현식 구문(no-op statement)을 남기지 않는다.

## 예시
```tsx
function ResultPanel({ items }: Props) {
  const visibleItems = items.filter((item) => item.visible);
  const isEmpty = visibleItems.length === 0;

  if (isEmpty) return <EmptyState />;
  return <ResultList items={visibleItems} />;
}
```

```tsx
// ❌ fetch와 파생 validation이 컴포넌트에 그대로 있음
function TicketEditForm({ initialData }: Props) {
  const [formData, setFormData] = useState(initialData);
  const isDisabled = !formData.title.trim() || formData.tags.length === 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch('/api/tickets', { method: 'POST', body: JSON.stringify(formData) });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}

// ✅ 상태, validation, 요청을 훅으로 분리
function useTicketEditForm(initialData: TicketEditData) {
  const [formData, setFormData] = useState(initialData);
  const isDisabled = !formData.title.trim() || formData.tags.length === 0;
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    return TicketService.update(formData);
  };
  return { formData, setFormData, isDisabled, handleSubmit };
}

function TicketEditForm({ initialData }: Props) {
  const { formData, setFormData, isDisabled, handleSubmit } = useTicketEditForm(initialData);
  return <form onSubmit={handleSubmit}>...</form>;
}
```

## 경계
- Page: 라우트 단위 데이터 조합과 화면 구성.
- Component: 렌더링과 로컬 상호작용.
- Hook: 재사용 가능한 상태 로직(기본 훅) 또는 하나의 기능을 전담하는 도메인 로직(기능 훅).
- 승인된 디자인, 화면 구조, 상태, 반응형 요구사항은 primitive 재사용보다 우선한다.
- primitive 재사용을 이유로 feature/page 책임이나 화면 고유 CSS를 제거하지 않는다.
- feature는 도메인 고유 배치, 밀도, 위계와 상태 표현을 소유할 수 있다. page는 shell, navigation, 큰 영역 조합과 page-level responsive layout을 소유할 수 있다.
- 반복되는 flex/grid는 layout primitive 추출을 검토하는 신호이지 feature/page의 직접 CSS 사용 금지가 아니다.
- 승인된 UI 요소나 viewport 동작을 제거하는 것은 단순화가 아니라 범위 변경이다.

## 테스트 범위
- 컴포넌트가 실제로 소유하는 렌더링 상태만 검증하며 체크리스트를 위해 상태를 만들지 않는다.
- 이벤트-상태 전이 동작을 검증한다.
- page 완료 전 spec 구조, 주요 viewport와 실제 브라우저 렌더링을 시각적으로 확인한다.
- 기능 테스트 통과는 화면 디자인 완료의 증거가 아니다.
- 변경 완료 전 프론트 테스트 또는 최소 타입체크/린트를 반드시 수행한다.
