> 이 문서에 정의된 규칙은 **프로젝트 전체에 적용**되며, 리뷰·PR·AI 보조 작업 모두 이 기준을 따릅니다.

---

## 0. 핵심 철학

모든 리팩토링과 설계의 목적은 **읽기 쉬운 코드**다.

> "이 코드를 처음 보는 사람이 맥락 없이 이해할 수 있는가?"

### 읽기 쉬운 코드의 기준

- **의도가 드러난다**: 이름과 구조만으로 목적이 보인다
- **맥락이 유지된다**: 관련 로직은 가깝고, 무관한 것은 분리된다
- **예측 가능하다**: 일반적인 기대를 벗어나지 않는다
- **단위가 작다**: 한 번에 이해 가능한 크기다

### 확장성을 먼저 생각한다

1인 개발이다. 전부 본인 코드이고, 프로젝트는 하나의 작품이다. 최소 코드가 목표가 아니다.
한 곳에서만 써도 유틸 성격이면 분리한다. 로직은 훅, 컴포넌트는 가볍게, Specify와 계층과
유틸 분리를 매번 한다. 구조는 확장 가능하게 짜되, 지금 호출되지 않는 variant나 config 키는
미리 넣지 않는다.

mykit의 두 의의.
- 새 프로젝트를 이 원칙 위에서 쌓는다
- 기존 프로젝트를 같은 원칙으로 리팩터한다. 기존 패턴이 위반이면 복제하지 않고 고친다

확인은 범위만 받는다. 합의한 범위 안에서는 의미 단위, 훅, 유틸을 원칙대로 만들고 사후에
보고한다. 범위 밖은 만지지 않는다.

### Server Component는 훅 대신 로더 함수로 나눈다

Server Component는 `use*` 훅을 쓸 수 없다. 그래서 복잡한 로직을 뺄 자리가 없다고 착각하기
쉽지만 원칙은 위 4가지 기준과 똑같다. 훅 대신 일반 async 함수로 단위를 나눈다.

- 가드(인증/권한 체크)와 파라미터 파싱은 여러 페이지가 재사용하는 공유 함수로 뺀다.
  허용 역할 목록처럼 가드가 참조하는 값도 페이지마다 따로 하드코딩하지 않고 같은
  공유 함수 또는 상수를 쓴다.
- 데이터 fetch와 파생 계산(옵션 목록, 색상 맵, dedup 등)은 페이지 전용 "뷰모델 로더"
  함수 하나로 모은다. 페이지 컴포넌트는 그 함수를 부르고 결과를 렌더링만 한다.
- 여러 페이지에서 거의 같은 파생 계산이 반복되면 공유 유틸로 추출한다. 페이지마다 손으로
  복붙하지 않는다.

```tsx
// ❌ 가드, 파싱, fetch, 파생 계산, 렌더링이 한 함수에 있다
export default async function OrganizationAgendaPage({ searchParams }: Props) {
  const profile = await getCurrentProfile();
  if (!profile?.organizationId || !allowedRoles.includes(profile.role)) redirect('/login');
  const params = await searchParams;
  // 파싱, fetch, 파생 계산 수십 줄이 이어진다
  return <main>...</main>;
}

// ✅ 로더 함수가 데이터를 준비하고, 컴포넌트는 렌더링만 한다
async function loadAgendaViewModel(searchParams: SearchParams) {
  const profile = await requireOrgManagerProfile();
  // 파싱, fetch, 파생 계산
  return { profile, visible, therapistOptions, clientOptions };
}

export default async function OrganizationAgendaPage({ searchParams }: Props) {
  const viewModel = await loadAgendaViewModel(searchParams);
  return <AgendaView {...viewModel} />;
}
```

이 분리는 필터/옵션이 여러 개거나 파생 계산이 몇 단계씩 이어지는 복잡한 페이지에 적용하는
기준이다. 가드 하나에 fetch 한 번뿐인 단순한 페이지까지 억지로 로더 함수로 쪼개지 않는다.
로더 함수 하나가 여전히 200줄을 넘는다면 로더를 안 만든 것과 같다. 로더 내부도 같은 4가지
기준으로 다시 나눈다.

### 복잡성은 은닉하고, 실사용 API는 간단하게

호출부는 구현 방식이 아니라 의도만 알면 된다. URL, method, header, 에러 코드 매핑, 재시도
같은 세부사항은 그 기능을 제공하는 모듈 안에 완전히 가두고, 밖으로는 도메인 의미를 가진
함수나 컴포넌트 API만 노출한다. UI도 같다. `TextField`에 `label={t("name")}`을 거는 것은
호출부가 입력 primitive의 세부사항을 아는 것이다. `NameTextForm`처럼 의미 단위로 닫는다.

```typescript
// ❌ 호출부가 transport 세부사항을 그대로 알아야 한다
await request(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

// ✅ 호출부는 의도만 남는다
await UserService.update(id, data);
```

```tsx
// ❌ 호출부가 입력 primitive와 label/required를 조립한다
<TextField label={t("name")} value={name} onChange={handleNameChange} required />

// ✅ 호출부는 닫힌 의미 단위만 본다
<NameTextForm value={name} onChange={handleNameChange} />
```

컴포넌트도 예외가 아니다. 내부에 생기는 복잡한 로직은 컴포넌트 밖으로 훅으로 옮기고,
컴포넌트 자체는 항상 가벼운 형태를 유지한다. 가장 바깥에서 쓰이는 API나 컴포넌트일수록
표면은 더 간단해야 한다.

훅의 "책임"은 상태나 effect 개수가 아니라 기능이나 도메인 단위로 판단한다. 하나의 기능에 속한
상태, effect, 이벤트 리스너는 여러 개여도 한 훅에 있어도 된다. 진짜 문제는 서로 무관한
기능을 한 훅에 섞는 것이다. 훅 내부가 아무리 복잡해도 반환하는 값과 함수는 간단하고
예측 가능해야 한다. 이 원칙은 위 client 모듈과 똑같다. 내부 복잡성은 감추고 표면은
간단하게 유지한다. 책임 경계를 한 번 정했으면 로직을 훅 안팎으로 반복해서 옮기지 않는다.

