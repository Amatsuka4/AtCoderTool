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
  const s1 = str();
  const s2 = str();

  if (s1 === "sick" && s2 === "sick") {
    print(1);
  } else if (s1 === "sick" && s2 === "fine") {
    print(2);
  } else if (s1 === "fine" && s2 === "sick") {
    print(3);
  } else {
    print(4);
  }
}

main();
if (out.length > 0) process.stdout.write(out.join("\n") + "\n");
