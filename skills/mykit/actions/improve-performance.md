# Improve Performance

성능 병목, 느린 렌더링, 느린 API, 느린 query, 큰 bundle, memory/CPU 문제를 개선할 때 사용한다.

## Project Scan

- 사용자가 느리다고 느끼는 경로와 측정 가능한 지표.
- 기존 profiling, benchmark, logging, analytics.
- frontend render, network, backend, DB, cache 중 어느 층인지.
- 기존 performance test나 budget.
- 최근 변경과 회귀 가능성.

## Confirmation Policy

성능 개선은 측정 전 최적화를 하지 않는다. 측정 대상과 만족 조건을 먼저 확인받는다.
명백한 N+1 query나 불필요한 중복 request처럼 증거가 코드에 바로 보이는 경우도 검증 계획을 남긴다.

## Confirmation Prompt

```text
성능 개선을 이렇게 진행하겠습니다. 괜찮을까요?

측정 대상.
프로젝트 검색 입력 후 결과 갱신까지의 시간.

현재 가설.
검색어 변경마다 전체 목록 parsing과 정렬이 반복됩니다.

먼저 확인할 것.
- 기준 데이터 크기에서 현재 실행 시간.
- 렌더링 병목인지 계산 병목인지.
- 기존 결과 정렬이 유지되는지.

개선 후보.
측정 후 parsing 결과 재사용 또는 query normalization 범위 축소를 검토합니다.

만족 조건.
- 같은 입력에서 결과가 동일하다.
- 기준 데이터에서 실행 시간이 목표 이하로 내려간다.

어떻게 진행할까요?
- 측정부터 진행.
- 후보까지 같이 검토.
- 범위 줄이기.
- 더 자세히 보기.
```

## Intake

- 느린 사용자 경로.
- 현재 지표와 목표 지표.
- 측정 방법.
- 병목 가설.
- 유지해야 할 동작.
- 회귀 방지 테스트 또는 benchmark.
- 제외할 최적화.

## Execution

1. 먼저 측정하거나 기존 증거를 확인한다.
2. 병목 층을 분리한다.
3. 최적화 후보를 비용/위험/효과로 나눈다.
4. 가장 작은 변경을 추천한다.
5. 동작 회귀 테스트와 성능 지표를 함께 확인한다.
6. 사소한 계산에 memoization/cache를 남용하지 않는다.
