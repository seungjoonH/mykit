# Add Component

primitive, 재사용 가능한 composed component, 기존 화면 안의 제한된 독립 UI 조각을 추가하거나
기존 UI를 새 컴포넌트로 분리할 때 사용한다. 폼 필드를 `TextField`에 `label={t("name")}`으로
조립해 달라는 요청도 이 action이다.

route/page, dashboard, settings, list/detail, form workflow, 화면 전체 layout은
`$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/build-screen.md`로 라우팅한다. 이미 있는
컴포넌트나 훅의 계층 위반을 고치는 일이면
`$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/code-refactoring.md`(및
`$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/audit-hooks.md`)로 라우팅한다.

이 문서는 dispatcher다. 철학 본문을 다시 쓰지 않는다. `feature`/`page`는 interactive primitive를
직접 쓰지 않는다.

## mustHold

필드는 `NameTextForm`처럼 의미 단위로 닫는다. `feature`/`page`는 `TextField`를 직접 쓰지
않는다.

## 서브액션

UI 작업이면 항상 아래를 연다. a11y/responsive/i18n은 해당될 때만 연다.

- `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/specify-meaning-unit.md`
- `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/place-layer.md`

## Project Scan

- package manager, framework, 컴포넌트 디렉터리, 기존 primitive/form field
- 기존 훅/유틸. 구현 전에 먼저 찾는다
- `feature`/`page` JSX의 `<TextField`, `<ChipButton`, `label={t(`

## 확인 정책

확인은 범위만 받는다. 합의한 범위 안에서는 의미 단위/훅/유틸을 원칙대로 만들고 사후에
보고한다. 새 파일 이름을 만들기 전에 따로 묻지 않는다. 범위 밖은 고치지 않고 보고만 한다.
기존 패턴이 위반이면 복제하지 않는다.

typo, 누락 import, 명백한 lint/type error는 관례 확인 후 바로 진행할 수 있다.

## Confirmation Prompt

```text
이런 형태로 구현하려고 합니다. 이번에 만지는 범위는 이 폼/의미 단위입니다.

1. 새로 만들 것.
   NameTextForm처럼 닫힌 의미 단위.

2. 호출부는 대략 이렇게 됩니다.
   <NameTextForm value={name} onChange={handleNameChange} />

어떻게 진행할까요?
- 이 범위로 구현.
- 범위 수정.
```

## Execution

1. 관련 파일과 기존 훅/유틸을 찾는다.
2. `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/specify-meaning-unit.md`와
   `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/place-layer.md`를 적용한다.
3. 합의한 범위만 구현한다. 범위 안 새 파일은 원칙대로 만들고 보고한다.
4. 관련 테스트, typecheck, lint 중 가장 작은 검증을 먼저 실행한다.

## Verification

- `feature`/`page` JSX에 `TextField`/`ChipButton`이 남아 있으면 미완료다
- `handleXxx`가 본문에 있고 JSX는 참조만 받는다
