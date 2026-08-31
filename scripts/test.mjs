import { spawnSync } from "child_process";
import { resolveTasks, requirePrepared } from "./lib.mjs";

const tasks = await resolveTasks(process.argv.slice(2));
if (tasks.length > 1) {
  console.error("テストは問題を1つ指定してください");
  process.exit(1);
}
const task = requirePrepared(tasks[0], { needSamples: true });

// Node 22+ は .ts を直接実行できるのでビルド不要
const r = spawnSync("oj", ["t", "-c", "node main.ts", "-d", "test"], {
  cwd: task.dir,
  stdio: "inherit",
});
process.exit(r.status ?? 1);
