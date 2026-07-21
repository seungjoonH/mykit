# Fix Bug

버그, 에러, 이상 동작, 회귀, flaky behavior를 수정할 때 사용한다.

## Project Scan

- 재현 가능한 입력, 화면, API call, 로그.
- 최근 변경 파일과 관련 테스트.
- error stack, network response, console/server logs.
- 기존 bug regression test 패턴.
- 관련 boundary. UI, API, DB, cache, external dependency.

## Confirmation Policy

원인이 불명확하거나 수정 방향이 여러 개면 먼저 재현 계획과 최소 수정 방향을 확인받는다.
명백한 typo, 잘못된 import path, 확실한 null guard 누락처럼 원인이 확인된 작은 버그는 바로 고칠 수 있다.

## Confirmation Prompt

```text
버그를 이렇게 다루겠습니다. 괜찮을까요?

증상.
모달을 닫은 뒤 focus가 열기 버튼으로 돌아오지 않습니다.

재현.
열기 버튼 클릭 → 닫기 버튼 클릭 → focus 위치 확인.

의심 지점.
close handler가 returnFocusRef를 사용하지 않거나 unmount 순서가 맞지 않습니다.

먼저 고정할 동작.
닫힌 뒤 focus가 열기 버튼으로 돌아와야 합니다.

수정 방향.
focus 복귀 경계만 최소 수정하고 animation/style은 건드리지 않습니다.

검증.
회귀 테스트 추가 후 같은 테스트 통과.

어떻게 진행할까요?
- 이대로 진행.
- 테스트 먼저 추가하고 멈추기.
- 수정까지 진행.
- 더 자세히 보기.
```

## Intake

- 증상과 기대 동작.
- 재현 단계.
- 실제 에러/log/response.
- 영향 범위.
- 회귀 테스트 가능 여부.
- 최소 수정 방향.
- 검증 명령.

## Execution

1. 실제 에러와 로그를 읽는다.
2. 재현 경로를 확인한다.
3. 가능하면 실패하는 테스트나 명확한 검증을 먼저 만든다.
4. 흔한 수정법을 추측으로 적용하지 않는다.
5. 원인과 가장 작은 수정 범위를 분리한다.
6. 수정 후 같은 재현 경로와 관련 테스트를 다시 실행한다.
