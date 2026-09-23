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
  const B = nums(N);

  let sum = 0;
  for (let i = 0; i < N; i++) {
    sum += Math.abs(A[i] - B[i]);
  }

  if (sum > K) {
    print("No");
  } else if (sum - K === 0) {
    print("Yes");
  } else {
    if ((sum - K) % 2) {
      print("No");
    } else {
      print("Yes");
    }
  }
}

main();
if (out.length > 0) process.stdout.write(out.join("\n") + "\n");
