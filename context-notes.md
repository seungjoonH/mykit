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
