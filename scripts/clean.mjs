import { readFileSync, readdirSync, rmSync, existsSync } from "fs";
import { join } from "path";

/**
 * 取ってきただけで手を付けていない問題ディレクトリを消す。
 *
 * 判定は main() の中身がテンプレートのままかどうかで行う。
 * ファイル全体の一致で見ると、テンプレートのヘッダを後から変えたときに
 * 過去の未着手ファイルが検出できなくなるため。
 *
 * 誤って消さないよう、`new` が作るもの以外のファイルが1つでもあれば残す。
 */

const ALLOWED = new Set(["main.ts", "test", ".task.json"]);

/** main() の中身を取り出す。取れなければ null */
function mainBody(source) {
  const m = source.match(/function main\(\): void \{\n([\s\S]*?)\n\}/);
  return m ? m[1].trim() : null;
}

/** 未着手か。main() の中身で見て、取れないときだけ全文で比べる */
function isUntouched(source, template) {
  const a = mainBody(source);
  const b = mainBody(template);
  return a !== null && b !== null ? a === b : source === template;
}
const dryRun = process.argv.includes("--dry-run");

const root = process.cwd();
const contests = join(root, "contests");
const template = readFileSync(join(root, "template", "main.ts"), "utf8");

if (!existsSync(contests)) {
  console.log("contests/ がありません");
  process.exit(0);
}

const dirs = (path) =>
  readdirSync(path, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

const removed = [];
const kept = [];

for (const contest of dirs(contests)) {
  const contestDir = join(contests, contest);

  for (const task of dirs(contestDir)) {
    const dir = join(contestDir, task);
    const main = join(dir, "main.ts");
    const label = `${contest}/${task}`;

    if (!existsSync(main)) continue;
    if (!isUntouched(readFileSync(main, "utf8"), template)) {
      kept.push(label);
      continue;
    }

    const extra = readdirSync(dir).filter((name) => !ALLOWED.has(name));
    if (extra.length > 0) {
      kept.push(`${label}（${extra.join(", ")} があるため残す）`);
      continue;
    }

    if (!dryRun) rmSync(dir, { recursive: true, force: true });
    removed.push(label);
  }

  // 問題が全部消えて空になったコンテストのディレクトリも片付ける
  if (!dryRun && dirs(contestDir).length === 0 && readdirSync(contestDir).length === 0) {
    rmSync(contestDir, { recursive: true, force: true });
  }
}

for (const label of kept) console.log(`残す  : ${label}`);
for (const label of removed) console.log(`${dryRun ? "削除対象" : "削除  "}: ${label}`);
console.log(`\n${removed.length} 件${dryRun ? "が対象" : "を削除"}、${kept.length} 件を保持`);
