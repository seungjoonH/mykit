# SvelteKit 스택

## 규칙
- load 함수는 라우트 데이터 요구사항에만 집중한다.
- UI 상태와 서버 데이터 로딩 책임을 분리한다.

## Do
- 엔드포인트 로직은 `+server`, UI 로직은 `+page`에 둔다.

## Don't
- 컴포넌트 이벤트 핸들러에 백엔드 도메인 로직을 직접 넣지 않는다.

## 예시
```ts
// +page.ts
export const load = async ({ fetch }) => {
  const users = await fetch("/api/users").then((r) => r.json());
  return { users };
};
```

## 경계
- route load/server endpoint는 데이터 흐름을 담당한다.
- component는 렌더링/상호작용을 담당한다.

## 테스트 범위
- load 함수와 컴포넌트 상호작용을 검증한다.
- 변경 완료 전 프론트 테스트 또는 최소 타입체크/린트를 반드시 수행한다.
