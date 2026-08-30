# Audit Directory Structure

계층·도메인·라우트 루트에 쌓인 구현 파일을 유닛 폴더 또는 관심사 하위 폴더로 정리할 때
쓴다. `code-refactoring` dispatcher가 항상 호출한다. 직접
`/mykit:audit-directory-structure`로 불러도 된다. 프론트만이 아니다.

계층이 틀린 파일은 이 액션이 폴더로 싸지 않는다.
`$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/place-layer.md`로 보낸다.

유닛 폴더 계약은 `$CLAUDE_PLUGIN_ROOT/skills/mykit/references/en/frontend/ui/component.md`,
관심사 하위폴더는 `$CLAUDE_PLUGIN_ROOT/skills/mykit/references/en/core/code-hygiene.md`다.
한국어면 같은 경로의 `ko`를 연다.

## mustHold

여러 파일이 한 의미면 자기 폴더다. 계층·도메인·라우트 루트에 구현 파일을 쌓지 않는다.
관심사 하위 폴더로 나눈다. 파일 하나마다 폴더를 만들지 않는다. 순수 유틸은 파일로 둔다.
계층 오배치는 `place-layer`다.

## Project Scan

`components/`, `lib/`, 라우트 폴더와 비코로케이션 테스트 폴더를 스캔한다. 디렉터리 루트의
형제 `*.tsx` / `*.module.css` / `use*.ts`와, 도메인 폴더 루트의 형제 `*.ts` 덤프가
신호다. 테스트 폴더는 가능한 한 소스의 도메인 구조를 반영하는지 확인한다.

물리 파일 수가 아니라 논리적 구현 단위 수를 본다. 같은 이름의 `Component.tsx`,
`Component.module.css`, `useComponent.ts`, `Component.types.ts`는 한 단위다. 직접 구현
단위가 20개 이상이면 점검 신호지만 숫자만으로 분리하지 않는다. 같은 추상화 수준의 디자인
시스템처럼 응집된 폴더인지, 공용 폴더에 도메인 구현이 섞인 폴더인지 함께 판단한다.

`page.tsx` / `layout.tsx` / `route.ts` / 그룹 공용 `api.ts` 같은 예약 파일과 facade는
과밀도 계산에서 뺀다.

루트에 구현 파일이 둘 이상 형제로 있으면 후보다.

스캔 결과는 `개선 필요`, `개선 후보`, `허용`으로 나눈다. 역할이 섞이고 과밀하면 `개선
필요`, 응집됐지만 커질 여지가 있으면 `개선 후보`, 같은 추상화 수준으로 탐색 가능한 크기면
`허용`이다.

## 확인 정책

확인은 범위만 받는다. 합의한 범위 안에서 파일을 옮기고 import를 고친 뒤 사후에 보고한다.
새 폴더 이름을 만들기 전에 따로 묻지 않는다. 범위 밖은 고치지 않고 보고만 한다.

## Confirmation Prompt

```text
이번에 만지는 범위는 이 디렉터리의 폴더 덤프다.

범위 안에서 할 것.
한 의미의 tsx/css/훅은 유닛 폴더로 옮긴다.
도메인 루트에 쌓인 구현 파일은 관심사 하위 폴더로 나눈다.

범위 밖. 고치지 않고 보고만 한다.
(없으면 생략)

어떻게 진행할까요?
- 이 범위로 고친다.
- 범위 수정.
```

## Review Checklist

- tsx, css, 훅, `type.ts`가 한 의미인데 계층·도메인·라우트 루트에 형제로 있는가
- 도메인 폴더 루트에 무관한 구현 파일이 십수 개 쌓여 있는가
- 물리 파일 수가 아니라 tsx/css/훅/type을 묶은 논리적 구현 단위 수를 셌는가
- 직접 구현 단위 20개 이상인 폴더의 역할 혼재도와 응집도를 함께 확인했는가
- 비코로케이션 테스트 폴더가 소스의 도메인 구조를 반영하는가
- 같은 추상화 수준의 응집된 폴더를 숫자만 보고 불필요하게 나누려 하는가
- 관심사 하나 = 파일 하나인 순수 유틸을 폴더로 감싸려 하는가
- 여러 유닛이 공유하는 css나 `api.ts`를 한 유닛 폴더로 집어넣으려 하는가
- 계층이 틀린 파일을 잘못된 층에서 폴더로 싸려 하는가
- 프로젝트가 쓰지 않는 `index.ts` barrel을 미리 만들려 하는가

## Execution

1. `components/`, `lib/`, 라우트와 비코로케이션 테스트 폴더를 스캔한다. tsx/css/훅/type을
   논리적 구현 단위로 묶어 세고, 20개 이상이면 역할 혼재도와 응집도를 점검한다.
   `page.tsx` / `layout.tsx` / `route.ts`와 그룹 공용 facade는 그대로 둔다.
2. 결과를 `개선 필요`, `개선 후보`, `허용`으로 분류하고 근거를 보고한다.
3. tsx+css+훅처럼 한 유닛이면 `Name/`을 만들고 그 파일들을 옮긴다.
4. 도메인 lib처럼 파일이 많고 유닛이 아니면 관심사 하위 폴더로 나눈다. 파일마다 폴더를
   만들지 않는다.
5. 비코로케이션 테스트는 가능한 한 소스의 도메인 구조를 따라 하위 폴더로 나눈다.
6. 여러 유닛이 공유하는 css와 `api.ts`는 그룹에 남긴다.
7. 호출부 import를 고친다. barrel은 프로젝트가 이미 쓰지 않으면 만들지 않는다.
8. 계층이 틀리면 폴더로 싸기 전에
   `$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/place-layer.md`로 보낸다.
9. 관련 lint/typecheck/test 중 가장 작은 검증을 실행한다.
