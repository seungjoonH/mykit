# Component Layers

UI 컴포넌트를 추가하거나 분리할 때 쓰는 범용 계층 모델이다. 프로젝트마다 이름은 달라도
책임 경계는 유지한다.

## 우선순위

- 승인된 디자인, 화면 구조, 상태, 반응형 요구사항은 primitive 재사용과 구현 편의보다 우선한다.
- primitive 재사용을 이유로 UI 요구사항을 생략하거나 `feature`/`page` 계층을 제거하지 않는다.
- 승인된 UI 요소나 viewport 대응을 제거하는 것은 단순화가 아니라 scope change다. 사용자 승인을 받는다.
- primitive가 화면 구조나 반응형 구현을 방해하면 디자인 요구를 버리지 않는다. primitive를 수정하거나 해당 `feature`/`page`가 자체 CSS를 소유하게 한다.

## 계층

| 계층 | 책임 | 넣지 말 것 |
|---|---|---|
| `layout` | 배치, 간격, 정렬, 폭 제어 | 도메인 텍스트, fetch, business state |
| `design` | 비상호작용 시각 primitive | 클릭 동작, route 이동, 도메인 의미 |
| `interactive` | 조작 가능한 primitive | 특정 화면 전용 데이터, 비즈니스 규칙 |
| `composed` | primitive 조합으로 만든 재사용 UI | 특정 페이지의 fetch/cache/store 결합 |
| `feature` | 화면·도메인 맥락이 있는 완성형 UI | 다른 도메인까지 고려한 추상화 |
| `page` | route data, metadata, provider, 큰 조합 | 작은 버튼/카드의 내부 상태 |

## 판단 순서

화면을 조립하기 전에 프로젝트의 color/semantic token, typography, spacing, radius/border,
surface/elevation, focus, 상태 표현, breakpoint, icon 규칙을 확인한다. 없으면 승인된 디자인에
필요한 최소 기반부터 정의한다.

1. 같은 UI가 다른 화면에서도 의미 있게 재사용되는지 확인한다.
2. 사용자 조작이 있으면 `interactive` 또는 그 위 계층으로 둔다.
3. 도메인 데이터 모델을 직접 안다면 `feature`로 둔다.
4. 단지 시각 모양만 제공한다면 `design`으로 둔다.
5. 배치만 담당하면 `layout`으로 둔다.

## 조합 관계

- `interactive`는 `design`을 감싸 동작과 접근성 계약을 더한다.
- `composed`는 `layout`, `design`, `interactive`를 조합해 반복 UI를 만든다.
- `feature`는 `composed`와 도메인 hook/store/data를 연결한다.
- 하위 계층이 상위 계층을 import하지 않게 한다.
- 상위 계층이 하위 계층을 건너뛰고 native element를 새로 구현하지 않게 한다. 이미 있는 `design`/`interactive` 컴포넌트를 두고 별도 스타일로 같은 시각·동작을 중복 정의하면 계층을 건너뛴 것이다.

## 관계 어휘

계층(수직 위치)과 별개로, 컴포넌트끼리 어떻게 결합하는지도 아래 네 가지로 구분한다.

- 확장(Expand): 같은 디자인 역할을 유지한 채 동작이나 props를 더한다. `Icon` → `IconButton`.
- 사용(Use): 다른 컴포넌트를 내부 부품으로 쓰되, 자신의 정체성은 그대로 유지한다. `Chip`이 내부에서 `Icon`을 쓰지만 여전히 `Chip`이다.
- 조합(Compose): 서로 다른 컴포넌트를 엮어 제3의 맥락을 만든다. `DocRow` = `Icon` + `SearchChipButton` + `GotoButton`.
- 구체화(Specify): 범용 컴포넌트의 파라미터를 좁혀 특정 용도로 특수화한다. `Chip` → `StatusChip`.

## Layout 계약

- `layout` 컴포넌트는 배치를 prop으로 표현한다. 이름은 프로젝트마다 다를 수 있지만 `width`(hug/stretch), `direction`, `justify`, `align`, `gap` 같은 축을 prop으로 노출하는 형태가 일반적이다.
- 화면별 CSS Module에 같은 `display: flex`나 `display: grid` 패턴이 반복되면 `layout` primitive 추출을 검토한다. 이는 직접 CSS 사용 금지가 아니라 책임 누수 가능성을 살피라는 신호다.
- 화면 고유 grid template, 비대칭 패널, sticky header/sidebar, 반응형 재배치, container query, 도메인별 밀도와 시각적 hierarchy는 `feature`/`page` CSS가 정상적으로 소유할 수 있다.
- 화면 고유 empty/loading/error/forbidden 표현도 해당 상태를 소유한 `feature`/`page`가 스타일링할 수 있다.

## CSS 소유권

