# Add Feature

알림, 검색, 북마크, 관리자 초대, 장바구니, 결제 흐름처럼 프로젝트 도메인에 종속된 사용자 기능을
추가할 때 사용한다. 하나의 파일이나 계층으로 끝나지 않는 작업을 하위 action들로 쪼개는
orchestration action이다.

## Project Scan

- 제품 도메인과 기존 feature/module 구조.
- 사용자가 도달하는 route, navigation, entry point.
- 기존 UI component, API, data model, auth, cache, i18n, test 패턴.
- 같은 도메인의 기존 기능과 naming.
- backend/frontend가 분리되어 있는지, monolith인지, local-only 앱인지.
- deployment/runtime 제약과 feature flag 관례.

특정 frontend/backend/database가 있다고 가정하지 않는다. 프로젝트가 UI-only면 UI/local state
범위로, backend가 있으면 API/data boundary까지 포함해 preview를 만든다.

## Confirmation Policy

도메인 기능은 새 surface area가 생기므로 기본적으로 확인받는다. 단일 버튼 label 수정처럼
기능 범위가 명확하고 작은 작업은 해당 하위 action으로 바로 처리할 수 있다.

## Confirmation Prompt

```text
이 기능을 이렇게 쪼개서 진행하려고 합니다. 괜찮을까요?

기능.
사용자가 프로젝트를 북마크하고 북마크한 항목만 볼 수 있게 합니다.

사용자 흐름.
1. 프로젝트 카드에서 북마크 버튼을 누른다.
2. 북마크 상태가 즉시 반영된다.
3. 필터에서 북마크한 프로젝트만 볼 수 있다.

필요한 하위 작업.
- UI: 카드에 북마크 토글 추가.
- State/Data: 저장 위치 결정.
- API: 서버 저장이 필요하면 bookmark endpoint 추가.
- DB: 사용자별 bookmark 저장소 추가.
- i18n/a11y: 추가/해제 label 추가.
- Test: 토글, 필터, 저장 실패 케이스 검증.

추천 1차 범위.
localStorage 기반 UI 기능만 먼저 구현합니다.
서버 저장/API/DB는 다음 단계로 분리합니다.

제외할 것.
- 로그인 사용자 간 동기화.
- 서버 저장.
- 알림/공유 기능.

어떻게 진행할까요?
- 추천 1차 범위로 진행.
- 서버 저장까지 포함.
- 특정 하위 작업만 진행.
- 범위 다시 잡기.
```

## Intake

- 기능을 사용자 흐름으로 표현한다.
- 사용자-visible entry point와 성공 상태.
- 필요한 하위 작업. UI, page, API, data model, auth/security, i18n/a11y, test, docs.
- 1차 범위와 제외 범위.
- 데이터 저장 위치와 동기화 필요성.
- 권한, 실패, empty/loading/error 상태.
- 기존 기능과의 compatibility.
- 검증 계획.

## Sub-action Routing

- UI 컴포넌트가 필요하면 `actions/add-component.md`.
- 새 화면이나 route가 필요하면 `actions/add-page.md`.
- API contract가 필요하면 `actions/add-api-endpoint.md`.
- 저장 모델이나 migration이 필요하면 `actions/change-data-model.md`.
- 테스트 범위가 필요하면 `actions/test-code.md`.
- 보안 경계가 있으면 `actions/review-security.md`.
- 성능 우려가 있으면 `actions/improve-performance.md`.
- 문서 변경이 필요하면 `actions/update-docs.md`.

## Execution

1. 기능 요청을 사용자 흐름으로 다시 쓴다.
2. 프로젝트 구조를 읽고 어떤 하위 action이 필요한지 판단한다.
3. 모든 것을 한 번에 구현하지 않고 가장 작은 1차 범위를 추천한다.
4. 사용자가 승인한 범위의 하위 action만 순서대로 진행한다.
5. 각 하위 action의 confirmation/verification 규칙을 따른다.
6. 범위가 커지면 checklist를 단계별로 나누고 context-notes에 결정 이유를 남긴다.
7. 최종 보고에는 구현된 사용자 흐름과 실행한 검증을 기준으로 말한다.
