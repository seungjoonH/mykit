# Place Layer

컴포넌트를 어느 계층에 둘지 한 줄로 판단할 때 연다. 계층 표 전문은
`$CLAUDE_PLUGIN_ROOT/skills/mykit/references/philosophy/component-layers.md`다.
훅/Store는 열지 않는다.

## mustHold

`feature`/`page`는 interactive primitive를 직접 import하지 않는다. 반복 아이콘은 `Icon`,
화면 고유 illustration은 feature가 가진다. Props는 `function Component({ param }: ComponentProps) {}`다.

## 한 줄 판단

| 계층 | 둘 때 |
|---|---|
| `layout` | 배치만 |
| `design` | 비상호작용 시각 primitive |
| `interactive` | 조작 primitive. a11y 계약을 연다 |
| `composed` | 재사용 의미. 특정 화면 데이터에 묶지 않는다 |
| `feature` | 도메인 완성형. 닫힌 의미 단위만 조립한다 |
| `page` | route data, shell, metadata |

기존 훅/컴포넌트/유틸을 구현 전에 먼저 찾는다. 한 곳에서만 써도 유틸 성격이면 분리한다.
계층이 맞은 뒤 루트에 쌓인 구현 파일은
`$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/audit-directory-structure.md`로 보낸다.
