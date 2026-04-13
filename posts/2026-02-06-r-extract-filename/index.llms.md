# Rでファイル名を抽出する方法

r

basename(), `file.path_sans_ext()`を使ってRでファイル名を抽出する方法についてまとめます。

Published

2026-02-06

Modified

2026-02-06

Rでファイルパスを扱う際に、ファイル名だけを抽出したり、拡張子を除いたファイル名を取得したりすることがあります。 ここでは、`basename()`や`tools::file_path_sans_ext()`を使って、Rでファイル名を抽出する方法についてまとめます。

## ファイル名の抽出

ファイルパスからファイル名を抽出するには、`basename()`関数を使用します。

``` r
file_path <- "/path/to/your/file/data.csv"
file_name <- basename(file_path)
print(file_name)
```

    [1] "data.csv"

ディレクトリパスを含むファイルパスから、ファイル名だけが抽出されました。

## 拡張子を除いたファイル名の抽出

拡張子を除いたファイル名を取得するには、`tools`パッケージの`file_path_sans_ext()`関数を使用します。

``` r
library(tools)
file_path <- "/path/to/your/file/data.csv"
file_name_no_ext <- file_path_sans_ext(basename(file_path))
print(file_name_no_ext)
```

    [1] "data"

これにより、拡張子を除いたファイル名が取得できます。

> **NOTE:**
>
> 少し長い関数名で覚えづらいですが、意味から覚えると忘れにくいと思います。 `sans`はフランス語で「〜なし」を意味します。 英語の`without`に相当します。 また、`ext`は「拡張子(extension)」の略です。 したがって、`file_path_sans_ext()`は「拡張子なしのファイルパス」を意味しています。

## 使用例

データと対応する画像ファイル名などを結び付けてデータフレームにまとめる場合などに便利です。

``` r
file_paths <- c(
  "/path/to/your/file/data1.csv",
  "/path/to/your/file/data2.csv",
  "/path/to/your/file/data3.csv"
)
file_names <- basename(file_paths)
file_names_no_ext <- file_path_sans_ext(file_names)
df <- data.frame(value = c(10, 20, 30), file_name = file_names_no_ext)
print(df)
```

      value file_name
    1    10     data1
    2    20     data2
    3    30     data3

このようにして、ファイル名をデータフレームに含めることができます。
