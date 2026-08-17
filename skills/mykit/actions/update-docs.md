# Update Docs

README, API 문서, playbook, ADR, 사용자 가이드, 주석성 문서, changelog를 작성하거나 수정할 때
사용한다. CHANGELOG 항목 작성은
`$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/release-version.md`의 "CHANGELOG 형식"을 따른다.

## Project Scan

- 문서의 대상 독자. 사용자, 개발자, 운영자, 에이전트.
- 기존 문서 톤, 구조, heading depth.
- 실제 코드와 명령어.
- 링크, 이미지, mermaid, 예시 코드.
- package scripts와 환경변수.
- 생성 문서인지 수동 관리 문서인지.

## Confirmation Policy

문서가 public contract, 설치 방법, API 사용법, 아키텍처 설명을 바꾸면 확인받는다.
typo, 깨진 내부 링크, 명백한 outdated command 하나는 바로 수정할 수 있다.

## Confirmation Prompt

```text
문서를 이렇게 수정하려고 합니다. 괜찮을까요?

대상.
README Getting Started.

독자.
처음 설치하는 개발자.

바꿀 내용.
- npm install.
- npm run mykit -- init.
- npm run check.

검증.
- package.json scripts와 명령어가 일치하는지 확인.
- 링크가 실제 파일을 가리키는지 확인.

제외할 것.
- 프로젝트 철학 문서 재작성.
- 배포 문서 추가.

어떻게 진행할까요?
- 이대로 진행.
- 범위 줄이기.
- 섹션 추가.
- 더 자세히 보기.
```

## Intake

- 문서 목적과 독자.
- 반영할 사실.
- 제외할 세부사항.
- 실제 코드/명령어/source of truth.
- 예시, 링크, 이미지, 다이어그램 필요 여부.
- 검증 방법.

## Execution

1. 문서가 설명하는 실제 코드나 설정을 먼저 확인한다.
2. 기존 문서 톤과 구조를 맞춘다.
3. 추측으로 최신 상태를 쓰지 않는다.
4. 명령어, 파일 경로, 링크는 실제로 확인한다.
5. 문서만 바꿨다면 가능한 문서 검증을 보고하고, 코드 테스트가 불필요한 이유를 말한다.