```tsx
// ❌ 서로 무관한 기능을 한 훅에 섞는다
function useOrderPage(initialData: OrderData) {
  const [formData, setFormData] = useState(initialData);
  const isDisabled = !formData.title.trim();
  const handleSubmit = () => OrderService.update(formData);

  // 주문 수정과 무관한 전역 알림 구독이 같은 훅에 섞여 있다
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => notificationBus.subscribe(setToast), []);

  return { formData, setFormData, isDisabled, handleSubmit, toast };
}

// ✅ 하나의 기능은 하나의 훅으로 묶는다. 훅 내부가 복잡해도 반환 인터페이스는 간단하게 유지한다
function useOrderEditForm(initialData: OrderData) {
  const [formData, setFormData] = useState(initialData);
  const isDisabled = !formData.title.trim();
  const handleSubmit = () => OrderService.update(formData);
  return { formData, setFormData, isDisabled, handleSubmit };
}

function OrderEditForm() {
  const { formData, setFormData, isDisabled, handleSubmit } = useOrderEditForm(initialData);
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Store, 도메인 훅, 컴포넌트 계층

전역 상태 저장소(Store)를 쓰는 프로젝트는 계층이 하나 더 생긴다. Store는 상태와 primitive
setter만 가지고, API 호출이나 여러 단계로 이뤄진 도메인 동작은 도메인 훅이 가진다. 컴포넌트가
Store에서 값을 꺼내 다른 훅에 파라미터로 다시 주입하는 wiring은 금지한다. 도메인 훅이 내부
에서 직접 Store를 쓴다. 도메인 훅은 Store API를 그대로 재노출하지 않고, 컴포넌트가 실제로
수행하는 행위 단위 API로 변환해서 반환한다.

Store의 API는 상태 이름과 그 상태를 바꾸는 동사로만 구성된다(`items`, `addItem`,
`removeItem`, `updateQuantity`, `clearItems`). `checkout`, `applyCoupon`,
`calculateTotal`, `order` 같은 도메인 행위는 Store가 아니라 도메인 훅에 둔다.

```tsx
// ❌ 컴포넌트가 Store와 훅을 조립하는 wiring 계층이 된다
const { addOutput, addError, clearLogs, setIsLoading } = useTerminalStore();
const { executeCommand } = useTerminalCommands({
  addOutput, addError, clearLogs, setLoading: setIsLoading,
});

// ✅ 도메인 훅이 내부에서 Store를 직접 쓰고, 행위 단위 API만 노출한다
function useTerminal() {
  const { addOutput, addError, clearLogs, setIsLoading } = useTerminalStore();
  function executeCommand(input: string) { /* ... */ }
  return { logs, input, isExecuting, changeInput, executeCommand };
}
```

훅은 기본 훅(도메인과 무관한 범용 훅, 예: `useFetch`, `useResponsive`)과 기능 훅(하나의
기능을 전담하는 훅, 예: `useTerminal`, `useAddChildForm`)으로 나뉜다. 기능 훅에
`onSuccess`/`onError` 콜백을 주입해서 컴포넌트의 UI 동작(모달 닫기, 새로고침)을 그 안에서
실행시키지 않는다. 훅은 결과 상태만 반환하고, 그 상태로 무엇을 할지는 호출부가 결정한다.

```tsx
// ❌ 훅에 onSuccess 콜백을 주입해 UI 오케스트레이션을 위탁한다
const form = useAddChildForm({
  accountId,
  onSuccess: () => { setOpen(false); router.refresh(); },
});

// ✅ 훅은 결과만 반환하고, 호출부가 그 결과에 따라 행동한다
const form = useAddChildForm({ accountId });
const ok = await form.submit();
if (ok) { setOpen(false); router.refresh(); }
```

기능 훅과 Store의 반환 형태는 프로젝트 전체에서 일관되게 유지한다. 예를 들어 상태와
행위를 `{ state, actions }`로 묶는 규칙을 정했으면 모든 기능 훅이 그 구조를 따른다.

```tsx
function useCart() {
  return {
    state: { items, totalPrice },
    actions: { increaseQuantity, decreaseQuantity, removeFromCart, clearCart },
  };
}
```

Store의 action은 상태를 어떻게 바꿀지를, 도메인 훅의 action은 사용자가 무엇을 할 수
있는지를 표현한다. Store가 `updateQuantity(itemId, quantity)` 하나만 제공해도, 도메인
훅은 그걸로 `increaseQuantity`/`decreaseQuantity`처럼 행위 단위 action을 만든다. 이
둘을 반환값에서 섞지 않는다. Store 원시 API와 변환된 도메인 action을 같은 객체에 함께
반환하면 훅의 추상화 수준이 무너진다. 컴포넌트가 도메인 전체가 아니라 일부만 필요하면
`useCartSummary()`처럼 더 좁은 목적의 훅을 따로 둘 수 있다.

---

## 1. 코드 구조 원칙

### 1.1 조건 분기

**규칙**
- 열거형/타입 기반 분기는 `switch` 사용
- 중첩 조건은 early return으로 평탄화
- 같은 열거형 조건으로 여러 값을 반환하는 삼항 체인이 여러 곳에 반복되면 lookup 객체
  하나로 모은다

```typescript
// ❌
if (type === 'A') { ... }
if (type === 'B') { ... }

// ✅
switch (type) {
  case 'A': ...
  case 'B': ...
}
```

```typescript
// ❌ 같은 view 조건으로 갈라지는 삼항 체인이 여러 값마다 반복된다
const days = view === 'month' ? getMonthDays() : view === 'day' ? [anchor] : getWeekDays();
const range = view === 'month' ? getMonthRange() : view === 'day' ? getDayRange() : getWeekRange();
const shift = view === 'month' ? shiftMonth : view === 'day' ? shiftDay : shiftWeek;

// ✅ view를 키로 하는 lookup 객체 하나로 모은다
const VIEW_STRATEGY: Record<View, { days: DaysFn; range: RangeFn; shift: ShiftFn }> = {
  month: { days: getMonthDays, range: getMonthRange, shift: shiftMonth },
  day: { days: (anchor) => [anchor], range: getDayRange, shift: shiftDay },
  week: { days: getWeekDays, range: getWeekRange, shift: shiftWeek },
};
const { days, range, shift } = VIEW_STRATEGY[view];
```

```typescript
// ❌
if (a) {
  if (b) {
    doSomething();
  }
}

// ✅
if (!a) return;
if (!b) return;
doSomething();
```

### 1.2 조건식 단순화

**규칙**
- 조건이 3개 이상이면 의미 있는 변수로 추출
- null 체크는 optional chaining 사용

```typescript
// ✅
const isValidTarget = node instanceof Node && ref.current?.contains(node);
if (isValidTarget) { ... }
```

### 1.3 함수는 최대한 작게

**규칙**
- 모든 코드(JSX 포함)는 한 줄이 가능하면 한 줄로 작성한다
- 들여쓰기 포함 **100자 이상**이면 줄바꿈한다. 포맷터 `printWidth`도 100으로 맞춘다
- 하나의 함수는 하나의 책임만
- void 함수에서 `if (!result.ok) return setError(...)` 한 줄 압축은 허용한다

```typescript
// ✅
const close = () => setOpen(false);
if (!result.ok) return setError(result.error);
```

### 1.4 매직 넘버 금지

**규칙**
- 의미 없는 숫자/문자열 직접 사용 금지
- 반드시 이름 있는 상수로 추출

```typescript
// ✅
const RETRY_INTERVAL_MS = 300;
```

### 1.5 JSX / View 레이어 규칙

**규칙**
- 렌더 내부에서 로직 실행 금지
- 복잡한 로직은 렌더 이전에 계산
- 변환 규칙이 거의 같은 항목을 JSX prop 안에 손으로 여러 개 나열하지 않는다. 선언적
  설정 배열로 뽑고 `map`으로 만든다
- 행위 콜백은 컴포넌트 본문의 `handleXxx`다. JSX에는 `onKeyDown={handleKeyDown}`처럼
  참조만 둔다. `onClick={() => ...}` 인라인은 `map`이어도 금지다. 항목이 필요하면 행
  컴포넌트를 닫고 그 안의 `handleXxx`가 클로저로 가진다
- `handleSubmit`은 `preventDefault`와 persist 시작만 한다. JSX `onSubmit={(e) => ...}`는
  금지다. `onSubmit` 이벤트 타입은 `SubmitEvent<HTMLFormElement>`다. `FormEvent`는 쓰지 않는다

```tsx
// ❌
{(() => compute())()}

