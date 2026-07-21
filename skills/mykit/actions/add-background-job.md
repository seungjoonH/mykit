# Add Background Job

cron, queue, worker, scheduler, async processing, webhook 후처리, batch job을 추가하거나 기존 동기
작업을 비동기로 분리할 때 사용한다.

## Project Scan

- queue/scheduler/worker framework와 실행 방식.
- dev/prod process topology.
- retry, dead letter, backoff, concurrency 관례.
- idempotency key, lock, dedupe, rate limit.
- logging, metrics, alerting.
- 테스트와 local worker 실행 script.

## Confirmation Policy

새 비동기 경계, retry 정책, side effect, 외부 API 호출, schedule이 생기면 확인받는다.
기존 job의 typo, log message, import path 같은 작은 수정은 바로 진행할 수 있다.

## Confirmation Prompt

```text
백그라운드 작업을 이렇게 추가하려고 합니다. 괜찮을까요?

Trigger.
주문 생성 후 invoice 발행 job enqueue.

Job payload.
{
  "orderId": "ord_123"
}

처리 방식.
worker가 orderId로 최신 주문을 다시 조회하고 invoice를 생성합니다.

안전장치.
- orderId 기준 idempotency.
- 외부 API 실패는 exponential backoff로 재시도.
- 최종 실패는 dead letter 또는 failed 상태로 기록.

관찰성.
- job 시작/성공/실패 로그.
- orderId correlation.

검증.
- enqueue 테스트.
- worker 성공 테스트.
- 중복 실행 시 invoice가 하나만 생기는 테스트.

어떻게 진행할까요?
- 이대로 진행.
- retry/idempotency 정책 수정.
- 동기 처리로 유지.
- 더 자세히 보기.
```

## Intake

- trigger. schedule, event, API call, webhook.
- payload shape와 persisted source of truth.
- idempotency와 dedupe.
- retry, backoff, timeout, dead letter.
- concurrency와 lock.
- external dependency와 rate limit.
- observability.
- local/dev 실행 방법과 테스트.

## Execution

1. 기존 worker/queue/scheduler 구조를 읽는다.
2. 동기 처리로 충분한지 먼저 검토한다.
3. job boundary와 payload를 최소화한다.
4. payload에는 재조회 가능한 id를 우선 넣고 큰 snapshot을 피한다.
5. idempotency와 retry 정책을 preview에 포함한다.
6. enqueue와 worker 처리를 별도로 테스트한다.
7. worker 실행 명령 또는 local 검증 방법을 보고한다.
