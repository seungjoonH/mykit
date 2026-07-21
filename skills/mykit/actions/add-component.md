# Add Component

새 UI 컴포넌트, 폼, 모달, 카드, 필터, 리스트, 패널, 툴바, 컨트롤을 추가하거나 기존 UI를
새 컴포넌트로 분리할 때 사용한다.

## 원칙

- 사용자가 긴 요구사항 폼을 채우게 하지 않는다.
- 에이전트가 먼저 합리적인 기본안을 제시하고, 확인 또는 수정을 받는다.
- 질문은 가능하면 하나로 끝낸다. 구현에 치명적인 정보만 따로 묻는다.
- 프로젝트 고유 컴포넌트 이름을 새 프로젝트의 규칙으로 강제하지 않는다.
- 구현 전 실제 코드와 주변 컴포넌트를 읽고, 기존 디자인 시스템을 우선 재사용한다.

## Project Scan

구현 전에 해당 프로젝트의 관례를 먼저 확인한다.

- package manager와 실행 scripts.
- framework, routing 방식, client/server boundary.
- 컴포넌트 디렉터리 구조와 import alias.
- 기존 primitive, form field, modal, button, style token.
- 가까운 call site와 테스트 스타일.
- 접근성, 반응형, i18n 처리 방식.

관례가 확인되면 그 관례에 맞춘 preview를 만든다. 관례가 불명확하면 가장 작은 합리적
기본안을 제시하고 확인받는다.

## Confirmation Policy

새 컴포넌트, 새 props contract, 새 사용자 흐름, 새 번역 키처럼 surface area가 생기면 확인을
받는다.

아래처럼 좁고 되돌리기 쉬운 작업은 관례 확인 후 바로 진행할 수 있다.

- typo.
- 누락 import 제거.
- 명백한 lint/type error 수정.
- 기존 패턴과 동일한 단일 prop 전달.
- 테스트 expectation의 메시지 오타 수정.

## 먼저 읽을 참고 문서

- 컴포넌트 계층 판단: `../references/philosophy/component-layers.md`
- 접근성 판단: `../references/philosophy/accessibility.md`
- 반응형 판단: `../references/philosophy/responsive.md`
- 다국어 판단: `../references/philosophy/i18n.md`

프로젝트가 이미 자체 playbook을 갖고 있으면 해당 프로젝트의 `playbook/frontend/ui/component.md`,
`playbook/frontend/ui/accessibility.md`, `playbook/frontend/content/i18n.md`,
`playbook/frontend/styling/*`도 함께 읽는다.

## Intake Draft

요청이 모호하면 아래 항목을 에이전트가 먼저 채워 제안한다. 모든 항목을 장황하게 채울
필요는 없고, 작업 판단에 필요한 5개에서 8개 bullet만 남긴다.

- 계층: `layout`, `design`, `interactive`, `composed`, `feature`, `page` 중 어디에 둘지.
- 역할: 이 컴포넌트가 책임지는 사용자 작업 또는 화면 조각.
- 재사용: 기존 primitive, hook, style token, form field를 재사용할 수 있는지.
- 상태: 부모 소유, 내부 소유, route/store/cache 소유 중 어디가 맞는지.
- 데이터: props만 받는지, fetch/cache/form library와 연결되는지.
- 접근성: native element, label, keyboard, focus, aria state가 필요한지.
- 반응형: CSS로 해결할 변화와 TypeScript/hook이 필요한 동작 변화가 무엇인지.
- 다국어: 화면 텍스트와 접근성 텍스트에 번역 키가 필요한지.
- 검증: 렌더링 상태, 이벤트, aria, 반응형 분기, 번역 키 중 무엇을 확인할지.

## Confirmation Prompt

확인용 출력은 내부 판단 항목을 그대로 나열하지 않는다. 사용자가 실제로 만들어질 모습을
빠르게 상상할 수 있도록 짧은 요약, 예상 사용 코드, 대략적인 마크업, 검증 포인트를 보여준다.

