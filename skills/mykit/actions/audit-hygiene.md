# Audit Hygiene

기존 코드의 데이터 설계, 사이드이펙트, 정리/중복, 성능 위생을 감사하고 구조적으로 고칠
때 사용한다. 언어나 스택에 무관하게 적용된다. 이 4가지를 하나의 action으로 묶는 이유는
각각 항목 수가 적어서 따로 만들면 과도하게 잘게 쪼개진 코드 위생 점검이 되기 때문이다.
컴포넌트/훅 경계는 `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/audit-hooks.md`로 라우팅한다.

대상이 파일 경로처럼 구체적으로 지칭돼 있으면 바로 Project Scan으로 넘어간다. 대상이
없으면 "어떤 파일/디렉터리를 볼까요?"만 짧게 묻는다. 저장소 전체를 훑어야 하면 아래
키워드로 후보를 먼저 좁힌다.

- `useMemo(`, `useCallback(`
- `.toLocaleDateString(`, `.toFixed(`, `Intl.NumberFormat` 같은 날짜/숫자 포맷 inline 패턴
- 한 파일에 `useEffect(`가 여러 번

## Project Scan

- `code-quality.md`(있으면 프로젝트의 `playbook/`)의 해당 절만 `source-rule-map`으로 연다.
- 프로젝트의 `utils/` 디렉터리 구조와 기존 유틸리티 목록.
- 대상 파일과 가까운 call site, 동일 패턴이 반복되는 다른 파일.

## 확인 정책

확인은 범위만 받는다. 합의한 범위 안에서는 유틸 추출과 위생 정리를 원칙대로 하고 사후에
보고한다. 새 파일 이름을 만들기 전에 따로 묻지 않는다. 한 곳에서만 써도 유틸 성격이면
분리한다. persist/권한은 훅이나 도메인이다. 범위 밖은 고치지 않고 보고만 한다.

## Confirmation Prompt

```text
이번에 만지는 범위는 이 파일의 위생 항목입니다.

범위 안에서 할 것.
OrderList와 InvoiceDetail의 날짜 포맷을 utils/date.ts로 추출한다.
CartSummary의 비용 낮은 useMemo를 제거한다.

범위 밖. 고치지 않고 보고만 한다.
(없으면 생략)

어떻게 진행할까요?
- 이 범위로 고친다.
- 범위 수정.
```

## Review Checklist

- `if (type === 'special')` 같은 분기가 `item.isSpecial`처럼 데이터로 표현 가능한가.
- 하나의 `useEffect`가 여러 책임을 동시에 하는가.
- 같은 키를 공유하는 데이터가 여러 객체로 흩어져 있는가.
- 부수효과 없는 표현식 구문(no-op statement)이 남아 있는가.
- 날짜/숫자 포맷 같은 범용 유틸리티가 `utils/` 없이 파일마다 인라인으로 반복되는가.
- `utils/`에 이미 있는 함수를 파일마다 로컬로 재구현하면서 로케일 같은 값을 하드코딩하는가.
- 비용 측정 없이 걸린 `useMemo`/`useCallback`이 있는가.

## Execution

1. 대상이 명시되지 않았으면 범위부터 확인한다.
2. `code-quality.md`(있으면 프로젝트의 `playbook/`)의 해당 절만 `source-rule-map`으로 연다.
3. 대상 파일과 동일 패턴이 반복되는 다른 파일을 함께 읽는다.
4. 후보를 범위 안 수정 / 범위 밖 보고로 나눈다.
5. 합의한 범위 안에서 원칙대로 고친다. 새 파일 이름을 만들기 전에 따로 묻지 않는다.
6. 관련 lint/typecheck/test 중 가장 작은 검증을 실행한다.
