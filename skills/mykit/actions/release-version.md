# Release Version

`develop`에서 작업을 마치고 `main`으로 릴리즈를 컷하면서 버전을 올릴 때 사용한다. 예:
"버전 올려줘", "릴리즈해줘", "release 진행", "배포 버전 갱신".

## CHANGELOG 형식

CHANGELOG는 내부 커밋 로그 요약이 아니라 사용자가 읽는 릴리즈 노트다.

- 제목은 `# Changelog`. 버전마다 `## vX.Y.Z` 다음 줄에 `vX.Y.Z 릴리즈 노트입니다.`, 그 아래
  `<br />`로 띄운다.
- 커밋 종류(`feat`/`fix`)가 아니라 사용자가 체감하는 결과 단위로 묶어 `### <한 줄 요약>`
  헤딩을 붙이고, 그 아래 bullet 2~4개를 둔다. 그룹 사이도 `<br />`로 띄운다.
- 모든 문장은 `-습니다`/`-ㅂ니다`로 끝난다 (개선했습니다, 추가했습니다, 확인합니다,
  줄어듭니다). `-다`나 명사형 종결은 쓰지 않는다.
- 구현 용어(컴포넌트명, PR 번호, 내부 경로) 대신 사용자가 보는 화면과 동작 기준으로 쓴다.
- 첫 공개 버전은 헤딩 없이 `- 첫 공개 버전입니다.` 한 줄로 끝낸다.
- 프로젝트에 이미 다른 형식이 확립돼 있으면 그 형식을 따른다.

## 원칙

- squash merge, 버전 SOT 갱신, lockfile 갱신, 커밋을 **하나의 release 커밋**으로 묶는다.
- 버전 SOT는 절대 하드코딩한 파일 목록으로 고정하지 않는다. 매번 `package.json`을 기준으로
  스캔한다.
- 검증에 실패하거나 병합 충돌이 나면 즉시 멈추고 사용자에게 보고한다. 임의로 충돌을
  해결하거나 검증을 건너뛰고 진행하지 않는다.
- `push`는 이 액션의 범위에 포함하지 않는다. 로컬 커밋·태그·`develop` 병합까지만 하고,
  push 여부는 항상 별도로 확인받는다.

## Project Scan

- 현재 브랜치와 `git status`로 `main`/`develop` 두 브랜치가 모두 clean한지.
- `develop`이 `main`보다 앞서 있는지 (`git log main..develop`). 앞서 있지 않으면 릴리즈할
  변경이 없다는 뜻이므로 사용자에게 확인한다.
- 패키지 매니저. `package-lock.json` → npm, `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn.
- `package.json`의 현재 `"version"` 값.
- 같은 버전 문자열을 `"version"` 필드로 가진 다른 매니페스트 (`.claude-plugin/plugin.json`,
  `.claude-plugin/marketplace.json` 등 프로젝트마다 다를 수 있음). 하드코딩된 목록이 아니라
  스캔으로 찾는다.
- `package.json`의 `scripts`에서 검증 커맨드 후보 (`test`, `build`, `check`, `lint` 순으로 존재
  여부 확인).
- `CHANGELOG.md` 존재 여부와 기존 버전 항목의 포맷. 위 "CHANGELOG 형식"과 다른 형식이 이미
  확립되어 있으면 기존 형식을 유지한다.
- 기존 `git tag` 목록과 네이밍 규칙 (`v` 접두사 유무).

## Confirmation Policy

릴리즈 이력은 되돌리기 어렵기 때문에 아래 각 단계는 항상 확인받는다.

- squash merge 실행 전 (버전 종류와 대상 커밋 확정).
- 버전 SOT 파일 목록과 CHANGELOG 초안 확정 전.
- 최종 release 커밋 실행 전.
- 태그 생성 전.

## Confirmation Prompt

```text
릴리즈를 이렇게 진행하려고 합니다. 괜찮을까요?

대상 커밋 (develop, main보다 5개 앞섬).
- feat: 패키지 메타데이터 및 라이선스 업데이트
- docs: MIT 라이선스 추가
- docs: Claude 가이드라인 간소화 및 오토커밋 제거
- docs: mykit skill 초기 설정
- chore: node_modules git 관리 대상 제거