// ✅
const result = compute();
```

```tsx
// ❌ 거의 같은 변환 규칙을 가진 항목을 손으로 하나씩 나열한다
<DefinitionList items={[
  { label: t('field.name'), value: entity.name?.trim() || t('notSet') },
  { label: t('field.email'), value: entity.email?.trim() || t('notSet') },
  { label: t('field.phone'), value: entity.phone?.trim() || t('notSet') },
  // ... 20여 개 더
]} />

// ✅ 필드 목록을 선언적 설정으로 뽑고 map으로 생성한다
const DETAIL_FIELDS = [
  { key: 'name', labelKey: 'field.name' },
  { key: 'email', labelKey: 'field.email' },
  { key: 'phone', labelKey: 'field.phone' },
] as const;

const items = DETAIL_FIELDS.map(({ key, labelKey }) => ({
  label: t(labelKey),
  value: entity[key]?.trim() || t('notSet'),
}));

<DefinitionList items={items} />
```

```tsx
// ❌ map 안에서도 인라인 핸들러를 쓰지 않는다
{items.map((item) => (
  <button key={item.id} onClick={() => select(item.id)}>{item.label}</button>
))}

// ✅ 행 컴포넌트를 닫고 그 안의 handleXxx가 클로저로 가진다
function ItemRow({ item, onSelect }: ItemRowProps) {
  function handleClick() { onSelect(item.id); }
  return <button type="button" onClick={handleClick}>{item.label}</button>;
}
```

### 1.6 반복/변환

**규칙**
- `map` / `filter` 우선 사용
- 성능상 필요할 때만 `for` 사용

### 1.7 컴포넌트/모듈 크기

컴포넌트는 항상 가벼운 형태를 유지한다. 복잡한 로직은 컴포넌트 밖으로 훅으로 옮긴다. 훅은
기능이나 도메인 단위로 묶고, 서로 무관한 기능을 한 훅에 섞지 않는다.

다음 조건이면 분리한다:
- 상태가 많다
- 사이드이펙트가 많다
- 이벤트 핸들러가 많다
- UI 블록이 여러 개다
- 컴포넌트 본문에 `fetch`/네트워크 요청이 직접 있다
- 파생 상태(validation, 계산된 값)가 2개 이상이다

| 대상 | 분리 방법 |
|---|---|
| 상태/로직 | custom hook |
| UI 블록 | 하위 컴포넌트 |
| 데이터 처리 | service/module |
| 네트워크 요청 | service 레이어 호출 + custom hook, 컴포넌트에 `fetch` 직접 금지 |

```tsx
// ❌ fetch와 파생 validation이 컴포넌트에 그대로 있음
function TicketEditForm({ initialData }: Props) {
  const [formData, setFormData] = useState(initialData);
  const isTitleEmpty = !formData.title.trim();
  const isDisabled = isTitleEmpty || formData.tags.length === 0;

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch('/api/tickets', { method: 'POST', body: JSON.stringify(formData) });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}

// ✅ 상태, validation, 요청을 훅으로 분리
function useTicketEditForm(initialData: TicketEditData) {
  const [formData, setFormData] = useState(initialData);
  const isDisabled = !formData.title.trim() || formData.tags.length === 0;
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    void persist();
  };
  async function persist() {
    try { return await TicketService.update(formData); }
    catch (error) { return mapPersistError(error); }
  }
  return { formData, setFormData, isDisabled, handleSubmit };
}

function TicketEditForm({ initialData }: Props) {
  const { formData, setFormData, isDisabled, handleSubmit } = useTicketEditForm(initialData);
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 1.8 사이드 이펙트

**규칙**
- 하나의 effect = 하나의 책임

```typescript
// ❌
useEffect(() => {
  fetch();
  addEventListener();
}, []);

// ✅
useEffect(fetch, []);
useEffect(bindEvent, []);
```

### 1.9 제어문 블록 스타일

**규칙**
- `} else {`, `} else if (...) {`, `} finally {` 형태를 금지한다
- `switch`에서 statement가 1개면 한 줄로 작성한다 (`case 'X': break;`, `default: break;`)
- `try/catch`에서 양쪽 statement가 1개면 한 줄로 작성한다 (`try { ... }`, `catch { ... }`)
- `catch {}` 빈 블록 금지 (최소 주석 또는 처리 로직 필요)
- `try`는 persist 하나다. 그 안에 create/update `if/else`를 넣지 않는다. `catch`는 매핑만 한다

```typescript
// ❌
switch (kind) {
  case 'ping':
    break;
  default:
    break;
}

try {
  event = JSON.parse(raw) as Event;
}
catch {
  continue;
}
```

```typescript
// ✅
if (ok) {
  run();
}
else {
  fallback();
}

switch (kind) {
  case 'ping': break;
  default: break;
}

try { event = JSON.parse(raw) as Event; }
catch { continue; }
```

---

## 2. 코드 정리 원칙

### 2.1 import 정리

- 항상 최상단
- 선언과 섞지 않음

### 2.2 미사용 코드 제거

즉시 제거 대상:
- unused import
- unused 변수
- unused export
- 빈 파일
- 부수효과 없는 표현식 구문(no-op statement). 예: `initialData.isPrivate;`처럼 값만 참조하고 아무 데도 쓰지 않는 줄

### 2.3 데이터 구조 통합

**규칙**
- 같은 키를 공유하는 데이터는 하나의 객체로 통합

```typescript
// ❌
const labels = {};
const icons = {};

// ✅
const META = {
  key: { label, icon }
};
```

### 2.4 우회 금지

문제 해결 순서:
1. 실패 원인 파악
2. 근본 원인 해결
3. 단순한 수정 적용

**금지**
- fallback 남발
- try-catch로 숨기기
- 환경 분기로 우회

### 2.5 범용 유틸리티는 utils/로 분리

**규칙**
- 도메인과 무관한 순수 변환만 `utils/`에 둔다. persist, 권한, API 호출은 훅이나 도메인
  계층이다
- 한 곳에서만 써도 유틸 성격이 짙으면 분리한다. 다음에 비슷한 로직이 나오면 분리된
  유틸을 먼저 찾고 재사용한다
- 같은 유틸리티 로직을 파일마다 인라인으로 다시 구현하지 않는다
- 새 포맷/변환 함수를 만들기 전에 `utils/`에 이미 있는지 먼저 찾는다. 특히 로케일처럼
  프로젝트 전역에서 일관돼야 하는 값을 함수 안에 하드코딩하지 않는다. 파일마다 다르게
  하드코딩되면 화면마다 다르게 보이는 버그가 된다
- `utils/` 안에서도 관심사별로 파일을 나눈다(`date.ts`, `number.ts`, `string.ts` 등). 하나의
  `utils.ts`에 다 몰아넣지 않는다
- 유틸리티 함수는 순수 함수라 테스트하기 쉽다. 대상 파일과 나란히 테스트를 둔다(`date.ts` +
  `date.test.ts`)

```typescript
// ❌ 공용 유틸이 있는데 페이지마다 로컬로 다시 구현하고, 로케일도 하드코딩한다
function formatTimeRange(start: string, end: string) {
  const fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${fmt.format(new Date(start))}-${fmt.format(new Date(end))}`;
}

