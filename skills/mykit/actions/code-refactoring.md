# Code Refactoring

기존 코드를 mykit 원칙으로 고칠 때 쓰는 진입점이다. 기존 작품에 원칙을 심는 일은 이
dispatcher다.

실제 체크는 아래 독립 action이 나눠 갖고 있다. 대상을 확인한 뒤 관련 action만 고른다.

| 관심사 | action | 스코프 |
|---|---|---|
| 의미 단위 닫힘 | `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/specify-meaning-unit.md` | `.tsx`/`.jsx` |
| 컴포넌트/훅/Store 경계 | `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/audit-hooks.md` | 프론트엔드. `$CLAUDE_PLUGIN_ROOT/skills/mykit/references/philosophy/hooks-store.md`를 연다 |
| 데이터 요청 계층 | `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/audit-api-layer.md` | client / route-handler 두 체크 |
| 디자인 시스템 SSOT | `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/audit-a11y-ssot.md` | 프론트엔드 |
| 컴포넌트 API | `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/audit-component-api.md` | 프론트엔드 |
| 데이터 설계, 사이드이펙트, utils, 성능 | `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/audit-hygiene.md` | 언어 무관. 백엔드만이면 hooks/a11y/component-api는 건너뛴다 |
| 가드, 인가, RLS | `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/audit-auth.md` | 언어 무관 |

좁은 스타일만 있으면 `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/review-code-style.md`로
라우팅한다. 새 컴포넌트/화면이면 `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/add-component.md`/
`$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/build-screen.md`로 라우팅한다.

## 대상 확인

호출 시 대상이 파일 경로처럼 구체적으로 지칭돼 있으면 이 단계를 건너뛴다. 없으면 하나만
확인한다. 이게 범위 확인이다.

- 전체 코드베이스
- dirty worktree (지금 변경된 파일)
- 사용자 지정 (파일/디렉터리를 직접 알려줌)

기본 제안은 이번에 만지는 폼/의미 단위다. 작은 요청의 위반 범위는 매번 확인한다.

## 확인 정책

확인은 범위만 받는다. 합의한 범위 안에서는 의미 단위/훅/유틸을 원칙대로 만들고 사후에
보고한다. 새 파일 이름을 만들기 전에 따로 묻지 않는다. 범위 밖은 고치지 않고 보고만 한다.

## 관련 action 판별

| 대상 | 적용 action |
|---|---|
| `.tsx`/`.jsx` 포함 | specify-meaning-unit, audit-hooks, audit-a11y-ssot, audit-component-api + 아래 공통 |
| 항상 | audit-api-layer, audit-hygiene, audit-auth |

`전체 코드베이스`를 고르면 모든 파일을 읽지 않는다. 각 audit의 grep 키워드로 후보를 좁힌다.

## Execution

1. 대상이 명시되지 않았으면 범위부터 확인한다.
2. 관련 서브액션만 읽는다. `code-quality.md` 전체나
   `$CLAUDE_PLUGIN_ROOT/skills/mykit/references/philosophy/component-layers.md` 훅 장을
   기본 로드하지 않는다.
3. 후보를 범위 안 수정 / 범위 밖 보고로 나눈다.
4. 합의한 범위 안에서 원칙대로 고친다. 새 파일 이름을 만들기 전에 따로 묻지 않는다.
5. 관련 lint/typecheck/test 중 가장 작은 검증을 실행한다.
