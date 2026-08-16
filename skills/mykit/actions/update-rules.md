# Update Rules

mykit 자체의 SOT 규칙 문서(`code-quality.md`)를 추가하거나 수정하고, `source-rule-map.md`
기준으로 전파까지 처리할 때 사용한다. 프로젝트가 mykit을 사용하며 만드는 문서(README,
API docs, playbook 등)는 `update-docs.md`로 라우팅한다. 이 action은 mykit 자신의 규칙
저작 전용이다.

## Project Scan

- `code-quality.md`에서 대상 섹션(수정이면 기존 번호, 신규면 이어붙일 번호)과 그 섹션의
  기존 문체.
- `source-rule-map.md`에서 그 섹션 번호가 어떤 전파 대상 파일로 매핑되는지.
- 전파 대상 각 파일의 현재 상태: 스텁("아직 채워지지 않음"/"Not filled in yet")인지,
  이미 다른 규칙이 있는 파일인지.
- `code-quality.md` §11 체크리스트와 개정 이력의 현재 상태.

## Confirmation Policy

규칙 문구는 mykit을 쓰는 모든 프로젝트의 행동 기준이 되므로 항상 확인을 받는다.

## Confirmation Prompt

```text
code-quality.md에 이렇게 규칙을 추가하려고 합니다. 괜찮을까요?

대상 섹션.
§2.6 (신규).

규칙 초안.
- ...

전파 대상 (source-rule-map.md 기준).
- skills/mykit/references/{ko,en}/core/code-hygiene.md
- templates/{ko,en}/core/code-hygiene.md
- playbook/core/code-hygiene.md

체크리스트/개정 이력.
§11에 항목 추가, 개정 이력에 오늘 날짜로 한 줄 추가.

어떻게 진행할까요?
- 이대로 진행.
- 문구 수정.
- 전파 범위 다시 잡기.
```

## Execution

1. `code-quality.md`에서 대상 섹션을 정하고 규칙 bullet과 예시를 그 섹션의 기존 문체에
   맞춰 작성한다.
2. `source-rule-map.md`에서 그 섹션 번호의 전파 대상 파일을 찾는다.
3. 전파 대상을 **먼저 읽는다.** 스텁이면 형제 파일(`templates/`, `playbook/`)에 이미
   있는 내용을 먼저 확인하고 병합해서 쓴다. 새 내용만 남기고 기존 규칙을 지우지
   않는다.
4. 전파 대상에 규칙을 반영한다. references와 templates는 문장까지 같을 필요는 없고
   핵심 contract 의미만 같으면 된다.
5. `code-quality.md` §11 체크리스트에 대응 항목을 추가한다.
6. `code-quality.md` 개정 이력에 오늘 날짜로 한 줄 추가한다.
7. `scripts/check-ui-contracts.js`가 이미 검증하는 문서(css/component/screen/content/
   error-handling/accessibility/code-hygiene/code-refactoring 등)를 건드렸으면 새
   규칙의 대표 문구를 contract 정규식으로 추가할지 판단한다.
8. 검증한다.
   - `npm test` 실행.
   - 수정한 모든 파일의 fence(코드 블록) 개수가 짝수인지 확인한다.
   - 새로 쓴 한국어 텍스트에 가운뎃점(·)이나 em dash(—)가 없는지 확인한다(라벨/코드 안은
     예외).
   - references/templates/playbook 사본끼리 `diff`로 구조적으로 어긋나는 부분(고아
     bullet, 섹션 오배치, 한쪽만 있는 내용)이 없는지 확인한다.
9. 결과를 수정 파일 목록과 검증 결과로 요약 보고한다.