버전 추천.
현재 0.1.1 → minor(0.2.0) 추천.
이유: feat 커밋이 포함되어 있고, 기존 public contract를 깨는 변경은 없습니다.

버전 SOT (스캔 결과, 현재 0.1.1을 가진 파일).
- package.json
- .claude-plugin/plugin.json
- .claude-plugin/marketplace.json (metadata.version, plugins[0].version)

검증 커맨드.
npm run check

CHANGELOG.md 초안.
## v0.2.0

v0.2.0 릴리즈 노트입니다.

<br />

### 패키지 메타데이터가 라이선스 기준에 맞게 정리됩니다.

- MIT 라이선스와 패키지 메타데이터를 맞춥니다.
- 그래서 배포 정보와 실제 라이선스가 어긋나던 부분이 줄어듭니다.

태그.
v0.2.0 (annotated)

어떻게 진행할까요?
- 이대로 진행 (minor, 위 SOT, 위 CHANGELOG 초안).
- 버전 종류 변경 (major/patch).
- CHANGELOG 초안 수정.
- 더 자세히 보기.
```

## Intake

- 확정된 버전 종류(major/minor/patch)와 다음 버전 문자열.
- 확정된 버전 SOT 파일 목록.
- 검증 커맨드와 통과 여부.
- 확정된 CHANGELOG.md 항목 (또는 생략 결정).
- 태그 이름 (`vX.Y.Z` 형식, 기존 태그 네이밍과 일치).

## Execution

1. **Pre-flight**: `main`/`develop` clean 여부, `develop`이 `main`보다 앞서 있는지 확인한다.
   문제가 있으면 멈추고 보고한다.
2. `git log main..develop --oneline`으로 대상 커밋을 읽는다. Conventional 스타일이면
   `feat`→minor, `fix`/`chore`/`docs`→patch, 파괴적 변경 표시(`BREAKING CHANGE`, 명시적 호환성
   깨짐)→major로 판단해 **주 버전(Major, X.0.0) — 하위 호환되지 않는 변경 / 부 버전(Minor,
   0.X.0) — 하위 호환되는 기능 추가 / 수 버전(Patch, 0.0.X) — 하위 호환되는 버그 수정** 기준으로
   추천값을 제시한다. 최종 선택은 사용자가 확정한다.
3. `main`으로 전환하고 `git merge --squash develop`을 실행한다. 충돌 시 멈추고 사용자에게
   해결을 요청한다. 임의로 conflict marker를 지우지 않는다.
4. `package.json`의 현재 버전을 기준으로 확정된 bump 종류를 적용해 다음 버전을 계산한다.
5. Project Scan에서 찾은 버전 SOT 후보를 사용자에게 보여주고 확정받는다.
6. 확정된 모든 SOT 파일의 `"version"` 필드를 새 버전으로 갱신한다.
7. 감지된 패키지 매니저로 lockfile만 갱신한다 (`npm install --package-lock-only`,
   `pnpm install --lockfile-only` 등). `node_modules`는 건드리지 않는다.
8. 감지된 검증 커맨드를 실행한다. 실패하면 커밋하지 않고 실패 원인을 보고한 뒤 멈춘다.
9. `CHANGELOG.md`가 있으면 2단계에서 읽은 커밋들을 위 "CHANGELOG 형식"대로 정리해 초안을
   제시한다. 프로젝트에 이미 다른 형식이 확립돼 있으면 그 형식을 따른다. 확정되면 최상단에
   새 버전 섹션을 추가한다.
10. `git add .` 후 `git commit -m "release: vX.Y.Z"`로 커밋한다.
11. `git tag -a vX.Y.Z -m "release: vX.Y.Z"`로 annotated tag를 생성한다.
12. `git switch develop` 후 `git merge main`으로 병합해 이후 충돌을 방지한다. 충돌 시 멈추고
    보고한다.
13. 최종 보고에 다음 버전, 갱신한 SOT 파일, 검증 결과, 생성된 태그를 요약하고, `main`/
    `develop`/태그의 push 여부는 별도로 확인받아야 한다고 명시한다.
