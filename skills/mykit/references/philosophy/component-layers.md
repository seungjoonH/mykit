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

## 일반화 기준

여러 프로젝트에서 반복될 수 있는 버튼, 세그먼트 컨트롤, 칩 선택, 코드 입력, 모달,
슬라이더 같은 primitive 패턴은 일반화 후보가 될 수 있다.

특정 제품의 카드, 주문 상태 패널, 프로젝트 상세 카드처럼 도메인 모델과 문구가 강하게
묶인 UI는 범용 규칙으로 만들지 않는다. 그런 컴포넌트는 예시로만 언급한다.

## Props 설계

- 컴포넌트가 소유하지 않는 상태는 controlled props로 받는다.
- label, aria label, disabled, invalid, selected, pressed 같은 사용자 상태를 명시한다.
- variant는 실제 디자인 시스템에 존재하는 값만 받는다.
- escape hatch를 만들기 전에 기존 계층을 잘못 잡은 것은 아닌지 확인한다.

## Hook 경계

- hook은 상태 전이와 계산을 담당하고 JSX를 반환하지 않는다.
- hook은 `CSSProperties` 전체를 반환하지 않는다. 필요한 값만 반환하고 컴포넌트가 style을 조립한다.
- 범용 hook 결과를 다시 다른 hook 인자로 전달하는 대신, 필요한 hook이 내부에서 직접 호출한다.
- 컴포넌트별 hook은 그 컴포넌트 기능만 담당한다.
