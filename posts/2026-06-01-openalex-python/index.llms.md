# OpenAlexをPythonから使ってみる

python

openalex

api

OpenAlex APIをPythonから呼び出し、論文メタデータを取得するための下書きです。

Published

2026-06-01

Modified

2026-06-01

> **NOTE:**
>
> English version: [Using OpenAlex from Python](../../en/posts/2026-06-01-openalex-python/index.llms.md)

## はじめに

この記事では、[OpenAlex](https://openalex.org/)をPythonから使い、論文や著者などの学術メタデータを取得する手順を整理します。

OpenAlexは、論文、著者、ジャーナル、機関、トピックなどを扱う学術情報のデータベースです。 APIのベースURLは `https://api.openalex.org` で、`/works`、`/authors`、`/sources`、`/institutions` などのエンドポイントが用意されています。

この記事では、まず `/works` エンドポイントを使い、キーワード検索、条件による絞り込み、結果の表形式への変換までを扱います。

## 実行環境

まず、この `.qmd` ファイル内でPythonが実行できるかを確認します。 ここではAPIにはアクセスせず、レンダリング時に必要なPython、`requests`、`pandas` が使えることだけを確認します。

``` python
import platform

import pandas as pd
import requests

pd.DataFrame(
    {
        "component": ["python", "requests", "pandas"],
        "version": [
            platform.python_version(),
            requests.__version__,
            pd.__version__,
        ],
    }
)
```

|     | component | version |
|-----|-----------|---------|
| 0   | python    | 3.12.13 |
| 1   | requests  | 2.34.2  |
| 2   | pandas    | 3.0.3   |

## APIキーの準備

OpenAlex APIを使うときは、APIキーを環境変数として保存しておくと、記事本文やコードにキーを書かずにすみます。

> **NOTE:**
>
> OpenAlexのAPI Referenceでは、`api_key` をクエリパラメータとして渡す形式が案内されています。 GitHub Actionsで実行する場合は、`OPENALEX_API_KEY` をRepository secretとして登録し、workflow側で環境変数として渡します。

``` bash
export OPENALEX_API_KEY="your-api-key"
```

Windows PowerShellでは次のように設定します。

``` powershell
$env:OPENALEX_API_KEY = "your-api-key"
```

## Works APIで論文を検索する

次のコードは、`/works` エンドポイントに対してキーワード検索を行う例です。 APIキーが必要なので、下書き段階では `eval: false` にしています。 実際に記事として実行する場合は、APIキーを設定したうえで `eval: true` に変更します。

``` python
import os

import pandas as pd
import requests

api_key = os.environ["OPENALEX_API_KEY"]

params = {
    "api_key": api_key,
    "search": "species distribution model",
    "filter": "publication_year:2024,type:article,open_access.is_oa:true",
    "sort": "cited_by_count:desc",
    "per_page": 5,
    "select": "id,display_name,publication_year,cited_by_count,doi",
}

response = requests.get(
    "https://api.openalex.org/works",
    params=params,
    timeout=30,
)
response.raise_for_status()

works = response.json()["results"]

pd.DataFrame(
    [
        {
            "title": work["display_name"],
            "year": work["publication_year"],
            "citations": work["cited_by_count"],
            "doi": work.get("doi"),
            "openalex_id": work["id"],
        }
        for work in works
    ]
)
```

## 取得結果を見るときの観点

取得した結果は、次のような観点で確認すると記事としてまとめやすくなります。

- `display_name`: 論文タイトルとして表示する
- `publication_year`: 年ごとの絞り込みや集計に使う
- `cited_by_count`: 被引用数で並べ替えると、よく引用されている文献を見つけやすい
- `doi`: DOIがある場合は元論文へのリンクに使える
- `id`: OpenAlex上の永続的な識別子として使える

## 次に試すこと

この記事では、最初のひな形としてWorks APIだけを扱いました。 本文を書き進めるときは、次のどれかを加えると内容を広げやすいです。

- 特定の著者IDや機関IDで絞り込む
- `group_by` を使って出版年やオープンアクセス状況を集計する
- DOIからOpenAlexのレコードを引く
- 取得した文献リストをCSVとして保存する

## 参考

- [OpenAlex API Overview](https://developers.openalex.org/api-reference/introduction)
- [OpenAlex Works API](https://developers.openalex.org/api-reference/works/list-works)
- [Using Python - Quarto](https://quarto.org/docs/computations/python.html)
