# Hooks And Store

훅, Server Component 로더, Store 경계를 볼 때 읽는 슬라이스다. `audit-hooks`가 연다.
의미 단위는 `meaning-unit.md`, 계층 표는 `component-layers.md`다.

## Hook 경계

- 컴포넌트는 항상 가벼운 형태를 유지한다. 내부에 생기는 복잡한 로직은 컴포넌트 밖으로
  훅(`use*`)으로 옮긴다.
- 훅의 책임은 상태나 effect 개수가 아니라 기능이나 도메인 단위로 판단한다. 하나의 기능에
  속한 상태, effect, 이벤트 리스너는 여러 개여도 한 훅에 있어도 된다. 서로 무관한 기능을
  한 훅에 섞지 않는 것이 진짜 기준이다. 훅 내부가 복잡해도 반환하는 값과 함수는 간단하게
  유지한다.
- 책임 경계를 한 번 정했으면 로직을 훅 안팎으로 반복해서 옮기지 않는다. 새 기능이 생기면
  기존 훅에 무관하게 끼워 넣지 않고 새 훅으로 분리한다.
- hook은 상태 전이와 계산을 담당하고 JSX를 반환하지 않는다.
- hook은 `CSSProperties` 전체를 반환하지 않는다. 필요한 값만 반환하고 컴포넌트가 style을 조립한다.
- 범용 hook 결과를 다시 다른 hook 인자로 전달하는 대신, 필요한 hook이 내부에서 직접 호출한다.
- 컴포넌트별 hook은 그 컴포넌트 기능만 담당한다.
- persist와 권한은 훅이나 도메인 계층이다. 도메인 없는 순수 변환만 유틸이다.

## Server Component 계층

Server Component는 `use*` 훅을 쓸 수 없다. 그래서 복잡한 로직을 뺄 자리가 없다고 착각하기
쉽지만, 원칙은 client 컴포넌트와 같다. 단위를 작게 유지하고 서로 다른 책임을 분리한다.
훅 대신 일반 async 함수로 나눈다.

- **가드**: 인증/권한 체크는 여러 페이지가 재사용하는 공유 함수로 뺀다. 허용 역할 목록처럼
  가드가 참조하는 값도 페이지마다 따로 하드코딩하지 않고 같은 공유 함수 또는 상수를 쓴다.
  영역 가드는 layout, 리소스 가드는 domain이다. `redirect("/login")`를 페이지마다
  하드코딩하지 않는다.
- **뷰모델 로더**: 파라미터 파싱, 데이터 fetch, 파생 계산(옵션 목록, 색상 맵, dedup 등)은
  페이지 전용 로더 함수 하나로 모은다. 페이지 컴포넌트는 그 함수를 부르고 결과를
  렌더링만 한다.
- **공유 유틸**: 여러 페이지에서 거의 같은 파생 계산이 반복되면 공유 유틸로 추출한다.
  페이지마다 손으로 복붙하지 않는다.

```tsx
// ❌ 가드, 파싱, fetch, 파생 계산, 렌더링이 한 함수에 있다
export default async function OrganizationAgendaPage({ searchParams }: Props) {
  const profile = await getCurrentProfile();
  if (!profile?.organizationId || !allowedRoles.includes(profile.role)) redirect('/login');
  const params = await searchParams;
  return <main>...</main>;
}

// ✅ 로더 함수가 데이터를 준비하고, 컴포넌트는 렌더링만 한다
async function loadAgendaViewModel(searchParams: SearchParams) {
  const profile = await requireOrgManagerProfile();
  return { profile, visible, therapistOptions, clientOptions };
}

export default async function OrganizationAgendaPage({ searchParams }: Props) {
  const viewModel = await loadAgendaViewModel(searchParams);
  return <AgendaView {...viewModel} />;
}
```

이 분리는 필터/옵션이 여러 개거나 파생 계산이 몇 단계씩 이어지는 복잡한 페이지에 적용하는
기준이다. 가드 하나에 fetch 한 번뿐인 단순한 페이지까지 억지로 로더 함수로 쪼개지 않는다.
로더 함수 하나가 여전히 200줄을 넘는다면 로더를 안 만든 것과 같다. 로더 내부도 같은 원칙으로
다시 나눈다.

## Store / 도메인 훅 / 컴포넌트 계층

전역 상태 저장소(Zustand, Redux, Jotai 등)를 쓰는 프로젝트에서는 컴포넌트와 훅 사이에
Store 계층이 하나 더 생긴다. 세 계층의 책임을 명확히 나눈다.

- **Store**: 상태와 그 상태를 바꾸는 primitive한 setter만 가진다. Store API는 상태
  이름과 그 상태를 바꾸는 동사로만 구성된다(`items`, `addItem`, `removeItem`,
  `updateQuantity`, `clearItems`). 부수효과 없는 파생 읽기 전용 selector는 둘 수 있다.
  API 호출이나 여러 단계로 이뤄진 도메인 동작(`checkout`, `applyCoupon`,
  `calculateTotal`, `order`)은 Store가 아니라 도메인 훅이 가진다.
