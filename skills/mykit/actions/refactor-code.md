# Refactor Code

컴포넌트, hook, service, API, utility, module 구조를 정리하거나 전체/부분 코드를 리팩터링할 때
사용한다.

## Project Scan

- 대상 파일과 가까운 call site.
- 기존 abstraction, naming, error handling, test style.
- 변경 전 동작을 보장하는 테스트 유무.
- ownership boundary와 generated file 여부.
- 최근 사용자 변경과 dirty worktree.

## Confirmation Policy

리팩터링은 기본적으로 먼저 진단하고 확인받는다. typo, 누락 import, 명백한 dead branch 제거처럼
좁고 되돌리기 쉬운 변경만 바로 진행할 수 있다.

## Confirmation Prompt

```text
살펴보니 개선 후보는 3개입니다.

권장.
검색 parsing 로직이 UI 컴포넌트에 섞여 있습니다.
렌더링 책임과 계산 책임을 분리하는 작은 refactor가 좋아 보입니다.

선택.
반복되는 aria label 조립을 helper로 모을 수 있습니다.
다만 이번 요청과 직접 관련은 약합니다.

보류.
CSS 클래스명 정리는 가능하지만 동작 개선과 무관하므로 건드리지 않겠습니다.

이번 추천 범위.
권장 항목만 적용.

검증.
기존 SearchFilter 테스트와 typecheck를 실행.

어떻게 진행할까요?
- 추천 범위만 진행.
- 선택 항목까지 포함.
- 범위 줄이기.
- 더 자세히 보기.
```

## Intake

- 리팩터링 목적. 가독성, 책임 분리, 중복 제거, 테스트 가능성, 성능 준비.
- 대상 범위.
- 유지해야 할 public API와 behavior.
- 건드리지 않을 범위.
- 테스트 안전망.
- 작은 변경 단위.

## Execution

1. 먼저 읽고 개선 후보를 `권장`, `선택`, `보류`로 나눈다.
2. 찾은 후보를 전부 고치지 않는다.
3. 사용자 요청과 직접 연결된 가장 작은 범위를 추천한다.
4. 승인된 범위만 수정한다.
5. public API와 behavior를 유지한다.
6. 관련 테스트를 전후로 실행하거나 최소 typecheck/lint를 실행한다.
