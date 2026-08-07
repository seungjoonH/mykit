#!/usr/bin/env node
// 프로젝트 설정에 따라 사용자 노출 텍스트의 금지 항목을 검사한다.
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { findContentViolations } from "../src/content-checker.js";

function readConfigPath(args) {
  const index = args.indexOf("--config");
  if (index === -1 || !args[index + 1]) {
    throw new Error("Usage: mykit-content-check --config <relative-config.json>");
  }
  return args[index + 1];
}

try {
  const root = process.cwd();
  const configPath = readConfigPath(process.argv.slice(2));
  if (path.isAbsolute(configPath)) {
    throw new Error("The config path must be relative to the project root.");
  }
  const config = JSON.parse(await fs.readFile(path.resolve(root, configPath), "utf8"));
  const violations = await findContentViolations({ root, config });

  if (violations.length > 0) {
    for (const violation of violations) {
      console.error(`${violation.file}:${violation.line} ${violation.reason}: ${JSON.stringify(violation.value)}`);
    }
    process.exitCode = 1;
  }
  else {
    console.log("User-facing content check passed.");
  }
}
catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
