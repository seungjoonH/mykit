// mykit 선택 결과를 playbook 산출물로 생성한다.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import {
  aiGuides,
  backendStacks,
  buildAiGuideKeys,
  buildDocKeys,
  cssOptions,
  commonFrontendDocs,
  crossCuttingDocs,
  databases,
  frontendStacks,
  infrastructures,
  staticCoreDocs,
} from "./manifest.js";

const generatorDir = path.dirname(fileURLToPath(import.meta.url));
const templateRoot = path.resolve(generatorDir, "../templates");

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function writeFile(filePath, content) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf8");
}

function normalizeDocOutputPath(key) {
  return `playbook/${key}.md`;
}

function normalizeTemplatePath(lang, key) {
  return `templates/${lang}/${key}.md`;
}

function aiTemplateMap(key, autoCommit = true) {
  if (key === "agents") {
    const template = autoCommit ? "AGENTS.md" : "AGENTS.no-auto-commit.md";
    return [{ from: `templates/ai/${template}`, to: "AGENTS.md" }];
  }
  if (key === "claude") {
    const template = autoCommit ? "CLAUDE.md" : "CLAUDE.no-auto-commit.md";
    return [{ from: `templates/ai/${template}`, to: "CLAUDE.md" }];
  }
  if (key === "examples") return [{ from: "templates/ai/EXAMPLES.md", to: "EXAMPLES.md" }];
  if (key === "cursor-rules") {
    const workflowTemplate = autoCommit
      ? "mykit-workflow.mdc"
      : "mykit-workflow.no-auto-commit.mdc";
    return [
      {
        from: `templates/ai/cursor-rules/${workflowTemplate}`,
        to: ".cursor/rules/mykit-workflow.mdc",
      },
    ];
  }
  throw new Error(`Unknown AI guide key: ${key}`);
}

function docPath(key) {
  return `playbook/${key}.md`;
}

function pickLang(selection) {
  if (typeof selection.language === "string") return selection.language;
  return selection.language?.default ?? "en";
}

function buildDomainMap(selection) {
  const lang = pickLang(selection);
  return {
    core: {
      readability: docPath("core/readability"),
      codeStyle: docPath("core/code-style"),
      codeHygiene: docPath("core/code-hygiene"),
      naming: docPath("core/naming"),
      performance: docPath("core/performance"),
      errorHandling: docPath("core/error-handling"),
      dataDesign: docPath("core/data-design"),
    },
    frontend: {
      stack: docPath(`frontend/stacks/${selection.frontend}`),
      styling: [
        docPath(`frontend/styling/${selection.css ?? "tailwindcss"}`),
        docPath("frontend/styling/theme"),
      ],
      ui: [
        docPath("frontend/ui/component"),
        docPath("frontend/ui/screen"),
        docPath("frontend/ui/accessibility"),
        docPath("frontend/ui/svg-icon"),
      ],
      data: docPath("frontend/data/react-query"),
      content: [
        docPath("frontend/content/ui-copy"),
        docPath("frontend/content/i18n"),
        docPath("frontend/content/seo"),
      ],
    },
    backend: selection.backend ? docPath(`backend/${selection.backend}`) : null,
    database: selection.db.map((db) => docPath(`database/${db}`)),
    infra: selection.infra.map((infra) => docPath(`infra/${infra}`)),
    crossCutting: selection.docs.map((doc) => docPath(doc)),
    design: [
      "design/design.md",
      "design/erd.md",
      "design/architecture.md",
      "design/api-spec.md",
    ],
  };
}

function compact(arr) {
  return arr.filter(Boolean);
}

