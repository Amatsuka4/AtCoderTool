import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const cleanScript = join(repoRoot, "scripts", "clean.mjs");
const template = readFileSync(join(repoRoot, "template", "main.ts"), "utf8");

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "atcoder-clean-"));
  mkdirSync(join(root, "template"));
  mkdirSync(join(root, "contests"));
  writeFileSync(join(root, "template", "main.ts"), template);
  return root;
}

function task(root, contest, name, source = template) {
  const dir = join(root, "contests", contest, name);
  mkdirSync(join(dir, "test"), { recursive: true });
  writeFileSync(join(dir, "main.ts"), source);
  writeFileSync(join(dir, "test", "sample-1.in"), "1\n");
  return dir;
}

function clean(root, ...args) {
  return spawnSync(process.execPath, [cleanScript, ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

test("テンプレートのままの問題だけを削除する", () => {
  const root = fixture();

  try {
    const untouched = task(root, "abc001", "a");
    const solved = task(root, "abc001", "b", template.replace("//   print(n);", "print(42);"));
    const withExtra = task(root, "abc001", "c");
    writeFileSync(join(withExtra, "memo.md"), "考察\n");

    const result = clean(root);

    assert.equal(result.status, 0, result.stderr);
    assert.equal(existsSync(untouched), false);
    assert.equal(existsSync(solved), true);
    assert.equal(existsSync(withExtra), true);
    assert.match(result.stdout, /削除  : abc001\/a/);
    assert.match(result.stdout, /残す  : abc001\/b/);
    assert.match(result.stdout, /memo\.md があるため残す/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("dry-run は対象を表示するだけで削除しない", () => {
  const root = fixture();

  try {
    const untouched = task(root, "abc002", "a");
    const result = clean(root, "--dry-run");

    assert.equal(result.status, 0, result.stderr);
    assert.equal(existsSync(untouched), true);
    assert.match(result.stdout, /削除対象: abc002\/a/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
