# Audit Hygiene

기존 코드의 데이터 설계, 사이드이펙트, 정리/중복, 성능 위생을 감사하고 구조적으로 고칠
때 사용한다. 언어나 스택에 무관하게 적용된다. 이 4가지를 하나의 action으로 묶는 이유는
각각 항목 수가 적어서 따로 만들면 과도하게 잘게 쪼개진 코드 위생 점검이 되기 때문이다.
컴포넌트/훅 경계는 `audit-hooks.md`로 라우팅한다.

대상이 파일 경로처럼 구체적으로 지칭돼 있으면 바로 Project Scan으로 넘어간다. 대상이
없으면 "어떤 파일/디렉터리를 볼까요?"만 짧게 묻는다. 저장소 전체를 훑어야 하면 아래
키워드로 후보를 먼저 좁힌다.

- `useMemo(`, `useCallback(`
- `.toLocaleDateString(`, `.toFixed(`, `Intl.NumberFormat` 같은 날짜/숫자 포맷 inline 패턴
- 한 파일에 `useEffect(`가 여러 번

## Project Scan

- `code-quality.md`(있으면 프로젝트의 `playbook/`)의 기존 규칙.
- 프로젝트의 `utils/` 디렉터리 구조와 기존 유틸리티 목록.
- 대상 파일과 가까운 call site, 동일 패턴이 반복되는 다른 파일.

## Confirmation Policy

바로 고칠 수 있는 항목.

- 부수효과 없는 표현식 구문(no-op statement) 제거.
- 같은 키를 공유하는 데이터를 하나의 객체로 통합.

확인받고 고칠 항목.

- if/switch 분기를 데이터 구조로 전환.
- 하나의 `useEffect`가 여러 책임을 하면 분리.
- 날짜/숫자 포맷 같은 범용 유틸리티를 `utils/`로 추출(실제로 2곳 이상에서 쓰일 때만).
- 측정 없이 걸린 `useMemo`/`useCallback` 제거.

## Confirmation Prompt

```text
mykit 정리/위생 감사 기준으로 보면 후보는 2개입니다.

정리: 확인 필요.
OrderList와 InvoiceDetail이 같은 날짜 포맷 로직을 각자 인라인으로 구현하고 있습니다.
utils/date.ts로 추출하는 걸 제안합니다.

성능: 확인 필요.
CartSummary의 useMemo(() => a + b)는 비용이 낮은 연산인데도 메모이제이션돼 있습니다.
제거하는 걸 제안합니다.

바로 고칠 수 있는 항목.
OrderEditForm 43번째 줄의 `initialData.isUrgent;`는 아무 효과 없는 표현식입니다. 바로 제거하겠습니다.

어떻게 진행할까요?
- 전체 후보 적용.
- 항목별로 선택.
- 리뷰만 하고 멈추기.
```

## Review Checklist

- `if (type === 'special')` 같은 분기가 `item.isSpecial`처럼 데이터로 표현 가능한가.
- 하나의 `useEffect`가 여러 책임을 동시에 하는가.
- 같은 키를 공유하는 데이터가 여러 객체로 흩어져 있는가.
- 부수효과 없는 표현식 구문(no-op statement)이 남아 있는가.
- 날짜/숫자 포맷 같은 범용 유틸리티가 `utils/` 없이 파일마다 인라인으로 반복되는가.
- 비용 측정 없이 걸린 `useMemo`/`useCallback`이 있는가.

## Execution

1. 대상이 명시되지 않았으면 대상부터 확인한다.
2. `code-quality.md`(또는 프로젝트 `playbook/`) 규칙을 먼저 확인한다.
3. 대상 파일과 동일 패턴이 반복되는 다른 파일을 함께 읽는다.
4. 후보를 `바로 고칠 수 있음`, `확인 필요`로 나눈다.
5. 확인 필요 항목은 Confirmation Prompt로 사용자 승인을 받는다.
6. 승인된 범위만 수정한다.
7. 관련 lint/typecheck/test 중 가장 작은 검증을 실행한다.
