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
  const A = big();
  const B = big();
  const C = big();

  const gcd = (a: bigint, b: bigint): bigint => {
    if (b === 0n) {
      return a;
    }
    return gcd(b, a % b);
  };

  const t = gcd(gcd(A, B), C);

  print(A / t + B / t + C / t - 3n);
}

main();
if (out.length > 0) process.stdout.write(out.join("\n") + "\n");
