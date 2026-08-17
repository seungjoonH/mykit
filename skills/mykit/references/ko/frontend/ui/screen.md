# 화면 구현 규칙

## 우선순위
- 승인된 디자인, 화면 구조, 상태, 반응형 요구사항은 primitive 재사용과 구현 편의보다 우선한다.
- 승인된 UI 요소나 viewport 동작을 제거하는 것은 단순화가 아니라 범위 변경이다.
- primitive는 하위 contract를 통일하며 feature/page CSS를 대체하지 않는다.

## 소유권
- feature는 도메인 고유 배치, 밀도, 시각적 위계와 상태 표현을 소유할 수 있다.
- page는 shell, navigation, 큰 영역 조합과 page-level responsive layout을 소유할 수 있다.
- 화면 고유 grid template, 비대칭 패널, sticky 영역, media query와 container query를 허용한다.
- 반복되는 flex/grid는 layout primitive 추출을 검토하는 신호이지 화면의 직접 CSS 사용 금지가 아니다.
- `feature`/`page`는 `TextField` 같은 interactive primitive를 직접 쓰지 않는다. 필드는 `NameTextForm`처럼 의미 단위로 닫는다.

## 구현 전 확인
- reference spec, mock, screenshot, wireframe 또는 기준이 되는 기존 화면을 식별한다.
- 화면 조립 전에 semantic color, typography, spacing, surface, focus, 상태, breakpoint, icon 규칙을 확인한다.
- 필요한 모든 화면 요소와 상태를 구현 task에 매핑한다.
- desktop/mobile 구조와 visual hierarchy를 정의한다.
- loading/error/empty/forbidden/data 중 화면이 실제로 소유하는 상태만 포함한다.
- 사용자 노출 문구를 플랫폼 카피, 런타임 데이터, fixture/example, 불필요한 임시 문구로 분류한다.
- 범위를 줄이기 전에 구현 preview를 제시하고 승인을 받는다.

## 완료 조건
- 구조적 QA에서 필요한 heading, navigation, filter, action, status, 소유 상태, 반응형 전환, keyboard 접근, accessible name과 긴 문자열을 확인한다.
- `feature`/`page` JSX에 `TextField`가 남아 있으면 구조적 QA 실패다.
- Visual QA에서 reference와 hierarchy, spacing, alignment, typography, token, overflow, clipping을 desktop/mobile viewport에서 비교한다.
- 불일치를 기록하고 수정한 뒤 다시 비교한다. 브라우저를 한 번 여는 것은 visual QA가 아니다.
- 시각 수정 후 Content QA를 수행한다. 안전에 필요한 설명은 보존하면서 공통 카피의 런타임·fixture 데이터, 불필요하거나 반복되는 설명, 문자 icon, 설정된 금지 content를 검사한다.
- 기능 완료와 디자인 완료를 별도로 판정한다. 테스트 통과는 화면 디자인 완료의 증거가 아니다.
