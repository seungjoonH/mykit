# TailwindCSS 규칙

## 규칙
- 유틸리티 클래스는 목적별로 읽기 쉽게 그룹화한다.
- 반복되는 클래스 조합은 컴포넌트 상수/래퍼로 추출한다.
- 임의값보다 디자인 토큰 기반 클래스를 우선한다.
- canonical class를 우선 사용한다. 예: `w-[14px]` 대신 `w-3.5`.

## Do
- Tailwind 권장 축약 클래스를 우선 적용해 lint 경고를 피한다.

## Don't
- 레이아웃/색상/상태 클래스를 무작위 순서로 섞지 않는다.
- Tailwind 문서/코드에서 `buildCls`를 사용하거나 언급하지 않는다.

## 예시
```tsx
const className = `flex items-center gap-2 rounded-md px-3 py-2 ${
  isActive ? "bg-primary text-primary-foreground w-3.5" : "w-3.5"
}`;
```

## 경계
- 컴포넌트 계층은 유틸리티 조합을 담당한다.
- 테마 계층은 토큰/스케일 정의를 담당한다.

## 테스트 범위
- 상태별 클래스 적용을 검증한다.
- 주요 브레이크포인트 반응형 동작을 검증한다.
- 변경 완료 전 프론트 테스트 또는 최소 타입체크/린트를 반드시 수행한다.
