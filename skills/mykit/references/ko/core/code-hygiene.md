# 코드 정리

## 규칙
- 도메인과 무관한 순수 함수는 `utils/`에 두고 재사용한다.
- 같은 유틸리티 로직을 파일마다 인라인으로 다시 구현하지 않는다.
- 아직 한 곳에서만 쓰는 로직을 예측만으로 미리 `utils/`로 빼지 않는다. 실제로 2곳 이상에서 필요해졌을 때 추출한다.

## Do
- 새 유틸리티를 추가하기 전에 `utils/`에 이미 있는지 먼저 찾아본다.

## Don't
- 날짜 포맷, 숫자 포맷 같은 범용 로직을 컴포넌트나 도메인 모듈 안에 인라인으로 반복 작성하지 않는다.
- 아직 한 곳에서만 쓰는 로직을 미리 `utils/`로 추출하지 않는다.

## 흔한 후보
- 날짜/시간: 상대 시간, locale 포맷, 기간 계산
- 숫자/통화: 천 단위 구분, 통화 기호, 퍼센트, 단위 변환(바이트 → MB)
- 문자열: truncate, slugify, capitalize, 마스킹(이메일, 전화번호)
- 배열/객체: groupBy, uniqueBy, sortBy, pick/omit
- 함수형: debounce, throttle, memoize
- 형식 검증: 이메일, 전화번호, URL 형식 체크 (비즈니스 규칙 검증은 도메인 계층)

## 예시
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
// ❌ 한 곳에서만 쓰는데 미리 utils/로 추출
// utils/formatOrderTitle.ts
export function formatOrderTitle(order: Order) {
  return `#${order.id} ${order.title}`;
}

// ✅ 두 번째로 필요해진 시점에 추출한다. 그 전까지는 인라인으로 둔다
const title = `#${order.id} ${order.title}`;
```

## 경계
- `utils/`는 도메인 지식이 없는 순수 함수만 둔다.
- 도메인 규칙이나 API 호출이 섞이면 `utils/`가 아니라 도메인 서비스나 훅으로 둔다.

## 테스트 범위
- 순수 함수이므로 입출력 단위 테스트로 충분하다.
- 로케일, 경계값(빈 배열, 0, null)을 함께 검증한다.
