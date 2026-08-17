# 코드 스타일

## 규칙
- 중첩 조건은 early return으로 평탄화한다.
- enum/type 분기는 switch를 사용한다.
- 같은 열거형 조건으로 여러 값을 반환하는 삼항 체인이 여러 곳에 반복되면 lookup 객체로 모은다.
- 블록 내 statement가 1개면 한 줄 압축 형태를 사용한다. 모든 코드(JSX 포함)는 한 줄이 가능하면 한 줄로 둔다. 들여쓰기 포함 100자 이상이면 줄바꿈한다. 포맷터 `printWidth`도 100이다.
- `handleXxx`는 컴포넌트 본문에 둔다. JSX에는 참조만 연결한다. `onClick={() => ...}`는 `map`이어도 금지다. 항목이 필요하면 행 컴포넌트를 닫는다.
- `onSubmit`은 `SubmitEvent<HTMLFormElement>`다. `FormEvent`는 쓰지 않는다. `try`는 persist 하나다. `catch`는 매핑만 한다.
- 타입 판별은 `is` 패키지를 사용한다. (`npm install is`)

## Do
- 모든 스택에서 제어 흐름 스타일을 통일한다.
- 런타임 타입 체크는 `is` 유틸로 통일한다.

## Don't
- 멀티라인과 압축 패턴을 무작위로 섞지 않는다.

## Do 예시
```ts
import is from "is";

if (ok) run();
else fallback();

if (!is.string(payload.id)) {
  throw new Error("invalid_id");
}

function handleSubmit(value: string | null) {
  if (value) return save(value);
}

for (const item of items) {
  if (!item.enabled) continue;
  process(item);
}

switch (kind) {
  case "ping": break;
  default: break;
}

try { execute(); }
catch { recover(); }
```

```ts
// ✅ view를 키로 하는 lookup 객체 하나로 모은다
const VIEW_STRATEGY: Record<View, { days: DaysFn; range: RangeFn; shift: ShiftFn }> = {
  month: { days: getMonthDays, range: getMonthRange, shift: shiftMonth },
  day: { days: (anchor) => [anchor], range: getDayRange, shift: shiftDay },
  week: { days: getWeekDays, range: getWeekRange, shift: shiftWeek },
};
const { days, range, shift } = VIEW_STRATEGY[view];
```

## Don't 예시
```ts
if (ok) {
  run();
}
else {
  fallback();
}

function handleSubmit(value: string | null) {
  if (value) {
    save(value);
  }
  else {
    doSomething();
  }
}

function handleSubmit(value: string | null) {
  if (!value) return;
  save(value);
}

for (const item of items) {
  if (item.enabled) {
    process(item);
  }
}

if (kind === "ping") {
  ping();
}
if (kind === "pong") {
  pong();
}

const days = view === "month" ? getMonthDays() : view === "day" ? [anchor] : getWeekDays();
const range = view === "month" ? getMonthRange() : view === "day" ? getDayRange() : getWeekRange();
const shift = view === "month" ? shiftMonth : view === "day" ? shiftDay : shiftWeek;
```

## 경계
- 이 규칙은 프론트엔드/백엔드 전 계층에 공통 적용한다.
- 아키텍처 책임 분리는 각 스택 문서(`backend/*`, `frontend/stacks/*`)에서 정의한다.

## 테스트 범위
- 스타일 규칙을 린트로 검증한다.
- 대표 제어 흐름 샘플을 리뷰한다.
