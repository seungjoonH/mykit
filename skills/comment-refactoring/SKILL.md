---
name: comment-refactoring
description: "코드를 생성하거나 수정하는 모든 작업에 반드시 적용하는 주석 리팩토링 스킬. 새 파일, 새 함수, 코드 스니펫, 기존 코드 수정, 리팩토링, 버그 수정, 코드 리뷰 반영 등 코드가 산출물에 포함되는 모든 turn에 사용자가 명시적으로 요청하지 않아도 예외 없이 자동 트리거한다. 언어, 프레임워크, 작업 종류와 무관하게 적용하며 과소 트리거하지 않는다."
---

# Comment Refactoring

코드가 산출물에 포함되는 모든 작업에서 이 주석 전략을 강제로 적용한다. 사용자가
`comment-refactoring 써줘`라고 직접 부르지 않아도 반드시 적용한다.

## 트리거

다음 경우를 포함해 코드를 생성하거나 수정하는 모든 turn에 예외 없이 적용한다.

- 새 파일이나 새 함수 작성.
- 답변에 코드 스니펫 작성.
- 기존 코드 수정, 리팩토링, 버그 수정.
- 코드 리뷰 의견 반영.
- 언어, 프레임워크, 작업 종류와 무관하게 코드가 산출물에 포함되는 모든 작업.

## 적용 범위

- 새로 작성하거나 직접 수정하는 코드에만 이 규칙을 적용한다.
- 기존 코드베이스에 다른 스타일의 주석이 있어도 손대지 않은 부분의 주석은 유지한다.
- 사용자가 전체 코드를 이 스타일로 바꿔 달라고 명시한 경우에만 기존 주석까지 다시 쓴다.

## 주석 규칙

### 파일 최상단

- 언어 관례가 허용하면 다음 형식을 사용한다.

```text
/** 파일명
 * 한 줄 설명
 */
```

- 해당 언어에서 위 형식이 부적절하면 언어 관례에 맞는 docstring이나 주석으로 대체한다.
- 설명은 `~하는 코드`, `~하는 라우터` 수준으로 매우 짧게 한 줄만 쓴다.
- 상세 설명을 넣지 않는다.
- shebang이나 언어 필수 지시문이 있으면 그 바로 아래에 둔다.

### 코드 블록 바로 위

- 함수, 핸들러, `if`와 `else`, `try`와 `catch`, 반복문 등 각 코드 블록의 핵심 동작을
  바로 위 한 줄 주석으로 쓴다.
- 주석에서 괄호 `()`와 `[]`를 사용하지 않는다.
- 가운뎃점, 콜론, 세미콜론 등 구두점을 사용하지 않는다.
- 마침표를 사용하지 않는다.
- 명사형으로 끝낸다.
- `~한다` 같은 서술형으로 끝내지 않는다.
- 부연 설명 없이 핵심 동작만 쓴다.

### 자명한 코드

- 단순 대입이나 단순 반환처럼 너무 자명한 한 줄에는 주석을 달지 않는다.
- 모든 줄을 설명하지 않고 블록당 꼭 필요한 곳에만 주석을 둔다.

## 기준 예시

아래 before와 after를 이 규칙의 우선 레퍼런스로 사용한다.

### Before

```typescript
// GET/PUT /api/file — 문서 하나를 읽고 쓴다. 쓰기는 버전이 다르면 충돌로 거절한다.
import { Router } from "express";
import { readDocument, writeDocument } from "../fsTree.js";
import type { SaveFileRequest } from "../../shared/types.js";

export const fileRouter = Router();

fileRouter.get("/", async (req, res) => {
const relativePath = String(req.query.path ?? "");
if (!relativePath) {
res.status(400).json({ error: "path query is required." });
return;
}

try {
const { content, version } = await readDocument(relativePath);
res.json({ path: relativePath, content, version });
} catch {
res.status(404).json({ error: "File not found." });
}
});

fileRouter.put("/", async (req, res) => {
const body = req.body as SaveFileRequest;
if (!body?.path) {
res.status(400).json({ error: "path is required." });
return;
}

try {
const current = await readDocument(body.path).catch(() => null);
if (current && current.version !== body.baseVersion) {
res.status(409).json({
error: "conflict",
current: { path: body.path, content: current.content, version: current.version },
});
return;
}

const version = await writeDocument(body.path, body.content);
res.json({ version });
} catch {
res.status(500).json({ error: "Failed to save." });
}
});
```

### After

```typescript
/**
 * fileRouter.ts
 * 파일 하나를 읽고 쓰는 라우터
 */
import { Router } from "express";
import { readDocument, writeDocument } from "../fsTree.js";
import type { SaveFileRequest } from "../../shared/types.js";

export const fileRouter = Router();

fileRouter.get("/", async (req, res) => {
// path 파라미터 추출
const relativePath = String(req.query.path ?? "");

// path 없으면 에러 응답
if (!relativePath) {
res.status(400).json({ error: "path query is required." });
return;
}

try {
// 문서 읽기
const { content, version } = await readDocument(relativePath);
res.json({ path: relativePath, content, version });
} catch {
// 파일 없음 응답
res.status(404).json({ error: "File not found." });
}
});

fileRouter.put("/", async (req, res) => {
// 요청 바디 파싱
const body = req.body as SaveFileRequest;

// path 없으면 에러 응답
if (!body?.path) {
res.status(400).json({ error: "path is required." });
return;
}

try {
// 기존 문서 조회
const current = await readDocument(body.path).catch(() => null);

// 버전 충돌 검사
if (current && current.version !== body.baseVersion) {
  res.status(409).json({
    error: "conflict",
    current: { path: body.path, content: current.content, version: current.version },
  });
  return;
}

// 문서 저장
const version = await writeDocument(body.path, body.content);
res.json({ version });
} catch {
// 저장 실패 응답
res.status(500).json({ error: "Failed to save." });
}
});
```
