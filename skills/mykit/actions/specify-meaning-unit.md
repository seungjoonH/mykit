# Specify Meaning Unit

UI 작업이면 dispatcher가 항상 이 서브액션을 연다. 철학 본문은
`$CLAUDE_PLUGIN_ROOT/skills/mykit/references/philosophy/meaning-unit.md`다.

## mustHold

필드는 `NameTextForm`처럼 의미 단위로 닫는다. `feature`/`page`는 `TextField`를 직접 쓰지
않는다. Specify를 variant 전용으로 읽지 않는다. a11y는 의미가 생기는 계층에서 보장한다.

## 완료 조건

- `feature`/`page` JSX에 `TextField`/`ChipButton`이 남아 있지 않다
- label, type, required, i18n이 닫힌 의미 단위 안에 있다
- 기존 패턴이 위반이면 복제하지 않고 새 의미 단위를 만든다
- 합의한 범위 안에서 파일을 만들고 사후에 보고한다

## 체크리스트

- 호출부가 primitive를 열고 `label={t(...)}`를 채우는가
- Named Export가 variant 이름뿐인가. 폼 필드 Specify가 빠졌는가
- 행 `map`의 인라인 `onClick={() => ...}`를 행 컴포넌트로 닫았는가
