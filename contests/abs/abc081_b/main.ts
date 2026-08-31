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
  const n = num();
  const s = nums(n);

  const divided = (numbers: number[]): number[] => {
    return numbers.map((num: number): number => {
      return num / 2;
    });
  };

  let count = 0;
  let numbers = s;
  while (true) {
    if (numbers.some((v) => v % 2 !== 0)) {
      print(count);
      return;
    } else {
      count += 1;
      numbers = divided(numbers);
    }
  }
}

main();
if (out.length > 0) process.stdout.write(out.join("\n") + "\n");
