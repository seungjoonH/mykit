# Component Layers

UI 컴포넌트를 추가하거나 분리할 때 쓰는 범용 계층 모델이다. 프로젝트마다 이름은 달라도
책임 경계는 유지한다.

## 우선순위

- 승인된 디자인, 화면 구조, 상태, 반응형 요구사항은 primitive 재사용과 구현 편의보다 우선한다.
- primitive 재사용을 이유로 UI 요구사항을 생략하거나 `feature`/`page` 계층을 제거하지 않는다.
- 승인된 UI 요소나 viewport 대응을 제거하는 것은 단순화가 아니라 scope change다. 사용자 승인을 받는다.
- primitive가 화면 구조나 반응형 구현을 방해하면 디자인 요구를 버리지 않는다. primitive를 수정하거나 해당 `feature`/`page`가 자체 CSS를 소유하게 한다.

## 계층

| 계층 | 책임 | 넣지 말 것 |
|---|---|---|
| `layout` | 배치, 간격, 정렬, 폭 제어 | 도메인 텍스트, fetch, business state |
| `design` | 비상호작용 시각 primitive | 클릭 동작, route 이동, 도메인 의미 |
| `interactive` | 조작 가능한 primitive | 특정 화면 전용 데이터, 비즈니스 규칙 |
| `composed` | primitive 조합으로 만든 재사용 UI | 특정 페이지의 fetch/cache/store 결합 |
| `feature` | 화면·도메인 맥락이 있는 완성형 UI | 다른 도메인까지 고려한 추상화 |
| `page` | route data, metadata, provider, 큰 조합 | 작은 버튼/카드의 내부 상태 |

## 판단 순서

화면을 조립하기 전에 프로젝트의 color/semantic token, typography, spacing, radius/border,
surface/elevation, focus, 상태 표현, breakpoint, icon 규칙을 확인한다. 없으면 승인된 디자인에
필요한 최소 기반부터 정의한다.

1. 같은 UI가 다른 화면에서도 의미 있게 재사용되는지 확인한다.
2. 사용자 조작이 있으면 `interactive` 또는 그 위 계층으로 둔다.
3. 도메인 데이터 모델을 직접 안다면 `feature`로 둔다.
4. 단지 시각 모양만 제공한다면 `design`으로 둔다.
5. 배치만 담당하면 `layout`으로 둔다.

## 조합 관계

- `interactive`는 `design`을 감싸 동작과 접근성 계약을 더한다.
- `composed`는 `layout`, `design`, `interactive`를 조합해 반복 UI를 만든다.
- `feature`는 `composed`와 도메인 hook/store/data를 연결한다.
- 하위 계층이 상위 계층을 import하지 않게 한다.
- 상위 계층이 하위 계층을 건너뛰고 native element를 새로 구현하지 않게 한다. 이미 있는 `design`/`interactive` 컴포넌트를 두고 별도 스타일로 같은 시각·동작을 중복 정의하면 계층을 건너뛴 것이다.

## 관계 어휘

계층(수직 위치)과 별개로, 컴포넌트끼리 어떻게 결합하는지도 아래 네 가지로 구분한다.

- 확장(Expand): 같은 디자인 역할을 유지한 채 동작이나 props를 더한다. `Icon` → `IconButton`.
- 사용(Use): 다른 컴포넌트를 내부 부품으로 쓰되, 자신의 정체성은 그대로 유지한다. `Chip`이 내부에서 `Icon`을 쓰지만 여전히 `Chip`이다.
- 조합(Compose): 서로 다른 컴포넌트를 엮어 제3의 맥락을 만든다. `DocRow` = `Icon` + `SearchChipButton` + `GotoButton`.
- 구체화(Specify): 범용 컴포넌트의 파라미터를 좁혀 특정 용도로 특수화한다. `Chip` → `StatusChip`.

## Layout 계약

- `layout` 컴포넌트는 배치를 prop으로 표현한다. 이름은 프로젝트마다 다를 수 있지만 `width`(hug/stretch), `direction`, `justify`, `align`, `gap` 같은 축을 prop으로 노출하는 형태가 일반적이다.
- 화면별 CSS Module에 같은 `display: flex`나 `display: grid` 패턴이 반복되면 `layout` primitive 추출을 검토한다. 이는 직접 CSS 사용 금지가 아니라 책임 누수 가능성을 살피라는 신호다.
- 화면 고유 grid template, 비대칭 패널, sticky header/sidebar, 반응형 재배치, container query, 도메인별 밀도와 시각적 hierarchy는 `feature`/`page` CSS가 정상적으로 소유할 수 있다.
- 화면 고유 empty/loading/error/forbidden 표현도 해당 상태를 소유한 `feature`/`page`가 스타일링할 수 있다.

## CSS 소유권

