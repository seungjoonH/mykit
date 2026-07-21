- [x] Map rules from `code-quality.md` into generic + stack categories.
- [x] Define shared document template sections and tone.
- [x] Author English template payloads for all categories.
- [x] Author Korean template payloads for all categories.
- [x] Implement `mykit init` interactive and flag-based generation.
- [x] Validate generated outputs and command behavior.

## README rewrite

- [x] Inspect CLI behavior, stack, and generated outputs.
- [x] Write `README.md` in the requested format with terminal code blocks.
- [x] Verify README-related command behavior.

## mykit을 단일 "mykit" 스킬로 재구성

- [x] `skills/karpathy-guidelines/` 최신화(10번 규칙 동기화) 후 브랜드 제거하고 `skills/mykit/`로 대체.
- [x] `.claude-plugin/plugin.json`, `marketplace.json`을 mykit 고유 브랜딩으로 변경.
- [x] `skills/mykit/SKILL.md` 작성 — 행동 원칙 10개 + 스캐폴딩 절차 + 도메인 참고 라우팅.
- [x] `templates/{en,ko}/**`, `templates/ai/EXAMPLES.md`를 `skills/mykit/references/`로 복사.
- [x] `templates/ai/CLAUDE.md`, `CLAUDE.no-auto-commit.md`를 8줄 비협상 원칙으로 축소, 루트 `CLAUDE.md` 재동기화.
- [x] AGENTS.md는 이번엔 그대로 둠 — Codex 쪽은 추후 별도 진행하기로 확정.
- [x] `.cursor/rules/karpathy-guidelines.mdc`(템플릿+dogfood 산출물) 완전 삭제, `src/generator.js`의 cursor-rules 매핑에서 제거, README 생성 파일 목록 동기화. `npm run check` 29개 파일로 재확인.
- [ ] `mykit init`이 타깃 프로젝트에 `.claude/skills/mykit/`을 생성하도록 generator.js 재작업(다음 단계, 이번 스코프 밖).
- [x] 9개 규칙 중 프로세스 성격(1,2,3,4,7,8,9,10,5번)은 mykit에서 분리하기로 결정 — superpowers 플러그인 설치로 대체, mykit은 코드 취향(스타일/컴포넌트/CSS/반응형/접근성 등)만 담당.
- [x] `core/code-style.md`의 placeholder 오타를 `doSomething();`으로 수정(en+ko).
- [x] `backend/{express,nestjs,spring}.md`의 `Security`/`Testing Strategy` 섹션을 `security.md`/`testing.md` 참조로 축약, 중복 제거(en+ko). `Central Error Handling`은 스택별 고유 내용이라 유지.
- [x] 얇은 문서 8개(`core/data-design.md`, `core/code-hygiene.md`, `frontend/stacks/{react-vite,vue-nuxt,sveltekit}.md`, `infra/{aws,azure,vercel}.md`, en+ko)를 "아직 채워지지 않음" 빈 문서로 정리 — 실제 사용 중 느끼는 불편함 위주로 추후 채울 예정.
- [ ] `frontend/ui/component.md` 내용을 사용자와 구체화 진행 중.
- [ ] 나머지 문서(readability, naming, error-handling, performance, styling/*, ui/accessibility, ui/svg-icon, data/react-query, content/*, database/*, backend 3개의 Rules 본문, superpowers 실제 설치 후 CLAUDE.md 최종 슬림화)는 계속 대화하며 항목별 재작성.

## 범용 UI 액션/철학 skill 분리

- [x] `actions/add-component.md` 작성 — 컴포넌트 추가 작업의 intake/확인/실행 절차.
- [x] `references/philosophy/component-layers.md` 작성 — 범용 컴포넌트 계층 모델.
- [x] `references/philosophy/accessibility.md` 작성 — 범용 접근성 판단 기준.
- [x] `references/philosophy/responsive.md` 작성 — 범용 반응형 판단 기준.
- [x] `references/philosophy/i18n.md` 작성 — 범용 다국어 판단 기준.
- [x] `skills/mykit/SKILL.md` 라우팅 보강.
- [x] 기존 CLI 드라이런 검증.

## 범용 개발 action 세트

- [x] `add-component.md`에 Project Scan과 auto-confirm 기준 추가.
- [x] `add-page.md` 작성.
- [x] `add-api-endpoint.md` 작성.
- [x] `change-data-model.md` 작성.
- [x] `test-code.md` 작성.
- [x] `review-code-style.md` 작성.
- [x] `refactor-code.md` 작성.
- [x] `fix-bug.md` 작성.
- [x] `improve-performance.md` 작성.
- [x] `review-security.md` 작성.
- [x] `update-docs.md` 작성.
- [x] `SKILL.md` action 라우팅 확장.
- [x] 기존 CLI 드라이런 재검증.

## 확장 action 세트

- [x] `add-feature.md` 작성.
- [x] `integrate-library.md` 작성.
- [x] `add-background-job.md` 작성.
- [x] `review-pr.md` 작성.
- [x] `SKILL.md` action 라우팅 추가 확장.
- [x] 기존 CLI 드라이런 재검증.

## GitHub 공개 전 정리

- [x] `.gitignore`와 npm package 포함 파일 범위 정리.
- [x] `package.json`, `.claude-plugin/plugin.json`, README 라이선스를 MIT로 통일.
- [x] `core/code-style.md`의 placeholder 오타 수정.
- [x] README에 GitHub 적용 방법 추가.
- [x] `npm pack --dry-run` 재확인.
- [x] 기존에 추적되던 `node_modules/`, `package/`, `*.tgz`를 Git index에서 제거.
- [x] untracked `experiments/`가 공개 커밋에 섞이지 않도록 ignore 처리.
