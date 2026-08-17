# Build Screen

새 route/page, dashboard, settings, list/detail, form workflow, 여러 feature를 조합하는
화면, mock/screenshot 기반 화면, 기존 page의 주요 layout 변경에 사용한다.

디자인 변경 없이 아키텍처 원칙 위반만 고치면
`$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/code-refactoring.md`로 라우팅한다.

이 문서는 dispatcher다. 철학 본문을 다시 쓰지 않는다.

## mustHold

필드는 `NameTextForm`처럼 의미 단위로 닫는다. `feature`/`page`는 `TextField`를 직접 쓰지
않는다. 승인된 UI 요소나 viewport 대응을 제거하는 것은 scope change다.

## 서브액션

- `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/specify-meaning-unit.md` (의미 단위. 재사용)
- `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/place-layer.md`
- `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/screen-structure.md`
- `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/screen-visual.md`
- `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/screen-content.md`

responsive, accessibility, i18n, content 철학은 해당될 때만 연다.

## Project Scan

- framework, routing, 인접 route, 기존 primitive/token/CSS
- reference spec, mock, screenshot
- 사용자 노출 텍스트 경로와 금지 문자열 검사 설정

## 확인 정책

확인은 범위만 받는다. 기본 제안은 이번에 만지는 화면이다. 합의한 범위 안에서는 의미
단위/훅/유틸을 원칙대로 만들고 사후에 보고한다. 새 파일 이름을 만들기 전에 따로 묻지
않는다. 범위 밖은 고치지 않고 보고만 한다.

## Preview

- 유지할 reference 구조와 주요 영역
- desktop/mobile 차이
- 새로 만들 것과 재사용할 것
- 기능 검증과 visual QA 방법

## Execution

1. 프로젝트와 주변 화면 관례를 확인한다.
2. 사용자에게 범위를 보여주고 승인을 받는다.
3. 합의한 범위만 구현한다.
4. 서브액션 QA 3축을 수행한다. 구조적 QA는
   `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/screen-structure.md`, Visual QA는
   `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/screen-visual.md`, Content QA는
   `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/screen-content.md`다. 금지 문자열을 자동 검색한다.
5. 기능 완료와 디자인 완료를 별도로 판정한다.
