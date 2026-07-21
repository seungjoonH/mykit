# Responsive

반응형은 화면 크기별 CSS만의 문제가 아니라, 레이아웃 변화와 상호작용 변화의 책임을 나누는
문제다.

## CSS와 TypeScript 경계

- 레이아웃, 간격, 표시/숨김, 컬럼 수처럼 시각 변화는 CSS media/container query를 우선한다.
- 클릭 방식, hover 대체, gesture, 표시 개수 계산처럼 동작이 바뀌면 TypeScript hook이나 config를 쓴다.
- 같은 breakpoint 값을 CSS와 TypeScript가 함께 써야 하면 중앙 config 또는 토큰으로 관리한다.
- 단순 스타일 차이를 React state로 관리하지 않는다.

## Breakpoint 정책

- breakpoint 이름은 프로젝트 맥락에 맞게 적되 의미를 안정적으로 유지한다.
- `mobile`, `tablet`, `desktop`, `wide` 같은 이름은 예시일 뿐 필수 규칙이 아니다.
- breakpoint 숫자, grid bounds, 최대 표시 개수처럼 UX 정책인 값은 컴포넌트 내부에 흩뿌리지 않는다.
- 여러 컴포넌트가 공유하는 값은 config, token, CSS custom property 중 하나로 중앙화한다.

## 컴포넌트 설계

- 반응형 때문에 컴포넌트 계층이 뒤집히면 안 된다.
- 하위 primitive가 viewport 도메인 정책을 알게 하지 않는다.
- feature 컴포넌트나 대응 hook이 viewport별 동작 차이를 소유한다.
- mobile 전용 동작이 필요하면 접근성 라벨과 테스트도 함께 바꾼다.

## CSS Custom Properties

- 런타임 값이 CSS 계산에 필요할 때만 custom property를 사용한다.
- 일반 속성(`width`, `color`, `margin` 등)을 인라인 style로 흩뿌리지 않는다.
- hook은 값만 반환하고 컴포넌트가 `style` 객체를 조립한다.
- 고빈도 pointer/scroll 업데이트는 ref 기반 CSS var 갱신을 예외적으로 사용할 수 있다.

## Intake 질문

새 UI를 만들 때 에이전트가 먼저 판단한다.

- 이 변화는 화면 크기에 따른 스타일 변화인가, 동작 변화인가.
- CSS만으로 충분한가.
- breakpoint 값이 이미 프로젝트에 있는가.
- 모바일에서 hover/focus/gesture 대체 동작이 필요한가.
- 표시 개수, 컬럼 수, hit area가 viewport별로 달라지는가.

## 검증

- 주요 breakpoint에서 레이아웃이 깨지지 않는지 확인한다.
- TypeScript 분기가 있으면 boundary 값 주변을 테스트한다.
- 모바일 전용 동작은 pointer와 keyboard/focus 관점에서 함께 확인한다.
- 텍스트가 길거나 번역이 바뀌어도 container를 넘지 않는지 확인한다.
