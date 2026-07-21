# Add Page

페이지, route, 화면 섹션, layout entry, navigation target을 추가할 때 사용한다.

## Project Scan

- framework와 routing 방식. Next App Router, Pages Router, React Router, file routing, custom router.
- page/layout 파일 위치와 naming convention.
- data loading 위치. server loader, client fetch, route loader, query library.
- metadata, SEO, i18n, auth guard, error/loading/empty 처리 방식.
- 기존 페이지 테스트, story, e2e, visual check 방식.

프로젝트의 routing 관례가 확인되면 그 방식으로 preview를 만든다. 특정 framework를 가정하지
않는다.

## Confirmation Policy

새 route, navigation entry, metadata, auth boundary, data loading contract가 생기면 확인받는다.
좁고 되돌리기 쉬운 link typo, title typo, import 정리는 바로 진행할 수 있다.

## Confirmation Prompt

```text
이 페이지를 이런 형태로 추가하려고 합니다. 괜찮을까요?

Route.
/settings

역할.
사용자 설정을 조회하고 변경하는 화면.

예상 화면 구조.
<SettingsPage>
  <SettingsForm />
  <DangerZone />
</SettingsPage>

Data boundary.
초기 설정은 page/loader에서 가져오고, form은 controlled 상태만 다룹니다.

같이 처리할 것.
- navigation entry 추가.
- title/metadata 추가.
- loading/error/empty 상태 확인.
- 페이지 렌더링과 권한 경계 테스트.

어떻게 진행할까요?
- 이대로 진행.
- route 수정.
- data boundary 수정.
- 더 자세히 보기.
```

## Intake

- route/path와 사용자가 도달하는 방법.
- 페이지의 한 문장 역할.
- 필요한 data source와 mutation.
- auth/permission boundary.
- loading, error, empty, forbidden 상태.
- SEO/metadata와 i18n 키.
- mobile/desktop에서 달라지는 layout.
- 검증 방식.

## Execution

1. route 구조와 가까운 페이지를 읽는다.
2. data loading과 layout 관례를 확인한다.
3. preview로 route, 화면 구조, 상태, 검증을 제안한다.
4. 승인된 범위만 구현한다.
5. route 렌더링, navigation, metadata, auth/error 상태 중 관련 검증을 실행한다.
