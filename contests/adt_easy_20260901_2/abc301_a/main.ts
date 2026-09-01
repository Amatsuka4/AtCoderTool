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
  const S = [...str()];

  let t = 0;
  let a = 0;
  let l = "";
  for (const c of S) {
    if (c === "T") t++;
    if (c === "A") a++;
    l = c;
  }

  if (t > a) {
    print("T");
  } else if (t < a) {
    print("A");
  } else {
    if (l === "T") print("A");
    if (l === "A") print("T");
  }
}

main();
if (out.length > 0) process.stdout.write(out.join("\n") + "\n");
