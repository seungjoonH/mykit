# Test Code

테스트 추가, 테스트 보강, 회귀 테스트, 접근성 테스트, API contract 테스트, 성능 회귀 테스트,
i18n consistency 테스트, refactor safety test를 작성할 때 사용한다.

## Project Scan

- test runner와 scripts. Vitest, Jest, Playwright, pytest, JUnit 등.
- unit/integration/e2e 구분과 파일 위치.
- Testing Library, request helper, fixture, factory, mock 전략.
- 기존 test naming convention.
- CI에서 실행되는 최소 검증 명령.

## Confirmation Policy

새 테스트 목적, 보장 동작, public contract, performance threshold를 정하는 작업은 확인받는다.
명백한 테스트 이름 typo, expectation message typo, 누락 import는 바로 진행할 수 있다.

## Confirmation Prompt

테스트 작업에서는 코드 preview를 보여주지 않는다. 무엇을 보장할지와 어떤 결과면 충분한지
먼저 합의한다.

```text
이 테스트 범위로 잡겠습니다. 괜찮을까요?

대상.
SearchFilter

테스트 목적.
UI interaction과 접근성 계약 고정.

보장할 동작.
1. 현재 검색어가 입력창에 표시된다.
2. 사용자가 검색어를 바꾸면 변경 이벤트가 전달된다.
3. 초기화 버튼을 누르면 초기화 이벤트가 전달된다.
4. 초기화 버튼은 accessible name으로 찾을 수 있다.

만족 조건.
- 위 케이스가 자동 테스트로 통과한다.
- 구현 내부 state가 아니라 사용자-visible behavior 기준으로 작성한다.
- 기존 테스트는 계속 통과한다.

제외할 것.
- 실제 검색 결과 필터링.
- 반응형 레이아웃 시각 검증.

어떻게 진행할까요?
- 이대로 진행.
- 케이스 추가.
- 케이스 줄이기.
- 목적 다시 잡기.
```

## Intake

- 대상.
- 테스트 목적. 접근성, API 계약, 성능 회귀, 버그 재현, refactor safety 등.
- 보장할 동작.
- 만족 조건.
- 제외할 범위.
- mock 처리할 외부 의존성.
- 실행할 검증 명령.

## Execution

1. 대상 코드와 기존 테스트 패턴을 읽는다.
2. 테스트 목적과 만족 조건을 preview로 제안한다.
3. 승인된 범위의 테스트만 작성한다.
4. 실패 테스트가 필요한 버그 작업이면 먼저 실패를 확인한다.
5. 테스트를 통과시키기 위해 production code 의미를 바꾸지 않는다.
6. 관련 테스트를 실행하고 실패하면 실제 에러를 읽는다.
