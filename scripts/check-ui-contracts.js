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
    component: [/take priority over primitive reuse/i, /Repeated flex\/grid is a signal/i, /NameTextForm/, /meaning unit/i, /interactive primitive/i, /own folder/i],
    screen: [/Visual QA/i, /Content QA/i, /Classify visible text/i, /Functional completion and design completion are separate/i, /NameTextForm/, /interactive primitive/i],
    content: [/platform copy/i, /runtime tenant\/user data/i, /Unicode symbols/i, /safety-critical guidance/i],
    errorHandling: [/keep the code cohesive/i, /never touch URL, method, header/i, /same principle applies to route handlers/i, /machine-readable error codes/i, /Never `as T`/],
    accessibility: [/SSOT component/i, /banned outright/i, /layer where meaning starts/i],
    codeHygiene: [/util-shaped/i, /Persist, auth/i, /keep domain-agnostic pure transforms/i, /subfolders/, /folder per file/, /logical implementation unit/i, /20 or more/i, /count alone/i],
    testing: [/non-colocated test folders/i, /mirror source domains/i, /one root/i],
    codeStyle: [/printWidth/i, /handleXxx/, /SubmitEvent/],
  },
  ko: {
    css: [/내부 클래스 적용/, /public 스타일 탈출구/, /feature\/page가 화면 고유 layout/],
    component: [/primitive 재사용보다 우선/, /직접 CSS 사용 금지가 아니다/, /NameTextForm/, /의미 단위로 닫/, /interactive/, /자기 폴더/],
    screen: [/Visual QA/, /Content QA/, /사용자 노출 문구를 플랫폼 카피/, /기능 완료와 디자인 완료를 별도로 판정/, /NameTextForm/, /의미 단위로 닫/],
    content: [/플랫폼 공통 카피/, /tenant\/user 런타임 데이터/, /Unicode 기호/, /안전에 필요한 설명/],
    errorHandling: [/응집성을 지킨다/, /URL, method, header/, /같은 원칙이 라우트 핸들러에도 적용된다/, /기계 에러 코드/, /as T/],
    accessibility: [/SSOT 컴포넌트가 있는지 먼저 확인/, /원칙적으로 금지/, /의미가 생기는 계층/],
    codeHygiene: [/유틸 성격이 짙으면/, /utils\//, /persist/, /관심사 하위 폴더/, /논리적 구현 단위/, /20개 이상/, /숫자만으로/],
    testing: [/비코로케이션 테스트 폴더/, /소스의 도메인 구조/, /평면으로 쌓지 않는다/],
    codeStyle: [/printWidth/, /handleXxx/, /SubmitEvent/],
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
    const codeStyle = await read(`${sourceRoot}/${language}/core/code-style.md`);
    const testing = await read(`${sourceRoot}/${language}/testing.md`);
    includesAll(css, contracts.css, `${sourceRoot} ${language} CSS Module`);
    includesAll(component, contracts.component, `${sourceRoot} ${language} component`);
    includesAll(screen, contracts.screen, `${sourceRoot} ${language} screen`);
    includesAll(content, contracts.content, `${sourceRoot} ${language} UI copy`);
    includesAll(errorHandling, contracts.errorHandling, `${sourceRoot} ${language} error handling`);
    includesAll(accessibility, contracts.accessibility, `${sourceRoot} ${language} accessibility`);
    includesAll(codeHygiene, contracts.codeHygiene, `${sourceRoot} ${language} code hygiene`);
    includesAll(codeStyle, contracts.codeStyle, `${sourceRoot} ${language} code style`);
    includesAll(testing, contracts.testing, `${sourceRoot} ${language} testing`);
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
const auditAuth = await read("skills/mykit/actions/audit-auth.md");
const auditDirectoryStructure = await read("skills/mykit/actions/audit-directory-structure.md");
const specifyMeaningUnit = await read("skills/mykit/actions/specify-meaning-unit.md");
const placeLayer = await read("skills/mykit/actions/place-layer.md");
const screenStructure = await read("skills/mykit/actions/screen-structure.md");
const screenVisual = await read("skills/mykit/actions/screen-visual.md");
const screenContent = await read("skills/mykit/actions/screen-content.md");
const updateRules = await read("skills/mykit/actions/update-rules.md");
const meaningUnit = await read("skills/mykit/references/philosophy/meaning-unit.md");
const componentLayers = await read("skills/mykit/references/philosophy/component-layers.md");
const hooksStore = await read("skills/mykit/references/philosophy/hooks-store.md");

assert.doesNotMatch(skill, /karpathy/, "skill must not pair with karpathy-guidelines");
assert.equal(
  await fs.access(path.join(repositoryRoot, "commands/apply.md")).then(() => true, () => false),
  false,
  "commands/apply.md must not exist",
);
assert.ok(componentLayers.split("\n").length <= 180, "component-layers.md default load must stay a slice");

includesAll(skill, [
  /actions\/build-screen\.md/,
  /references\/en\/frontend\/ui\/screen\.md/,
  /actions\/code-refactoring\.md/,
  /actions\/audit-hooks\.md/,
  /actions\/audit-api-layer\.md/,
  /actions\/audit-a11y-ssot\.md/,
  /actions\/audit-component-api\.md/,
  /actions\/audit-hygiene\.md/,
  /actions\/audit-auth\.md/,
  /actions\/audit-directory-structure\.md/,
  /actions\/update-rules\.md/,
  /NameTextForm/,
  /의미 단위로 닫는다/,
  /meaning-unit\.md/,
  /component-layers\.md/,
  /frontend-form-meaning-unit|폼 필드\/입력\/TextField/,
  /description:.*TextField/,
  /description:.*NameTextForm/,
  /이 SKILL\.md는 인덱스다/,
  /mustHold/,
  /Extensibility First/,
], "skill routing");
includesAll(addComponent, [/build-screen\.md/, /route\/page/, /code-refactoring\.md/, /audit-hooks\.md/, /NameTextForm/, /의미 단위로 닫/, /interactive primitive/, /specify-meaning-unit\.md/, /place-layer\.md/, /한 폴더/], "add-component routing");
includesAll(buildScreen, [/구조적 QA/, /Visual QA/, /Content QA/, /금지 문자열을 자동 검색/, /기능 완료와 디자인 완료를 별도로 판정/, /code-refactoring\.md/, /NameTextForm/, /의미 단위로 닫/, /specify-meaning-unit\.md/, /screen-structure\.md/], "build-screen action");
includesAll(reviewCodeStyle, [/review-code-style의 스코프 밖/, /code-refactoring\.md/, /audit-component-api\.md/, /TextField/, /printWidth/, /handleXxx/], "review-code-style routing");
includesAll(codeRefactoring, [/dirty worktree/, /audit-hooks\.md/, /audit-api-layer\.md/, /audit-a11y-ssot\.md/, /audit-component-api\.md/, /audit-hygiene\.md/, /audit-auth\.md/, /audit-directory-structure\.md/, /review-code-style\.md/, /의미 단위 닫힘/, /specify-meaning-unit\.md/, /항상/], "code-refactoring dispatcher");
includesAll(auditHooks, [/audit-a11y-ssot\.md/, /audit-api-layer\.md/, /wiring/, /onSuccess/, /audit-component-api\.md/, /TextField/, /hooks-store\.md/], "audit-hooks action");
includesAll(auditApiLayer, [/언어나 스택에 무관하게 적용된다/, /같은 리소스를 다루는/, /라우트 핸들러/, /client 체크/, /route-handler/], "audit-api-layer action");
includesAll(auditA11ySsot, [/SSOT 컴포넌트/, /<select`/], "audit-a11y-ssot action");
includesAll(auditComponentApi, [/Base \+ Named Export/, /이름 있는 타입/, /NameTextForm/, /의미 단위로 닫/, /specify-meaning-unit\.md/], "audit-component-api action");
includesAll(auditHygiene, [/과도하게 잘게 쪼개진/, /utils\//, /유틸 성격이면/], "audit-hygiene action");
includesAll(auditAuth, [/영역 가드는 layout/, /service-role/, /redirect\("\/login"\)/], "audit-auth action");
includesAll(auditDirectoryStructure, [/범위만/, /유닛 폴더/, /관심사 하위폴더/, /place-layer/, /\$CLAUDE_PLUGIN_ROOT/, /논리적 구현 단위/, /20개 이상/, /개선 필요/, /비코로케이션 테스트/], "audit-directory-structure action");
includesAll(specifyMeaningUnit, [/mustHold/, /NameTextForm/, /meaning-unit\.md/], "specify-meaning-unit sub-action");
includesAll(placeLayer, [/mustHold/, /layout/, /feature/, /ComponentProps/, /audit-directory-structure\.md/], "place-layer sub-action");
includesAll(screenStructure, [/interactive primitive/, /NameTextForm|의미 단위/], "screen-structure sub-action");
includesAll(screenVisual, [/hierarchy/, /screenshot/], "screen-visual sub-action");
includesAll(screenContent, [/금지 문자열/, /fixture/], "screen-content sub-action");
includesAll(meaningUnit, [/NameTextForm/, /의미 단위로 닫는다/, /mustHold/], "meaning-unit slice");
includesAll(componentLayers, [/meaning-unit\.md/, /hooks-store\.md/, /계층/], "component-layers slice pointers");
includesAll(hooksStore, [/wiring/, /useCart/, /SubmitEvent/], "hooks-store slice");
includesAll(updateRules, [/source-rule-map\.md/, /스텁이면/, /가운뎃점/], "update-rules action");

const addComponentCommand = await read("commands/add-component.md");
const buildScreenCommand = await read("commands/build-screen.md");
const auditComponentApiCommand = await read("commands/audit-component-api.md");
const codeRefactoringCommand = await read("commands/code-refactoring.md");
const pluginManifest = await read(".claude-plugin/plugin.json");
includesAll(addComponentCommand, [/description:.*TextField/, /NameTextForm/, /의미 단위로 닫/], "add-component command");
includesAll(buildScreenCommand, [/description:.*TextField/, /NameTextForm/, /의미 단위로 닫/], "build-screen command");
includesAll(auditComponentApiCommand, [/description:.*TextField/, /NameTextForm/, /의미 단위/], "audit-component-api command");
includesAll(codeRefactoringCommand, [/directory-structure/], "code-refactoring command");
includesAll(pluginManifest, [/"skills": \["\.\/skills\/mykit"\]/, /"commands": "\.\/commands"/, /NameTextForm|forms/], "claude plugin manifest");

const commandFiles = (await fs.readdir(path.join(repositoryRoot, "commands"))).filter((name) => name.endsWith(".md"));
for (const name of commandFiles) {
  const content = await read(`commands/${name}`);
  includesAll(
    content,
    [new RegExp(`\\$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/${name.replace(".", "\\.")}`)],
    `command ${name} dispatcher path`,
  );
  assert.doesNotMatch(content, /specify-meaning-unit/, `command ${name} must not name sub-actions`);
  assert.doesNotMatch(content, /references\/philosophy/, `command ${name} must not name philosophy slices`);
}

const actionFiles = (await fs.readdir(path.join(repositoryRoot, "skills/mykit/actions"))).filter((name) => name.endsWith(".md"));
for (const name of actionFiles) {
  const content = await read(`skills/mykit/actions/${name}`);
  const strippedPhilosophy = content
    .replaceAll("$CLAUDE_PLUGIN_ROOT/skills/mykit/references/philosophy", "")
    .replaceAll("../references/philosophy", "");
  assert.doesNotMatch(
    strippedPhilosophy,
    /references\/philosophy/,
    `${name} philosophy path must use $CLAUDE_PLUGIN_ROOT or ../references`,
  );
  assert.doesNotMatch(content, /확인받고 고칠/, `${name} must not use confirm-then-fix buckets`);
}

assert.doesNotMatch(auditHooks, /승인 없이 hook 분리/, "audit-hooks must not block hook extraction");

const scopeOnlyActions = {
  "add-component": addComponent,
  "build-screen": buildScreen,
  "code-refactoring": codeRefactoring,
  "review-code-style": reviewCodeStyle,
  "audit-hooks": auditHooks,
  "audit-api-layer": auditApiLayer,
  "audit-a11y-ssot": auditA11ySsot,
  "audit-component-api": auditComponentApi,
  "audit-hygiene": auditHygiene,
  "audit-auth": auditAuth,
  "audit-directory-structure": auditDirectoryStructure,
};
for (const [label, content] of Object.entries(scopeOnlyActions)) {
  includesAll(content, [/범위만/], `${label} scope-only confirmation`);
}

includesAll(addComponent, [/\$CLAUDE_PLUGIN_ROOT\/skills\/mykit\/actions\/specify-meaning-unit\.md/], "add-component plugin path");
includesAll(auditHooks, [/source-rule-map/], "audit-hooks section-only load");
includesAll(auditApiLayer, [/source-rule-map/], "audit-api-layer section-only load");
includesAll(auditComponentApi, [/source-rule-map/], "audit-component-api section-only load");

const agents = await read("AGENTS.md");
const agentsTemplate = await read("templates/ai/AGENTS.md");
const agentsNoAutoCommit = await read("templates/ai/AGENTS.no-auto-commit.md");
includesAll(agents, [/editRoutes/, /mustHold/, /open/, /Extensibility First/], "agents index routing");
includesAll(agentsTemplate, [/editRoutes/, /mustHold/, /open/, /Extensibility First/], "agents template index routing");
includesAll(agentsNoAutoCommit, [/editRoutes/, /mustHold/, /open/, /Extensibility First/], "agents no-auto-commit index routing");

const cursorRule = await read(".cursor/rules/mykit-workflow.mdc");
const cursorRuleTemplate = await read("templates/ai/cursor-rules/mykit-workflow.mdc");
const cursorRuleNoAuto = await read("templates/ai/cursor-rules/mykit-workflow.no-auto-commit.mdc");
includesAll(cursorRule, [/editRoutes/, /mustHold/, /open/], "cursor rule index routing");
includesAll(cursorRuleTemplate, [/editRoutes/, /mustHold/, /open/], "cursor rule template index routing");
includesAll(cursorRuleNoAuto, [/editRoutes/, /mustHold/, /open/], "cursor rule no-auto-commit index routing");

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
    const generatedCodeStyle = await fs.readFile(
      path.join(outputRoot, "playbook/core/code-style.md"),
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
    includesAll(generatedCodeStyle, languageContracts[language].codeStyle, `generated ${language} code style`);
    includesAll(generatedIndex, [
      /id: frontend-screen-change/,
      /action: build-screen/,
      /frontend\/ui\/screen\.md/,
      /frontend\/content\/ui-copy\.md/,
      /id: frontend-ui-change/,
      /id: frontend-form-meaning-unit/,
      /action: add-component/,
      /mustHold:/,
      /NameTextForm/,
    ], `generated ${language} index`);
    const generatedRootPlaybook = await fs.readFile(path.join(outputRoot, "PLAYBOOK.md"), "utf8");
    includesAll(generatedRootPlaybook, [/PLAYBOOK\.index\.yaml/, /mustHold/, /editRoutes/], `generated ${language} PLAYBOOK.md`);
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
