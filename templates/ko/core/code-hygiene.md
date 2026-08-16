# 코드 정리

## 규칙
- 미사용 import/export는 즉시 제거한다.
- fallback 남발로 실패를 숨기지 않는다.
- 도메인과 무관한 순수 함수(날짜/숫자 포맷 등)는 `utils/`에 두고 재사용한다.
- 아직 한 곳에서만 쓰는 로직을 예측만으로 미리 `utils/`로 빼지 않는다. 실제로 2곳 이상에서 필요해졌을 때 추출한다.

## Do
- 우회보다 근본 원인 수정부터 수행한다.
- 새 유틸리티를 추가하기 전에 `utils/`에 이미 있는지 먼저 찾아본다.

## Don't
- 광범위한 try-catch로 오류를 무시하지 않는다.
- 날짜 포맷, 숫자 포맷 같은 범용 로직을 파일마다 인라인으로 반복 작성하지 않는다.
- 아직 한 곳에서만 쓰는 로직을 미리 `utils/`로 추출하지 않는다.

## Do 예시
```ts
if (!response.ok) throw new Error("request_failed");
```

```ts
// utils/date.ts
export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("ko-KR");
}
```

## Don't 예시
```ts
try {
  await request();
}
catch {
  // ignore
}
```

```ts
// ❌ 같은 날짜 포맷 로직이 파일마다 따로 구현됨
function OrderList({ orders }: Props) {
  const formatted = new Date(orders[0].createdAt).toLocaleDateString("ko-KR");
}
```

```ts
// ❌ 한 곳에서만 쓰는데 미리 utils/로 추출
// utils/formatOrderTitle.ts
export function formatOrderTitle(order: Order) {
  return `#${order.id} ${order.title}`;
}
```

## 경계
- 에러 처리는 에러 맥락이 있는 계층에서 수행한다.
- fallback 동작은 명시적으로 리뷰한다.
- `utils/`는 도메인 지식이 없는 순수 함수만 둔다. 도메인 규칙이나 API 호출이 섞이면 도메인 서비스나 훅으로 둔다.

## 테스트 범위
- 미사용 심볼이 없는지 확인한다.
- 실패 경로가 관측 가능한지 검증한다.