```text
이런 형태로 구현하려고 합니다. 괜찮을까요?

1. 새로 만들 것.
   SettingsOpenButton처럼 기존 버튼 primitive를 감싼 작은 컴포넌트.

2. 호출부는 대략 이렇게 됩니다.
   <SettingsOpenButton onOpen={openSettings} />

3. 실제 마크업은 이런 형태를 목표로 합니다.
   <button type="button" aria-label={t('a11y.settings.open')}>
     <span aria-hidden="true">...</span>
   </button>

4. 같이 처리할 것.
   - a11y.settings.open 번역 키 추가.
   - 모바일에서는 크기만 CSS로 대응.
   - 클릭 시 onOpen 호출 테스트.

수정할 부분이 있으면 말해주세요. 없으면 이 기준으로 구현하겠습니다.
```

사용자가 읽기 어려울 정도로 긴 설계표를 보여주지 않는다. 내부적으로는 intake 항목을 모두
검토하되, 사용자에게는 코드 shape와 사용자 영향 중심으로 요약한다.

사용자가 승인하면 바로 구현한다. 사용자가 수정하면 수정된 기준을 `context-notes.md`에 남긴다.

## Preview Formats

작업 성격에 맞춰 아래 중 1개에서 2개만 보여준다.

### Usage Preview

호출부 API가 중요할 때 보여준다.

```tsx
<SearchFilter
  value={query}
  onChange={setQuery}
  onReset={resetQuery}
/>
```

### Markup Preview

접근성, semantic HTML, form 구조가 중요할 때 보여준다.

```html
<form role="search">
  <label for="project-search">Search projects</label>
  <input id="project-search" type="search" />
  <button type="button" aria-label="Clear search">...</button>
</form>
```

### State Preview

상태 소유 경계가 중요할 때 보여준다.

```tsx
type SearchFilterProps = {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
};
```

### Interaction Preview

사용자 조작 흐름이 중요할 때 보여준다.

```text
입력 변경 → onChange(nextValue)
초기화 클릭 → onReset()
Enter → 기본 form submit 또는 검색 실행
```

### Test Preview

검증 범위가 애매할 때 보여준다.

```text
- role="search" 영역이 보인다.
- 검색 input을 입력하면 onChange가 호출된다.
- 초기화 버튼은 accessible name으로 찾을 수 있다.
```

## Execution

1. 관련 파일을 찾는다. `rg --files`, `rg`, 기존 import 경로, 가까운 테스트를 우선 사용한다.
2. 실제로 수정할 파일과 주변 call site를 읽는다.
3. `checklist.md`에 작업 항목을 추가하고 진행하며 체크한다.
4. 확정된 계층, 상태 소유자, 접근성, 반응형, i18n 결정을 `context-notes.md`에 남긴다.
5. 기존 컴포넌트 계층과 스타일 규칙에 맞춰 구현한다.
6. 불필요한 추상화나 새 dependency를 만들지 않는다.
7. 관련 테스트, typecheck, lint 중 가장 작은 검증을 먼저 실행한다.

## Component Decision Rules

- `layout`: 배치만 담당한다. 도메인 텍스트, 비즈니스 상태, 데이터 fetch를 넣지 않는다.
- `design`: 비상호작용 시각 primitive다. 의미나 사용자 작업을 강제하지 않는다.
- `interactive`: 버튼, 입력, 슬라이더처럼 조작 가능한 primitive다. 접근성 props를 계약으로 둔다.
- `composed`: 여러 primitive를 조합해 재사용 가능한 의미를 만든다. 특정 화면 데이터에는 묶지 않는다.
- `feature`: 특정 화면, 도메인, 데이터 흐름에 묶인 완성형 UI다.
- `page`: route-level data, layout composition, metadata, provider 경계를 담당한다.

`IconButton`, `SegmentedButton`, `ChipSelect`, `CodeField`처럼 여러 프로젝트에서 반복되는
primitive 패턴은 일반화할 수 있다. `ProjectCard`처럼 특정 도메인과 데이터 모델에 강하게
묶인 컴포넌트는 예시로만 다루고 범용 규칙으로 만들지 않는다.

## Verification

- 선택형 UI는 선택 상태와 `onChange` 호출을 확인한다.
- 토글/사이클 UI는 `pressed` 또는 다음 값 계산을 확인한다.
- 입력 UI는 입력, clear, invalid, disabled 상태를 확인한다.
- 접근성은 native role, `aria-label`, `aria-pressed`, `aria-valuetext`, focus 복귀를 확인한다.
- 반응형 동작이 TypeScript에 있으면 breakpoint 분기나 hook 값을 확인한다.
- i18n을 건드렸으면 locale별 키 누락 검사를 포함한다.
