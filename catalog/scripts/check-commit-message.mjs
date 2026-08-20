#!/usr/bin/env node

import { readFile } from "node:fs/promises";

const allowedTypes = [
  "feat",
  "fix",
  "refactor",
  "perf",
  "test",
  "docs",
  "build",
  "ci",
  "chore",
  "revert",
];
const headerPattern = new RegExp(
  `^(?:${allowedTypes.join("|")})(?:\\([^()\\s](?:[^()\\r\\n]*[^()\\s])?\\))?!?: \\S(?:.*\\S)?$`,
);
const generatedHeaderPatterns = [/^Revert ".+"$/, /^Merge .+$/];

function firstHeader(message) {
  return message
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith("#"));
}

function validate(message) {
  const header = firstHeader(message);
  if (!header) {
    return "commit message가 비어 있습니다.";
  }
  if (
    !headerPattern.test(header) &&
    !generatedHeaderPatterns.some((pattern) => pattern.test(header))
  ) {
    return `header는 <type>(<scope>): <summary> 형식이어야 합니다. 허용 type: ${allowedTypes.join(", ")}`;
  }
  return null;
}

function runSelfTest() {
  const cases = [
    ["fix(목록): refetch 중 기존 데이터 유지", true],
    ["feat(auth)!: token 저장 계약 변경", true],
    ["docs: 카탈로그 사용법 보강", true],
    ["update files", false],
    ["fix(): 빈 scope", false],
    ["fix( ): 공백 scope", false],
    ["fix(목록):", false],
    ["style(목록): 간격 조정", false],
    ['Revert "feat(목록): URL 상태 추가"', true],
    ["Merge branch 'codex/catalog-cleanup'", true],
  ];

  const failures = cases.filter(
    ([message, expected]) => (validate(message) === null) !== expected,
  );
  if (failures.length > 0) {
    for (const [message, expected] of failures) {
      console.error(
        `self-test failed: ${JSON.stringify(message)} expected ${expected}`,
      );
    }
    return 1;
  }

  console.log(`OK: checked ${cases.length} commit message case(s)`);
  return 0;
}

async function main() {
  const [argument] = process.argv.slice(2);
  if (argument === "--self-test") {
    return runSelfTest();
  }
  if (!argument) {
    console.error(
      "Usage: check-commit-message.mjs <commit-message-file> | --self-test",
    );
    return 2;
  }

  const message = await readFile(argument, "utf8");
  const error = validate(message);
  if (error) {
    console.error(error);
    return 1;
  }

  console.log("OK: commit message header is valid");
  return 0;
}

process.exitCode = await main();
