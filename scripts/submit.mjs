import { spawnSync } from "child_process";
import { readFileSync } from "fs";
import { join } from "path";
import { resolveTasks, requirePrepared } from "./lib.mjs";

/**
 * AtCoder は提出フォームに Cloudflare Turnstile を入れており、
 * ブラウザが生成するトークンなしでは POST が通らない（× Error. になる）。
 * oj も atcoder-cli も同じ理由で提出できない。
 * ここではソースをクリップボードに入れ、提出ページを開くまでを行う。
 */

const noOpen = process.argv.includes("--no-open");
const argv = process.argv.slice(2).filter((a) => a !== "--no-open");

const tasks = await resolveTasks(argv);
if (tasks.length > 1) {
  console.error("提出は問題を1つ指定してください");
  process.exit(1);
}
const task = requirePrepared(tasks[0]);

// taskScreenName を付けると問題が選択された状態で開く
const url = `https://atcoder.jp/contests/${task.contest}/submit?taskScreenName=${task.taskId}`;
const source = readFileSync(join(task.dir, "main.ts"), "utf8");

function copyToClipboard(text) {
  const cmd =
    process.platform === "win32"
      ? ["powershell", ["-NoProfile", "-Command", "$input | Set-Clipboard"]]
      : process.platform === "darwin"
        ? ["pbcopy", []]
        : ["xclip", ["-selection", "clipboard"]];
  const r = spawnSync(cmd[0], cmd[1], { input: text, stdio: ["pipe", "ignore", "ignore"] });
  return !r.error && r.status === 0;
}

function openBrowser(target) {
  const cmd =
    process.platform === "win32"
      ? ["cmd", ["/c", "start", "", target]]
      : process.platform === "darwin"
        ? ["open", [target]]
        : ["xdg-open", [target]];
  spawnSync(cmd[0], cmd[1], { stdio: "ignore" });
}

console.log(
  copyToClipboard(source)
    ? "main.ts をクリップボードにコピーしました"
    : "クリップボードへのコピーに失敗しました（手動でコピーしてください）",
);
console.log(`提出ページ: ${url}`);
console.log("");
console.log("AtCoder は提出フォームに Cloudflare Turnstile を入れているため、");
console.log("コマンドラインからは提出できません。開いたページで貼り付けてください。");
console.log("言語は TypeScript 5.9 (tsc 5.9.2 (Node.js 22.19.0)) を選びます。");

if (!noOpen) openBrowser(url);
