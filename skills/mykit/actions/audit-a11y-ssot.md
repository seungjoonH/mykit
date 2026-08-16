# Audit A11y SSOT

기존 코드에서 native 요소가 프로젝트 디자인 시스템의 SSOT 컴포넌트를 두고도 직접 쓰이고
있는지 감사하고 구조적으로 고칠 때 사용한다. 프론트엔드 전용이다. 컴포넌트/훅 경계는
`audit-hooks.md`, props/variant 설계는 `audit-component-api.md`로 라우팅한다.

대상이 파일 경로처럼 구체적으로 지칭돼 있으면 바로 Project Scan으로 넘어간다. 대상이
없으면 "어떤 파일/디렉터리를 볼까요?"만 짧게 묻는다. 저장소 전체를 훑어야 하면 아래
키워드로 후보를 먼저 좁힌다.

- `<input type="checkbox"`
- `<select`

## Project Scan

- 프로젝트 디자인 시스템에 이미 존재하는 SSOT 컴포넌트 목록(Checkbox, Dropdown, Modal,
  Button 등).
- 접근성 관례: `references/philosophy/accessibility.md`.
- 대상 파일과 가까운 call site, 동일 패턴이 반복되는 다른 파일.

## Confirmation Policy

native → SSOT 교체는 접근성 동작(키보드 조작, focus)이 달라질 수 있어 확인을 받는다.

바로 고칠 수 있는 항목.

- 없음. 이 action의 대상 자체가 교체이므로 전부 확인을 받는다.

확인받고 고칠 항목.

- native `<input type="checkbox">`/`<select>`를 프로젝트 SSOT 컴포넌트로 교체.

## Confirmation Prompt

```text
mykit SSOT 감사 기준으로 보면 후보는 1개입니다.

디자인 시스템: 확인 필요.
AgreementSection이 <input type="checkbox">를 직접 쓰고 있는데, 프로젝트에 Checkbox SSOT가 있습니다.
Checkbox로 교체하는 걸 제안합니다.

어떻게 진행할까요?
- 전체 후보 적용.
- 항목별로 선택.
- 리뷰만 하고 멈추기.
```

## Review Checklist

- 이 UI 패턴(checkbox, dropdown, radio, toggle, date picker 등)에 대해 프로젝트에 이미 SSOT
  컴포넌트가 있는데 native를 직접 쓰고 있는가.
- `<input type="checkbox">`를 화면 코드에 직접 노출하고 있는가.
- `<select>`를 화면 코드에 직접 쓰고 있는가.

## Execution

1. 대상이 명시되지 않았으면 대상부터 확인한다.
2. 프로젝트 디자인 시스템의 SSOT 컴포넌트 목록을 먼저 확인한다.
3. 대상 파일과 동일 패턴이 반복되는 다른 파일을 함께 읽는다.
4. Confirmation Prompt로 사용자 승인을 받는다.
5. 승인된 범위만 교체한다. 키보드 조작, focus, accessible name이 native와 동등한지
   확인한다.
6. 관련 lint/typecheck/test 중 가장 작은 검증을 실행한다.
