# 사용자 노출 UI 카피 규칙

## 작성 전 분류
- 플랫폼 공통 카피, tenant/user 런타임 데이터, fixture/example, 사용자에게 불필요한 임시 문구를 구분한다.
- 명세의 고유명사를 플랫폼 카피로 단정하지 않는다. 런타임 데이터, 예시, 승인된 브랜드 문구 중 무엇인지 확인한다.
- tenant, 고객, 지역, 지점, 사용자 데이터를 공통 제품 설명에 하드코딩하지 않는다. 소유권이 불명확하면 묻는다.

## 설명 문구
- description, subtitle, helper text를 관성적으로 추가하지 않는다.
- heading, label, button을 반복하지 않으면서 다음 행동, 결과 판단, 안전에 도움이 될 때만 남긴다.
- 오류 원인, 복구 방법, 위험한 작업의 결과와 법적 동의에 필요한 문구는 유지한다.

## 아이콘과 제약
- Unicode 기호, 화살표 문자, emoji, 문자 glyph를 UI icon으로 사용하지 않는다. 프로젝트의 SVG Icon과 IconButton contract를 사용한다.
- 장식 icon은 보조 기술에서 숨기고 기능 icon control에는 accessible name을 제공한다.
- 프로젝트가 제약을 제공할 때만 금지 content 자동 검사를 활성화한다. 사용자 노출 include/exclude 경로를 설정하고 요청이 없으면 test, docs, comment, generated file, fixture를 검사하지 않는다.
- 설정한 검사는 `npx mykit-content-check --config <relative-config.json>`으로 실행한다.

## Content QA
- 런타임·fixture 데이터가 공통 제품 카피가 되지 않았는지 확인한다.
- 안전에 필요한 설명은 보존하면서 불필요한 설명, 반복 문장, 역할·기능 나열을 제거한다.
- 구조와 시각 수정 후 문자 icon과 설정된 금지 content를 다시 검사한다.
