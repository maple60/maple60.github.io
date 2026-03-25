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

``` downlit
options(
  repos = c(
    CRAN = "https://cran.rstudio.com",
    "r-universe" = "https://ropensci.r-universe.dev"
  )
)
renv::snapshot(force = TRUE)
```

    The following package(s) will be updated in the lockfile:

    # CRAN -----------------------------------------------------------------------
    - boot          [1.3-32 -> *]
    - brio          [1.1.5 -> *]
    - cluster       [2.1.8.1 -> *]
    - codetools     [0.2-20 -> *]
    - desc          [1.4.3 -> *]
    - downlit       [0.4.5 -> *]
    - fansi         [1.0.7 -> *]
    - foreign       [0.8-90 -> *]
    - ggrepel       [0.9.7 -> *]
    - mgcv          [1.9-3 -> *]
    - necountries   [0.1-1 -> *]
    - nlme          [3.1-168 -> *]
    - nnet          [7.3-20 -> *]
    - rbibutils     [2.4.1 -> *]
    - Rdpack        [2.6.6 -> *]
    - rpart         [4.1.24 -> *]
    - spatial       [7.3-18 -> *]
    - survival      [3.8-3 -> *]
    - xml2          [1.5.2 -> *]

    - Lockfile written to "~/work/maple60.github.io/maple60.github.io/renv.lock".

このコードでは、[`options()`](https://rdrr.io/r/base/options.html)関数を使って、CRANとr-universeのリポジトリを指定しています。 その後、`renv::snapshot(force = TRUE)`を実行して、`renv.lock` ファイルを更新しています。

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
