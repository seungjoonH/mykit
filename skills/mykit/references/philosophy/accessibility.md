# Accessibility

접근성은 UI 액션의 선택 옵션이 아니라 기본 계약이다. 새 컴포넌트가 사용자 조작, 상태,
텍스트, 이동을 다루면 접근성 판단을 함께 한다.

## 기본 원칙

- native HTML 요소를 검토하기 전에, 이 UI 패턴에 대해 프로젝트 디자인 시스템에 이미 SSOT
  컴포넌트가 있는지 먼저 확인한다. 있으면 그 컴포넌트를 재사용한다.
- 가능한 한 native HTML 요소와 속성을 먼저 사용한다.
- `role`로 native 동작을 흉내 내기 전에 `<button>`, `<a>`, `<input>`, `<label>`, `<fieldset>`을 검토한다.
- checkbox와 dropdown은 디자인 일관성 문제로 native를 화면에 직접 노출하지 않는다.
  `<input type="checkbox">`는 프로젝트 Checkbox SSOT로 감싸고, `<select>`는 커스터마이징과
  브라우저 간 UX 차이 때문에 원칙적으로 쓰지 않는다. 대체하는 커스텀 Dropdown도 native와
  동등한 키보드 조작·포커스 관리·accessible name은 그대로 보장한다.
- 포커스 가능한 요소에 `aria-hidden`을 주지 않는다.
- 장식용 아이콘과 시각 보조 래퍼는 `aria-hidden="true"`로 숨긴다.
- 사용자 조작의 결과가 명확하지 않으면 label에 동작 결과를 포함한다.
- Unicode 기호, 화살표 문자, emoji, 문자 모양 glyph를 UI icon 대용으로 사용하지 않는다.

## Interactive Primitive 계약

조작 가능한 primitive는 호출부가 접근성 정보를 빠뜨리기 어렵게 props로 강제한다.

- 아이콘 버튼은 `ariaLabel`을 필수로 둔다.
- 클릭 동작이 있는 icon은 프로젝트의 `IconButton` contract를 우선하고 accessible name을 제공한다.
- 토글은 `pressed`와 `aria-pressed`를 연결한다.
- range/slider는 `ariaLabel`, `ariaValueText`, min/max/now를 제공한다.
- segmented control, chip select 같은 그룹 선택 UI는 `fieldset`/`legend` 또는 group label을 제공한다.
- modal/dialog는 제목 연결, close label, focus 복귀를 고려한다.

## Label 작성

- 라벨은 보이는 제목만 반복하지 말고 사용자가 실행할 동작을 설명한다.
- 같은 컴포넌트라도 모바일과 데스크톱에서 조작 방식이 다르면 라벨도 달라질 수 있다.
- 접근성 라벨이 사용자 언어에 따라 달라지면 i18n 키로 관리한다.
- 동적 값이 들어가는 라벨은 interpolation을 사용한다.

## Touch And Focus

- 작은 아이콘이라도 실제 pointer target은 충분히 크게 확보한다.
- 보이는 glyph 크기와 hit area 크기를 분리할 수 있다.
- focus-visible 스타일은 hover 스타일과 별도로 보장한다.
- 키보드로 열 수 있는 것은 키보드로 닫거나 빠져나올 수 있어야 한다.

## 피해야 할 패턴

- 클릭 가능한 `div`/`span`을 기본 선택지로 쓰지 않는다.
- `tabIndex`와 키보드 핸들러를 덧붙인 fake button을 native button보다 먼저 고르지 않는다.
- 아이콘만 있는 버튼에 title만 주고 `aria-label`을 생략하지 않는다.
- `aria-label`을 각 호출부에서 임의 문자열로 흩뿌리지 않는다. 반복되면 helper나 i18n 키로 모은다.

## 검증

- Testing Library를 쓴다면 role/name 기반 query를 우선한다.
- 선택/토글 상태는 `aria-pressed`, checked state, selected state를 확인한다.
- modal은 제목 연결, close 버튼 label, 닫힌 뒤 focus 복귀를 확인한다.
- 접근성 label을 i18n으로 추가했다면 locale별 키 누락을 확인한다.
