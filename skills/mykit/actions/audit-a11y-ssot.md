# Audit A11y SSOT

기존 코드에서 native 요소가 프로젝트 디자인 시스템의 SSOT 컴포넌트를 두고도 직접 쓰이고
있는지 감사하고 구조적으로 고칠 때 사용한다. 프론트엔드 전용이다. 컴포넌트/훅 경계는
`$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/audit-hooks.md`, props/variant 설계는
`$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/audit-component-api.md`로 라우팅한다.

대상이 파일 경로처럼 구체적으로 지칭돼 있으면 바로 Project Scan으로 넘어간다. 대상이
없으면 "어떤 파일/디렉터리를 볼까요?"만 짧게 묻는다. 저장소 전체를 훑어야 하면 아래
키워드로 후보를 먼저 좁힌다.

- `<input type="checkbox"`
- `<select`

## Project Scan

- 프로젝트 디자인 시스템에 이미 존재하는 SSOT 컴포넌트 목록(Checkbox, Dropdown, Modal,
  Button 등).
- 접근성 관례.
  `$CLAUDE_PLUGIN_ROOT/skills/mykit/references/philosophy/accessibility.md`.
- 대상 파일과 가까운 call site, 동일 패턴이 반복되는 다른 파일.

## 확인 정책

확인은 범위만 받는다. 합의한 범위 안에서 native → SSOT 교체를 원칙대로 하고 사후에
보고한다. 새 파일 이름을 만들기 전에 따로 묻지 않는다. 범위 밖은 고치지 않고 보고만
한다. 교체 후 키보드 조작, focus, accessible name이 native와 동등한지 확인한다.

## Confirmation Prompt

```text
이번에 만지는 범위는 이 화면의 native 입력입니다.

범위 안에서 할 것.
AgreementSection의 <input type="checkbox">를 Checkbox SSOT로 교체한다.

범위 밖. 고치지 않고 보고만 한다.
(없으면 생략)

어떻게 진행할까요?
- 이 범위로 고친다.
- 범위 수정.
```

## Review Checklist

- 이 UI 패턴(checkbox, dropdown, radio, toggle, date picker 등)에 대해 프로젝트에 이미 SSOT
  컴포넌트가 있는데 native를 직접 쓰고 있는가.
- `<input type="checkbox">`를 화면 코드에 직접 노출하고 있는가.
- `<select>`를 화면 코드에 직접 쓰고 있는가.

## Execution

1. 대상이 명시되지 않았으면 범위부터 확인한다.
2. 프로젝트 디자인 시스템의 SSOT 컴포넌트 목록을 먼저 확인한다.
3. 대상 파일과 동일 패턴이 반복되는 다른 파일을 함께 읽는다.
4. 후보를 범위 안 수정 / 범위 밖 보고로 나눈다.
5. 합의한 범위 안에서 원칙대로 교체한다. 키보드 조작, focus, accessible name이 native와
   동등한지 확인한다.
6. 관련 lint/typecheck/test 중 가장 작은 검증을 실행한다.
