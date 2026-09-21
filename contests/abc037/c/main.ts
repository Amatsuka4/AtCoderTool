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
  const K = num();
  const A = nums(N);

  let sum = 0;
  let ans = 0;
  for (let i = 0; i < N; i++) {
    sum += A[i];

    if (i >= K - 1) {
      if (i >= K) {
        sum -= A[i - K];
      }
      ans += sum;
    }
  }

  print(ans);
}

main();
if (out.length > 0) process.stdout.write(out.join("\n") + "\n");
