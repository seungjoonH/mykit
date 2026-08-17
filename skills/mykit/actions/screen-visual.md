# Screen Visual

build-screen dispatcher가 visual QA를 할 때 연다.

## 완료 조건

- reference와 실제 화면의 hierarchy를 비교한다
- spacing, alignment, typography, color/token을 확인한다
- overflow와 clipping을 확인한다
- 최소 desktop/mobile viewport screenshot을 reference와 비교한다
- 불일치 목록을 작성하고 수정한 뒤 다시 확인한다

브라우저를 한 번 열었거나 기능 테스트가 통과했다는 사실만으로 완료를 선언하지 않는다.
기능 완료와 디자인 완료는 따로 판정한다.
