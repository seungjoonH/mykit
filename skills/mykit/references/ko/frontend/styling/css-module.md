# CSS Module 규칙

## 규칙
- 컴포넌트 스타일은 `*.module.css`에 둔다.
- 인라인 style 객체보다 클래스 토글을 우선한다.
- 클래스명은 컴포넌트 목적 중심으로 짓는다.
- 클래스 조합은 아래 `buildCls` 유틸을 사용한다.

## Do
- JSX 반환 전에 className을 계산한다.
- `src/lib/buildCls.ts`에 유틸을 두고 재사용한다.
- 컴포넌트가 자기 CSS Module을 import하고 적용한다. `className={styles.root}` 같은 내부 클래스 적용은 권장 패턴이다.
- feature/page가 화면 고유 layout, hierarchy, 밀도, 반응형 media query와 container query용 CSS Module을 소유하게 한다.

## Don't
- 인자가 1개뿐이면 `buildCls`를 쓰지 않는다. 예: `buildCls(styles.root)` 금지, `className={styles.root}` 사용.
- `className`이나 `style`을 public 스타일 탈출구로 기본 노출하지 않는다. 정말 필요하면 소유권과 contract를 검토하고 명시한다.

## 예시
```tsx
export function buildCls(...args: (string | false | null | undefined)[]) {
  return args.filter(Boolean).join(" ").trim();
}

const className = buildCls(styles.root, isOpen && styles.open);
return <section className={className}>...</section>;
```

```tsx
// Public 스타일 탈출구는 호출자가 내부 디자인을 덮어쓸 수 있다.
function Card({ className }: { className?: string }) {
  return <article className={buildCls(styles.root, className)} />;
}
```

## 경계
- 컴포넌트 모듈은 해당 스타일시트를 소유한다.
- primitive 재사용은 feature/page 스타일시트를 제거하라는 뜻이 아니다. 화면 고유 flex/grid와 반응형 CSS는 허용한다.
- 글로벌 스타일은 reset/theme primitive만 둔다.

## 테스트 범위
- variant 클래스 토글을 검증한다.
- 주요 상태 시각 회귀를 검증한다.
- 변경 완료 전 프론트 테스트 또는 최소 타입체크/린트를 반드시 수행한다.
