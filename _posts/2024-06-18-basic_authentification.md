---
title:  BASIIC認証でつまったこと
layout: post
tags: [BASIC認証]
---

BASIC認証を使用したときのメモです。

適切な`.htacess`と`.htpasswd`を作成したつもりが、500エラー(Internal Server Error)になってしまいました。

原因は以下でした。

- `AuthUserFile`が`AuthUserfile`になっていた(`f`が小文字!)
- `AuthName`の文字列のクォーテーションマークが`"`(straight quotes)ではなく、`“`(smart quotes)になっていた。

どちらも細かいですが、気づきにくいですね。

参考サイトからコピペした弊害です。
コードは最初は手打ちしたほうが良いのかもしれないですね。

その他もいろいろ落とし穴があるので、慣れないうちは特に細心の注意を払う必要がありますね。