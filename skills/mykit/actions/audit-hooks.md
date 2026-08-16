# Audit Hooks

기존 코드의 컴포넌트/훅/Store 계층 경계를 감사하고 구조적으로 고칠 때 사용한다.
프론트엔드(React 계열) 전용이다. 컴포넌트 안에 남은 로직, 훅의 책임 경계, Store와
도메인 훅의 관계만 본다. SSOT, checkbox나 select는 `audit-a11y-ssot.md`, fetch 자체의
client 통합은 `audit-api-layer.md`, props나 variant 설계는 `audit-component-api.md`로
라우팅한다.

단일 statement block 압축, guard clause 정리처럼 좁고 되돌리기 쉬운 스타일 문제만
있으면 `review-code-style.md`로 라우팅한다. 새 컴포넌트/화면을 만드는 작업이면
`add-component.md`/`build-screen.md`로 라우팅한다.

대상이 파일 경로나 "이 컴포넌트/훅"처럼 구체적으로 지칭돼 있으면 바로 Project Scan으로
넘어간다. 대상이 없으면 "어떤 파일/디렉터리를 볼까요?"만 짧게 묻는다. 저장소 전체를
훑어야 하면 아래 키워드로 후보를 먼저 좁힌다.

- 컴포넌트 파일 안의 `fetch(`
- 한 파일에 `useState(`/`useEffect(`가 여러 번
- `create<...Store>`, `useXStore(`처럼 상태 저장소를 직접 구독하는 패턴

## Project Scan

- `code-quality.md`(있으면 프로젝트의 `playbook/`)의 기존 규칙.
- 기존 custom hook과 공용 client/service 모듈(fetch를 감싸는 layer가 있는지).
- 프로젝트가 상태 저장소(Zustand, Redux, Jotai 등)를 쓰는지, 쓴다면 기존 Store/도메인
  훅 네이밍 관례.
- 대상 파일과 가까운 call site, 동일 패턴이 반복되는 다른 파일.
- 기존 컴포넌트 계층 관례: `references/philosophy/component-layers.md`.

## Confirmation Policy

이 action의 대상 자체가 구조 변경(함수/hook 추출, 컴포넌트 계층 이동, 파일 분리,
Store-훅 경계 재배치)이라 대부분 확인을 받는다. 즉시 고칠 수 있는 항목은 거의 없다고
가정한다.

바로 고칠 수 있는 항목.

- 부수효과 없는 표현식 구문(no-op statement) 제거.
- 명백한 dead import/export 제거.

확인받고 고칠 항목.

- 컴포넌트 본문의 `fetch`를 도메인 서비스 함수 또는 hook으로 추출.
- 파생 상태/validation을 custom hook으로 추출.
- 서로 무관한 기능이 한 훅에 섞여 있으면 기능 단위로 분리.
- 컴포넌트가 Store에서 값을 꺼내 다른 훅에 다시 주입하는 wiring 제거.
- 도메인 훅이 Store의 primitive API를 그대로 재노출하는 걸 행위 단위 API로 변환.
- 훅 파라미터가 호출자에게 내부 의존성 조립을 요구하면 제거.
- 기능 훅에 주입된 `onSuccess`/`onError` 콜백을 제거하고 훅이 결과 상태만 반환하게 변경.
- 파일 분리, 컴포넌트 계층 이동(component → hook, feature → composed 등).

## Confirmation Prompt

```text
mykit 훅 감사 기준으로 보면 후보는 2개입니다.

구조 변경: 확인 필요.
OrderEditForm이 useState 8개 + fetch 4개를 컴포넌트 본문에 갖고 있습니다.
useOrderEditForm 훅으로 상태, 요청 로직을 옮기고, 컴포넌트는 렌더링만 남기는 걸 제안합니다.

구조 변경: 확인 필요.
useCartPanel이 Store에서 값을 꺼내 useCartActions에 파라미터로 다시 주입하고 있습니다.
useCartActions가 Store를 직접 쓰도록 바꾸고, wiring을 컴포넌트에서 제거하는 걸 제안합니다.

바로 고칠 수 있는 항목.
OrderEditForm 43번째 줄의 `initialData.isUrgent;`는 아무 효과 없는 표현식입니다. 바로 제거하겠습니다.

어떻게 진행할까요?
- 전체 후보 적용.
- 항목별로 선택.
- 리뷰만 하고 멈추기.
```

## Review Checklist

- Page(라우트 데이터, 구성) / Component(렌더링, 로컬 상호작용) / Hook(기본 훅 또는 기능
  훅) 책임이 실제로 분리돼 있는가.
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

1. 대상이 명시되지 않았으면 대상부터 확인한다.
2. `code-quality.md`(또는 프로젝트 `playbook/`) 규칙을 먼저 확인한다.
3. 대상 파일과 동일 패턴이 반복되는 다른 파일을 함께 읽는다.
4. 후보를 `바로 고칠 수 있음`, `확인 필요`로 나눈다.
5. 확인 필요 항목은 Confirmation Prompt로 사용자 승인을 받는다.
6. 승인된 범위만 수정한다. 승인 없이 hook 분리, 계층 이동, 파일 분리를 진행하지 않는다.
7. 관련 lint/typecheck/test 중 가장 작은 검증을 실행한다.
