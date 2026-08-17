# 코드 정리

## 규칙
- 미사용 import/export는 즉시 제거한다.
- fallback 남발로 실패를 숨기지 않는다.
- 도메인과 무관한 순수 변환만 `utils/`에 둔다. persist, 권한, API 호출은 훅이나 도메인 계층이다.
- 같은 유틸리티 로직을 파일마다 인라인으로 다시 구현하지 않는다.
- 새 포맷/변환 함수를 만들기 전에 `utils/`에 이미 있는지 먼저 찾는다. 특히 로케일처럼 프로젝트 전역에서 일관돼야 하는 값을 함수 안에 하드코딩하지 않는다. 파일마다 다르게 하드코딩되면 화면마다 다르게 보이는 버그가 된다.
- 한 곳에서만 써도 유틸 성격이 짙으면 분리한다. 다음에 비슷한 로직이 나오면 분리된 유틸을 먼저 찾고 재사용한다.
- `utils/` 안에서도 관심사별로 파일을 나눈다(`date.ts`, `number.ts`, `string.ts` 등). 하나의 `utils.ts`에 다 몰아넣지 않는다.

## Do
- 우회보다 근본 원인 수정부터 수행한다.
- 새 유틸리티를 추가하기 전에 `utils/`에 이미 있는지 먼저 찾아본다.

## Don't
- 광범위한 try-catch로 오류를 무시하지 않는다.
- 날짜 포맷, 숫자 포맷 같은 범용 로직을 컴포넌트나 도메인 모듈 안에 인라인으로 반복 작성하지 않는다.
- persist나 권한을 `utils/`에 넣지 않는다.
- 유틸 성격이 짙은 순수 변환을 한 곳이라고 인라인에 남기지 않는다.

## 흔한 후보
- 날짜/시간: 상대 시간, locale 포맷, 기간 계산
- 숫자/통화: 천 단위 구분, 통화 기호, 퍼센트, 단위 변환(바이트 → MB)
- 문자열: truncate, slugify, capitalize, 마스킹(이메일, 전화번호)
- 배열/객체: groupBy, uniqueBy, sortBy, pick/omit
- 함수형: debounce, throttle, memoize
- 형식 검증: 이메일, 전화번호, URL 형식 체크 (비즈니스 규칙 검증은 도메인 계층)

## 예시
```ts
if (!response.ok) throw new Error("request_failed");
```

```typescript
// ❌ 공용 유틸이 있는데 페이지마다 로컬로 다시 구현하고, 로케일도 하드코딩한다
function formatTimeRange(start: string, end: string) {
  const fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${fmt.format(new Date(start))}-${fmt.format(new Date(end))}`;
}

// ✅ 이미 있는 공용 유틸을 먼저 찾아 재사용하고, 로케일은 인자로 받는다
import { formatDateTime } from '@/utils/date';
const range = `${formatDateTime(start, locale)}-${formatDateTime(end, locale)}`;
```

```typescript
// ❌ 같은 날짜 포맷 로직이 파일마다 따로 구현됨
function OrderList({ orders }: Props) {
  const formatted = new Date(orders[0].createdAt).toLocaleDateString('ko-KR');
}

function InvoiceDetail({ invoice }: Props) {
  const formatted = new Date(invoice.issuedAt).toLocaleDateString('ko-KR');
}
```

```typescript
// ✅ utils/에서 한 번만 정의
// utils/date.ts
export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('ko-KR');
}
```

```typescript
// ❌ persist나 권한을 utils/에 넣는다
export async function saveTicket(formData: Ticket) {
  return TicketService.update(formData);
}

// ✅ 도메인 없는 순수 변환만 utils/. 한 곳에서만 써도 유틸 성격이면 분리한다
export function slugify(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}
```

## 경계
- 에러 처리는 에러 맥락이 있는 계층에서 수행한다.
- fallback 동작은 명시적으로 리뷰한다.
- `utils/`는 도메인 지식이 없는 순수 함수만 둔다. 도메인 규칙이나 API 호출이 섞이면 도메인 서비스나 훅으로 둔다.

## 테스트 범위
- 미사용 심볼이 없는지 확인한다.
- 실패 경로가 관측 가능한지 검증한다.
- 순수 함수이므로 입출력 단위 테스트로 충분하다. 로케일, 경계값(빈 배열, 0, null)을 함께 검증한다.
