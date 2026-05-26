# mykit

<br clear="both" />
<br clear="both" />

<div align="center">

**프로젝트 스택을 선택하면 에이전트용 플레이북과 작업 지침을 즉시 생성하는 CLI**

<blockquote>mykit은 새 프로젝트를 시작할 때 반복해서 작성하던 AGENTS, CLAUDE, Cursor Rules, PLAYBOOK 문서를<br/>선택한 기술 스택에 맞춰 한 번에 생성하기 위해 만든 개발 워크플로우 키트입니다.</blockquote>

<br />
<br />

</div>

<br clear="both" />
<br clear="both" />
<br clear="both" />

## Features

<br clear="both" />

### 1. 플레이북 언어 선택

생성할 플레이북 문서의 기본 언어를 선택합니다.

```text
? Select playbook language
❯ en
  ko

↑↓ navigate • ⏎ select
```

<br clear="both" />

### 2. 프론트엔드 스택 선택

```text
? Select frontend stack
❯ nextjs
  react-vite
  vue-nuxt
  sveltekit
  vanilla-js

↑↓ navigate • ⏎ select
```

<br clear="both" />

### 3. CSS 전략 선택

```text
? Select CSS strategy
❯ tailwindcss
  css-module

↑↓ navigate • ⏎ select
```

<br clear="both" />

### 4. 백엔드 스택 선택

```text
? Select backend stack
  none (frontend only)
  express
❯ nestjs
  spring

↑↓ navigate • ⏎ select
```

<br clear="both" />

### 5. 데이터베이스 스택 선택

```text
? Select database stacks (optional, space to toggle)
◯ postgres
◯ mysql
◯ mongodb
◯ redis
◯ supabase

Space toggle • Enter submit
```

<br clear="both" />

### 6. 인프라 스택 선택

```text
? Select infra stacks (optional, space to toggle)
◯ aws
◯ gcp
◯ azure
◯ vercel
◯ kubernetes

Space toggle • Enter submit
```

<br clear="both" />

### 7. 공통 문서 선택

```text
? Select cross-cutting docs
◯ security
◯ testing

Space toggle • Enter submit
```

<br clear="both" />

### 8. AI 가이드 파일 선택

```text
? Select AI guide files (space for multi-select)
◉ all
◯ agents
◯ claude
◯ cursor-rules
◯ examples

Space toggle • Enter submit
```

<br clear="both" />

### 9. 커밋 방식 선택

```text
? Commit behavior
❯ auto — commit when a logical unit is complete
  manual — never commit without explicit user approval

↑↓ navigate • ⏎ select
```

<br clear="both" />
<br clear="both" />
<br clear="both" />

## Tech Stacks

<br clear="both" />

#### Runtime

<span>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white">
  <img src="https://img.shields.io/badge/JavaScript_ESM-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111111">
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white">
</span>

#### CLI

<span>
  <img src="https://img.shields.io/badge/Inquirer-111827?style=for-the-badge">
  <img src="https://img.shields.io/badge/Node_fs%2Fpath-3C873A?style=for-the-badge&logo=node.js&logoColor=white">
</span>

#### Data

<span>
  <img src="https://img.shields.io/badge/YAML-CB171E?style=for-the-badge&logo=yaml&logoColor=white">
  <img src="https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white">
</span>

#### Output

<span>
  <img src="https://img.shields.io/badge/AGENTS.md-2563EB?style=for-the-badge">
  <img src="https://img.shields.io/badge/CLAUDE.md-7C3AED?style=for-the-badge">
  <img src="https://img.shields.io/badge/Cursor_Rules-111827?style=for-the-badge">
  <img src="https://img.shields.io/badge/PLAYBOOK-0F766E?style=for-the-badge">
</span>

<br clear="both" />
<br clear="both" />
<br clear="both" />

## Templates

<br clear="both" />

[templates](templates/)는 `mykit init`이 프로젝트에 복사하는 원본 문서 모음입니다. <br />
`en`과 `ko`는 같은 카테고리 구조를 공유하고, `ai`는 에이전트별 가이드 파일을 따로 보관합니다.

```text
templates/
├── ai/
│   ├── AGENTS.md
│   ├── CLAUDE.md
│   ├── EXAMPLES.md
│   └── cursor-rules/
├── en/
│   ├── core/
│   ├── frontend/
│   ├── backend/
│   ├── database/
│   ├── infra/
│   ├── security.md
│   └── testing.md
└── ko/
    ├── core/
    ├── frontend/
    ├── backend/
    ├── database/
    ├── infra/
    ├── security.md
    └── testing.md
```

<br clear="both" />
<br clear="both" />
<br clear="both" />

## Getting Started

<br clear="both" />

### 설치 및 실행

```sh
# 의존성 설치
npm install

# 인터랙티브 생성
npm run mykit -- init

# 드라이런으로 생성 파일 확인
npm run mykit -- init --dry-run --frontend nextjs --backend nestjs --db postgres --infra vercel --doc security --doc testing --ai all
```

<br />

### 기본 명령

- `npm run mykit -- init`
- `npm run mykit -- init --dry-run`
- `npm run check`

<br />

### 주요 옵션

```text
--dry-run
--lang <en|ko>
--frontend <nextjs|react-vite|vue-nuxt|sveltekit|vanilla-js>
--css <tailwindcss|css-module>
--backend <express|nestjs|spring>
--db <postgres|mysql|mongodb|redis|supabase>
--infra <aws|gcp|azure|vercel|kubernetes>
--doc <security|testing>
--ai <agents|claude|cursor-rules|examples|all>
--commit <auto|manual>
```

<br />

### 생성 파일

```text
PLAYBOOK.md
AGENTS.md
CLAUDE.md
EXAMPLES.md
.cursor/rules/mykit-workflow.mdc
.cursor/rules/karpathy-guidelines.mdc
design/design.md
design/architecture.md
design/erd.md
design/api-spec.md
playbook/PLAYBOOK.index.yaml
playbook/mykit.selection.yaml
playbook/**/*.md
```

<br clear="both" />
<br clear="both" />
<br clear="both" />

## License

ISC License · mykit