// ✅ 이미 있는 공용 유틸을 먼저 찾아 재사용하고, 로케일은 인자로 받는다
import { formatDateTime } from '@/utils/date';
const range = `${formatDateTime(start, locale)}-${formatDateTime(end, locale)}`;
```

```typescript
// ❌ persist나 권한을 utils/에 넣는다
export async function saveTicket(formData: Ticket) {
  return TicketService.update(formData);
}

// ✅ 도메인 없는 순수 변환만 utils/. 한 곳에서만 써도 유틸 성격이면 분리한다
export function slugify(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}
```

**흔한 후보**
- 날짜/시간: 상대 시간, locale 포맷, 기간 계산
- 숫자/통화: 천 단위 구분, 통화 기호, 퍼센트, 단위 변환(바이트 → MB)
- 문자열: truncate, slugify, capitalize, 마스킹(이메일, 전화번호)
- 배열/객체: groupBy, uniqueBy, sortBy, pick/omit
- 함수형: debounce, throttle, memoize
- 형식 검증: 이메일, 전화번호, URL 형식 체크 (비즈니스 규칙 검증은 도메인 계층)

```typescript
// ❌ 같은 날짜 포맷 로직이 파일마다 따로 구현됨
function OrderList({ orders }: Props) {
  const formatted = new Date(orders[0].createdAt).toLocaleDateString('ko-KR');
}

function InvoiceDetail({ invoice }: Props) {
  const formatted = new Date(invoice.issuedAt).toLocaleDateString('ko-KR');
}

// ✅ utils/에서 한 번만 정의
// utils/date.ts
export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('ko-KR');
}
```

`utils/`는 도메인 지식이 없는 순수 함수만 둔다. 도메인 규칙이나 API 호출이 섞이면
`utils/`가 아니라 도메인 서비스나 훅으로 둔다.

---

## 3. 네이밍 원칙

### 3.1 이벤트 핸들러

`handleXxx`를 컴포넌트 본문에 둔다. JSX에는 참조만 연결한다.

```
handleClick
handleSubmit
handleKeyDown
handleDragEnter
```

```tsx
// ❌
<button onClick={() => setOpen(true)} />

// ✅
function handleOpen() { setOpen(true); }
<button type="button" onClick={handleOpen} />
```

### 3.2 불리언

`is` / `has` / `can` 접두사

```
isVisible
hasError
```

### 3.3 의미 기반 네이밍

```typescript
// ❌
data, temp, value

// ✅
userList, retryCount
```

---

## 4. 스타일링 원칙

### 4.1 CSS Modules 패턴

모든 스타일은 `.module.css` 파일에 정의한다. TSX에 인라인 스타일을 작성하지 않는다.

```tsx
// ✅
function Component({ label }: ComponentProps) {
  return <div className={styles.root}>{label}</div>;
}
```

```css
.root {
  /* 스타일 */
}
```

className 조합에는 `buildCls` 유틸리티를 사용한다.

```ts
// src/lib/buildCls.ts
export function buildCls(...args: (string | false | null | undefined)[]) {
  return args.filter(Boolean).join(' ').trim();
}
```

`buildCls`를 JSX 속성에 인라인으로 호출하지 않는다. 반드시 변수로 추출한다.

```tsx
// ❌
<div className={buildCls(styles.root, active && styles.active)} />

// ✅
const className = buildCls(styles.root, active && styles.active);
<div className={className} />
```

`buildCls`에 인자가 하나뿐이라면 `buildCls`를 쓰지 않고 직접 사용한다.

```tsx
// ❌
const className = buildCls(styles.root);
<div className={className} />

// ✅
<div className={styles.root} />
```

### 4.2 동적 값 처리

동적 CSS 값이 필요한 경우 CSS 변수로 전달하고, `.module.css`에서 소비한다.
JSX `style` prop에 CSS 속성값(opacity, transform 등)을 직접 넣지 않는다.

```tsx
// ❌
<div style={{ opacity: value, transition: 'opacity 0.3s' }} />

// ✅
<div style={{ '--opacity': value } as React.CSSProperties} />
```

```css
.root {
  opacity: var(--opacity, 1);
  transition: opacity 0.3s;
}
```

### 4.3 컴포넌트 캡슐화

- 컴포넌트는 자신의 스타일을 완전히 소유한다
- 컴포넌트 내부의 `className={styles.root}`는 권장되는 내부 클래스 적용이다
- 커스텀 컴포넌트에 호출자가 내부 디자인을 덮어쓰는 public `className`·`style` prop을 기본적으로 두지 않는다
- 외부에서 스타일 조정이 필요하면 래퍼 요소에 클래스를 붙인다
- feature/page는 화면 고유 layout, hierarchy, 밀도와 반응형을 자기 CSS Module로 소유할 수 있다

```tsx
// ❌
<ResultBadge result="ac" className={styles.badge} />

// ✅
<span className={styles.badge}><ResultBadge result="ac" /></span>
```

예외: `style={{ '--css-var': value }}` CSS 변수 전달은 허용한다.

### 4.4 SVG는 파일로 분리

JSX 안에 `<svg>` 태그를 인라인으로 작성하지 않는다.
반복되는 아이콘은 `Icon` 계약으로 뺀다. 그 화면만의 illustration은 feature가 가진다.
재사용 가정이 히어로 그림을 디자인 시스템에 넣으라는 뜻이 아니다.
`public/`에 `.svg`로 두고 `<img>`로 쓰는 방식도 허용한다.

```tsx
// ❌
<svg viewBox="0 0 24 24"><path d="..." /></svg>

// ✅
<img src="/icons/search.svg" alt="" aria-hidden="true" />
```

---

## 5. 컴포넌트 API 설계

### 5.1 최소 API

- 하나의 값으로 유추 가능한 prop은 제거
- 훅, 컴포넌트, Store를 설계하거나 리뷰할 때마다 이 param과 return이 정말 필요한지
  되묻는다. 훅의 param과 return, 컴포넌트의 param, Store의 param과 return 전부
  대상이다

### 5.2 단일 진입점

- 같은 기능을 여러 방식으로 제공 금지

### 5.3 Variant 타입 패턴

배경색·크기 등을 직접 prop으로 받지 않는다.
미리 정의된 variant를 타입으로 제한하여 임의의 값 사용을 막는다.

```tsx
type ResultVariant = 'ac' | 'wa' | 'tle' | 'mle' | 'ce' | 're';

