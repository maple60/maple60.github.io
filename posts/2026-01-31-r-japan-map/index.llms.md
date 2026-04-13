# Rで日本地図を描く

r

rnaturalearthパッケージとrnaturalearthhiresパッケージを使ってRで日本地図を描く方法を紹介します。

Published

2026-01-31

Modified

2026-01-31

## パッケージのインストールと読み込み

``` r
install.packages("rnaturalearth")
```

renvを使用している場合は、以下のコマンドでインストールします。

``` r
renv::install("necountries")
```

その後、パッケージを読み込みます。

``` r
library(rnaturalearth)
```

## 日本地図の描画

地図を描画するには、rnaturalearthdataパッケージも必要です。以下のコードで日本の地図を取得し、描画します。

``` r
install.packages("rnaturalearthdata")
renv::install("rnaturalearthdata") # renvを使用している場合
```

ライブラリを読み込まなくても問題ありませんが、念のため読み込みます。

``` r
library(rnaturalearthdata)
```


    Attaching package: 'rnaturalearthdata'

    The following object is masked from 'package:rnaturalearth':

        countries110

`ne_countries()`関数を使って日本の地図データを取得し、`plot()`関数で描画します。

``` r
japan <- ne_countries(
  scale = "medium",
  country = "Japan",
  returnclass = "sf"
)
plot(japan["geometry"])
```

![](index_files/figure-html/unnamed-chunk-3-1.png)

引数は、以下のように設定しています。

- `scale = "medium"`: 中程度の解像度の地図データを取得します。他に`small`や`large`も選択可能です。
- `country = "Japan"`: 日本の地図データを指定します。
- `returnclass = "sf"`: 地図データをsfオブジェクトとして返します。

これでRを使って日本地図を描くことができます。必要に応じて、地図のスタイルや詳細をカスタマイズしてください。

> **NOTE:**
>
> `ne_countries()`関数の詳細については、公式ドキュメントを参照してください。
>
> - [Get natural earth world country polygons — ne_countries • rnaturalearth](https://ropensci.github.io/rnaturalearth/reference/ne_countries.html)

## 日本地図を県別に描画する

県別の日本地図を描画するには、`rnaturalearthhires`パッケージを使用します。 インストールは、GitHubもしくはR-universeから行います。

> **NOTE:**
>
> パッケージのサイズがCRANの推奨を超えているため、CRANからのインストールができないようです。

``` r
remotes::install_github("ropensci/rnaturalearthhires")
```

または、以下のコードでインストールします。

``` r
install.packages(
  "rnaturalearthhires",
  repos = "https://ropensci.r-universe.dev",
  type = "source"
)
```

もしくは、renvを使用している場合は、以下のコマンドでインストールします。

``` r
renv::install("ropensci/rnaturalearthhires")
```

パッケージを読み込みます。

``` r
library(rnaturalearthhires)
```

県別の日本地図を取得し、描画します。

``` r
japan_prefectures <- ne_states(
  country = "Japan",
  returnclass = "sf"
)
plot(japan_prefectures["name_ja"])
```

![](index_files/figure-html/unnamed-chunk-5-1.png)

海岸線もきれいに描画されていますね。

> **NOTE:**
>
> `na_states()`関数の詳細については、公式ドキュメントを参照してください。
>
> - [Get natural earth world state (admin level 1) polygons — ne_states • rnaturalearth](https://ropensci.github.io/rnaturalearth/reference/ne_states.html)

## 参考

- [High Resolution World Vector Map Data from Natural Earth used in rnaturalearth • rnaturalearthhires](https://docs.ropensci.org/rnaturalearthhires/index.html)
- [rnaturalearthhires - GitHub](https://github.com/ropensci/rnaturalearthhires)
