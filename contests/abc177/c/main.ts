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
  const A = nums(N);

  const MOD = 1000000007n;

  const ps: number[] = [];

  let sum: number = 0;
  for (let i = 0; i < N; i++) {
    sum += A[i];
    ps.push(sum);
  }

  let r = BigInt(0);
  for (let i = 0; i < N - 1; i++) {
    let a = BigInt(A[i]);
    let b = BigInt(ps[N - 1]) - BigInt(ps[i]);

    let bigsum = a * b;
    r += bigsum % MOD;
  }
  print(r % MOD);
}

main();
if (out.length > 0) process.stdout.write(out.join("\n") + "\n");
