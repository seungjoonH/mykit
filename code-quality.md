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

### 복잡성은 은닉하고, 실사용 API는 간단하게

호출부는 구현 방식이 아니라 의도만 알면 된다. URL, method, header, 에러 코드 매핑, 재시도
같은 세부사항은 그 기능을 제공하는 모듈 안에 완전히 가두고, 밖으로는 도메인 의미를 가진
함수나 컴포넌트 API만 노출한다.

```typescript
// ❌ 호출부가 transport 세부사항을 그대로 알아야 한다
await request(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

// ✅ 호출부는 의도만 남는다
await UserService.update(id, data);
```

컴포넌트도 예외가 아니다. 내부에 생기는 복잡한 로직은 로직 종류별로 각각 별도의 훅(`use*`)
으로 분리하고, 컴포넌트 자체는 항상 가벼운 형태를 유지한다. 여러 로직을 훅 하나에 몰아넣지
않는다. 가장 바깥에서 쓰이는 API나 컴포넌트일수록 표면은 더 간단해야 한다.

```tsx
// ❌ 폼 상태, validation, 요청 로직이 컴포넌트 하나에 몰려 있다
function OrderEditForm() {
  const [formData, setFormData] = useState(initialData);
  const isDisabled = !formData.title.trim();
  const handleSubmit = () => OrderService.update(formData);
  return <form onSubmit={handleSubmit}>...</form>;
}

// ✅ 로직 종류별로 별도 훅으로 분리하고, 컴포넌트는 가벼운 형태만 유지한다
function useOrderFormState(initialData: OrderData) { /* formData, setFormData */ }
function useOrderValidation(formData: OrderData) { /* isDisabled */ }
function useOrderSubmit(formData: OrderData) { /* handleSubmit */ }

function OrderEditForm() {
  const { formData, setFormData } = useOrderFormState(initialData);
  const { isDisabled } = useOrderValidation(formData);
  const { handleSubmit } = useOrderSubmit(formData);
  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## 1. 코드 구조 원칙

### 1.1 조건 분기

**규칙**
- 열거형/타입 기반 분기는 `switch` 사용
- 중첩 조건은 early return으로 평탄화

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
- 한 줄이면 한 줄로 작성
- 하나의 함수는 하나의 책임만

```typescript
// ✅
const close = () => setOpen(false);
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

```tsx
// ❌
{(() => compute())()}

// ✅
const result = compute();
```

### 1.6 반복/변환

**규칙**
- `map` / `filter` 우선 사용
- 성능상 필요할 때만 `for` 사용

### 1.7 컴포넌트/모듈 크기

컴포넌트는 항상 가벼운 형태를 유지한다. 서로 다른 종류의 로직은 하나의 훅에 몰아넣지 않고
로직별로 각각 분리한다.

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
- 도메인과 무관한 순수 함수는 `utils/`에 두고 재사용한다
- 같은 유틸리티 로직을 파일마다 인라인으로 다시 구현하지 않는다
- 아직 한 곳에서만 쓰는 로직을 예측만으로 미리 `utils/`로 빼지 않는다. 실제로 2곳 이상에서
  필요해졌을 때 추출한다

```typescript
// ❌ 한 곳에서만 쓰는데 미리 utils/로 추출
// utils/formatOrderTitle.ts
export function formatOrderTitle(order: Order) {
  return `#${order.id} ${order.title}`;
}

// ✅ 두 번째로 필요해진 시점에 추출한다. 그 전까지는 인라인으로 둔다
const title = `#${order.id} ${order.title}`;
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

`handleXxx` 사용

```
handleClick
handleSubmit
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
`public/` 디렉토리에 `.svg` 파일로 저장하고 `<img>`로 사용한다.

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
variant가 고정된 Named Export를 외부에 제공한다.

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

### 5.5 타입 정의 파일 분리

컴포넌트의 타입은 같은 디렉토리의 `type.ts`에 분리한다.

```
components/
└── resultBadge/
    ├── ResultBadge.tsx
    ├── resultBadge.module.css
    └── type.ts
