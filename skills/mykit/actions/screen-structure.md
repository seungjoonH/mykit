# Screen Structure

build-screen dispatcher가 구조 QA를 할 때 연다. 의미 단위는
`$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/specify-meaning-unit.md`다.

## 완료 조건

- spec의 heading, navigation, filter, action, status 영역이 있다
- 필요한 loading/error/empty/forbidden/data 상태만 있다. 없는 상태를 만들지 않는다
- desktop/mobile 구조가 의도대로 전환된다
- keyboard 동작과 accessible name을 확인한다
- `feature`/`page` JSX에 interactive primitive가 직접 있으면 실패다. `NameTextForm`처럼
  의미 단위로 닫혔는지 확인한다
