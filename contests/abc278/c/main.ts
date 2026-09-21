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
  const Q = num();

  const F: Record<number, Set<number>> = { 1: new Set() };

  for (let i = 0; i < Q; i++) {
    const T = num();
    const A = num();
    const B = num();

    // フォロー操作
    if (T === 1) {
      if (F[A]) {
        F[A].add(B);
      } else {
        F[A] = new Set();
        F[A].add(B);
      }
    }

    // アンフォロー操作
    if (T === 2) {
      if (F[A]) {
        F[A].delete(B);
      }
    }

    // 相互フォローチェック
    if (T === 3) {
      if (F[A] && F[B]) {
        if (F[A].has(B) && F[B].has(A)) {
          print("Yes");
        } else {
          print("No");
        }
      } else {
        print("No");
      }
    }
  }
}

main();
if (out.length > 0) process.stdout.write(out.join("\n") + "\n");
