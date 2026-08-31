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
  const A = num();
  const B = num();
  const C = num();
  const X = num();

  let count: number = 0;

  for (let c = 0; c < C + 1; c++) {
    for (let b = 0; b < B + 1; b++) {
      for (let a = 0; a < A + 1; a++) {
        const total = a * 500 + b * 100 + c * 50;
        if (total === X) {
          count++;
          break;
        }
      }
    }
  }

  print(count);
}

main();
if (out.length > 0) process.stdout.write(out.join("\n") + "\n");
