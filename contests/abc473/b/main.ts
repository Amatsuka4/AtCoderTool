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
  const A = nums(N).sort();

  const r: number[] = [];
  for (let i = 0; i < N; i++) {
    if (i === N - 1) {
      r.push(A[i]);
      break;
    }
    if (A[i] === A[i + 1]) {
      i++;
    } else {
      r.push(A[i]);
    }
  }

  print(r.reduce((c, v) => c + v, 0));
}

main();
if (out.length > 0) process.stdout.write(out.join("\n") + "\n");