- `layout`은 반복되는 단순 배치, 간격, 정렬 contract를 소유한다.
- `design`과 `interactive`는 자체 모양, token, interaction state를 소유한다.
- `composed`는 내부 primitive 조합과 반복되는 의미 단위 구조를 소유한다.
- `feature`는 도메인 고유 배치, 상태, 밀도, 시각적 위계를 소유한다.
- `page`는 shell, navigation, 큰 영역 조합과 page-level responsive layout을 소유한다.
- 각 계층은 필요하면 자기 CSS Module을 import하고 내부에서 module class를 적용한다. primitive 재사용은 화면별 CSS Module을 제거하라는 뜻이 아니다.

## 일반화 기준

여러 프로젝트에서 반복될 수 있는 버튼, 세그먼트 컨트롤, 칩 선택, 코드 입력, 모달,
슬라이더 같은 primitive 패턴은 일반화 후보가 될 수 있다.

특정 제품의 카드, 주문 상태 패널, 프로젝트 상세 카드처럼 도메인 모델과 문구가 강하게
묶인 UI는 범용 규칙으로 만들지 않는다. 그런 컴포넌트는 예시로만 언급한다.

모든 SVG를 primitive로 추출하지 않는다. 반복되는 icon contract는 `Icon`으로 통일할 수 있지만,
화면 고유 illustration이나 의미 있는 SVG는 해당 feature/page가 직접 소유할 수 있다.

## Props 설계

- 컴포넌트가 소유하지 않는 상태는 controlled props로 받는다.
- label, aria label, disabled, invalid, selected, pressed 같은 사용자 상태를 명시한다.
- variant는 실제 디자인 시스템에 존재하는 값만 받는다.
- variant는 string prop보다 `Component.Variant` 형태의 named subcomponent로 노출하는 편을 권장한다. 예: `Icon.Primary`, `IconButton.Secondary`.
- size, color처럼 반복 사용되는 값은 지금 값이 하나뿐이어도 px, hex 같은 원시값이 아닌 닫힌 enum이나 토큰으로 받는다.
- escape hatch를 만들기 전에 기존 계층을 잘못 잡은 것은 아닌지 확인한다.
- 내부 클래스 적용(`internal class assignment`)인 `className={styles.root}`와 public 스타일 탈출구(`public style escape hatch`)를 구분한다.
- `className`이나 `style`을 public prop으로 받아 호출부가 내부 스타일을 임의로 덮어쓰게 하는 것이 대표적인 public style escape hatch다. 노출하기 전에 필요한 값을 이미 있는 prop이나 layout 계층으로 표현할 수 있는지 확인한다.
- public style escape hatch가 정말 필요하면 기본 허용으로 추가하지 않는다. 어떤 스타일을 누가 소유하고 어떤 contract를 보장하는지 명시적으로 검토한다.

```tsx
// 권장: 컴포넌트가 자기 CSS Module을 내부에 적용한다.
import styles from "./Card.module.css";

function Card() {
  return <article className={styles.root} />;
}
```

```tsx
// 기본 비권장: 호출자가 내부 디자인을 덮어쓸 수 있다.
function Card({ className }: { className?: string }) {
  return <article className={buildCls(styles.root, className)} />;
}

function CardWithStyle({ style }: { style?: CSSProperties }) {
  return <article style={style} />;
}
```

## 계층별 완료 조건

- Primitive(`layout`, `design`, `interactive`)는 props contract, 실제로 소유하는 상태, 접근성, token 적용을 확인한다.
- `composed`는 반복되는 의미 단위와 자신이 소유하는 필요한 상태를 확인한다.
- `feature`는 도메인 작업 완결성, 화면 고유 hierarchy, 실제 데이터 상태를 확인한다.
- `page`는 spec/wireframe 구조, shell/navigation, 주요 viewport, 실제 브라우저 visual QA를 확인한다.
- 모든 계층에 loading/error/empty 상태를 기계적으로 만들지 않는다. 해당 컴포넌트가 실제로 소유하는 상태만 검증한다.
- 기능이 동작한다는 사실은 화면 디자인이 완료됐다는 증거가 아니다.

## Hook 경계

- 컴포넌트는 항상 가벼운 형태를 유지한다. 내부에 생기는 복잡한 로직은 로직 종류별로 각각
  별도의 훅(`use*`)으로 분리하고, 여러 로직을 훅 하나에 몰아넣지 않는다.
- hook은 상태 전이와 계산을 담당하고 JSX를 반환하지 않는다.
- hook은 `CSSProperties` 전체를 반환하지 않는다. 필요한 값만 반환하고 컴포넌트가 style을 조립한다.
- 범용 hook 결과를 다시 다른 hook 인자로 전달하는 대신, 필요한 hook이 내부에서 직접 호출한다.
- 컴포넌트별 hook은 그 컴포넌트 기능만 담당한다.
