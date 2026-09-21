import * as fs from "fs";

const tokens = fs.readFileSync(0, "utf8").trim().split(/\s+/);
let cursor = 0;

const str = (): string => tokens[cursor++];
const num = (): number => Number(tokens[cursor++]);
const big = (): bigint => BigInt(tokens[cursor++]);
const strs = (n: number): string[] => Array.from({ length: n }, str);
const nums = (n: number): number[] => Array.from({ length: n }, num);

const out: string[] = [];
const print = (v: unknown): void => {
  out.push(String(v));
};

function main(): void {
  const N = num();
  const P = strs(N);
  const Q = strs(N);

  let p = 0;
  let q = 0;

  const used = Array(N + 1).fill(false);
  const current: number[] = [];
  let count = 0;

  function dfs(): void {
    if (current.length === N) {
      count += 1;
      if (String(current) === String(P)) {
        p = count;
      }
      if (String(current) === String(Q)) {
        q = count;
      }
      return;
    }

    for (let x = 1; x <= N; x++) {
      if (used[x]) continue;

      used[x] = true;
      current.push(x);

      dfs();

      current.pop();
      used[x] = false;
    }
  }

  dfs();

  print(Math.abs(p - q));
}

main();
if (out.length > 0) process.stdout.write(out.join("\n") + "\n");
