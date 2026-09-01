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
  const S = str();
  const T = str();

  if (S === T) {
    print("0");
    return;
  }

  let count = 0;
  for (let i = 0; i < Math.max(S.length, T.length); i++) {
    if (S[i] === T[i]) {
      count++;
    } else {
      count++;
      break;
    }
  }
  print(count);
}

main();
if (out.length > 0) process.stdout.write(out.join("\n") + "\n");
