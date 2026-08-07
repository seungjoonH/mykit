# 컴포넌트 규칙

## 규칙
- 렌더링 로직과 상태 전이 로직을 분리한다.
- 컴포넌트 하나는 명확한 책임 하나만 가진다.
- 반복되는 UI 블록은 하위 컴포넌트나 훅으로 추출한다.

## Do
- JSX 반환 전에 계산 값과 핸들러를 미리 정리한다.

## Don't
- JSX 안에 복잡한 IIFE나 중첩 분기를 직접 넣지 않는다.

## 예시
```tsx
function ResultPanel({ items }: Props) {
  const visibleItems = items.filter((item) => item.visible);
  const isEmpty = visibleItems.length === 0;

  if (isEmpty) return <EmptyState />;
  return <ResultList items={visibleItems} />;
}
```

## 경계
- Page: 라우트 단위 데이터 조합과 화면 구성.
- Component: 렌더링과 로컬 상호작용.
- Hook: 재사용 가능한 상태 로직.
- 승인된 디자인, 화면 구조, 상태, 반응형 요구사항은 primitive 재사용보다 우선한다.
- primitive 재사용을 이유로 feature/page 책임이나 화면 고유 CSS를 제거하지 않는다.
- feature는 도메인 고유 배치, 밀도, 위계와 상태 표현을 소유할 수 있다. page는 shell, navigation, 큰 영역 조합과 page-level responsive layout을 소유할 수 있다.
- 반복되는 flex/grid는 layout primitive 추출을 검토하는 신호이지 feature/page의 직접 CSS 사용 금지가 아니다.
- 승인된 UI 요소나 viewport 동작을 제거하는 것은 단순화가 아니라 범위 변경이다.

## 테스트 범위
- 컴포넌트가 실제로 소유하는 렌더링 상태만 검증하며 체크리스트를 위해 상태를 만들지 않는다.
- 이벤트-상태 전이 동작을 검증한다.
- page 완료 전 spec 구조, 주요 viewport와 실제 브라우저 렌더링을 시각적으로 확인한다.
- 기능 테스트 통과는 화면 디자인 완료의 증거가 아니다.
- 변경 완료 전 프론트 테스트 또는 최소 타입체크/린트를 반드시 수행한다.
