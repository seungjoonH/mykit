# MySQL 규칙

## 규칙
- 테이블 문자셋/콜레이션(`utf8mb4`)을 일관되게 유지한다.
- FK와 cascade 정책은 의도적으로 설계하고 문서화한다.
- 페이지네이션은 인덱스 기반 정렬 키를 명시한다.

## Do
- 고트래픽 쿼리는 `EXPLAIN`으로 계획을 검증한다.

## Don't
- `ORDER BY` 없는 암묵 정렬에 의존하지 않는다.

## 예시
```ts
const rows = await db.query(
  "SELECT id, email FROM users WHERE status = ? ORDER BY id DESC LIMIT ?",
  ["active", 50],
);
```

## 경계
- 스키마 계층은 문자셋/인덱스 정책을 소유한다.
- Repository는 SQL 호환성과 매핑을 소유한다.
- Service는 비즈니스 필터 규칙을 소유한다.

## 테스트 범위
- 콜레이션/인코딩 동작 검증.
- 동시 삽입 상황의 페이지네이션 일관성 검증.