interface ResultBadgeProps {
  result: ResultVariant;
}
```

```css
.badge.ac  { color: #009874; }
.badge.wa  { color: #cc3333; }
.badge.tle { color: #e06c00; }
```

### 5.4 Base 컴포넌트 + Named Export 패턴

variant가 여러 개인 컴포넌트는 `*Base`를 내부 구현으로 두고,
variant가 고정된 Named Export를 외부에 제공한다. 이 패턴은 색/크기만이 아니다. 폼 필드의
의미 단위(`NameTextForm`, `CptCodeTextForm`, `StatusForm`)도 같은 구체화다.
`PrimaryButton`만 보고 Specify를 variant 전용으로 읽지 않는다.

```tsx
// 내부 — export 안 함
function ButtonBase({ variant, ...props }: ButtonProps) {
  const cls = [styles.button, styles[variant]].filter(Boolean).join(' ');
  return <button className={cls} {...props} />;
}

// 외부에 공개
export function PrimaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <ButtonBase {...props} variant="primary" />;
}

export function GhostButton(props: Omit<ButtonProps, 'variant'>) {
  return <ButtonBase {...props} variant="ghost" />;
}
```

```tsx
// ❌ feature가 interactive를 열고 label/required를 밖에서 채운다
<TextField label={t("name")} value={name} onChange={onChange} required />

// ✅ 의미가 닫힌 Named Export. TextField는 이 안에만 있다
export function NameTextForm(props: Omit<TextFieldProps, "label" | "type" | "required">) {
  const t = useTranslations("ServiceTypeForm");
  return <TextField {...props} label={t("name")} type="text" required />;
}
```

### 5.5 타입 정의 파일 분리

컴포넌트의 타입은 같은 디렉토리의 `type.ts`에 분리한다.

```
components/
└── resultBadge/
    ├── ResultBadge.tsx
    ├── resultBadge.module.css
    └── type.ts
```

### 5.6 Props는 이름 있는 타입으로 정의

함수 시그니처에 인라인 객체 타입 리터럴을 쓰지 않는다. 항상 이름 있는 타입으로 선언한다.

```tsx
// ❌
export function AddChildForm({ accountId }: { accountId: string }) {}

// ✅
type AddChildFormProps = { accountId: string };

export function AddChildForm({ accountId }: AddChildFormProps) {}
```

시그니처 형태는 `function Component({ param }: ComponentProps) {}` 다.

### 5.7 의미 단위로 닫는다

`feature`/`page`는 `TextField`, `ChipButton` 같은 interactive primitive를 직접 쓰지 않는다.
label, type, required, i18n은 닫힌 의미 단위(`NameTextForm`, `StatusForm`) 안에 둔다.
primitive 재사용은 그 의미 단위가 primitive를 내부에서 쓰라는 뜻이지, 화면에 `TextField`를
깔라는 뜻이 아니다.

접근성도 호출부가 primitive에 label을 채우는 일이 아니다. **의미가 생기는 계층**에서
보장한다. `NameTextForm`이 그 지점이면 label/aria는 그 안에 둔다. `TextField`는 계약을
열고, feature는 채우지 않는다.

---

## 6. 성능 원칙

### 6.1 최적화 최소화

다음 경우에만 사용:
- 비용 큰 연산
- 참조 안정성 필요

```typescript
// ❌
useMemo(() => a + b)

// ✅
const result = a + b;
```

### 6.2 반복문 안에서 매번 DB 호출을 하지 않는다 (N+1)

배열을 순회하며 매번 쓰기/읽기 요청을 보내는 대신 한 번의 배치/조인 쿼리로 묶는다. 호출
횟수가 데이터 개수에 비례해서 늘어나면(N+1) 그 자체가 신호다.

```typescript
// ❌ 항목 개수만큼 매번 요청
for (const profile of profiles) {
  const user = await getUserById(profile.id);
}

// ✅ 한 번에 배치로 조회
const ids = profiles.map((p) => p.id);
const users = await getUsersByIds(ids);
```

---

## 7. 에러 처리

**규칙**
- 예측 가능한 에러는 사전에 차단
- 에러는 숨기지 않고 드러낸다
- 요청과 실패 처리(파싱, 에러 매핑)가 여러 호출부에서 반복되면 하나의 client 모듈로 통합한다
- client 모듈을 감쌌다고 끝난 게 아니다. 호출부(컴포넌트, 훅)는 URL, method, header,
  `try/catch`를 직접 다루지 않고 도메인 의미를 가진 함수만 호출한다
- 같은 리소스를 다루는 API 호출 함수는 개별로 흩어두지 않고 하나의 서비스 모듈로 묶어
  응집성을 지킨다 (아래 `UserService` 예시)

```typescript
// ✅
if (!response.ok) throw new Error();
```

```typescript
// ❌ 호출부마다 요청과 실패 처리를 반복 구현
async function getUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error('failed');
  return res.json();
}

async function updateUser(id: string, data: UserInput) {
  const res = await fetch(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  if (!res.ok) throw new Error('failed'); // 동일한 실패 처리 로직 반복
  return res.json();
}
```

```typescript
// ❌ 여전히 부족함. client는 하나로 모았지만 호출부가 URL, method, 에러 처리를 직접 다룬다
async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? '요청에 실패했습니다.');
  }
  return res.json();
}

