# AtCoder (TypeScript)

Node の TypeScript 直接実行を使うので、ビルドは不要。

## セットアップ（新しい環境で一度だけ）

必要なもの: **Node.js 22 以上**（`.ts` の直接実行に必要）、**Python 3**

```bash
npm install
```

```bash
pip install online-judge-tools
```

`oj --version` が通ることを確認する。通らない場合は pip のスクリプト置き場
（Windows なら `...\Python3xx\Scripts`）に PATH を通す。

## 使い方

問題を用意する（ディレクトリ作成 + サンプル取得）

```bash
npm run new -- https://atcoder.jp/contests/abc300/tasks/abc300_a
```

コンテストのURLを渡すと、その回の全問題をまとめて用意する。

```bash
npm run new -- https://atcoder.jp/contests/abc300
```

`コンテストID 問題` の形でも指定できる。

```bash
npm run new -- abc300 a
```

`contests/<コンテスト>/<問題>/main.ts` を編集して、サンプルでテストする。
URLは `.task.json` に控えてあるので、**問題ディレクトリの中では引数が要らない**。

```bash
cd contests/abc300/a
npm run t
```

ルートから実行するときは `new` と同じ指定方法が使える。

```bash
npm run t -- https://atcoder.jp/contests/abc300/tasks/abc300_a
```

型チェック（任意）

```bash
npm run typecheck
```

## 提出

**提出はコマンドラインからはできない。ブラウザで行う。**

AtCoder は提出フォームに Cloudflare Turnstile を入れており、POST には
ブラウザが生成する `cf-turnstile-response` が必要。無いと `× Error.` になる。
oj も atcoder-cli も同じ理由で提出できない。

`npm run submit` は「提出」ではなく「提出の準備」を行う。
main.ts をクリップボードにコピーし、問題が選択された状態で提出ページを開く。

```bash
cd contests/abc300/a
npm run submit
```

開いたページに貼り付け、言語に **TypeScript 5.9 (tsc 5.9.2 (Node.js 22.19.0))**
を選ぶ。ローカルの `node main.ts` と実行系が揃うのでこれを使う。
Deno 版は `"fs"` の解決方法が違うため、このテンプレートのままでは通らない。

AtCoder 側は tsc で型チェックしてから実行するので、ローカルで動いても
型エラーがあると CE になる。不安なときは `npm run typecheck`。

## 未着手の問題を片付ける

取ってきただけで解いていない問題ディレクトリを消す。

```bash
npm run clean
```

消す前に確認したいとき。

```bash
npm run clean -- --dry-run
```

判定は `main()` の中身がテンプレートのままかどうかで行う。ファイル全体で
比べると、テンプレートのヘッダを後から変えたときに検出できなくなるため。

`main.ts` / `test/` / `.task.json` 以外のファイルが1つでもあれば消さない。

GitHub Actions（`.github/workflows/clean.yml`）が main への push で同じ処理を
実行し、消すものがあればコミットする。手動実行も可。

## ログイン（開催中のコンテストのサンプル取得用）

公開済みのコンテストならログイン不要。開催中の回など、ログインが要る場合だけ。

1. ブラウザで https://atcoder.jp にログイン
2. `F12` → Application → Cookies → `https://atcoder.jp`
3. `REVEL_SESSION` の値をコピー
4. `npm run login` を実行し、値を貼り付け

Cookie はパスワード相当。保存先は oj の cookie.jar（リポジトリ外）。

## 構成

```
template/main.ts   新規問題にコピーされるひな形（入力トークナイザ + 出力バッファ）
scripts/           login / new / t / submit の実体
contests/          各問題。main.ts と test/ が入る
```
