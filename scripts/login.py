"""AtCoder の REVEL_SESSION クッキーを oj に保存する。

開催中のコンテストなど、ログインしないとサンプルを取得できない回のために使う。
AtCoder は Cloudflare を導入していて `oj login` は通らないため、
ブラウザで取得したセッションクッキーを直接 cookie.jar に書き込む。

（aclogin という既存ツールが同じ用途だが、ツール検出に Unix の `which` を
使っており Windows では常に検出0件になるため、ここで同じ処理を行う）
"""

import http.cookiejar
import pathlib
import sys
import time

import appdirs
import requests


def cookie_path() -> pathlib.Path:
    return pathlib.Path(appdirs.user_data_dir("online-judge-tools")) / "cookie.jar"


def store(value: str, path: pathlib.Path) -> http.cookiejar.LWPCookieJar:
    path.parent.mkdir(parents=True, exist_ok=True)

    jar = http.cookiejar.LWPCookieJar(str(path))
    if path.exists():
        try:
            jar.load(ignore_discard=True)
        except Exception:
            pass

    jar.set_cookie(
        http.cookiejar.Cookie(
            version=0,
            name="REVEL_SESSION",
            value=value,
            port=None,
            port_specified=False,
            domain="atcoder.jp",
            domain_specified=True,
            domain_initial_dot=False,
            path="/",
            path_specified=True,
            secure=True,
            expires=int(time.time()) + 60 * 60 * 24 * 365,
            discard=False,
            comment=None,
            comment_url=None,
            rest={"HttpOnly": None},
            rfc2109=False,
        )
    )
    jar.save(ignore_discard=True)
    return jar


def verify(jar: http.cookiejar.CookieJar) -> bool:
    """ログイン済みでないと見られないページで確認する"""
    session = requests.Session()
    session.cookies = jar
    session.headers["User-Agent"] = "Mozilla/5.0"
    return session.get("https://atcoder.jp/settings", allow_redirects=False).status_code == 200


def main() -> None:
    print("ブラウザで atcoder.jp にログインし、F12 → Application → Cookies →")
    print("https://atcoder.jp の REVEL_SESSION の値を貼り付けてください:")
    # 貼り付け時に BOM や空白が混じることがあるので落とす
    value = input().strip().lstrip("﻿").strip()
    if value.startswith("REVEL_SESSION="):
        value = value[len("REVEL_SESSION=") :]

    if not value:
        print("エラー: 値が入力されていません", file=sys.stderr)
        sys.exit(1)

    path = cookie_path()
    jar = store(value, path)
    print(f"保存しました: {path}（{len(value)} 文字）")

    if verify(jar):
        print("ログインを確認しました。")
    else:
        print(
            "エラー: このクッキーではログイン状態になりません。\n"
            "  ・値をすべて選択してコピーできているか（途中で切れていないか）\n"
            "  ・ブラウザ側で実際にログインできているか\n"
            "を確認して、もう一度実行してください。",
            file=sys.stderr,
        )
        sys.exit(1)


if __name__ == "__main__":
    main()
