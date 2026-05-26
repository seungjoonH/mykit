#!/usr/bin/env node
// mykit CLI 진입점을 제공하는 실행 스크립트.
import { runCli } from "../src/cli.js";

runCli(process.argv.slice(2)).catch((error) => {
  console.error("[mykit] Failed:", error?.message ?? error);
  process.exit(1);
});
