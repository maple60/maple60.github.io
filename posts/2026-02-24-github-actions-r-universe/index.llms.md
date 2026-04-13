# GitHub Actionsとrenvを使ってr-universeのパッケージを利用する際の注意点

github

r

GitHub ActionsでGitHub Pagesを利用しており、renvおよびr-universeを利用している場合、GitHub Actionsの環境でrenvが正しく動作しないことがあります。この記事では、その原因と対処法について説明します。

Published

2026-02-24

Modified

2026-02-24

## 症状

このウェブページでは、GitHub Actionsを利用して、GitHub Pagesを作成しています。 このとき、Rパッケージはrenvを利用して管理しています。 このとき、[r-universe](https://r-universe.dev/search)のパッケージを利用していると、GitHub Actionsの環境でrenvが正しく動作しないことがありました。

具体的には、`rnaturalearthhires`というパッケージを使用した記事を書いた後に、ビルドしたら、以下のようなエラーが発生しました。

    # Downloading packages -------------------------------------------------------
    - Querying repositories for available source packages ... Done!
    Error: code 22]

このエラーは、GitHub Actionsの環境でrenvがr-universeのパッケージを正しく認識できないことが原因でした。

## 対処法

`renv.lock` ファイルを確認すると、“Repositories”の部分に、r-universeのURLが含まれていませんでした。 このため、GitHub Actionsの環境でrenvがr-universeのパッケージを認識できないことが原因でした。

``` r
{
  "R": {
    "Version": "4.5.2",
    "Repositories": [
      {
        "Name": "CRAN",
        "URL": "https://cran.rstudio.com"
      }
    ]
  },
  "Packages": {
```

以下のコードをローカル環境で実行して、`renv.lock` ファイルの “Repositories” の部分に、r-universeのURLを追加することで、GitHub Actionsの環境でrenvがr-universeのパッケージを認識できるようになりました。

``` r
options(
  repos = c(
    CRAN = "https://cran.rstudio.com",
    "r-universe" = "https://ropensci.r-universe.dev"
  )
)
renv::snapshot(force = TRUE)
```

    The version of R recorded in the lockfile will be updated:
    - R   [4.5.3 -> 4.5.2]

    - Lockfile written to "~/work/maple60.github.io/maple60.github.io/renv.lock".

このコードでは、`options()`関数を使って、CRANとr-universeのリポジトリを指定しています。 その後、`renv::snapshot(force = TRUE)`を実行して、`renv.lock` ファイルを更新しています。

このコードを実行すると、`renv.lock` ファイルの “Repositories” の部分に、r-universeのURLが追加されます。

``` r
{
  "R": {
    "Version": "4.5.2",
    "Repositories": [
      {
        "Name": "CRAN",
        "URL": "https://cran.rstudio.com"
      },
      {
        "Name": "r-universe",
        "URL": "https://ropensci.r-universe.dev"
      }
    ]
  },
  "Packages": {
```

その後、変更をコミットして、GitHub Actionsでビルドすると、エラーが解消されて、r-universeのパッケージを利用できるようになりました。