function buildEditRoutes(selection) {
  const domain = buildDomainMap(selection);
  const routes = [
    {
      id: "requirements-scope-change",
      when: "요구사항/유저 플로우/범위 변경",
      open: ["design/design.md", "design/architecture.md"],
      thenRead: [domain.core.readability, domain.core.codeStyle],
    },
    {
      id: "api-contract-change",
      when: "API 스펙/에러 포맷/요청 응답 스키마 변경",
      open: compact(["design/api-spec.md", domain.backend, domain.core.errorHandling]),
      thenRead: [...domain.crossCutting],
    },
    {
      id: "data-model-change",
      when: "엔터티/테이블/인덱스/관계 변경",
      open: compact(["design/erd.md", domain.core.dataDesign, ...domain.database]),
      thenRead: compact([domain.backend, "design/api-spec.md"]),
    },
    {
      id: "frontend-ui-change",
      when: "컴포넌트 구조/접근성/SVG 아이콘 변경",
      open: [domain.frontend.stack, ...domain.frontend.ui],
      thenRead: [domain.core.naming, domain.core.codeStyle],
    },
    {
      id: "frontend-screen-change",
      action: "build-screen",
      when: "새 화면/route/dashboard/settings/list-detail/workflow/주요 page layout 변경",
      open: [domain.frontend.stack, docPath("frontend/ui/screen"), docPath("frontend/ui/component"), ...domain.frontend.styling],
      thenRead: [
        docPath("frontend/ui/accessibility"),
        docPath("frontend/content/ui-copy"),
        docPath("frontend/content/i18n"),
      ],
    },
    {
      id: "frontend-style-theme-change",
      when: "Tailwind/CSS Module/테마 변경",
      open: [domain.frontend.stack, ...domain.frontend.styling],
      thenRead: [domain.core.performance],
    },
    {
      id: "frontend-data-fetch-change",
      when: "React Query 캐시/동기화/로딩 전략 변경",
      open: [domain.frontend.stack, domain.frontend.data],
      thenRead: [domain.core.errorHandling, ...domain.crossCutting],
    },
    {
      id: "i18n-seo-change",
      when: "번역 키/locale/SEO 메타데이터 변경",
      open: [...domain.frontend.content, ...domain.crossCutting],
      thenRead: [domain.core.naming],
    },
    {
      id: "security-testing-policy-change",
      when: "보안 정책/테스트 기준 변경",
      open: [...domain.crossCutting],
      thenRead: compact([domain.backend, domain.frontend.stack]),
    },
    {
      id: "infra-deployment-change",
      when: "배포/인프라/런타임 설정 변경",
      open: ["design/architecture.md", ...domain.infra],
      thenRead: [...domain.crossCutting],
    },
  ];
  return routes;
}

function buildAgentEntryPoints(selection) {
  const lang = pickLang(selection);
  return {
    preferredLanguage: lang,
    globalStart: ["playbook/PLAYBOOK.index.yaml", "PLAYBOOK.md"],
    claude: [
      "CLAUDE.md",
      "playbook/PLAYBOOK.index.yaml",
      "design/design.md",
      "design/architecture.md",
      "design/erd.md",
      "design/api-spec.md",
    ],
    codex: [
      "AGENTS.md",
      "playbook/PLAYBOOK.index.yaml",
      "design/design.md",
      "design/architecture.md",
      "design/erd.md",
      "design/api-spec.md",
    ],
  };
}

function buildCatalog(selection) {
  const lang = pickLang(selection);
  return {
    availableOptions: {
      frontend: frontendStacks,
      css: cssOptions,
      backend: backendStacks,
      db: databases,
      infra: infrastructures,
      docs: crossCuttingDocs,
      ai: aiGuides,
      language: ["en", "ko"],
    },
    templatePaths: {
      core: staticCoreDocs.map((key) => docPath(key)),
      frontend: {
        common: commonFrontendDocs.map((key) => docPath(key)),
        stacks: frontendStacks.map((stack) => docPath(`frontend/stacks/${stack}`)),
        styling: cssOptions.map((css) => docPath(`frontend/styling/${css}`)),
      },
      backend: backendStacks.map((stack) => docPath(`backend/${stack}`)),
      database: databases.map((db) => docPath(`database/${db}`)),
      infra: infrastructures.map((infra) => docPath(`infra/${infra}`)),
      crossCutting: crossCuttingDocs.map((doc) => docPath(doc)),
    },
  };
}

