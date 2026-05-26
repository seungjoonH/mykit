// mykit init 명령을 파싱하고 플레이북 생성을 실행한다.
import { generatePlaybook } from "./generator.js";
import {
  aiGuides,
  backendStacks,
  cssOptions,
  crossCuttingDocs,
  databases,
  frontendStacks,
  infrastructures,
} from "./manifest.js";
import { promptSelection } from "./prompts.js";

function parseMultiValue(args, flagName) {
  const values = [];
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === flagName && args[i + 1]) values.push(args[i + 1]);
  }
  return values;
}

function parseSelectionFromFlags(args) {
  const language = args.includes("--lang") ? args[args.indexOf("--lang") + 1] : undefined;
  const frontend = args.includes("--frontend") ? args[args.indexOf("--frontend") + 1] : undefined;
  const css = args.includes("--css") ? args[args.indexOf("--css") + 1] : undefined;
  const backend = args.includes("--backend") ? args[args.indexOf("--backend") + 1] : undefined;
  const commit = args.includes("--commit") ? args[args.indexOf("--commit") + 1] : undefined;
  const db = parseMultiValue(args, "--db");
  const infra = parseMultiValue(args, "--infra");
  const docs = parseMultiValue(args, "--doc");
  const ai = parseMultiValue(args, "--ai");

  if (!language && !frontend && !backend && !commit && db.length === 0 && infra.length === 0 && docs.length === 0 && ai.length === 0) {
    return null;
  }

  const assertOne = (value, pool, label) => {
    if (!pool.includes(value)) throw new Error(`Invalid ${label}: ${value}`);
  };
  const assertMany = (values, pool, label) => {
    values.forEach((value) => {
      if (!pool.includes(value)) throw new Error(`Invalid ${label}: ${value}`);
    });
  };

  if (commit && !["auto", "manual"].includes(commit)) {
    throw new Error(`Invalid --commit value: ${commit}. Expected "auto" or "manual".`);
  }

  assertOne(frontend, frontendStacks, "frontend");
  if (backend) assertOne(backend, backendStacks, "backend");
  if (css) assertOne(css, cssOptions, "css");
  if (language) assertOne(language, ["en", "ko"], "lang");
  assertMany(db, databases, "db");
  assertMany(infra, infrastructures, "infra");
  assertMany(docs, crossCuttingDocs, "doc");
  assertMany(ai, [...aiGuides, "all"], "ai");

  return {
    language: language ?? "en",
    frontend,
    css: css ?? "tailwindcss",
    backend: backend ?? null,
    db,
    infra,
    docs,
    ai: ai.length > 0 ? ai : ["all"],
    autoCommit: commit !== "manual",
  };
}

function printUsage() {
  console.log(`mykit init [options]

Options:
  --dry-run
  --lang <en|ko>
  --frontend <${frontendStacks.join("|")}>
  --css <${cssOptions.join("|")}>
  --backend <${backendStacks.join("|")}>     (optional; omit for frontend-only)
  --db <${databases.join("|")}>      (repeatable)
  --infra <${infrastructures.join("|")}> (repeatable; omit for frontend-only)
  --doc <${crossCuttingDocs.join("|")}>  (repeatable)
  --ai <${[...aiGuides, "all"].join("|")}>    (repeatable)
  --commit <auto|manual>               (default: auto)
`);
}

export async function runCli(args) {
  const [command] = args;
  if (!command || command === "--help" || command === "-h") {
    printUsage();
    return;
  }
  if (command !== "init") {
    throw new Error(`Unknown command: ${command}`);
  }

  const rest = args.slice(1);
  const dryRun = rest.includes("--dry-run");
  const fromFlags = parseSelectionFromFlags(rest);
  const selection = fromFlags ?? (await promptSelection());

  const result = await generatePlaybook({
    cwd: process.cwd(),
    selection,
    dryRun,
  });

  console.log(`[mykit] Generated ${result.outputFiles.length} files${dryRun ? " (dry-run)" : ""}.`);
  if (dryRun) {
    console.log("[mykit] Output preview:");
    result.outputFiles.forEach((file) => console.log(`- ${file}`));
  }
}
