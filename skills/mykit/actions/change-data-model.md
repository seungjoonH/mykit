# Change Data Model

DB schema, entity, migration, model type, index, relation, cache key, serialized data shape를 변경할 때 사용한다.

## Project Scan

- database와 ORM/query layer. Prisma, TypeORM, JPA, SQL migration, Drizzle, Supabase 등.
- migration 작성과 적용 방식.
- entity/domain model과 API DTO 분리 방식.
- seed, fixture, rollback, compatibility 정책.
- 기존 data-model 테스트 방식.

프로젝트의 migration 도구와 배포 관례를 먼저 확인한다.

## Confirmation Policy

schema, migration, index, relation, persisted field, backward compatibility에 영향이 있으면 확인받는다.
타입 이름 오타나 generated import 정리처럼 저장 데이터에 영향이 없는 작은 수정은 바로 진행할 수 있다.

## Confirmation Prompt

```text
데이터 모델을 이렇게 바꾸려고 합니다. 괜찮을까요?

대상.
users

변경.
role 컬럼 추가. 기본값은 "user".

영향.
- 기존 row는 기본값으로 채웁니다.
- API 응답에는 아직 노출하지 않습니다.
- 권한 체크 로직은 이번 범위에 넣지 않습니다.

Migration.
add users.role with default and not-null policy.

검증.
- migration 생성 또는 schema check.
- model type compile.
- 기존 user 생성 테스트 통과.

어떻게 진행할까요?
- 이대로 진행.
- null/default 정책 수정.
- API 노출까지 포함.
- 더 자세히 보기.
```

## Intake

- 변경 대상 model/table/document/cache key.
- 추가, 제거, rename, relation, index 중 무엇인지.
- nullability, default, uniqueness, cascade.
- 기존 데이터 migration과 rollback.
- API/DTO/event/export에 노출할지.
- performance와 query 영향.
- 테스트와 migration 검증.

## Execution

1. schema, model, repository, API DTO, tests를 함께 읽는다.
2. persisted contract 변경과 non-persisted type 변경을 구분한다.
3. migration preview와 compatibility 영향을 제안한다.
4. 승인된 범위만 schema와 관련 코드를 수정한다.
5. migration check, typecheck, repository/API 테스트 중 관련 검증을 실행한다.
