# Audit Hooks

기존 코드의 컴포넌트/훅/Store 계층 경계를 감사하고 구조적으로 고칠 때 사용한다.
프론트엔드(React 계열) 전용이다. 컴포넌트 안에 남은 로직, 훅의 책임 경계, Store와
도메인 훅의 관계만 본다. SSOT, checkbox나 select는
`$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/audit-a11y-ssot.md`, fetch 자체의 client 통합은
`$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/audit-api-layer.md`, props나 variant 설계,
`feature`/`page`의 `TextField` 직접 사용과 의미 단위 미닫힘은
`$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/audit-component-api.md`로 라우팅한다.

단일 statement block 압축, guard clause 정리처럼 좁고 되돌리기 쉬운 스타일 문제만
있으면 `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/review-code-style.md`로 라우팅한다.
새 컴포넌트/화면을 만드는 작업이면
`$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/add-component.md`/
`$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/build-screen.md`로 라우팅한다.

대상이 파일 경로나 "이 컴포넌트/훅"처럼 구체적으로 지칭돼 있으면 바로 Project Scan으로
넘어간다. 대상이 없으면 "어떤 파일/디렉터리를 볼까요?"만 짧게 묻는다. 저장소 전체를
훑어야 하면 아래 키워드로 후보를 먼저 좁힌다.

- 컴포넌트 파일 안의 `fetch(`
- 한 파일에 `useState(`/`useEffect(`가 여러 번
- `create<...Store>`, `useXStore(`처럼 상태 저장소를 직접 구독하는 패턴
- `async function` + `page.tsx`에서 파일 길이 대비 함수가 하나뿐인 경우, 특히 한 줄이
  비정상적으로 긴 경우
- `feature`/`page` 경로의 `<TextField`, `<ChipButton`. 발견하면 이 action에서 고치지 않고
  `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/audit-component-api.md`로 라우팅한다.

## Project Scan

- `code-quality.md`(있으면 프로젝트의 `playbook/`)의 해당 절만 `source-rule-map`으로 연다.
- 기존 custom hook과 공용 client/service 모듈(fetch를 감싸는 layer가 있는지).
- 프로젝트가 상태 저장소(Zustand, Redux, Jotai 등)를 쓰는지, 쓴다면 기존 Store/도메인
  훅 네이밍 관례.
- 대상 파일과 가까운 call site, 동일 패턴이 반복되는 다른 파일.
- 기존 컴포넌트 계층 관례.
  `$CLAUDE_PLUGIN_ROOT/skills/mykit/references/philosophy/hooks-store.md`. 계층 표가
  필요하면 `$CLAUDE_PLUGIN_ROOT/skills/mykit/references/philosophy/component-layers.md`의
  표만 연다. 의미 단위는 `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/specify-meaning-unit.md`로
  보낸다.

## 확인 정책

확인은 범위만 받는다. 합의한 범위 안에서는 훅/유틸 분리와 계층 이동을 원칙대로 하고
사후에 보고한다. 새 파일 이름을 만들기 전에 따로 묻지 않는다. 범위 밖은 고치지 않고
보고만 한다.

## Confirmation Prompt

```text
이번에 만지는 범위는 이 컴포넌트/훅입니다.

범위 안에서 할 것.
OrderEditForm의 useState 8개 + fetch 4개를 useOrderEditForm으로 옮긴다.
useCartPanel wiring을 제거하고 useCartActions가 Store를 직접 쓰게 한다.

범위 밖. 고치지 않고 보고만 한다.
(없으면 생략)

어떻게 진행할까요?
- 이 범위로 고친다.
- 범위 수정.
```

## Review Checklist

- Page(라우트 데이터, 구성) / Component(렌더링, 로컬 상호작용) / Hook(기본 훅 또는 기능
  훅) 책임이 실제로 분리돼 있는가.
- (Server Component) 가드, 파라미터 파싱, 데이터 fetch, 파생 계산이 페이지 함수 하나에
  다 있고 페이지 전용 로더 함수로 안 빠져 있는가.
- (Server Component) 여러 페이지에서 인증 가드나 파생 계산(옵션 목록, 색상 맵 등)이
  거의 같은 모양으로 반복되는가. 허용 역할 목록처럼 가드가 참조하는 값이 페이지마다
  다르게 하드코딩돼 있는가.
- 컴포넌트 본문에 `fetch`가 직접 있는가.
- 파생 상태(validation, 계산값)가 2개 이상인데 훅으로 안 빠졌는가.
- 상태, 사이드이펙트, 핸들러, UI 블록이 한 컴포넌트에 과도하게 몰려 있는가.
- 서로 무관한 기능(예: 폼 로직과 무관한 전역 알림 구독)이 한 훅에 섞여 있는가. 한 기능에
  속한 상태와 effect가 여러 개인 것 자체는 문제가 아니다.
- 훅의 반환 인터페이스가 내부 복잡도에 비해 불필요하게 장황한가.
- (Store를 쓰는 프로젝트) 컴포넌트가 Store에서 값을 꺼내 다른 훅에 파라미터로 다시
  주입하는 wiring이 있는가.
- 도메인 훅이 Store의 primitive API를 행위 단위로 변환하지 않고 거의 그대로 재노출하는가.
- 훅 파라미터가 호출자에게 그 훅의 내부 의존성 조립을 요구하는가.
- 훅 이름이 기본 훅(범용)인지 기능 훅(도메인 전담)인지 이름만으로 구분되는가.
- 기능 훅에 `onSuccess`/`onError` 콜백을 주입해 컴포넌트의 UI 동작을 훅 안에서 실행시키는가.
- (Store를 쓰는 프로젝트) Store API에 `checkout`, `applyCoupon` 같은 다단계 도메인 행위가
  들어가 있는가.
- 기능 훅과 Store의 반환 형태가 프로젝트 안에서 서로 다른가(예: 어떤 훅은 `{ state,
  actions }`, 다른 훅은 플랫 객체).
- 훅 반환값에 Store 원시 API(`updateQuantity` 등)와 변환된 도메인 action(`increaseQuantity`
  등)이 함께 섞여 있는가.
- 컴포넌트가 도메인 일부만 쓰는데 필요 이상으로 큰 도메인 훅 전체를 끌어다 쓰는가.

## Execution

1. 대상이 명시되지 않았으면 범위부터 확인한다.
2. `code-quality.md`(있으면 프로젝트의 `playbook/`)의 해당 절만 `source-rule-map`으로 연다.
3. 대상 파일과 동일 패턴이 반복되는 다른 파일을 함께 읽는다.
4. 후보를 범위 안 수정 / 범위 밖 보고로 나눈다.
5. 합의한 범위 안에서 원칙대로 고친다. 새 파일 이름을 만들기 전에 따로 묻지 않는다.
6. 관련 lint/typecheck/test 중 가장 작은 검증을 실행한다.
