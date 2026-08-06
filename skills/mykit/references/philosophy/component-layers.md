# Component Layers

UI 컴포넌트를 추가하거나 분리할 때 쓰는 범용 계층 모델이다. 프로젝트마다 이름은 달라도
책임 경계는 유지한다.

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
- 화면별 CSS Module에 `display: flex`나 `display: grid`를 반복해서 직접 쓰고 있다면 `layout` 책임이 `feature` 계층으로 새고 있다는 신호다.

## 일반화 기준

여러 프로젝트에서 반복될 수 있는 버튼, 세그먼트 컨트롤, 칩 선택, 코드 입력, 모달,
슬라이더 같은 primitive 패턴은 일반화 후보가 될 수 있다.

특정 제품의 카드, 주문 상태 패널, 프로젝트 상세 카드처럼 도메인 모델과 문구가 강하게
묶인 UI는 범용 규칙으로 만들지 않는다. 그런 컴포넌트는 예시로만 언급한다.

## Props 설계

- 컴포넌트가 소유하지 않는 상태는 controlled props로 받는다.
- label, aria label, disabled, invalid, selected, pressed 같은 사용자 상태를 명시한다.
- variant는 실제 디자인 시스템에 존재하는 값만 받는다.
- variant는 string prop보다 `Component.Variant` 형태의 named subcomponent로 노출하는 편을 권장한다. 예: `Icon.Primary`, `IconButton.Secondary`.
- size, color처럼 반복 사용되는 값은 지금 값이 하나뿐이어도 px, hex 같은 원시값이 아닌 닫힌 enum이나 토큰으로 받는다.
- escape hatch를 만들기 전에 기존 계층을 잘못 잡은 것은 아닌지 확인한다.
- className, style을 그대로 받아 호출부가 내부 스타일을 임의로 덮어쓰게 하는 것이 대표적인 escape hatch다. 노출하기 전에 필요한 값을 이미 있는 prop이나 layout 계층으로 표현할 수 있는지 확인한다.

## Hook 경계

- hook은 상태 전이와 계산을 담당하고 JSX를 반환하지 않는다.
- hook은 `CSSProperties` 전체를 반환하지 않는다. 필요한 값만 반환하고 컴포넌트가 style을 조립한다.
- 범용 hook 결과를 다시 다른 hook 인자로 전달하는 대신, 필요한 hook이 내부에서 직접 호출한다.
- 컴포넌트별 hook은 그 컴포넌트 기능만 담당한다.
