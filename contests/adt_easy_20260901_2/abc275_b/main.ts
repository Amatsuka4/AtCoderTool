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
  const S = nums(6);

  print((S[0] * S[1] * S[2] - S[3] * S[4] * S[5]) % 998244353);
}

main();
if (out.length > 0) process.stdout.write(out.join("\n") + "\n");
