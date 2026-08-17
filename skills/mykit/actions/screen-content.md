# Screen Content

build-screen dispatcher가 Content QA를 할 때 연다. 카피 철학은
`$CLAUDE_PLUGIN_ROOT/skills/mykit/references/philosophy/content.md`다.

## 완료 조건

- tenant나 사용자 런타임 데이터가 플랫폼 공통 카피에 하드코딩되지 않았다
- fixture가 실제 제품 설명으로 노출되지 않았다
- 불필요한 subtitle, description, 역할 나열이 없다
- Unicode 기호, 화살표 문자, emoji가 icon 대신 쓰이지 않았다
- 프로젝트별 금지 문자열이 사용자 노출 경로에 없다
- 오류 원인, 복구 방법, 위험한 작업의 결과, 법적 동의에 필요한 설명까지 제거하지 않았다

설정된 금지 문자열 검색은 화면 완료 전 생략하지 않는다. 검사 설정이 없는 프로젝트에
임의의 금지 목록을 만들지 않는다.
