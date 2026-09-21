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

  const a = [];

  for (let i = 0; i < N; i++) {
    if (i < 3) {
      a.push(A[i]);
      a.sort((a, b) => {
        return b - a;
      });
      if (a[2]) {
        print(a[2]);
      }
      continue;
    }

    if (a[0] <= A[i]) {
      a.unshift(A[i]);
      a.pop();
    } else if (a[1] <= A[i]) {
      a.splice(1, 0, A[i]);
      a.pop();
    } else if (a[2] <= A[i]) {
      a.pop();
      a.push(A[i]);
    }

    print(a[2]);
  }
}

main();
if (out.length > 0) process.stdout.write(out.join("\n") + "\n");