function renderRootPlaybook(selection, generatedFiles) {
  const fileLines = generatedFiles.map((f) => `- \`${f}\``).join("\n");
  return `# PLAYBOOK

This playbook is generated by \`mykit init\`.

## Active Selection
- Frontend: \`${selection.frontend}\`
- CSS: \`${selection.css ?? "tailwindcss"}\`
- Backend: ${selection.backend ? `\`${selection.backend}\`` : "`(none)`"}
- DB: ${selection.db.length > 0 ? selection.db.map((x) => `\`${x}\``).join(", ") : "`(none)`"}
- Infra: ${selection.infra.length > 0 ? selection.infra.map((x) => `\`${x}\``).join(", ") : "`(none)`"}
- Cross-cutting: ${selection.docs.map((x) => `\`${x}\``).join(", ")}
- AI guides: ${(selection.ai ?? ["all"]).map((x) => `\`${x}\``).join(", ")}
- Language: \`${pickLang(selection)}\`
- Commit behavior: \`${(selection.autoCommit ?? true) ? "auto" : "manual"}\`

## Generated Files
${fileLines}

## Re-run
\`\`\`bash
mykit init
\`\`\`
`;
}

const designDocSeed = `# %TITLE%

> Fill this document before implementation and keep it synchronized with code changes.
`;

async function writeDesignDocs(cwd, dryRun, outputFiles) {
  const docs = [
    { path: "design/design.md", title: "Product Design" },
    { path: "design/erd.md", title: "ERD (mermaid)" },
    { path: "design/architecture.md", title: "Architecture (mermaid)" },
    { path: "design/api-spec.md", title: "API Spec" },
  ];
  for (const doc of docs) {
    outputFiles.push(doc.path);
    if (!dryRun) {
      await writeFile(path.join(cwd, doc.path), designDocSeed.replace("%TITLE%", doc.title));
    }
  }
}

async function copyAiGuides(cwd, aiSelection, dryRun, outputFiles, autoCommit = true) {
  const guideKeys = buildAiGuideKeys({ ai: aiSelection });
  for (const key of guideKeys) {
    const mappings = aiTemplateMap(key, autoCommit);
    for (const mapping of mappings) {
      outputFiles.push(mapping.to);
      if (!dryRun) {
        const from = path.join(templateRoot, mapping.from.replace(/^templates\//, ""));
        const to = path.join(cwd, mapping.to);
        await ensureDir(path.dirname(to));
        await fs.copyFile(from, to);
      }
    }
  }
}

export async function generatePlaybook({ cwd, selection, dryRun = false }) {
  const docKeys = buildDocKeys(selection);
  const outputFiles = [];
  const selectedLanguage = pickLang(selection);

  for (const key of docKeys) {
    const templatePath = path.join(templateRoot, selectedLanguage, `${key}.md`);
    const outputPath = normalizeDocOutputPath(key);
    outputFiles.push(outputPath);
    if (!dryRun) {
      try {
        await fs.access(templatePath);
      }
      catch {
        throw new Error(`Missing template file: ${normalizeTemplatePath(selectedLanguage, key)}`);
      }
      await ensureDir(path.dirname(path.join(cwd, outputPath)));
      await fs.copyFile(templatePath, path.join(cwd, outputPath));
    }
  }

  const index = {
    version: "0.1.3",
    generatedAt: new Date().toISOString(),
    selection,
    catalog: buildCatalog(selection),
    entrypoints: buildAgentEntryPoints(selection),
    domainMap: buildDomainMap(selection),
    editRoutes: buildEditRoutes(selection),
    files: outputFiles,
  };

  await writeDesignDocs(cwd, dryRun, outputFiles);
  await copyAiGuides(cwd, selection.ai ?? ["all"], dryRun, outputFiles, selection.autoCommit ?? true);

  if (!dryRun) {
    await writeFile(path.join(cwd, "playbook/PLAYBOOK.index.yaml"), YAML.stringify(index));
    await writeFile(path.join(cwd, "playbook/mykit.selection.yaml"), YAML.stringify(selection));
    await writeFile(path.join(cwd, "PLAYBOOK.md"), renderRootPlaybook(selection, outputFiles));
  }

  return { docKeys, outputFiles, index };
}
