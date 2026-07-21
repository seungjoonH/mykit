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

## Confirmation Policy

코드 스타일 리뷰는 먼저 후보를 보고한다. 사용자가 “고쳐줘”라고 했거나 좁고 되돌리기 쉬운
항목이면 적용할 수 있다.

바로 고칠 수 있는 항목.

- 단일 statement block 압축.
- guard clause 정리.
- JSX 밖으로 중복 계산 추출.
- 명백한 dead import 제거.
- 테스트명 또는 expectation message typo.

확인받고 고칠 항목.

- 함수 추출.
- hook 분리.
- lookup map 전환.
- public API 변경.
- 컴포넌트 계층 이동.
- 파일 분리.

## Confirmation Prompt

```text
mykit 코드 스타일 기준으로 보면 후보는 4개입니다.

고칠 만함.
단일 statement if block이 여러 군데 있습니다.
짧은 guard와 단일 statement는 한 줄 압축을 선호합니다.

고칠 만함.
JSX 안에서 filter 계산을 두 번 반복합니다.
return 전에 derived value로 정리하는 게 낫습니다.

선택.
status label 분기가 단순 switch입니다.
단순 값 매핑이면 lookup map이 더 읽기 쉽습니다.

보류.
import 순서는 formatter/linter 담당 영역입니다.
이번 action에서는 건드리지 않겠습니다.

추천 범위.
첫 두 항목만 적용.

어떻게 진행할까요?
- 추천 범위 적용.
- 리뷰만 하고 멈추기.
- 전체 후보 적용.
- 범위 다시 잡기.
```

## Review Checklist

- 단일 statement `if`/`else`/guard를 block으로 과하게 감싸는가.
- 중첩 조건을 early return으로 평탄화할 수 있는가.
- 조건식이 길거나 의미가 숨어 있어 이름 붙인 const가 필요한가.
- side effect 삼항이나 중첩 삼항이 있는가.
- enum/discriminated union/type 분기를 if chain으로 처리하는가.
- 단순 값 매핑을 switch로 과하게 쓰는가.
- JSX 안에 복잡한 계산, 분기, IIFE, 중복 filter/map이 있는가.
- handler, className, style, derived value가 return 전에 정리되어 있는가.
- hook이 `CSSProperties`나 렌더링 책임을 반환하는가.
- inline style이 CSS custom property 외 일반 시각 속성을 포함하는가.
- 테스트 이름이 보장할 동작을 말하는가.
- 테스트가 role/name보다 selector나 구현 세부에 의존하는가.
- 측정 없는 `useMemo`, `useCallback`, cache가 있는가.

## Execution

1. formatter/linter 관례를 먼저 확인한다.
2. 대상 파일과 주변 call site를 읽는다.
3. 후보를 `고칠 만함`, `선택`, `보류`로 나눈다.
4. 자동 도구 담당 항목은 직접 고치지 않고 도구 실행 또는 보류로 분류한다.
5. 승인된 범위만 수정한다.
6. 관련 lint/typecheck/test 중 가장 작은 검증을 실행한다.
