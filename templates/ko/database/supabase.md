# Supabase 규칙

## 규칙
- Supabase는 Postgres 기반으로 다루고, 스키마 변경은 마이그레이션과 리뷰된 SQL로 관리한다.
- 외부 노출 테이블은 모두 RLS(Row Level Security)를 활성화하고 정책을 명시한다. 사용자 범위 조회/쓰기는 세션 클라이언트와 RLS가 기본이다. service-role은 예외다.
- service role 키는 신뢰된 서버 환경에서만 사용한다. 페이지나 라우트에서 service-role 클라이언트를 직접 부르지 않는다.
- 반복문 안에서 항목마다 쿼리를 날리지 않는다(N+1). `.in()`/join 또는 RPC 하나로 배치 조회/갱신한다.
- 한 요청이 테이블 여러 개에 걸쳐 순서대로 쓰기 작업을 하면, `.rpc()`로 부르는 Postgres 함수 하나로 묶어 전체가 성공하거나 전체가 롤백되게 한다. 첫 단계만 수동으로 보상 처리하는 방식에 의존하지 않는다.

## Do
- 프론트엔드는 사용자 권한 키를 사용하고, service role은 백엔드 작업에만 제한한다.
- 항목별 읽기/쓰기를 `.in()` 또는 RPC 호출 하나로 배치 처리한다.

## Don't
- 클라이언트 코드에서 권한이 높은 키로 RLS를 우회해 조회하지 않는다.
- 배치 호출로 될 일을 반복문 안에서 매번 `.select()`/`.update()`로 처리하지 않는다.

## 예시
```sql
alter table public.todos enable row level security;

create policy "users can read own todos"
on public.todos
for select
using (auth.uid() = user_id);
```

```ts
// ❌ N+1: 행마다 쿼리
for (const id of ids) {
  const { data } = await supabase.from("profiles").select("*").eq("id", id);
}

// ✅ 한 번에 배치 쿼리
const { data } = await supabase.from("profiles").select("*").in("id", ids);
```

## 경계
- SQL 마이그레이션 계층이 스키마/정책 변경을 소유한다.
- 백엔드 계층이 service role 작업을 소유한다.
- 프론트엔드 계층은 사용자 범위 쿼리만 소유한다.
- 전체가 성공하거나 전체가 실패해야 하는 다중 테이블 쓰기는 순차적인 클라이언트 호출이 아니라 Postgres RPC 함수가 소유한다.

## 테스트 범위
- RLS 정책 allow/deny 경로 검증.
- 사용자 키와 service role 접근 회귀 검증.