```

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

---

## 8. 접근성 원칙

먼저 디자인 시스템 SSOT를 확인하고, 없으면 W3C "Using ARIA" 4가지 규칙을 따른다. 위반 시
코드 리뷰를 통과하지 못한다.

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
- [ ] 컴포넌트가 너무 큰가?
- [ ] 컴포넌트 본문에 `fetch`가 직접 있는가?
- [ ] 부수효과 없는 표현식 구문이 남아 있는가?
- [ ] effect가 여러 역할을 하는가?
- [ ] 불필요한 최적화가 있는가?
- [ ] 데이터로 표현 가능한 로직을 코드로 처리하고 있지 않은가?

**스타일링**
- [ ] JSX `style` prop에 CSS 속성값이 직접 들어가 있지 않은가? (CSS 변수만 허용)
- [ ] `buildCls`를 JSX 속성에 인라인으로 쓰지 않고 변수로 추출했는가?
- [ ] `buildCls` 인자가 하나뿐이라면 `styles.xxx`를 직접 사용했는가?
- [ ] 커스텀 컴포넌트에 `className`·`style` prop이 없는가?
- [ ] JSX 안에 인라인 `<svg>`가 없는가?

**컴포넌트 설계**
- [ ] variant/size를 임의 값이 아닌 타입으로 제한했는가?
- [ ] variant가 여러 개라면 Base + Named Export 패턴을 적용했는가?
- [ ] 컴포넌트 타입은 `type.ts`에 분리했는가?
- [ ] prop 중 한 값으로 다른 값을 유추할 수 있는 중복 prop이 없는가?

**정리**
- [ ] 사용하지 않는 import·export가 없는가?
- [ ] 구조분해에서 실제로 쓰이지 않는 항목이 없는가?
- [ ] 빈 파일이 남아 있지 않은가?
- [ ] 날짜/숫자 포맷 같은 범용 유틸리티가 `utils/` 대신 파일마다 인라인으로 반복되는가?

**에러 처리**
- [ ] 요청 실패 처리(파싱, 에러 매핑)가 여러 호출부에 중복되어 있는가?

**접근성**
- [ ] 디자인 시스템에 SSOT 컴포넌트가 있는데 native를 직접 쓰고 있는가?
- [ ] `<input type="checkbox">`, `<select>`를 화면 코드에 직접 사용하고 있는가?
- [ ] native HTML 요소로 대체 가능한 ARIA role이 없는가?
- [ ] interactive role에 `tabIndex`와 `onKeyDown`이 있는가?
- [ ] focusable 요소에 `aria-hidden`이 붙어 있지 않은가?

---

## 개정 이력

| 날짜 | 내용 |
|---|---|
| 2026-08-16 | utils/ 분리 규칙(2.5)에 조기 추출 금지(2곳 이상에서 필요할 때만 추출) caveat 추가 |
| 2026-08-16 | 코드 정리 원칙에 범용 유틸리티 utils/ 분리 규칙(2.5) 추가 |
| 2026-08-16 | 핵심 철학에 복잡성 은닉 원칙 추가, 에러 처리 예시를 도메인 함수 은닉 단계까지 확장 |
| 2026-08-16 | 접근성 원칙에 디자인 시스템 SSOT 우선(0th Rule) 추가, checkbox/select native 사용 금지 규칙 추가 |
| 2026-08-16 | 에러 처리 규칙에 요청/실패 처리 client 통합 원칙 추가 |
| 2026-08-16 | 컴포넌트/모듈 크기 규칙에 fetch, 파생 validation 분리 기준 추가, no-op statement 제거 규칙 추가 |
| 2026-04-17 | 제어문 블록 스타일 규칙 추가 (`else/else if/finally` 개행, `catch {}` 금지) |
| 2026-04-11 | 언어 비교 규칙 (`is()` 유틸, `switch`) 초안 작성 |
| 2026-04-11 | 핵심 철학·코드 구조·네이밍·접근성·데이터 설계 등 전체 규칙 추가 |
