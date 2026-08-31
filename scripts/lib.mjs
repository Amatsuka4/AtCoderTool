import { existsSync, readFileSync, writeFileSync } from "fs";
import { join, dirname, basename, sep } from "path";

/** 問題ディレクトリに置く、その問題のURLなどの控え */
export const META = ".task.json";

const USAGE = `使い方:
  問題ディレクトリの中では引数不要:
    cd contests/abs/practice_1
    npm run t

  ルートから指定する場合:
    npm run new -- <URL>              問題URL / コンテストURL のどちらでも可
    npm run new -- <contest> <task>   例: npm run new -- abc300 a`;

export function usageExit() {
  console.error(USAGE);
  process.exit(1);
}

/** タスクIDからディレクトリ名を決める。abc300_a -> a、接頭辞が無ければそのまま */
function dirNameFor(contest, taskId) {
  const prefix = `${contest}_`;
  return taskId.startsWith(prefix) ? taskId.slice(prefix.length) : taskId;
}

function makeTask(contest, taskId) {
  return {
    contest,
    taskId,
    dir: join(process.cwd(), "contests", contest, dirNameFor(contest, taskId)),
    url: `https://atcoder.jp/contests/${contest}/tasks/${taskId}`,
  };
}

export function writeMeta({ contest, taskId, url, dir }) {
  writeFileSync(join(dir, META), JSON.stringify({ contest, taskId, url }, null, 2) + "\n");
}

/** .task.json が無い既存ディレクトリ向けに、パスから復元する */
function metaFromPath(dir) {
  const name = basename(dir);
  const contest = basename(dirname(dir));
  // abc300/a -> abc300_a、abs/practice_1 -> practice_1
  const taskId = name.includes("_") ? name : `${contest}_${name}`;
  return { contest, taskId, dir, url: `https://atcoder.jp/contests/${contest}/tasks/${taskId}` };
}

function findTaskDir(start) {
  let dir = start;
  for (;;) {
    if (existsSync(join(dir, META)) || existsSync(join(dir, "main.ts"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

/** 引数なしのとき、実行した場所から問題を特定する */
function taskFromCwd() {
  // npm run はスクリプトを package.json の場所で動かすので、
  // 実際に叩かれた場所は INIT_CWD で受け取る
  const dir = findTaskDir(process.env.INIT_CWD || process.cwd());
  if (!dir || !dir.split(sep).includes("contests")) {
    console.error("問題ディレクトリの中で実行するか、URLを指定してください。");
    usageExit();
  }
  const metaPath = join(dir, META);
  if (existsSync(metaPath)) return { ...JSON.parse(readFileSync(metaPath, "utf8")), dir };
  return metaFromPath(dir);
}

export function requirePrepared(task, { needSamples = false } = {}) {
  if (!existsSync(task.dir)) {
    console.error(`${task.taskId} はまだ用意されていません: ${task.dir}`);
    console.error(`先に:  npm run new -- ${task.url}`);
    process.exit(1);
  }
  if (needSamples && !existsSync(join(task.dir, "test"))) {
    console.error(`${task.taskId} のサンプルがありません。`);
    console.error(`もう一度:  npm run new -- ${task.url}`);
    console.error("ログインが必要な回なら先に:  npm run login");
    process.exit(1);
  }
  return task;
}

/** コンテストの問題一覧ページからタスクIDを集める */
async function fetchTaskIds(contest) {
  const res = await fetch(`https://atcoder.jp/contests/${contest}/tasks`);
  if (!res.ok) {
    console.error(`問題一覧を取得できませんでした (HTTP ${res.status})`);
    if (res.status === 404) console.error("ログインが必要な回かもしれません:  npm run login");
    process.exit(1);
  }
  const html = await res.text();
  const re = new RegExp(`/contests/${contest}/tasks/([a-z0-9_]+)`, "g");
  const ids = [...new Set([...html.matchAll(re)].map((m) => m[1]))];
  if (ids.length === 0) {
    console.error("問題が見つかりませんでした。コンテストIDを確認してください");
    process.exit(1);
  }
  return ids;
}

/**
 * 引数を解釈して対象タスクの配列を返す。
 * 引数なしなら実行した場所から、URL 1本、または contest と task の2つでも指定できる。
 * コンテストURLを渡した場合は全問題が対象になる。
 */
export async function resolveTasks(argv) {
  const [first, second] = argv;
  if (!first) return [taskFromCwd()];

  if (!/^https?:\/\//i.test(first)) {
    if (!second) usageExit();
    const contest = first.toLowerCase();
    return [makeTask(contest, `${contest}_${second.toLowerCase()}`)];
  }

  const m = first.match(/atcoder\.jp\/contests\/([^/?#]+)(?:\/tasks(?:\/([^/?#]+))?)?/i);
  if (!m) {
    console.error("AtCoder の URL として解釈できませんでした");
    usageExit();
  }

  const contest = m[1].toLowerCase();
  if (m[2]) return [makeTask(contest, m[2].toLowerCase())];
  return (await fetchTaskIds(contest)).map((id) => makeTask(contest, id));
}
