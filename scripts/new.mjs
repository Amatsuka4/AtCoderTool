import { spawnSync } from "child_process";
import { mkdirSync, copyFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";
import { resolveTasks, writeMeta } from "./lib.mjs";

const tasks = await resolveTasks(process.argv.slice(2));
const template = join(process.cwd(), "template", "main.ts");

/** oj d は test/ に既にファイルがあると失敗するので、取得済みなら呼ばない */
function hasSamples(dir) {
  const testDir = join(dir, "test");
  return existsSync(testDir) && readdirSync(testDir).length > 0;
}

for (const task of tasks) {
  const { taskId, dir, url } = task;
  mkdirSync(dir, { recursive: true });

  // URL を控えておき、以降はディレクトリの中から引数なしで実行できるようにする
  writeMeta(task);

  const main = join(dir, "main.ts");
  const notes = [];
  if (existsSync(main)) notes.push("main.ts は既存のものを残しました");
  else copyFileSync(template, main);

  let ok = true;
  if (hasSamples(dir)) {
    notes.push("サンプルは取得済みです");
  } else {
    // 公開されている回ならログイン不要
    const r = spawnSync("oj", ["d", url, "-d", "test", "--silent"], {
      cwd: dir,
      stdio: ["ignore", "ignore", "inherit"],
    });
    ok = r.status === 0;
  }

  const suffix = notes.length > 0 ? `（${notes.join("、")}）` : "";
  console.log(
    ok ? `${taskId}: 準備完了 -> ${dir}${suffix}` : `${taskId}: サンプル取得に失敗${suffix}`,
  );
}