- `layout`은 반복되는 단순 배치, 간격, 정렬 contract를 소유한다.
- `design`과 `interactive`는 자체 모양, token, interaction state를 소유한다.
- `composed`는 내부 primitive 조합과 반복되는 의미 단위 구조를 소유한다.
- `feature`는 도메인 고유 배치, 상태, 밀도, 시각적 위계를 소유한다.
- `page`는 shell, navigation, 큰 영역 조합과 page-level responsive layout을 소유한다.
- 각 계층은 필요하면 자기 CSS Module을 import하고 내부에서 module class를 적용한다. primitive 재사용은 화면별 CSS Module을 제거하라는 뜻이 아니다.

## 일반화 기준

여러 프로젝트에서 반복될 수 있는 버튼, 세그먼트 컨트롤, 칩 선택, 코드 입력, 모달,
슬라이더 같은 primitive 패턴은 일반화 후보가 될 수 있다.

특정 제품의 카드, 주문 상태 패널, 프로젝트 상세 카드처럼 도메인 모델과 문구가 강하게
묶인 UI는 범용 규칙으로 만들지 않는다. 그런 컴포넌트는 예시로만 언급한다.

모든 SVG를 primitive로 추출하지 않는다. 반복되는 icon contract는 `Icon`으로 통일할 수 있지만,
화면 고유 illustration이나 의미 있는 SVG는 해당 feature/page가 직접 소유할 수 있다.

## Props 설계

- Props는 항상 이름 있는 타입으로 정의한다. 함수 시그니처에 인라인 객체 타입 리터럴을
  쓰지 않는다(`{ accountId }: { accountId: string }`이 아니라 `{ accountId }:
  AddChildFormProps`).
- 컴포넌트를 설계하거나 리뷰할 때마다 이 prop이 정말 필요한지 되묻는다. 훅과 Store를
  설계할 때도 같은 질문을 param과 return 양쪽에 적용한다.
- 컴포넌트가 소유하지 않는 상태는 controlled props로 받는다.
- label, aria label, disabled, invalid, selected, pressed 같은 사용자 상태를 명시한다.
- variant는 실제 디자인 시스템에 존재하는 값만 받는다.
- variant는 string prop보다 `Component.Variant` 형태의 named subcomponent로 노출하는 편을 권장한다. 예: `Icon.Primary`, `IconButton.Secondary`.
- size, color처럼 반복 사용되는 값은 지금 값이 하나뿐이어도 px, hex 같은 원시값이 아닌 닫힌 enum이나 토큰으로 받는다.
- escape hatch를 만들기 전에 기존 계층을 잘못 잡은 것은 아닌지 확인한다.
- 내부 클래스 적용(`internal class assignment`)인 `className={styles.root}`와 public 스타일 탈출구(`public style escape hatch`)를 구분한다.
- `className`이나 `style`을 public prop으로 받아 호출부가 내부 스타일을 임의로 덮어쓰게 하는 것이 대표적인 public style escape hatch다. 노출하기 전에 필요한 값을 이미 있는 prop이나 layout 계층으로 표현할 수 있는지 확인한다.
- public style escape hatch가 정말 필요하면 기본 허용으로 추가하지 않는다. 어떤 스타일을 누가 소유하고 어떤 contract를 보장하는지 명시적으로 검토한다.

```tsx
// 권장: 컴포넌트가 자기 CSS Module을 내부에 적용한다.
import styles from "./Card.module.css";

function Card() {
  return <article className={styles.root} />;
}
```

```tsx
// 기본 비권장: 호출자가 내부 디자인을 덮어쓸 수 있다.
function Card({ className }: { className?: string }) {
  return <article className={buildCls(styles.root, className)} />;
}

function CardWithStyle({ style }: { style?: CSSProperties }) {
  return <article style={style} />;
}
```

## 계층별 완료 조건

- Primitive(`layout`, `design`, `interactive`)는 props contract, 실제로 소유하는 상태, 접근성, token 적용을 확인한다.
- `composed`는 반복되는 의미 단위와 자신이 소유하는 필요한 상태를 확인한다.
- `feature`는 도메인 작업 완결성, 화면 고유 hierarchy, 실제 데이터 상태를 확인한다.
- `page`는 spec/wireframe 구조, shell/navigation, 주요 viewport, 실제 브라우저 visual QA를 확인한다.
- 모든 계층에 loading/error/empty 상태를 기계적으로 만들지 않는다. 해당 컴포넌트가 실제로 소유하는 상태만 검증한다.
- 기능이 동작한다는 사실은 화면 디자인이 완료됐다는 증거가 아니다.

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
새로고침)을 그 안에서 실행시키지 않는다. 이건 Store 값을 꺼내 다른 훅에 다시 주입하는
wiring 안티패턴과 방향만 반대일 뿐 같은 문제다. 훅은 자기 결과 상태만 반환하고, 그 상태에
따라 무엇을 할지는 호출부가 결정한다.