- **도메인 훅**(`useCart` 등): 해당 도메인의 action과 흐름을 전부 품는다. 내부에서
  필요하면 Store, 저수준 훅(`useFetch`), 순수 유틸을 자유롭게 조합한다. 이 내부 의존성을
  컴포넌트가 알 필요는 없다.
- **컴포넌트**: 도메인 훅 하나만 바라본다. Store와 다른 훅을 컴포넌트가 직접 조립하지
  않는다.

### 훅은 기본 훅과 기능 훅으로 구분한다

훅 이름만 보고 도메인과 무관한 범용 훅인지, 특정 기능을 전담하는 훅인지 구분할 수 있어야
한다.

- **기본 훅**: 도메인과 무관한 범용 훅이다. 어떤 기능에서든 재사용된다. 예: `useFetch`,
  `useResponsive`, `useLanguage`.
- **기능 훅**: 하나의 기능을 전담한다. 그 기능의 상태와 action을 전부 소유한다. 예:
  `useTerminal`, `useWindow`, `useAddChildForm`.

기능 훅이 내부에서 기본 훅을 조합하는 것은 정상이다. 반대로 기본 훅이 특정 기능의 개념을
알아서는 안 된다.

### 기능 훅에 콜백을 주입해서 UI 오케스트레이션을 위탁하지 않는다

`onSuccess`/`onError` 같은 콜백을 기능 훅에 주입해서 컴포넌트의 UI 동작(모달 닫기, 페이지
새로고침)을 그 안에서 실행시키지 않는다. 훅은 자기 결과 상태만 반환하고, 그 상태에 따라
무엇을 할지는 호출부가 결정한다.

```tsx
const form = useAddChildForm({ accountId });

async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
  event.preventDefault();
  const ok = await form.submit();
  if (ok) {
    setOpen(false);
    router.refresh();
  }
}
```

### 반환 형태는 프로젝트 전체에서 일관되게 유지한다

기능 훅과 Store의 반환 형태를 통일한다. 예를 들어 상태와 행위를 `{ state, actions }`로
묶는 규칙을 정했으면 모든 기능 훅이 그 구조를 따른다.

```tsx
function useCart() {
  return {
    state: { items, totalPrice },
    actions: { increaseQuantity, decreaseQuantity, removeFromCart, clearCart },
  };
}
```

### Store와 도메인 훅은 추상화 수준이 다르다

Store의 action은 상태를 어떻게 바꿀지를 표현하고, 도메인 훅의 action은 사용자가 무엇을
할 수 있는지를 표현한다.

```text
Store action    = 상태 변경
Domain action   = 사용자/도메인 행위
```

### 목적별로 더 좁은 훅을 만들 수도 있다

컴포넌트가 도메인 전체가 아니라 일부만 필요하면 더 좁은 목적의 훅을 따로 둘 수 있다.

```tsx
const { state: { itemCount } } = useCartSummary();
```

### 흔한 위반: wiring 안티패턴

컴포넌트가 Store에서 값을 꺼내 다른 커스텀 훅에 파라미터로 다시 주입하는 패턴을 금지한다.

```tsx
// ❌ 컴포넌트가 Store와 훅을 조립한다
const { addItem, removeItem, updateQuantity } = useCartStore();
const { increaseQuantity } = useCartActions({ addItem, removeItem, updateQuantity });

// ✅ 도메인 훅이 내부에서 직접 Store를 쓴다
function useCart() {
  const { items, addItem, removeItem, updateQuantity, clearItems } = useCartStore();
  function increaseQuantity(itemId: number) { /* ... */ }
  return { state: { items }, actions: { increaseQuantity } };
}
```

도메인을 몰라도 되는 진짜 범용 훅만 콜백을 파라미터로 받는다.

### 도메인 훅은 Store를 그대로 재노출하지 않는다

훅이 반환하는 API는 한 가지 추상화 수준만 가져야 한다.

```tsx
return {
  state: { items, totalPrice },
  actions: { increaseQuantity, decreaseQuantity, removeFromCart, clearCart },
};
```

### 파라미터도 최소화한다

도메인 훅은 자기 내부 의존성을 호출자에게 요구하지 않는다. 실제 외부 입력이 필요한
경우에만 받는다.

```tsx
useTerminal();
useTerminal({ sessionId });
```

### 상태는 그 상태를 실제로 소유하는 계층에만 둔다

같은 의미의 상태를 여러 계층에 중복해서 두지 않는다. 도메인 계층이 진짜로 소유하는
상태라면 `isLoading` 대신 `isExecuting`처럼 도메인 의미가 드러나는 이름을 쓴다.
