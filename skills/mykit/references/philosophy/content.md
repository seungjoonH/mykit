# User-Facing Content

화면 카피를 설계하고 검증할 때 쓰는 범용 원칙이다. 특정 제품의 고유명사나 fixture를 플랫폼
공통 문구로 오인하지 않게 하고, 필요한 설명까지 기계적으로 제거하지 않게 한다.

## 카피 분류

구현 전에 사용자 노출 텍스트를 다음 네 범주로 분류한다.

1. 플랫폼 공통 카피.
2. 현재 tenant나 사용자의 런타임 데이터.
3. 개발용 fixture 또는 예시 데이터.
4. 화면 이해에 필요하지 않은 임시 문구.

- tenant, 고객, 지역, 지점, 사용자처럼 실행 시 달라지는 값은 공통 브랜드 카피에 하드코딩하지 않는다.
- 명세의 고유명사는 플랫폼 카피라는 증거가 아니다. 데이터 모델 값, 예시, 실제 브랜드 문구 중 무엇인지 확인한다.
- 분류가 불명확하면 구현 전에 사용자에게 확인한다.
- 범용 문서와 예시는 중립적인 가상 이름만 사용한다.

## 설명 문구 판단

description, subtitle, helper text를 관성적으로 추가하지 않는다. 다음 질문 중 필요한 이유가
확인될 때만 가장 짧고 직접적인 문장으로 작성한다.

- 제목과 화면 구조만으로 목적을 이해할 수 없는가.
- 사용자의 다음 행동이나 판단을 실제로 돕는가.
- 제목, label, button 내용을 반복하지 않는가.
- 역할이나 기능을 나열하기만 하지 않는가.
- 삭제하면 사용성이나 안전성이 실제로 낮아지는가.

오류 원인, 복구 방법, 위험한 작업의 결과, 법적 동의처럼 판단과 안전에 필요한 설명은 생략하지 않는다.

## 프로젝트별 Content Constraint

- 금지 문자열이나 문자 목록은 프로젝트가 제공할 때만 자동 검사를 활성화한다.
- 검사 대상은 `src`, locale/message, email template 등 실제 사용자 노출 경로를 프로젝트 설정으로 지정한다.
- test, 개발 문서, 주석, generated file, fixture는 사용자 노출 범위가 아니라면 제외한다.
- mykit에 특정 프로젝트의 금지 목록이나 디렉터리 구조를 기본값으로 하드코딩하지 않는다.
- 자동 검색은 Content QA를 보조한다. 런타임 데이터와 플랫폼 카피의 의미 구분을 대신하지 않는다.

프로젝트가 제약을 갖는 경우에만 설정 파일을 만들고 실행한다.

```json
{
  "include": ["src/messages", "emails"],
  "exclude": ["src/messages/fixtures", "emails/generated"],
  "extensions": [".json", ".html", ".txt"],
  "forbidden": [
    { "value": "EXAMPLE_FORBIDDEN_TEXT", "reason": "Use approved product copy" }
  ],
  "ignoreLinePatterns": ["^\\s*//"]
}
```

```bash
npx mykit-content-check --config content-constraints.json
```

`include`와 `exclude`는 프로젝트 root 기준 상대 경로다. `ignoreLinePatterns`는 source를 검사할 때
주석처럼 사용자에게 노출되지 않는 줄을 프로젝트 문법에 맞게 제외하는 선택 항목이다.

## Content QA

- 런타임 데이터가 공통 카피에 하드코딩되지 않았는가.
- fixture나 예시 데이터가 실제 제품 설명으로 노출되지 않았는가.
- 불필요한 subtitle, description, 반복 문장, 역할·기능 나열이 남아 있지 않은가.
- 문자 기호나 emoji가 실제 UI icon 대신 사용되지 않았는가.
- 프로젝트별 금지 문자열이 설정된 사용자 노출 범위에 남아 있지 않은가.
- 위험, 오류, 복구, 동의에 필요한 설명을 과도하게 제거하지 않았는가.

Content QA는 구조적·시각적 수정이 끝난 뒤 다시 수행한다.
