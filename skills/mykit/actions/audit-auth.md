# Audit Auth

가드, 인가, RLS를 감사할 때 쓴다. `code-refactoring` dispatcher가 관련되면 호출한다.
직접 `/mykit:audit-auth`로 불러도 된다. 철학 본문은
`$CLAUDE_PLUGIN_ROOT/skills/mykit/references/en/security.md`와 해당 DB 문서
(`$CLAUDE_PLUGIN_ROOT/skills/mykit/references/en/database/supabase.md` 등)다.

## mustHold

영역 가드는 layout, 리소스 가드는 domain, API는 반드시 인가한다. `redirect("/login")`를
페이지마다 하드코딩하지 않는다. 사용자 범위는 세션+RLS가 기본이다. 페이지/라우트에서
service-role 클라이언트를 직접 부르지 않는다. 포털마다 같은 화면 파일을 복제하지 않는다.

## Project Scan

- layout의 영역 가드와 페이지의 `redirect(` 하드코딩
- API 라우트의 인가 누락
- `createServiceRoleClient`, `service_role`, `SERVICE_ROLE`
- 포털별 동일 화면 파일 복제

## 확인 정책

확인은 범위만 받는다. 합의한 범위 안에서 가드 추출과 인가 추가는 원칙대로 하고 사후에
보고한다. 새 파일 이름을 만들기 전에 따로 묻지 않는다. 범위 밖은 고치지 않고 보고만 한다.

## Review Checklist

- 페이지가 `redirect("/login")`를 하드코딩하는가
- API가 인가 없이 리소스에 접근하는가
- 사용자 범위 조회가 service-role로 우회되는가
- 페이지/라우트가 service-role 클라이언트를 직접 부르는가
- 포털마다 같은 화면 파일을 복제하는가
