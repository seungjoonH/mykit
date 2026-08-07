# 변경 이력

## 0.1.3 - 2026-08-07

- 컴포넌트 추가/릴리즈/코드 스타일 리뷰/문서 업데이트 네 가지만 남기고 나머지 액션 플레이북과 EXAMPLES.md 정리.
- 컴포넌트 추가 작업 전 checklist.md/context-notes.md 산출물 요구 절차 제거.
- 컴포넌트 계층 철학 문서에 layout prop 계약, className/style escape hatch 예시, size/color 토큰 강제, 계층 건너뛰기 금지 규칙, 확장/사용/조합/구체화 관계 어휘, variant named subcomponent 권장 규칙 추가.

## 0.1.2 - 2026-07-23

- develop→main 릴리즈 절차를 표준화하는 버전 릴리즈(release-version) 액션 플레이북 추가.
- main/develop 동기화가 누락된 경우 먼저 확인받는 절차 추가.
- 사용자의 명시적 승인 없이는 커밋하지 않도록 커밋 정책 강화.

## 0.1.1 - 2026-07-21

- Claude Code 스킬 패키지 이름을 `mykit`으로 변경.
- 컴포넌트, API 엔드포인트, 페이지, 데이터 모델, 테스트, 리팩터링, 버그 수정, 성능 개선, 보안 검토, 문서, 기능 오케스트레이션, 라이브러리 연동, 백그라운드 작업, PR 리뷰용 재사용 가능한 액션 플레이북 추가.
- 장기적으로 유지되는 엔지니어링 철학을 `skills/mykit/references/philosophy/`로 분리.
- 생성되는 Claude 가이드 템플릿을 단순화하고 기존 Cursor rule 출력 제거.
- README에 GitHub 사용법 안내 추가.
- MIT `LICENSE` 파일을 추가하고 패키지/플러그인 메타데이터를 MIT 기준으로 정렬.
- npm 패키지에 포함되는 파일을 CLI 소스, 템플릿, mykit skill, 플러그인 메타데이터, README, 라이선스 파일로 제한.
- `node_modules/`, `package/`, 오래된 `*.tgz` 아카이브처럼 이전에 추적되던 로컬 산출물을 Git 인덱스에서 제거.

## 0.1.0 - 2026-05-06

- 최초 `mykit init` CLI 추가.
- 인터랙티브 및 플래그 기반 스택 선택 기능 추가.
- 영어/한국어 플레이북 템플릿 추가.
- 생성되는 `PLAYBOOK.md`, `playbook/PLAYBOOK.index.yaml`, 스택 문서, AI 가이드 파일 추가.
