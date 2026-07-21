# Vanilla JS 스택

## 규칙
- 코드를 책임 단위(DOM, 상태, 네트워크, 유틸)의 ES 모듈로 분리한다.
- DOM 접근은 뷰 모듈 안에서만 하고, 상태/사이드 이펙트는 DOM 레이어 밖으로 뺀다.
- 잎(leaf) 노드마다 리스너를 붙이지 말고 안정적인 부모 노드에 이벤트 위임을 건다.
- 암묵적 전역을 만들지 않는다. 외부에서 쓰는 것만 `export` 한다.

## Do
- `addEventListener` 는 명명된 핸들러를 사용해 teardown 시 정상적으로 제거한다.
- 템플릿은 문자열/`DocumentFragment` 를 반환하는 함수로 두고, 렌더 위치는 한 곳에 모은다.
- fetch 호출과 에러 처리는 네트워크 모듈 하나로 집중시킨다.

## Don't
- 같은 함수 안에서 DOM 조작과 애플리케이션 상태 변경을 함께 하지 않는다.
- 여러 파일에 흩어진 문자열 연결로 마크업을 만들지 않는다.
- 이전 핸들러를 떼지 않은 채 다시 바인딩해서 리스너를 누수시키지 않는다.

## 예시
```js
// view/users.js
import { fetchUsers } from "../net/users.js";
import { renderRows } from "./users.template.js";

export function mountUsersView(root) {
  const onClick = (event) => {
    const row = event.target.closest("[data-user-id]");
    if (!row) return;
    openDetail(row.dataset.userId);
  };
  root.addEventListener("click", onClick);

  fetchUsers().then((rows) => {
    root.innerHTML = renderRows(rows);
  });

  return () => root.removeEventListener("click", onClick);
}
```

## 경계
- View 모듈은 DOM 렌더링과 이벤트 바인딩을 담당한다.
- State 모듈은 애플리케이션 데이터를 보관하고 subscribe/update 인터페이스를 제공한다.
- Network 모듈은 fetch, 재시도, 에러 정규화를 담당한다.

## 테스트 범위
- 순수 함수(템플릿, reducer, 포매터)는 단위 테스트로 덮는다.
- DOM 상호작용은 jsdom 또는 가벼운 통합 러너로 검증한다.
- 변경 완료 전 프로젝트의 테스트/린트 스크립트를 돌리거나, 최소한 엔트리 진입 시 콘솔 에러 없이 로드되는지 확인한다.
