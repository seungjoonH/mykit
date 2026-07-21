## 2026-05-06

- Base source is `code-quality.md`; project-specific items (Prova) are excluded.
- `mykit` should generate `PLAYBOOK.md` and selected docs under `playbook/`.
- Default output language is `en`; `ko` is always generated as an additional copy.
- Use one consistent rule format in every document: Rules, Do, Don't, Examples, Boundaries, Test Scope.
- Added `source-rule-map.md` to explicitly map source sections into reusable stacks.
- Implemented template-driven generation in `src/templates.js` with a shared format function.
- Added `mykit init` interactive prompts and non-interactive flags for verification.
- Generation writes `PLAYBOOK.md`, `playbook/PLAYBOOK.index.yaml`, and `playbook/mykit.selection.yaml`.

## 2026-05-27

- README 요청은 기존 이미지 중심 프로젝트 README 포맷을 `mykit` CLI 소개용으로 변환하는 작업이다.
- 현재 저장소에는 `README.md`가 없으므로 새 파일을 만든다.
- 이미지 자리에는 실제 터미널 프롬프트와 드라이런 출력 예시를 `text` 코드블록으로 넣는다.
- 기술 스택은 구현 기준으로 Node.js ESM, Inquirer, YAML, Markdown 템플릿, npm CLI로 정리한다.
- 아키텍처는 CLI 입력, 템플릿, 생성기, 산출 파일 흐름을 mermaid flowchart로 표현한다.
- `npm run check` 결과 드라이런 생성 파일 수는 30개이므로 README 예시도 `Generated 30 files`로 맞춘다.

## 2026-07-15

- CLAUDE.md는 매 세션 무조건 로드, SKILL.md는 frontmatter만 항상 보이고 본문/`references/`는
  트리거될 때만 로드되는 3단 점진 로딩 구조 — 지금까지 mykit은 이걸 CLAUDE.md 프로즈 +
  `PLAYBOOK.index.yaml`로 손수 흉내내고 있었다는 게 이번 재구성의 출발점.
- 행동 원칙(Simplicity First 등)을 순수 스킬로만 옮기면 "언더트리거" 위험이 있어(특히
  한 줄짜리 작업), CLAUDE.md는 없애지 않고 8줄 비협상 원칙만 남기는 하이브리드로 결정.
- `skills/karpathy-guidelines/`(forrestchang 저작, 외부 브랜드)를 폐기하고 `skills/mykit/`로
  대체 — 단, 이번엔 브랜딩/구조만 옮기고 규칙 9개 항목의 문구 자체는 그대로 둔다. 내용
  재작성은 사용자가 "같이 재정의해 나가고 싶다"고 해서 다음 단계로 미룸.
- `skills/mykit/references/`의 소스는 저장소 루트 `playbook/`이 아니라 `templates/{en,ko}/**`다
  — 루트 `playbook/`은 이 저장소 자신에 `mykit init`을 한 번 돌린 dogfood 산출물이라 스택이
  일부만 있고 일부 파일은 마스터와 미묘하게 다름(드리프트). `playbook/en/api.md`,
  `playbook/en/backend/nestjs-api.md`는 `templates/`에 없는 파일 — 마스터에 역반영 안 된
  수동 추가분으로 보이나 이번엔 건드리지 않음.
- `${CLAUDE_PLUGIN_ROOT}`는 hooks.json/MCP 설정/skill frontmatter의 `allowed-tools`에서
  실제로 쓰이는 걸 `~/.claude/cache/changelog.md`에서 확인했지만, SKILL.md 본문(자유 실행
  지시)에서 Bash로 실행할 때도 주입되는지는 미검증 — `skills/mykit/SKILL.md`에 자기 경로
  추론 폴백 문구를 넣어둠.
- AGENTS.md(Codex용)는 CLAUDE.md와 달리 13개 규칙을 담고 있고 Codex엔 스킬 메커니즘이
  없어서 이번엔 축소하지 않고 그대로 뒀다 — 사용자에게 확인 질문을 보냈으나 응답이
  없어 안전한 쪽(유지)으로 판단. 다음 세션에서 재확인 필요.
- 타깃 프로젝트에 `.claude/skills/mykit/`을 생성하도록 `src/generator.js`를 다시 짜는 건
  이번 스코프 밖 — `skills/mykit/`(mykit 저장소 자신의 설치형 스킬)만 이번에 만들었다.

## 2026-07-21