// 컴포넌트/훅에서 이렇게 쓰면 아직 은닉이 안 된 것
try {
  await request(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
} catch (err) {
  setError(err instanceof Error ? err.message : '요청에 실패했습니다.');
}
```

```typescript
// ✅ 도메인 함수로 URL, method, header, 에러 처리를 완전히 은닉
const UserService = {
  get: (id: string) => request<User>(`/api/users/${id}`),
  update: (id: string, data: UserInput) =>
    request<User>(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// 호출부는 의도만 남는다
await UserService.update(id, data);
```

### 라우트 핸들러의 반복 로직도 공용화한다

지금까지는 호출부(클라이언트) 쪽 얘기였다. 서버 라우트 핸들러도 똑같은 원칙이 적용된다.
여러 핸들러에서 반복되는 처리는 공용 함수로 모은다.

- 에러 타입에 따라 HTTP 상태/응답 본문을 매핑하는 분기가 여러 핸들러에 반복되면 공용
  매핑 함수 하나로 모은다. 한 핸들러 안에서 같은 조건을 상태 코드용, 메시지용으로 두 번
  판단하지 않는다
- 요청 파싱, 검증, 에러 매핑, rollback 같은 처리 흐름이 두 핸들러에 거의 그대로 복사돼
  있으면 공통 함수로 추출하고, 서로 다른 부분(호출할 도메인 함수 등)만 인자로 받는다

```typescript
// ❌ 상태 코드와 메시지를 같은 조건으로 두 번 판단
export async function PATCH(req: Request) {
  try {
    return NextResponse.json(await updateNote(req));
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof ForbiddenError ? '권한이 없습니다' : '처리에 실패했습니다' },
      { status: error instanceof ForbiddenError ? 403 : 500 },
    );
  }
}

// ✅ 에러 → 응답 매핑을 하나의 함수로 모은다
function mapErrorToResponse(error: unknown) {
  if (error instanceof ForbiddenError) return { status: 403, message: '권한이 없습니다' };
  return { status: 500, message: '처리에 실패했습니다' };
}

export async function PATCH(req: Request) {
  try {
    return NextResponse.json(await updateNote(req));
  } catch (error) {
    const { status, message } = mapErrorToResponse(error);
    return NextResponse.json({ message }, { status });
  }
}
```

```typescript
// ❌ 파싱, 업로드, 실패 시 rollback까지 다른 핸들러에 거의 그대로 복사됨
export async function POST(req: Request) {
  const uploaded = await uploadAttachments(await req.formData());
  try {
    return NextResponse.json(await sendMessage(uploaded));
  } catch (error) {
    await removeAttachmentFiles(uploaded);
    throw error;
  }
}

export async function POST_AS_CLIENT(req: Request) {
  const uploaded = await uploadAttachments(await req.formData());
  try {
    return NextResponse.json(await sendMessageAsClient(uploaded));
  } catch (error) {
    await removeAttachmentFiles(uploaded);
    throw error;
  }
}

// ✅ 차이(호출할 도메인 함수)만 인자로 받고 나머지 흐름은 공유한다
async function handleSendMessage(req: Request, send: (uploaded: Uploaded[]) => Promise<Message>) {
  const uploaded = await uploadAttachments(await req.formData());
  try {
    return NextResponse.json(await send(uploaded));
  } catch (error) {
    await removeAttachmentFiles(uploaded);
    throw error;
  }
}

export const POST = (req: Request) => handleSendMessage(req, sendMessage);
export const POST_AS_CLIENT = (req: Request) => handleSendMessage(req, sendMessageAsClient);
```

### 여러 단계로 나뉜 쓰기 작업은 실패 시 전체를 되돌린다

한 요청이 테이블 여러 개에 걸쳐 순서대로 쓰기 작업을 하면, 중간 단계가 실패했을 때 이미
쓰인 앞 단계를 그대로 두지 않는다. 트랜잭션/RPC로 전체를 하나의 단위로 묶거나, 그게
불가능하면 모든 단계에 대해 일관되게 보상 처리(rollback)를 건다. 첫 단계만 rollback을
걸고 이후 단계는 실패해도 그냥 넘어가면, 일부만 쓰인 상태가 성공으로 보고된다.

```typescript
// ❌ 첫 단계만 실패 시 되돌리고, 이후 단계는 실패해도 그대로 넘어간다
const user = await createAuthUser(input);
try {
  await createProfile(user.id, input);
} catch (error) {
  await deleteAuthUser(user.id); // 여기만 보상 처리
  throw error;
}
await linkClientRecord(user.id); // 실패해도 아무도 되돌리지 않는다
await markInvitationAccepted(input.invitationId); // 여기도 마찬가지

// ✅ 트랜잭션/RPC로 전체를 하나의 단위로 묶는다
await db.rpc('accept_invitation', { input });
```

### 가드와 인가

영역 가드는 layout이 하고, 리소스 가드는 domain이 한다. API는 반드시 인가한다.
`redirect("/login")`를 페이지마다 하드코딩하지 않는다. 포털마다 같은 화면 파일을 복제하지
않는다.

```tsx
// ❌ 페이지가 로그인 경로를 하드코딩한다
if (!profile) redirect("/login");

// ✅ 영역 가드는 공유 layout/가드 함수가 한다
const profile = await requireSession();
```

### API 에러 코드와 문구

API는 기계가 읽는 에러 코드를 반환한다. 사용자 문구는 UI가 `t()`로 만든다.

```ts
// ❌ API가 사용자 문구를 만든다
return NextResponse.json({ message: "권한이 없습니다" }, { status: 403 });

// ✅ API는 코드, UI는 t()
return NextResponse.json({ code: "forbidden" }, { status: 403 });
setError(t(`error.${result.code}`));
```

### 요청 값은 스키마로 파싱한다

`searchParams`와 요청 본문은 스키마로 파싱한다. `as T`로 단언하지 않는다.

```ts
// ❌
const view = searchParams.view as View;

// ✅
const parsed = viewSchema.safeParse(searchParams);
if (!parsed.success) return notFound();
```

### 사용자 범위는 세션과 RLS가 기본이다

사용자 범위 조회/쓰기는 세션 클라이언트와 RLS가 기본이다. service-role은 예외다.
페이지나 라우트에서 service-role 클라이언트를 직접 부르지 않는다.

---

## 8. 접근성 원칙

먼저 디자인 시스템 SSOT를 확인하고, 없으면 W3C "Using ARIA" 4가지 규칙을 따른다. 위반 시
코드 리뷰를 통과하지 못한다.

접근성은 호출부가 primitive에 label을 채우는 일이 아니다. 의미가 생기는 계층에서 보장한다.
`NameTextForm`이 그 지점이면 label/aria는 그 안에 둔다.

### 0th Rule — 디자인 시스템 SSOT 우선

native 요소를 검토하기 전에, 이 UI 패턴에 대해 프로젝트 디자인 시스템에 이미 SSOT(Single
Source of Truth) 컴포넌트가 있는지 먼저 확인한다. 있으면 그 컴포넌트를 재사용하고, 없을
때만 1st Rule(native 우선)로 넘어간다.

checkbox와 dropdown은 디자인 일관성 문제로 이 규칙의 대표 예외 대상이다.
- `<input type="checkbox">`를 화면 코드에 직접 노출하지 않는다. 프로젝트 Checkbox SSOT로
  교체한다. SSOT 내부 구현이 네이티브 checkbox를 감싸는 건 허용한다.
- `<select>`는 원칙적으로 사용하지 않는다. 브라우저마다 렌더링이 다르고 커스터마이징이
  어렵다. 커스텀 Dropdown(listbox/combobox ARIA 패턴)으로 대체하되, native `<select>`와
  동등한 키보드 조작, 포커스 관리, accessible name은 그대로 보장한다.

```tsx
// ❌ SSOT 확인 없이 native를 화면에 직접 사용
<input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
<select value={status} onChange={(e) => setStatus(e.target.value)}>...</select>

// ✅ 프로젝트 SSOT 컴포넌트 재사용
<Checkbox checked={agreed} onChange={setAgreed} label="약관에 동의합니다" />
<Dropdown value={status} onChange={setStatus} options={statusOptions} />
```

### 1st Rule — native 요소 우선

native HTML 요소로 의미와 동작을 표현할 수 있다면 ARIA를 쓰지 않는다.

```tsx
// ❌
<div role="list"><div role="listitem">...</div></div>
<div role="dialog">...</div>

// ✅
<ul><li>...</li></ul>
<dialog open>...</dialog>
```

예외: native 요소를 쓸 수 없는 경우에만 ARIA를 허용한다.
- `<button>` 안에 `<a>` 또는 `<button>`이 중첩될 때 → `<div role="button">`
- 동적 SVG 인라인 삽입처럼 native 요소가 없을 때 → `<span role="img">`

### 2nd Rule — native 의미를 덮어쓰지 않는다

```tsx
// ❌
<h2 role="tab">탭 제목</h2>

// ✅
<div role="tab"><h2>탭 제목</h2></div>
```

### 3rd Rule — interactive ARIA 컨트롤은 키보드로 조작 가능해야 한다

`role="button"` 등 interactive role이 있는 요소는 반드시:
- `tabIndex={0}` 으로 포커스 가능
- `onKeyDown`에서 Enter/Space 처리

```tsx
// ❌
<div role="button" onClick={handleClick}>클릭</div>

// ✅
<div role="button" tabIndex={0} onClick={handleClick} onKeyDown={handleKeyDown}>클릭</div>
```

### 4th Rule — focusable 요소에 aria-hidden 금지

```tsx
// ❌
<button aria-hidden="true">클릭</button>

// ✅ (포커스 불가 상태일 때만)
<button tabIndex={-1} aria-hidden="true">클릭</button>
```

---

## 9. 데이터 설계 원칙

### 핵심: "UI 로직을 데이터로 표현한다"

```typescript
// ❌
if (type === 'special') { ... }

// ✅
if (item.isSpecial) { ... }
```

### 예외 처리 방식

예외가 생기면:
- 코드 분기 추가 ❌
- 데이터 구조 수정 ⭕

```typescript
// ✅
{
  type: 'project',
  status: 'deprecated'
}
```

**금지**: 범용 규칙에 프로젝트 특화 로직 포함

---

## 10. Prova 언어 확장 규칙

### 10.1 언어 비교는 `is()` 유틸리티를 사용한다

**위치**: `src/lib/language.ts`

```typescript
import { lang } from "@/lib/language";

// ✅
if (lang(language).js)   { ... }
if (lang(language).py)   { ... }
if (lang(language).java) { ... }

// ❌ 문자열 리터럴 직접 비교
if (language === "javascript") { ... }
if (language === "python")     { ... }
```

이유:
- 언어 식별자 오타를 컴파일 타임에 잡을 수 있다
- 새 언어를 추가할 때 `is()` 반환 객체 한 곳만 수정하면 타입 에러로 누락을 탐지한다

적용 범위: `.ts`, `.tsx` 파일 전체. 단, `src/lib/language.ts` 내부 구현 코드는 예외.

### 10.2 언어 분기는 `switch`로 작성한다

언어별로 다른 로직을 실행해야 할 때, `if / else if` 체인 대신 `switch (language)`를 사용한다.

```typescript
// ✅
switch (language) {
  case "javascript":
    break;
  case "java":
    break;
  default:
    // Python
}

// ❌
if (language === "javascript") { ... }
else if (language === "java")  { ... }
else { ... }
```

예외: 단일 조건 체크(`if (lang(language).js) return ...`)는 단문 `if`로 작성해도 무방하다.

### 10.3 새 언어 추가 시 체크리스트

| 파일 | 확인 내용 |
|---|---|
| `src/lib/language.ts` | `is()` 반환 객체에 새 키 추가 |
| `src/features/execution/runtime.ts` | `switch (this.language)` 케이스 추가 |
| `app/page.tsx` | `isRuntimeNoiseVar`, `collectUserDeclaredSymbols` switch 케이스 추가 |
| `app/api/analyze/route.ts` | `langLabel`, `langSpecificHints` switch 케이스 추가, fallback 패턴 추가 |

---

## 11. 최종 체크리스트

코드 작성 전 반드시 확인:

**구조**
- [ ] 읽는 사람이 이해 가능한가?
- [ ] 불필요한 분기가 있는가?
- [ ] 매직 넘버가 있는가?
- [ ] 중첩 조건이 있는가?
- [ ] 로직이 JSX 안에 있는가?
- [ ] JSX에 `onClick={() => ...}` 인라인 핸들러가 있는가? `map`도 예외가 아니다
- [ ] 들여쓰기 포함 100자가 넘는 줄을 그대로 두는가?
- [ ] `FormEvent`를 쓰는가? `onSubmit`은 `SubmitEvent<HTMLFormElement>`다
- [ ] `try` 안에 create/update 분기가 섞여 있는가?
- [ ] 컴포넌트가 너무 큰가?
- [ ] Server Component에 가드, 파라미터 파싱, fetch, 파생 계산, 렌더링이 한 함수에 몰려 있는가?
- [ ] 같은 조건으로 여러 값을 반환하는 삼항 체인이 여러 곳에 반복되는가?
- [ ] 변환 규칙이 거의 같은 항목을 JSX prop 안에 손으로 여러 개 나열하는가?
- [ ] 컴포넌트 본문에 `fetch`가 직접 있는가?
- [ ] 부수효과 없는 표현식 구문이 남아 있는가?
- [ ] effect가 여러 역할을 하는가?
- [ ] 불필요한 최적화가 있는가?
- [ ] 데이터로 표현 가능한 로직을 코드로 처리하고 있지 않은가?

**Hook / Store**
- [ ] 서로 무관한 기능이 한 훅에 섞여 있는가?
- [ ] 훅 이름이 기본 훅(범용)인지 기능 훅(도메인 전담)인지 이름만으로 구분되는가?
- [ ] 컴포넌트가 Store에서 값을 꺼내 다른 훅에 파라미터로 다시 주입하는가?
- [ ] 기능 훅이 Store API를 행위 단위로 변환하지 않고 그대로 재노출하는가?
- [ ] 기능 훅에 `onSuccess`/`onError` 콜백을 주입해 컴포넌트의 UI 동작을 훅 안에서 실행시키는가?
- [ ] Store API에 `checkout`, `applyCoupon` 같은 다단계 도메인 행위가 들어가 있는가?
- [ ] 기능 훅과 Store의 반환 형태가 프로젝트 안에서 서로 다른가?
- [ ] 훅 반환값에 Store 원시 API와 변환된 도메인 action이 함께 섞여 있는가?
- [ ] 훅, 컴포넌트, Store의 param과 return이 실제로 필요한 것만 남아 있는가?

**스타일링**
- [ ] JSX `style` prop에 CSS 속성값이 직접 들어가 있지 않은가? (CSS 변수만 허용)
- [ ] `buildCls`를 JSX 속성에 인라인으로 쓰지 않고 변수로 추출했는가?
- [ ] `buildCls` 인자가 하나뿐이라면 `styles.xxx`를 직접 사용했는가?
- [ ] 커스텀 컴포넌트에 `className`·`style` prop이 없는가?
- [ ] JSX 안에 인라인 `<svg>`가 없는가?

**컴포넌트 설계**
- [ ] variant/size를 임의 값이 아닌 타입으로 제한했는가?
- [ ] variant가 여러 개라면 Base + Named Export 패턴을 적용했는가?
- [ ] 폼 필드를 `TextField` + `label={t("name")}`로 조립하지 않고 `NameTextForm`처럼 의미 단위로 닫았는가?
- [ ] `feature`/`page` JSX가 `TextField`/`ChipButton` 같은 interactive primitive를 직접 쓰는가?
- [ ] 컴포넌트 타입은 `type.ts`에 분리했는가?
- [ ] prop 중 한 값으로 다른 값을 유추할 수 있는 중복 prop이 없는가?
- [ ] Props를 함수 시그니처에 인라인 객체 타입 리터럴로 받지 않고 이름 있는 타입으로 정의했는가?

**정리**
- [ ] 사용하지 않는 import·export가 없는가?
- [ ] 구조분해에서 실제로 쓰이지 않는 항목이 없는가?
- [ ] 빈 파일이 남아 있지 않은가?
- [ ] 날짜/숫자 포맷 같은 범용 유틸리티가 `utils/` 대신 파일마다 인라인으로 반복되는가?
- [ ] 유틸 성격이 짙은 순수 변환을 한 곳이라고 인라인에 남겨 두는가?
- [ ] persist/권한을 `utils/`에 넣었는가?
- [ ] `utils/`에 이미 있는 함수를 로컬로 재구현하면서 로케일 같은 값을 하드코딩하는가?

**에러 처리**
- [ ] 요청 실패 처리(파싱, 에러 매핑)가 여러 호출부에 중복되어 있는가?
- [ ] 여러 라우트 핸들러가 같은 에러 조건을 상태 코드용, 메시지용으로 각자 반복 판단하는가?
- [ ] 파싱, 검증, 에러 매핑, rollback 흐름이 두 핸들러에 거의 그대로 복사돼 있는가?
- [ ] 다단계 쓰기 작업에서 일부 단계만 실패 시 되돌리고 나머지는 그냥 넘어가는가?
- [ ] API가 사용자 문구를 만들고 UI `t()`를 건너뛰는가?
- [ ] `searchParams`나 본문을 `as T`로 단언하는가?
- [ ] 영역 가드를 페이지마다 `redirect("/login")`로 하드코딩하는가?
- [ ] 페이지/라우트가 service-role 클라이언트를 직접 부르는가?
- [ ] 포털마다 같은 화면 파일을 복제하는가?

**성능/DB**
- [ ] 반복문 안에서 항목 개수만큼 DB 호출이 발생하는가(N+1)?

**접근성**
- [ ] 의미가 생기는 계층이 아니라 호출부가 primitive에 label을 채우는가?
- [ ] 디자인 시스템에 SSOT 컴포넌트가 있는데 native를 직접 쓰고 있는가?
- [ ] `<input type="checkbox">`, `<select>`를 화면 코드에 직접 사용하고 있는가?
- [ ] native HTML 요소로 대체 가능한 ARIA role이 없는가?
- [ ] interactive role에 `tabIndex`와 `onKeyDown`이 있는가?
- [ ] focusable 요소에 `aria-hidden`이 붙어 있지 않은가?

---

## 개정 이력

| 날짜 | 내용 |
|---|---|
| 2026-08-17 | 확장성 우선·1인 작품 철학(§0), 유틸 성격이면 한 곳이어도 분리(2.5), 한 줄/printWidth 100, handleXxx, FormEvent 금지, try는 persist 하나, 가드/인가/RLS/스키마 파싱, a11y는 의미 계층에서 보장 |
| 2026-08-17 | index→action→철학→component.md 라우팅을 닫음. `frontend-form-meaning-unit`과 `mustHold`를 인덱스에 넣고, 폼/화면 작업에서 component-layers 의미 단위 섹션을 필수로 읽게 함 |
| 2026-08-17 | JSX prop 안에 손으로 나열된 유사 항목을 설정 배열로 전환하는 규칙(1.5) 추가, utils/ 재사용 전 기존 함수 확인과 로케일 하드코딩 금지 규칙(2.5) 추가, Server Component 로더 분리 기준에 복잡한 페이지 한정 caveat과 가드 참조값 공유 규칙 추가, i18n 문서에 번역/하드코딩 혼용 금지 규칙 추가 |
| 2026-08-17 | Server Component는 훅 대신 페이지 전용 로더 함수로 가드/파싱/fetch/파생 계산을 분리하는 규칙 추가, 같은 조건의 반복 삼항 체인을 lookup 객체로 모으는 규칙(1.1) 추가 |
| 2026-08-17 | `references/{ko,en}/core/code-hygiene.md`가 utils/ 규칙만 남고 기존 import 정리/fallback 금지 규칙이 누락됐던 걸 복구, Hook/Store 예시를 장바구니로 통일, 추상화 수준 구분(Store=상태 변경/Domain=사용자 행위)과 목적별 좁은 훅 허용 규칙 추가, 문서 구조 정합성(고아 bullet, 체크리스트/개정 이력 누락) 정리 |
| 2026-08-17 | Props 이름 있는 타입 규칙(5.6) 추가, param/return 최소주의를 훅, 컴포넌트, Store 전체로 확장, 기능 훅/Store 반환 형태 일관성 규칙 추가 |
| 2026-08-17 | 훅 단일 책임 기준을 도메인 단위로 재정의(기술적 동작 개수 기준 폐기), Store/도메인 훅/컴포넌트 계층 원칙과 wiring, 콜백 위탁 안티패턴 추가 |
| 2026-08-16 | utils/ 분리 규칙(2.5)에 조기 추출 금지(2곳 이상에서 필요할 때만 추출) caveat 추가 |
| 2026-08-16 | 코드 정리 원칙에 범용 유틸리티 utils/ 분리 규칙(2.5) 추가 |
| 2026-08-16 | 핵심 철학에 복잡성 은닉 원칙 추가, 에러 처리 예시를 도메인 함수 은닉 단계까지 확장 |
| 2026-08-16 | 접근성 원칙에 디자인 시스템 SSOT 우선(0th Rule) 추가, checkbox/select native 사용 금지 규칙 추가 |
| 2026-08-16 | 에러 처리 규칙에 요청/실패 처리 client 통합 원칙 추가 |
| 2026-08-16 | 컴포넌트/모듈 크기 규칙에 fetch, 파생 validation 분리 기준 추가, no-op statement 제거 규칙 추가 |
| 2026-04-17 | 제어문 블록 스타일 규칙 추가 (`else/else if/finally` 개행, `catch {}` 금지) |
| 2026-04-11 | 언어 비교 규칙 (`is()` 유틸, `switch`) 초안 작성 |
| 2026-04-11 | 핵심 철학·코드 구조·네이밍·접근성·데이터 설계 등 전체 규칙 추가 |