```tsx
// ❌ 훅에 onSuccess 콜백을 주입해 UI 오케스트레이션을 위탁한다
const form = useAddChildForm({
  accountId,
  onSuccess: () => {
    setOpen(false);
    router.refresh();
  },
});

function close() {
  setOpen(false);
  form.reset();
}
// setOpen(false)가 onSuccess와 close 두 곳에 흩어져 있다

// ✅ 훅은 결과 상태만 반환하고, 호출부가 그 결과에 따라 행동한다
const form = useAddChildForm({ accountId });

async function submit(event: FormEvent) {
  event.preventDefault();
  const ok = await form.submit();
  if (ok) {
    setOpen(false);
    router.refresh();
  }
}

function close() {
  setOpen(false);
  form.reset();
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
할 수 있는지를 표현한다. Store가 `updateQuantity(itemId, quantity)` 하나만 제공해도,
도메인 훅은 그걸로 `increaseQuantity(itemId)`/`decreaseQuantity(itemId)`처럼 사용자
행위 단위 action을 만들어 노출한다.

```text
Store action    = 상태 변경
Domain action   = 사용자/도메인 행위
```

### 목적별로 더 좁은 훅을 만들 수도 있다

컴포넌트가 도메인 전체가 아니라 일부만 필요하면, 도메인 훅 하나를 억지로 다 쓰게 하지
않고 더 좁은 목적의 훅을 따로 둘 수 있다. 이건 로직을 기술적 종류별로 쪼개는 것과 다르다.
같은 도메인의 좁은 읽기 전용 view일 뿐이다.

```tsx
// 장바구니 개수만 필요한 컴포넌트
const { state: { itemCount } } = useCartSummary();
```

### 흔한 위반: wiring 안티패턴

컴포넌트가 Store에서 값을 꺼내 다른 커스텀 훅에 파라미터로 다시 주입하는 패턴을 금지한다.
이 흐름이 나타나면 컴포넌트가 Store와 훅을 조립하는 wiring 계층이 된 것이다.

```text
Store → 컴포넌트가 꺼냄 → 다른 훅에 다시 주입 → 그 훅에서 사용
```

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

콜백을 파라미터로 주입받는 훅이 전부 이 위반은 아니다. 판별 기준은 그 훅이 내부에서
이미 특정 도메인 개념(`addItem`, `updateQuantity` 같은)을 전제하고 있는지다. 전제하고
있다면 겉보기만 독립적인 위장된 DI다. 도메인을 몰라도 되는 진짜 범용 훅만 콜백을
파라미터로 받는다.

### 도메인 훅은 Store를 그대로 재노출하지 않는다, 두 추상화 수준을 섞지도 않는다

Store의 API를 거의 그대로 다시 반환하면 도메인 훅이 단순 wrapper가 된다. Store 원시
API와 변환된 도메인 action을 같은 반환값에 함께 섞는 것도 같은 문제다. 훅이 반환하는
API는 한 가지 추상화 수준만 가져야 한다.

```tsx
// ❌ Store 원시 API와 변환된 도메인 action이 뒤섞여 있다
return {
  items, setItems, addItem, removeItem, updateQuantity, clearItems,
  totalPrice, increaseQuantity, decreaseQuantity, removeFromCart, clearCart,
};

// ✅ 상태 변경(Store)이 아니라 사용자 행위(Domain)만 노출한다
return {
  state: { items, totalPrice },
  actions: { increaseQuantity, decreaseQuantity, removeFromCart, clearCart },
};
```

### 파라미터도 최소화한다

도메인 훅은 자기 내부 의존성을 호출자에게 요구하지 않는다. 실제 외부 입력이 필요한
경우에만 받는다.

```tsx
// ❌ 호출자가 훅의 내부 의존성을 전부 조립해서 넘겨야 한다
useTerminalCommands({ addOutput, addError, clearLogs, setLoading });

// ✅ 필요 없으면 파라미터가 없고, 진짜 외부 입력만 받는다
useTerminal();
useTerminal({ sessionId });
```

### 상태는 그 상태를 실제로 소유하는 계층에만 둔다

같은 의미의 상태를 여러 계층에 중복해서 두지 않는다. 하나의 진짜 출처만 둔다. `useFetch`가
이미 `loading`을 반환하는데 도메인 Store에 또 `isLoading`을 따로 두면 두 상태가 어긋날
수 있다. 도메인 계층이 진짜로 소유하는 상태(예: 지금 명령을 실행 중이라 다른 입력을
못 받는 상태)라면 `isLoading`처럼 범용적인 이름 대신 `isExecuting`처럼 도메인 의미가
드러나는 이름을 쓴다.
