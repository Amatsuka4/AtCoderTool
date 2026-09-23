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

  const C1_acc = [0];
  const C2_acc = [0];

  let sums = [0, 0];
  for (let i = 0; i < N; i++) {
    const C = num();
    const P = num();

    sums[C - 1] += P;
    C1_acc.push(sums[0]);
    C2_acc.push(sums[1]);
  }

  const Q = num();

  for (let i = 0; i < Q; i++) {
    const L = num();
    const R = num();

    const C1 = C1_acc[R] - C1_acc[L - 1];
    const C2 = C2_acc[R] - C2_acc[L - 1];

    print(`${C1} ${C2}`);
  }
}

main();
if (out.length > 0) process.stdout.write(out.join("\n") + "\n");
