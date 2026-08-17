# Review Code Style

mykit 코드 스타일 기준으로 파일, 모듈, PR 후보를 점검할 때 사용한다. formatter/linter 대체가
아니라 자동 도구가 잘 못 잡는 흐름, 책임 경계, JSX 정리, 테스트 표현 방식을 본다.

## Project Scan

- formatter/linter/prettier/eslint 설정과 실행 script.
- 기존 code-style, readability, component, testing 문서.
- 대상 파일과 가까운 call site.
- 프로젝트가 이미 허용하는 제어 흐름 압축, import 정렬, quote, semicolon 관례.
- 최근 사용자 변경과 dirty worktree.

자동 도구가 담당하는 공백, quote, semicolon, import order는 mykit 판단으로 임의 수정하지
않는다. 도구가 있으면 도구 결과를 따른다.

## 확인 정책

확인은 범위만 받는다. 합의한 범위 안의 스타일 항목은 고치고 사후에 보고한다. 범위 밖은
고치지 않고 보고만 한다.

이 action에서 고칠 것.

- 단일 statement block 압축.
- guard clause 정리.
- JSX 밖으로 중복 계산 추출.
- 명백한 dead import 제거.
- 테스트명 또는 expectation message typo.

이 항목들은 review-code-style의 스코프 밖이다.
`$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/code-refactoring.md`로 보낸다.

- 함수 추출.
- hook 분리.
- lookup map 전환.
- JSX prop 안에 손으로 나열된 유사 항목을 설정 배열 + `map`으로 전환.
- public API 변경.
- 컴포넌트 계층 이동.
- 파일 분리.

`feature`/`page` JSX의 `TextField` + `label={t(...)}` 조립은 계층 위반이다.
`$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/audit-component-api.md`로 라우팅한다.

## Confirmation Prompt

```text
이번에 만지는 범위는 이 파일의 스타일 항목입니다.

범위 안에서 할 것.
단일 statement if block을 한 줄로 압축한다.
JSX 안 filter 계산을 derived value로 옮긴다.

이 action 밖. code-refactoring으로 보낸다.
status label lookup map 전환.

어떻게 진행할까요?
- 이 범위로 고친다.
- 범위 수정.
```

## Review Checklist

- 단일 statement `if`/`else`/guard를 block으로 과하게 감싸는가.
- 중첩 조건을 early return으로 평탄화할 수 있는가.
- 조건식이 길거나 의미가 숨어 있어 이름 붙인 const가 필요한가.
- side effect 삼항이나 중첩 삼항이 있는가.
- enum/discriminated union/type 분기를 if chain으로 처리하는가.
- 단순 값 매핑을 switch로 과하게 쓰는가.
- JSX 안에 복잡한 계산, 분기, IIFE, 중복 filter/map이 있는가.
- 변환 규칙이 거의 같은 항목을 JSX prop 안에 손으로 여러 개 나열하는가.
- handler, className, style, derived value가 return 전에 정리되어 있는가.
- `handleXxx`가 본문에 있고 JSX는 참조만 받는가. `onClick={() => ...}` 인라인이 `map`에도 없는가.
- 들여쓰기 포함 100자가 넘는 줄을 그대로 두는가. 포맷터 `printWidth`는 100인가.
- `FormEvent`를 쓰는가. `onSubmit`은 `SubmitEvent<HTMLFormElement>`인가.
- hook이 `CSSProperties`나 렌더링 책임을 반환하는가.
- inline style이 CSS custom property 외 일반 시각 속성을 포함하는가.
- 테스트 이름이 보장할 동작을 말하는가.
- 테스트가 role/name보다 selector나 구현 세부에 의존하는가.
- 측정 없는 `useMemo`, `useCallback`, cache가 있는가.

## Execution

1. formatter/linter 관례를 먼저 확인한다.
2. 대상 파일과 주변 call site를 읽는다.
3. 후보를 범위 안 스타일 수정 / 이 action 밖(code-refactoring) / 도구 담당 보류로 나눈다.
4. 자동 도구 담당 항목은 직접 고치지 않고 도구 실행 또는 보류로 분류한다.
5. 합의한 범위만 수정한다.
6. 관련 lint/typecheck/test 중 가장 작은 검증을 실행한다.
