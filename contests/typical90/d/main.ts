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
  const H = num();
  const W = num();

  const A = [];

  const row = [];
  const line = Array(W).fill(0);

  const res = [];

  for (let i = 0; i < H; i++) {
    const numbers = nums(W);
    A.push(numbers);
    row.push(numbers.reduce((prev, curr) => prev + curr, 0));
    for (let j = 0; j < W; j++) {
      line[j] += numbers[j];
    }
  }

  for (let i = 0; i < H; i++) {
    const c_row = [];
    for (let j = 0; j < W; j++) {
      c_row.push(row[i] + line[j] - A[i][j]);
    }
    res.push(c_row);
    print(c_row.join(" "));
  }
}

main();
if (out.length > 0) process.stdout.write(out.join("\n") + "\n");
