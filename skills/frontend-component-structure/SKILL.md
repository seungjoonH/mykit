---
name: frontend-component-structure
description: React + TypeScript + Vite 프로젝트에서 컴포넌트를 생성하거나 수정할 때 layout, design, composed, interactive, feature 계층과 component-folder 구조를 적용하고 TypeScript/Vite import alias를 함께 유지한다. 기존 컴포넌트 구조를 마이그레이션하는 code-refactoring 작업에도 사용한다. Next.js 등 Vite가 아닌 프로젝트나 컴포넌트가 아닌 순수 로직 모듈 재구성에는 적용하지 않는다.
---

# Frontend Component Structure

React + TypeScript + Vite 컴포넌트의 물리 구조와 import 경계를 함께 관리한다. 폴더 깊이만
늘리고 alias를 빠뜨린 결과는 실패다.

## 적용 모드

- 컴포넌트 생성·수정은 이 문서의 일반 작업 절차를 따른다.
- 기존 코드베이스를 대상으로 한 `code-refactoring`이면 작업 전에
  [references/migration.md](references/migration.md)를 추가로 읽고 마이그레이션 모드로
  진행한다.
- 구조 선택이나 배럴 형태가 불분명할 때만
  [references/examples.md](references/examples.md)를 참고한다.

## 설정

`COMPONENT_FOLDER_THRESHOLD = 3`을 기본 임계값으로 사용한다. 사용자가 다른 값을 지정하면
그 작업에서는 지정값을 우선한다.

카테고리 안의 논리적 컴포넌트 수가 임계값 이상이면 각 컴포넌트를 자기 폴더에 둔다. 임계값
미만이면 기존 flat 구조를 유지할 수 있다. 파일 수가 아니라 컴포넌트 수를 센다.

## 분류

새 컴포넌트는 상위 개념부터 `feature` → `layout` → `composed` → `interactive` → `design`
순서로 배제하며 판단한다.

| 카테고리 | 판단 기준 |
|---|---|
| `feature` | 여러 composed를 조합해 화면이나 기능 하나를 완성하는 최상위 단위 |
| `layout` | 콘텐츠 의미와 무관한 배치, 그리드, 분할 전용 단위 |
| `composed` | 여러 design/interactive를 조합한 중간 단위. 도메인 로직 포함 가능 |
| `interactive` | 단일 책임의 상호작용 요소. 작은 로컬 상태는 가능하지만 비즈니스 로직은 없음 |
| `design` | 상태와 로직 없이 props를 표현하는 순수 시각 단위 |

둘 이상의 분류가 실질적으로 가능하면 가장 가까운 기존 컴포넌트 1~2개와 판단 근거를 먼저
제시하고 사용자에게 범위를 확인한다.

## 표준 구조

폴더 분리 대상은 다음 형태를 사용한다.

```text
src/components/<category>/<ComponentName>/
├── <ComponentName>.tsx
├── <ComponentName>.module.css  선택 사항
└── index.ts
```

- 폴더 분리 대상에는 `index.ts`를 반드시 둔다.
- 컴포넌트가 default export면 `export { default } from './ComponentName';`으로 재노출한다.
- named export도 사용하면 `export * from './ComponentName';`을 함께 둔다.
- 컴포넌트 폴더 내부의 CSS Module과 로컬 파일은 `./` 상대경로를 유지한다.
- 다른 폴더나 카테고리로 이동하는 import는 alias를 사용한다.

## Alias 계약

다음 매핑을 고정 계약으로 유지한다.

```text
@/*            -> src/*
@composed/*    -> src/components/composed/*
@design/*      -> src/components/design/*
@interactive/* -> src/components/interactive/*
@layout/*      -> src/components/layout/*
@feature/*     -> src/components/feature/*
@hooks/*       -> src/hooks/*
@lib/*         -> src/lib/*
@styles/*      -> src/styles/*
```

작업 전에 `tsconfig.json`, Vite 설정, `package.json`을 읽는다.

- `tsconfig.json`의 `compilerOptions.baseUrl`과 `paths`에 alias를 반영한다.
- 프로젝트가 `vite-tsconfig-paths`를 실제 Vite 플러그인으로 사용하면 Vite 설정에 alias를
  중복 선언하지 않는다.
- 그렇지 않으면 `vite.config.ts`의 `resolve.alias`에도 같은 매핑을 반영한다. 프로젝트가 쓰는
  `fileURLToPath`, `path.resolve` 등 기존 Vite 방식에 맞춘다.
- tsconfig와 Vite를 따로 관리하는 경우 두 목록의 의미가 일치해야 한다.
- `../../`처럼 두 단계 이상 상위로 이동하는 새 import는 만들지 않는다. 기존 파일을 수정하며
  직접 건드린 import도 alias로 바꾸되, 무관한 파일 전체를 일괄 정리하지 않는다.

## 일반 작업 절차

1. 프레임워크와 기존 폴더, export, alias 관례를 실제 파일에서 확인한다.
2. 새 컴포넌트를 분류하고 해당 카테고리의 논리적 컴포넌트 수를 센다.
3. 임계값과 기존 구조에 따라 flat 또는 component-folder 형태를 선택한다. 임계값 도달로 기존
   형제까지 옮겨야 한다면 그것은 범위 확장이므로 이동 범위를 사용자에게 확인한다.
4. 필요한 컴포넌트, CSS Module, `index.ts`를 만들거나 수정한다.
5. alias가 없으면 Alias 계약에 따라 tsconfig와 Vite 설정을 함께 갱신한다.
6. 새 import와 직접 건드린 import를 alias 규칙에 맞춘다.
7. 아래 검증을 실행하고 실제 결과를 보고한다.

## 검증

- 폴더로 새로 만들거나 옮긴 모든 컴포넌트에 `index.ts`가 있는지 확인한다.
- `vite-tsconfig-paths` 사용 여부와 tsconfig/Vite alias 동기화 상태를 확인한다.
- import 문에서 두 단계 이상 상위 상대경로가 새로 생기지 않았는지 검색한다.
- 같은 컴포넌트 폴더 내부 참조가 불필요하게 alias로 바뀌지 않았는지 확인한다.
- 프로젝트의 typecheck와 build를 실행한다. 별도 명령이 없으면 `tsc --noEmit`과 Vite build에
  해당하는 package script를 사용한다.

## 범위 제외

- `lib/flowMarkdown` 같은 비컴포넌트 순수 로직 모듈의 내부 재구성.
- 기존 프로젝트의 컴포넌트 네이밍 규칙 변경.
- 요청과 무관한 상대경로의 전면 정리. 전면 정리는 마이그레이션 모드에서만 수행한다.
