# Audit Component API

기존 컴포넌트의 props/variant/타입 설계와 의미 단위 닫힘을 감사하고 구조적으로 고칠 때
사용한다. 프론트엔드 전용이다. 컴포넌트 내부 로직(훅 경계)은
`$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/audit-hooks.md`로 라우팅한다.

대상이 파일 경로처럼 구체적으로 지칭돼 있으면 바로 Project Scan으로 넘어간다. 대상이
없으면 "어떤 파일/디렉터리를 볼까요?"만 짧게 묻는다. props 설계는 키워드로 좁히기 어렵다.
대상 파일을 직접 읽으면서 확인한다. 의미 단위 미닫힘은 아래 키워드로 후보를 먼저 좁힌다.

- `feature`/`page` 경로의 `<TextField`, `<ChipButton`, `label={t(`

계층 문서는 필수다. `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/specify-meaning-unit.md`와
`$CLAUDE_PLUGIN_ROOT/skills/mykit/references/philosophy/meaning-unit.md`를 연다. Specify를
variant 전용으로 읽지 않는다.

## Project Scan

- `code-quality.md`(있으면 프로젝트의 `playbook/`)의 컴포넌트 API 규칙(§5)만
  `source-rule-map`으로 연다.
- 프로젝트의 기존 variant 패턴, Base + Named Export 패턴 사용 여부.
- 대상 컴포넌트의 호출부(같은 prop을 실제로 어떻게 쓰는지).
- `feature`/`page`가 `TextField`에 `label`/`type`/`required`를 밖에서 채우는지.

## 확인 정책

확인은 범위만 받는다. 합의한 범위 안에서는 의미 단위 닫힘과 props 정리를 원칙대로 하고
사후에 보고한다. 새 파일 이름을 만들기 전에 따로 묻지 않는다. public prop 변경은 모든
호출부를 함께 갱신한다. 범위 밖은 고치지 않고 보고만 한다.

## Confirmation Prompt

```text
이번에 만지는 범위는 이 컴포넌트입니다.

범위 안에서 할 것.
AddChildForm의 인라인 타입을 AddChildFormProps로 분리한다.
feature/page의 TextField + label 조립을 NameTextForm처럼 닫는다.

범위 밖. 고치지 않고 보고만 한다.
(없으면 생략)

어떻게 진행할까요?
- 이 범위로 고친다.
- 범위 수정.
```

## Review Checklist

- 한 값으로 유추 가능한 중복 prop이 있는가.
- variant/size가 임의 문자열이 아니라 타입으로 제한돼 있는가.
- variant가 여러 개인데 Base + Named Export 패턴이 안 쓰였는가.
- 타입이 컴포넌트 파일에 섞여 있고 `type.ts`로 분리 안 됐는가.
- Props가 함수 시그니처에 인라인 객체 타입 리터럴로 돼 있고 이름 있는 타입이 없는가.
- `feature`/`page`가 `TextField`/`ChipButton`을 직접 쓰며 `label`/`type`/`required`를 밖에서
  채우는가. `NameTextForm`처럼 의미 단위로 닫히지 않았는가.

## Execution

1. 대상이 명시되지 않았으면 범위부터 확인한다.
2. `code-quality.md`(있으면 프로젝트의 `playbook/`)의 해당 절만 `source-rule-map`으로 연다.
3. 대상 컴포넌트의 실제 호출부를 확인한다.
4. 후보를 범위 안 수정 / 범위 밖 보고로 나눈다.
5. 합의한 범위 안에서 원칙대로 고친다. 새 파일 이름을 만들기 전에 따로 묻지 않는다.
   public prop 변경은 모든 호출부를 함께 갱신한다.
6. 관련 lint/typecheck/test 중 가장 작은 검증을 실행한다.
