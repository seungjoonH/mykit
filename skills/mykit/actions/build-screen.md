# Build Screen

새 route/page, dashboard, settings, list/detail, form workflow, 여러 feature/composed component를
조합하는 화면, mock/screenshot/wireframe/design spec 기반 화면, 기존 page의 주요 layout 변경에
사용한다.

## 원칙

- 승인된 디자인, 화면 구조, 상태, 반응형 요구사항은 primitive 재사용과 구현 편의보다 우선한다.
- primitive는 화면 전용 CSS를 제거하기 위한 수단이 아니다.
- 기능 완료와 디자인 완료를 별도로 판정한다.
- 승인된 UI 요소나 viewport 대응을 제거하는 것은 scope change다. 구현 전에 사용자 승인을 받는다.

## 먼저 읽을 참고 문서

- 계층과 CSS 소유권: `../references/philosophy/component-layers.md`
- 반응형: `../references/philosophy/responsive.md`
- 접근성: `../references/philosophy/accessibility.md`
- 다국어: `../references/philosophy/i18n.md`
- 사용자 노출 카피: `../references/philosophy/content.md`
- 프로젝트의 component, accessibility, CSS Module 또는 styling 규칙.

## Project Scan

- framework, routing, client/server boundary, package scripts.
- 인접 route와 shell/navigation, 기존 page/feature 구조.
- 기존 primitive, composed component, token, CSS 관례.
- 가까운 테스트와 visual regression 또는 screenshot 도구.
- reference spec, mock, screenshot, wireframe 또는 기준이 되는 기존 화면.
- color/semantic token, typography, spacing, radius/border, surface/elevation, focus, 상태, breakpoint, icon 규칙.
- 사용자 노출 텍스트 경로와 프로젝트별 금지 문자열 검사 설정.

## Screen Intake

구현 전에 다음을 실제 요구사항에서 추출한다.

1. 화면 요소와 상태를 구현 task에 빠짐없이 매핑한다.
2. desktop/mobile의 영역 구조와 전환 방식을 정의한다.
3. heading, navigation, primary action, filter, status 등 주요 visual hierarchy를 정의한다.
4. loading/error/empty/forbidden/data 중 화면이 실제로 소유하는 상태만 정의한다.
5. 접근성, 반응형, i18n 책임과 긴 문자열 동작을 확인한다.
6. primitive 재사용과 feature/page 전용 CSS의 경계를 정한다.
7. 사용자 노출 문구를 플랫폼 카피, 런타임 데이터, fixture, 불필요한 임시 문구로 분류한다.
8. description/subtitle/helper text가 실제 행동, 판단, 안전에 필요한지 확인한다.

체크리스트를 채우기 위해 존재하지 않는 상태나 abstraction을 만들지 않는다.

## Plan Review

- reference의 모든 화면 요소가 task에 매핑됐는가.
- 구현 편의를 이유로 UI 요소를 누락하지 않았는가.
- primitive 추출이 `feature`/`page` 책임을 제거하지 않았는가.
- 반응형이나 상태를 범위에서 제외했다면 사용자가 승인했는가.
- plan의 예시가 임시 scaffold인지 production UI인지 구분했는가.
- 마지막에 구조적 QA, responsive QA, accessibility QA, visual QA, Content QA가 모두 있는가.

## Preview

사용자에게 구현 전에 다음을 짧게 보여주고 확인받는다.

- 유지할 reference 구조와 주요 영역.
- desktop/mobile 차이.
- 실제 필요한 데이터 상태.
- 새로 만들 것과 재사용할 것.
- 기능 검증과 visual QA 방법.
- 카피 분류와 프로젝트별 content constraint 검사 방법.

## Execution

1. 프로젝트와 주변 화면 관례를 확인한다.
2. reference 기준과 화면 요소를 식별한다.
3. screen intake와 plan review를 마친다.
4. 사용자에게 preview를 제시하고 승인을 받는다.
5. 승인된 범위만 구현한다.
6. 기능 테스트, typecheck, lint, build 중 프로젝트에 존재하는 검증을 실행한다.
7. 구조적 QA, responsive QA, accessibility QA를 수행한다.
8. 실제 브라우저에서 visual QA를 수행하고 불일치 목록을 작성해 수정한다.
9. Content QA를 다시 수행하고 설정된 프로젝트별 금지 문자열을 자동 검색한다.
10. 기능 완료와 디자인 완료를 별도로 판정한다.

## 구조적 QA

- spec의 heading, navigation, filter, action, status 영역이 존재한다.
- 필요한 loading/error/empty/forbidden/data 상태가 존재한다.
- desktop/mobile 구조가 의도대로 전환된다.
- keyboard 동작과 accessible name을 확인한다.
- 긴 문자열과 번역 문자열에서 구조가 깨지지 않는다.

## Visual QA

- reference와 실제 화면의 hierarchy를 비교한다.
- spacing, alignment, typography, color/token을 확인한다.
- overflow와 clipping을 확인한다.
- 최소 desktop/mobile viewport의 screenshot을 reference와 비교한다.
- 불일치 목록을 작성하고 수정한 뒤 다시 확인한다.

브라우저를 한 번 열었거나 기능 테스트가 통과했다는 사실만으로 visual QA 완료를 선언하지 않는다.

## Content QA

- tenant나 사용자 런타임 데이터가 플랫폼 공통 카피에 하드코딩되지 않았는가.
- fixture나 예시 데이터가 실제 제품 설명으로 노출되지 않았는가.
- 불필요한 subtitle, description, 반복 문장, 역할·기능 나열이 남아 있지 않은가.
- Unicode 기호, 화살표 문자, emoji가 icon 대신 사용되지 않았는가.
- 프로젝트별 금지 문자열이 설정된 사용자 노출 경로에 남아 있지 않은가.
- 오류 원인, 복구 방법, 위험한 작업의 결과, 법적 동의에 필요한 설명까지 제거하지 않았는가.

Content QA와 설정된 금지 문자열 검색은 화면 완료 전 생략하지 않는다. 자동 검색은 의미 판단을
대체하지 않으며, 검사 설정이 없는 프로젝트에 임의의 금지 목록을 만들지 않는다.
