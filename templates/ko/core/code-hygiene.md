# 코드 정리

## 규칙
- 미사용 import/export는 즉시 제거한다.
- fallback 남발로 실패를 숨기지 않는다.
- 도메인과 무관한 순수 변환만 `utils/`에 둔다. persist, 권한, API 호출은 훅이나 도메인 계층이다.
- 한 곳에서만 써도 유틸 성격이 짙으면 분리한다. 다음에 비슷한 로직이 나오면 분리된 유틸을 먼저 찾고 재사용한다.
- 새 포맷/변환 함수를 만들기 전에 `utils/`에 이미 있는지 먼저 찾는다. 로케일처럼 프로젝트 전역에서 일관돼야 하는 값을 함수 안에 하드코딩하지 않는다.

## Do
- 우회보다 근본 원인 수정부터 수행한다.
- 새 유틸리티를 추가하기 전에 `utils/`에 이미 있는지 먼저 찾아본다.

## Don't
- 광범위한 try-catch로 오류를 무시하지 않는다.
- persist나 권한을 `utils/`에 넣지 않는다.
- 유틸 성격이 짙은 순수 변환을 한 곳이라고 인라인에 남기지 않는다.

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
// ❌ 공용 유틸이 있는데 페이지마다 로컬로 다시 구현하고, 로케일도 하드코딩한다
function formatTimeRange(start: string, end: string) {
  const fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
  return `${fmt.format(new Date(start))}-${fmt.format(new Date(end))}`;
}
```

```ts
// ❌ 같은 날짜 포맷 로직이 파일마다 따로 구현됨
function OrderList({ orders }: Props) {
  const formatted = new Date(orders[0].createdAt).toLocaleDateString("ko-KR");
}
```

```ts
// ❌ persist나 권한을 utils/에 넣는다
export async function saveTicket(formData: Ticket) {
  return TicketService.update(formData);
}

// ✅ 도메인 없는 순수 변환만 utils/. 한 곳에서만 써도 유틸 성격이면 분리한다
export function slugify(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}
```

## 경계
- 에러 처리는 에러 맥락이 있는 계층에서 수행한다.
- fallback 동작은 명시적으로 리뷰한다.
- `utils/`는 도메인 지식이 없는 순수 함수만 둔다. 도메인 규칙이나 API 호출이 섞이면 도메인 서비스나 훅으로 둔다.

## 테스트 범위
- 미사용 심볼이 없는지 확인한다.
- 실패 경로가 관측 가능한지 검증한다.