- 포트폴리오 프로젝트는 좋은 UI 사례가 많지만 지역적 철학과 도메인 구현이 섞여 있다.
- `mykit`에는 여러 프로젝트에 재사용 가능한 추상 규칙만 가져온다. 예를 들어 `IconButton`,
  `SegmentedButton`, `ChipSelect`, `CodeField`처럼 공통 UI primitive 패턴은 일반화 가능하지만
  `ProjectCard` 같은 도메인 컴포넌트는 규칙으로 굳히지 않고 예시로만 언급한다.
- 문서 구조는 `references/philosophy/*`를 박물관처럼 오래 유지할 판단 기준으로 두고,
  `actions/*`를 실제 작업을 시작할 때 쓰는 intake/확인/실행 프롬프트로 분리한다.
- 새 컴포넌트 요청 시 사용자가 긴 폼을 채우게 하지 않는다. 에이전트가 컴포넌트 계층,
  상태 소유자, 접근성, 반응형, i18n, 검증 범위를 먼저 제안하고 확인 또는 수정을 받는다.
- 사용자 확인 메시지는 내부 판단 bullet을 그대로 보여주지 않는다. 실제로 구현될 사용 코드,
  HTML shape, props 타입, interaction flow, test preview 중 필요한 것만 1~2개 보여주는
  preview-first 형식으로 바꾼다.
- action은 특정 스택/스타일을 가정하지 않는다. 먼저 해당 프로젝트의 package manager,
  framework, directory structure, nearby files, test style, error/i18n/a11y/responsive 패턴을
  읽고, 프로젝트 관례에 맞춘 preview를 만든다.
- 새 surface area, public contract, 데이터 모델, 보안, 성능, 테스트 기준에 영향을 주는 작업은
  preview 확인을 받는다. typo, 누락 import 제거, 명백한 lint/type error, 기존 패턴과 동일한
  단일 prop 전달처럼 좁고 되돌리기 쉬운 작업은 관례 확인 후 바로 진행할 수 있다.
- `review-code-style.md`는 formatter/linter 대체가 아니라 mykit 취향의 흐름, 책임 경계,
  JSX 정리, 테스트 표현 방식 리뷰로 둔다. 공백, quote, semicolon, import order는 프로젝트
  도구가 담당한다.
- 확장 action으로 `integrate-library.md`, `add-background-job.md`, `review-pr.md`를 추가했다.
  dependency/provider 연동은 비용·보안·runtime 영향이 커서 기존 helper 대체 가능성과 env/mock
  전략을 먼저 확인한다. background job은 retry/idempotency/concurrency/observability를
  필수 확인한다. PR 리뷰는 구현 action과 달리 findings-first 출력으로 둔다.
- `add-feature.md`를 상위 orchestration action으로 추가했다. "검색 기능", "북마크 기능",
  "알림 기능"처럼 프로젝트 도메인 기능 요청이 들어오면 사용자 흐름으로 재작성하고 UI/API/data
  model/test/security/docs 하위 action으로 쪼갠 뒤 가장 작은 1차 범위를 제안한다.

## 2026-07-21 공개 전 정리

- GitHub 공개 전 패키지 검증에서 로컬 Claude 설정, 실험 결과, 이전 pack 산출물, `package/`
  폴더가 npm package에 포함될 수 있음을 확인했다. `package.json`의 `files`를 명시해 CLI,
  템플릿, mykit skill, plugin metadata, README, LICENSE만 포함되도록 좁혔다.
- 공개 package에 포함하지 않는 `experiments/`를 가리키는 npm scripts는 제거했다. 실험 스크립트가
  필요하면 package 대상과 별도의 dev-only 파일로 분리하는 편이 맞다.
- npm cache 권한 문제 때문에 `npm pack --dry-run` 검증은 `npm_config_cache=/private/tmp/mykit-npm-cache`
  환경값을 붙여 실행한다.
- 최종 pack dry-run 결과는 `mykit@0.1.0`, `entryCount: 182`, `filename: mykit-0.1.0.tgz`다.
  이전에 섞였던 `.claude/`, `package/`, `*.tgz`, 실험 결과 파일은 포함되지 않는다.
- `experiments/`는 현재 추적된 파일이 없고 실험용 scripts도 package에서 제거했으므로 공개 커밋에
  섞이지 않도록 폴더 전체를 ignore한다.
- `is`는 템플릿 예시에서만 언급되고 CLI 런타임에서 import하지 않으므로 package dependency에서
  제거한다.
