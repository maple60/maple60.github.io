# jpplantnames Rパッケージについて

r

jpplantnames Rパッケージについて簡単にまとめます。

公開

2026-06-17

更新日

2026-06-17

[English version](../../en/posts/2026-06-17-jpplantnames/)

最近作成した、`jpplantnames`というRパッケージについて簡単にまとめます。 ドキュメントは、以下をご覧ください。

- [jpplantnames • jpplantnames](https://maple60.github.io/jpplantnames/)

## インストールとライブラリの読み込み

いつも通りパッケージをインストールします。 現在はGitHubにしか公開していませんので、`pak`や`remotes`, `renv`などを使ってインストールしてください。

``` downlit
pak::pak("maple60/jpplantnames")
remotes::install_github("maple60/jpplantnames")
# renv::install("maple60/jpplantnames") # renvを使用している場合
```

インストールが完了したら、[`library()`](https://rdrr.io/r/base/library.html)で読み込みます。

``` downlit
library(jpplantnames)
```

## 和名から学名を取得する

[`scientific_name()`](https://maple60.github.io/jpplantnames/reference/scientific_name.html)関数で和名から学名を取得できます。 初回の実行はデータのダウンロードが行われるため、少し時間がかかります。 この時、インターネットに接続されている必要があることに注意します。 二回目以降は、キャッシュが使用されるため、すぐに結果が返ってきます。

``` downlit
scientific_name("コナラ")
```

> **NOTE:**

If you also want author information, set `with_author = TRUE`.

``` downlit
scientific_name("コナラ", with_author = TRUE)
```

> **NOTE:**

You can also pass a vector when you want to retrieve scientific names for multiple Japanese names at once.

``` downlit
scientific_name(c("コナラ", "アカマツ", "イチョウ"))
```

> **NOTE:**

## Getting a Japanese Name from a Scientific Name

Use [`japanese_name_search()`](https://maple60.github.io/jpplantnames/reference/japanese_name_search.html) when you want to retrieve Japanese names from a scientific name.

``` downlit
japanese_name_search("Quercus serrata", field = "scientific")
```

> **NOTE:**

In this search, all records whose scientific name contains `"Quercus serrata"` are returned. If you want Japanese names that exactly match a specific scientific name, set `exact = TRUE`.

``` downlit
japanese_name_search("Quercus serrata", field = "scientific", exact = TRUE)
```

> **NOTE:**

Even with exact matching, multiple records may be returned. This happens because multiple Japanese names and aliases may be registered for the same species, such as Konara.

## Searching for Ambiguous Japanese Names

When field notes are digitized, typos may appear in Japanese plant names. For example, `"コナラ"` might accidentally be entered as `"コラナ"`. In such cases, you can use [`japanese_name_suggest()`](https://maple60.github.io/jpplantnames/reference/japanese_name_suggest.html) to search for likely correct Japanese names from an ambiguous input.

``` downlit
japanese_name_suggest("コラナ")
```

> **NOTE:**

Another possible typo is entering `"タロヨウ"` instead of `"タラヨウ"`.

``` downlit
japanese_name_suggest("タロヨウ")
```

> **NOTE:**

This fuzzy search compares the entered Japanese name with Japanese names in the checklist and calculates a string distance for each candidate. In the current implementation, when the `stringdist` package is available, it uses [`stringdist::stringdist()`](https://rdrr.io/pkg/stringdist/man/stringdist.html) with `method = "osa"`. `osa` means Optimal String Alignment distance, or restricted Damerau-Levenshtein distance, which considers adjacent character transpositions in addition to insertions, deletions, and substitutions. This makes it possible to suggest close candidates for Japanese names that include simple typos or swapped character order.

## Matching Scientific Names Against GBIF

You can match scientific names against [GBIF](https://www.gbif.org/) (Global Biodiversity Information Facility) with [`gbif_match()`](https://maple60.github.io/jpplantnames/reference/gbif_match.html).

``` downlit
gbif_match("Quercus serrata")
```

> **NOTE:**

## Matching Scientific Names Against WFO

You can also match scientific names against another database, [WFO](https://wfoplantlist.org/) (World Flora Online).

``` downlit
wfo_accepted_name("Quercus serrata")
```

> **NOTE:**

Use [`wfo_suggest()`](https://maple60.github.io/jpplantnames/reference/wfo_suggest.html) when you want to search by partial match.

``` downlit
wfo_suggest("Quercus serrata")
```

> **NOTE:**

## Getting Species Information from a Japanese Name

You can also retrieve species-related information from a Japanese name. Use [`japanese_name_info()`](https://maple60.github.io/jpplantnames/reference/japanese_name_info.html) for this. It is usually convenient to store the result in a variable. Printing the object gives a short summary.

``` downlit
jp_info <- japanese_name_info("コナラ")
print(jp_info)
```

> **NOTE:**

This is a **short report saying that the Japanese name `"コナラ"` matched `Quercus serrata Murray` in the checklist and had 9 candidate rows**.

The object is a list, so you can access detailed information with `$`. Use `$summary` to expand the short report as a data frame.

``` downlit
jp_info$summary
```

> **NOTE:**

Use `$japanese_name` to expand the Japanese-name information as a data frame.

``` downlit
jp_info$japanese_name
```

> **NOTE:**

If you want to compare the result with GBIF or WFO data, set `wfo = TRUE` or `gbif = TRUE`.

``` downlit
jp_info <- japanese_name_info("コナラ", wfo = TRUE, gbif = TRUE)
jp_info$wfo
jp_info$gbif
```

> **NOTE:**

In short, `japanese_name_info` is a helper that brings together the functions introduced above.
