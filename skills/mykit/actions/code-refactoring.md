# Code Refactoring

기존 코드를 mykit 구조/설계 원칙 기준으로 감사하고, 구조적으로 고칠 때 사용한다. formatter/
linter가 못 잡는 흐름 압축이 아니라 컴포넌트/훅 경계, 데이터 요청 계층, 디자인 시스템 SSOT,
컴포넌트 API 설계, 데이터 설계처럼 아키텍처 수준의 문제를 본다.

단일 statement block 압축, guard clause 정리, JSX 밖 계산 추출처럼 좁고 되돌리기 쉬운 스타일
문제만 있으면 `review-code-style.md`로 라우팅한다. 새 컴포넌트/화면을 만드는 작업이면
`add-component.md`/`build-screen.md`로 라우팅한다.

## Project Scan

- `code-quality.md`(있으면 프로젝트의 `playbook/`)의 기존 규칙.
- 프로젝트 디자인 시스템에 이미 존재하는 SSOT 컴포넌트 목록(Checkbox, Dropdown, Modal, Button 등).
- 기존 custom hook과 공용 client/service 모듈(fetch를 감싸는 layer가 있는지).
- 대상 파일과 가까운 call site, 동일 패턴이 반복되는 다른 파일.
- 기존 컴포넌트 계층 관례: `references/philosophy/component-layers.md`.
- 접근성 관례: `references/philosophy/accessibility.md`.

## Confirmation Policy

이 action의 대상 자체가 구조 변경(함수/hook 추출, public API 변경, 컴포넌트 계층 이동, 파일
분리, native → SSOT 교체)이라 대부분 확인을 받는다. `review-code-style.md`처럼 즉시 고칠 수
있는 항목은 거의 없다고 가정한다.

바로 고칠 수 있는 항목.

- 부수효과 없는 표현식 구문(no-op statement) 제거.
- 명백한 dead import/export 제거.

확인받고 고칠 항목.

- 컴포넌트 본문의 `fetch`를 공용 client 모듈 또는 hook으로 추출.
- 파생 상태/validation을 custom hook으로 추출.
- 호출부마다 반복되는 요청 실패 처리를 하나의 client로 통합.
- native `<input type="checkbox">`/`<select>`를 프로젝트 SSOT 컴포넌트로 교체.
- 컴포넌트 API(중복 prop, variant 타입, Base + Named Export 패턴, `type.ts` 분리) 변경.
- if/switch 분기를 데이터 구조로 전환.
- 파일 분리, 컴포넌트 계층 이동(component → hook, feature → composed 등).

## Confirmation Prompt

```text
mykit 리팩토링 기준으로 보면 후보는 3개입니다.

구조 변경 — 확인 필요.
OrderEditForm이 useState 8개 + fetch 4개를 컴포넌트 본문에 갖고 있습니다.
useOrderEditForm 훅으로 상태·요청 로직을 옮기고, 컴포넌트는 렌더링만 남기는 걸 제안합니다.

구조 변경 — 확인 필요.
ProfileSettingsPanel 안의 fetch 3곳이 각자 try/catch와 에러 매핑을 반복합니다.
공용 client 모듈(request<T>)로 통합하는 걸 제안합니다.

디자인 시스템 — 확인 필요.
AgreementSection이 <input type="checkbox">를 직접 쓰고 있는데, 프로젝트에 Checkbox SSOT가 있습니다.
Checkbox로 교체하는 걸 제안합니다.

바로 고칠 수 있는 항목.
OrderEditForm 43번째 줄의 `initialData.isUrgent;`는 아무 효과 없는 표현식입니다. 바로 제거하겠습니다.

어떻게 진행할까요?
- 전체 후보 적용.
- 항목별로 선택.
- 리뷰만 하고 멈추기.
```

## Review Checklist

### 0. 디자인 시스템 SSOT 우선

- 이 UI 패턴(checkbox, dropdown, radio, toggle, date picker 등)에 대해 프로젝트에 이미 SSOT
  컴포넌트가 있는데 native를 직접 쓰고 있는가.
- `<input type="checkbox">`를 화면 코드에 직접 노출하고 있는가.
- `<select>`를 화면 코드에 직접 쓰고 있는가.

### 1. 컴포넌트/훅 경계

- Page(라우트 데이터·구성) / Component(렌더링·로컬 상호작용) / Hook(재사용 상태 로직) 책임이
  실제로 분리돼 있는가.
- 컴포넌트 본문에 `fetch`가 직접 있는가.
- 파생 상태(validation, 계산값)가 2개 이상인데 훅으로 안 빠졌는가.
- 상태·사이드이펙트·핸들러·UI 블록이 한 컴포넌트에 과도하게 몰려 있는가.

### 2. 데이터 요청 계층

- fetch + 실패 처리(파싱, 에러 매핑)가 공용 client 모듈을 통과하는가.
- 호출부마다 `try/catch`, 응답 파싱, 에러 코드 매핑을 반복 구현하는가.

### 3. 컴포넌트 API 설계

- 한 값으로 유추 가능한 중복 prop이 있는가.
- variant/size가 임의 문자열이 아니라 타입으로 제한돼 있는가.
- variant가 여러 개인데 Base + Named Export 패턴이 안 쓰였는가.
- 타입이 컴포넌트 파일에 섞여 있고 `type.ts`로 분리 안 됐는가.

### 4. 데이터 설계 원칙

- `if (type === 'special')` 같은 분기가 `item.isSpecial`처럼 데이터로 표현 가능한가.

### 5. 사이드 이펙트

- 하나의 `useEffect`가 여러 책임을 동시에 하는가.

### 6. 정리/중복

- 같은 키를 공유하는 데이터가 여러 객체로 흩어져 있는가.
- 부수효과 없는 표현식 구문(no-op statement)이 남아 있는가.

### 7. 성능

- 비용 측정 없이 걸린 `useMemo`/`useCallback`이 있는가.

## Execution

1. `code-quality.md`(또는 프로젝트 `playbook/`) 규칙과 디자인 시스템 SSOT 목록을 먼저 확인한다.
2. 대상 파일과 동일 패턴이 반복되는 다른 파일을 함께 읽는다.
3. 후보를 `바로 고칠 수 있음`, `확인 필요`로 나눈다.
4. 확인 필요 항목은 Confirmation Prompt로 사용자 승인을 받는다.
5. 승인된 범위만 수정한다. 승인 없이 hook 분리, API 변경, 파일 분리를 진행하지 않는다.
6. 관련 lint/typecheck/test 중 가장 작은 검증을 실행한다.
