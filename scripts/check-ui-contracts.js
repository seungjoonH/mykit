// UI 규칙의 핵심 의미와 생성 결과 드리프트를 검증한다.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findContentViolations } from "../src/content-checker.js";
import { generatePlaybook } from "../src/generator.js";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function read(relativePath) {
  return fs.readFile(path.join(repositoryRoot, relativePath), "utf8");
}

function includesAll(content, contracts, label) {
  for (const contract of contracts) {
    assert.match(content, contract, `${label} is missing contract: ${contract}`);
  }
}

const selection = {
  frontend: "nextjs",
  css: "css-module",
  backend: null,
  db: [],
  infra: [],
  docs: [],
  ai: ["agents", "examples"],
  language: "en",
  autoCommit: false,
};

const languageContracts = {
  en: {
    css: [/internal class assignment/i, /public style escape hatch/i, /features and pages own CSS Modules/i],
    component: [/take priority over primitive reuse/i, /Repeated flex\/grid is a signal/i],
    screen: [/Visual QA/i, /Content QA/i, /Classify visible text/i, /Functional completion and design completion are separate/i],
    content: [/platform copy/i, /runtime tenant\/user data/i, /Unicode symbols/i, /safety-critical guidance/i],
    errorHandling: [/keep the code cohesive/i, /never touch URL, method, header/i],
    accessibility: [/SSOT component/i, /banned outright/i],
    codeHygiene: [/used in only one place/i, /keep domain-agnostic pure functions/i],
  },
  ko: {
    css: [/내부 클래스 적용/, /public 스타일 탈출구/, /feature\/page가 화면 고유 layout/],
    component: [/primitive 재사용보다 우선/, /직접 CSS 사용 금지가 아니다/],
    screen: [/Visual QA/, /Content QA/, /사용자 노출 문구를 플랫폼 카피/, /기능 완료와 디자인 완료를 별도로 판정/],
    content: [/플랫폼 공통 카피/, /tenant\/user 런타임 데이터/, /Unicode 기호/, /안전에 필요한 설명/],
    errorHandling: [/응집성을 지킨다/, /URL, method, header/],
    accessibility: [/SSOT 컴포넌트가 있는지 먼저 확인/, /원칙적으로 금지/],
    codeHygiene: [/한 곳에서만 쓰는 로직/, /utils\//],
  },
};

for (const [language, contracts] of Object.entries(languageContracts)) {
  for (const sourceRoot of ["templates", "skills/mykit/references"]) {
    const css = await read(`${sourceRoot}/${language}/frontend/styling/css-module.md`);
    const component = await read(`${sourceRoot}/${language}/frontend/ui/component.md`);
    const screen = await read(`${sourceRoot}/${language}/frontend/ui/screen.md`);
    const content = await read(`${sourceRoot}/${language}/frontend/content/ui-copy.md`);
    const errorHandling = await read(`${sourceRoot}/${language}/core/error-handling.md`);
    const accessibility = await read(`${sourceRoot}/${language}/frontend/ui/accessibility.md`);
    const codeHygiene = await read(`${sourceRoot}/${language}/core/code-hygiene.md`);
    includesAll(css, contracts.css, `${sourceRoot} ${language} CSS Module`);
    includesAll(component, contracts.component, `${sourceRoot} ${language} component`);
    includesAll(screen, contracts.screen, `${sourceRoot} ${language} screen`);
    includesAll(content, contracts.content, `${sourceRoot} ${language} UI copy`);
    includesAll(errorHandling, contracts.errorHandling, `${sourceRoot} ${language} error handling`);
    includesAll(accessibility, contracts.accessibility, `${sourceRoot} ${language} accessibility`);
    includesAll(codeHygiene, contracts.codeHygiene, `${sourceRoot} ${language} code hygiene`);
  }
}

const skill = await read("skills/mykit/SKILL.md");
const addComponent = await read("skills/mykit/actions/add-component.md");
const buildScreen = await read("skills/mykit/actions/build-screen.md");
const codeRefactoring = await read("skills/mykit/actions/code-refactoring.md");
const reviewCodeStyle = await read("skills/mykit/actions/review-code-style.md");
const auditHooks = await read("skills/mykit/actions/audit-hooks.md");
const auditApiLayer = await read("skills/mykit/actions/audit-api-layer.md");
const auditA11ySsot = await read("skills/mykit/actions/audit-a11y-ssot.md");
const auditComponentApi = await read("skills/mykit/actions/audit-component-api.md");
const auditHygiene = await read("skills/mykit/actions/audit-hygiene.md");
const updateRules = await read("skills/mykit/actions/update-rules.md");

includesAll(skill, [
  /actions\/build-screen\.md/,
  /references\/en\/frontend\/ui\/screen\.md/,
  /actions\/code-refactoring\.md/,
  /actions\/audit-hooks\.md/,
  /actions\/audit-api-layer\.md/,
  /actions\/audit-a11y-ssot\.md/,
  /actions\/audit-component-api\.md/,
  /actions\/audit-hygiene\.md/,
  /actions\/update-rules\.md/,
], "skill routing");
includesAll(addComponent, [/build-screen\.md/, /route\/page/, /code-refactoring\.md/, /audit-hooks\.md/], "add-component routing");
includesAll(buildScreen, [/구조적 QA/, /Visual QA/, /Content QA/, /금지 문자열을 자동 검색/, /기능 완료와 디자인 완료를 별도로 판정/, /code-refactoring\.md/], "build-screen action");
includesAll(reviewCodeStyle, [/review-code-style의 스코프 밖/, /code-refactoring\.md/], "review-code-style routing");
includesAll(codeRefactoring, [/dirty worktree/, /audit-hooks\.md/, /audit-api-layer\.md/, /audit-a11y-ssot\.md/, /audit-component-api\.md/, /audit-hygiene\.md/, /review-code-style\.md/], "code-refactoring dispatcher");
includesAll(auditHooks, [/audit-a11y-ssot\.md/, /audit-api-layer\.md/, /wiring/, /onSuccess/], "audit-hooks action");
includesAll(auditApiLayer, [/언어나 스택에 무관하게 적용된다/, /같은 리소스를 다루는/], "audit-api-layer action");
includesAll(auditA11ySsot, [/SSOT 컴포넌트/, /<select`/], "audit-a11y-ssot action");
includesAll(auditComponentApi, [/Base \+ Named Export/, /이름 있는 타입/], "audit-component-api action");
includesAll(auditHygiene, [/과도하게 잘게 쪼개진/, /utils\//], "audit-hygiene action");
includesAll(updateRules, [/source-rule-map\.md/, /스텁이면/, /가운뎃점/], "update-rules action");

const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "mykit-ui-contracts-"));
try {
  for (const language of Object.keys(languageContracts)) {
    const outputRoot = path.join(temporaryRoot, language);
    await generatePlaybook({
      cwd: outputRoot,
      selection: { ...selection, language },
    });

    const generatedCss = await fs.readFile(
      path.join(outputRoot, "playbook/frontend/styling/css-module.md"),
      "utf8",
    );
    const generatedComponent = await fs.readFile(
      path.join(outputRoot, "playbook/frontend/ui/component.md"),
      "utf8",
    );
    const generatedScreen = await fs.readFile(
      path.join(outputRoot, "playbook/frontend/ui/screen.md"),
      "utf8",
    );
    const generatedContent = await fs.readFile(
      path.join(outputRoot, "playbook/frontend/content/ui-copy.md"),
      "utf8",
    );
    const generatedErrorHandling = await fs.readFile(
      path.join(outputRoot, "playbook/core/error-handling.md"),
      "utf8",
    );
    const generatedAccessibility = await fs.readFile(
      path.join(outputRoot, "playbook/frontend/ui/accessibility.md"),
      "utf8",
    );
    const generatedCodeHygiene = await fs.readFile(
      path.join(outputRoot, "playbook/core/code-hygiene.md"),
      "utf8",
    );
    const generatedIndex = await fs.readFile(
      path.join(outputRoot, "playbook/PLAYBOOK.index.yaml"),
      "utf8",
    );

    includesAll(generatedCss, languageContracts[language].css, `generated ${language} CSS Module`);
    includesAll(generatedComponent, languageContracts[language].component, `generated ${language} component`);
    includesAll(generatedScreen, languageContracts[language].screen, `generated ${language} screen`);
    includesAll(generatedContent, languageContracts[language].content, `generated ${language} UI copy`);
    includesAll(generatedErrorHandling, languageContracts[language].errorHandling, `generated ${language} error handling`);
    includesAll(generatedAccessibility, languageContracts[language].accessibility, `generated ${language} accessibility`);
    includesAll(generatedCodeHygiene, languageContracts[language].codeHygiene, `generated ${language} code hygiene`);
    includesAll(generatedIndex, [/id: frontend-screen-change/, /action: build-screen/, /frontend\/ui\/screen\.md/, /frontend\/content\/ui-copy\.md/], `generated ${language} index`);
  }

  const forwardRoot = path.join(temporaryRoot, "forward-tests");
  await fs.mkdir(forwardRoot, { recursive: true });

  const platformCopyPath = path.join(forwardRoot, "platform-copy.txt");
  const contentConfigPath = path.join(forwardRoot, "content-constraints.json");
  await fs.writeFile(contentConfigPath, JSON.stringify({
    include: ["platform-copy.txt"],
    extensions: [".txt"],
    forbidden: [{ value: "Example Tenant", reason: "Render tenant name from runtime data" }],
  }), "utf8");
  await fs.writeFile(platformCopyPath, "Example Tenant workspace management", "utf8");
  const tenantMixViolations = await findContentViolations({
    root: forwardRoot,
    config: {
      include: ["platform-copy.txt"],
      extensions: [".txt"],
      forbidden: [{ value: "Example Tenant", reason: "Render tenant name from runtime data" }],
    },
  });
  assert.equal(tenantMixViolations.length, 1, "forward test must detect fixture tenant data in platform copy");
  const failedCliCheck = spawnSync(
    process.execPath,
    [path.join(repositoryRoot, "bin/check-user-facing-content.js"), "--config", "content-constraints.json"],
    { cwd: forwardRoot, encoding: "utf8" },
  );
  assert.equal(failedCliCheck.status, 1, "content CLI must fail when forbidden user-facing content exists");
  await fs.writeFile(platformCopyPath, "Workspace management", "utf8");
  assert.equal((await findContentViolations({
    root: forwardRoot,
    config: {
      include: ["platform-copy.txt"],
      extensions: [".txt"],
      forbidden: ["Example Tenant"],
    },
  })).length, 0, "forward test must allow neutral platform copy");
  const passedCliCheck = spawnSync(
    process.execPath,
    [path.join(repositoryRoot, "bin/check-user-facing-content.js"), "--config", "content-constraints.json"],
    { cwd: forwardRoot, encoding: "utf8" },
  );
  assert.equal(passedCliCheck.status, 0, "content CLI must pass after fixture tenant data is removed");

  const controlPath = path.join(forwardRoot, "control.tsx");
  await fs.writeFile(controlPath, "<p>Administrators, reviewers, and operators manage workspaces.</p>\n<button>→</button>", "utf8");
  const redundantCopyViolations = await findContentViolations({
    root: forwardRoot,
    config: {
      include: ["control.tsx"],
      extensions: [".tsx"],
      forbidden: ["Administrators, reviewers, and operators", "→"],
    },
  });
  assert.equal(redundantCopyViolations.length, 2, "forward test must detect redundant role copy and text icons");
  await fs.writeFile(controlPath, '<IconButton icon="next" ariaLabel="Open next workspace" />', "utf8");
  assert.equal((await findContentViolations({
    root: forwardRoot,
    config: {
      include: ["control.tsx"],
      extensions: [".tsx"],
      forbidden: ["Administrators, reviewers, and operators", "→"],
    },
  })).length, 0, "forward test must allow labeled SVG icon controls without redundant copy");

  const fixtureRoot = path.join(forwardRoot, "fixtures");
  await fs.mkdir(fixtureRoot, { recursive: true });
  await fs.writeFile(path.join(fixtureRoot, "sample.txt"), "Hidden fixture", "utf8");
  assert.equal((await findContentViolations({
    root: forwardRoot,
    config: {
      include: ["fixtures"],
      exclude: ["fixtures"],
      extensions: [".txt"],
      forbidden: ["Hidden fixture"],
    },
  })).length, 0, "content checker must honor project-configured fixture exclusions");

  const commentedSourcePath = path.join(forwardRoot, "commented-source.ts");
  await fs.writeFile(commentedSourcePath, '// → developer note\nconst label = "Open";', "utf8");
  assert.equal((await findContentViolations({
    root: forwardRoot,
    config: {
      include: ["commented-source.ts"],
      extensions: [".ts"],
      forbidden: ["→"],
      ignoreLinePatterns: ["^\\s*//"],
    },
  })).length, 0, "content checker must honor project-configured comment exclusions");
}
finally {
  assert.equal(path.dirname(temporaryRoot), os.tmpdir());
  assert.match(path.basename(temporaryRoot), /^mykit-ui-contracts-/);
  await fs.rm(temporaryRoot, { recursive: true });
}

console.log("UI contract checks passed for skill references, templates, and generated playbooks.");
