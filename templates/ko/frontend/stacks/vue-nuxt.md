# Vue Nuxt 스택

## 규칙
- Nuxt 디렉터리 규약 기준으로 페이지 책임을 분리한다.
- composable, component, server route 경계를 분명히 둔다.

## Do
- 데이터 접근은 composable 또는 server route에 모은다.

## Don't
- 페이지 템플릿에 백엔드 비즈니스 로직을 직접 넣지 않는다.

## 예시
```vue
<script setup lang="ts">
const { data } = await useAsyncData("users", () => $fetch("/api/users"));
</script>
```

## 경계
- Page/component 레이어는 렌더링을 담당한다.
- composable/server route 레이어는 데이터 접근을 담당한다.

## 테스트 범위
- 라우트 렌더링과 composable 동작을 검증한다.
- 변경 완료 전 프론트 테스트 또는 최소 타입체크/린트를 반드시 수행한다.
