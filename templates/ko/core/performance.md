# 성능

## 규칙
- 실제 비용이 확인된 경우에만 최적화한다.
- 사소한 계산에 메모이제이션을 남용하지 않는다.
- 반복문 안에서 항목마다 DB 호출을 하지 않는다. 호출 횟수가 데이터 개수에 비례해서 늘어나면(N+1) 한 번의 배치 쿼리로 묶는다.

## Do
- 측정 후 최적화한다.
- 항목별 DB 호출을 하나의 배치/조인 쿼리로 묶는다.

## Don't
- 선제적으로 캐시/메모이제이션을 넣지 않는다.
- 배치 쿼리 한 번으로 될 일을 반복문 안에서 매번 DB 호출로 처리하지 않는다.

## Do 예시
```ts
const sum = a + b; // trivial 계산에는 useMemo 불필요
```

```ts
// ✅ 한 번에 배치로 조회
const ids = profiles.map((p) => p.id);
const users = await getUsersByIds(ids);
```

## Don't 예시
```ts
const sum = useMemo(() => a + b, [a, b]);
```

```ts
// ❌ N+1: 항목 개수만큼 매번 요청
for (const profile of profiles) {
  const user = await getUserById(profile.id);
}
```

## 경계
- 성능 튜닝은 측정된 병목 지점에서만 수행한다.
- 비용이 미미하면 가독성을 우선한다.

## 테스트 범위
- 최적화 전후 지표를 비교한다.
- 최적화로 인한 동작 회귀를 검증한다.
