# WFO Plant List APIをRから利用する方法

r

The World Flora Online (WFO)のAPIをRから利用して、学名からaccepted nameを取得します。

公開

2026-06-16

更新日

2026-06-16

[English version](../../en/posts/2026-06-16-wfo-r/)

[The World Flora Online](https://www.worldfloraonline.org/)という、世界中の植物のデータベースがあります。 [WFO Plant List API](https://list.worldfloraonline.org/)という形でAPIも提供されているので、Rからアクセスし、学名からaccepted nameを取得する方法を紹介してみます。

## パッケージのインストール

APIを利用しやすくするために、`httr2`パッケージをインストールします。 また、APIからのレスポンスはJSON形式なので、`jsonlite`パッケージもインストールします。

インストール後、[`library()`](https://rdrr.io/r/base/library.html)関数を使ってパッケージを読み込みます。

``` downlit
# install.packages(c("httr2", "jsonlite"))
# renv::install(c("httr2", "jsonlite")) # renvを使用している場合はこちら
library(httr2)
library(jsonlite)
```

## エンドポイントの指定

APIのエンドポイントは、以下のURLになります。

``` downlit
endpoint <- "https://list.worldfloraonline.org/gql.php"
```

## 学名から検索するクエリの作成

どのように検索するかを、GraphQLのクエリとして記述します。 ここでは、“Quercus serrata”(和名はコナラ)という学名を検索するクエリを作成します。

``` downlit
query <- '
query {
  taxonNameSuggestion(
    termsString: "Quercus serrata"
    limit: 10
  ) {
    id
    fullNameStringHtml
    currentPreferredUsage {
      hasName {
        id
        fullNameStringHtml
      }
    }
  }
}
'
```

このクエリの意味は、以下のようになります。

- `taxonNameSuggestion`というフィールドを呼び出す
- `termsString`引数に検索したい学名を指定する
- `limit`引数に検索結果の最大数を指定する
- クエリの結果として、`id`、`fullNameStringHtml`、および`currentPreferredUsage`フィールドを取得する

`fullNameStringHtml`は検索した名前の学名をHTML形式で表現したものです。 `currentPreferredUsage`はその名前が現在どの分類群として扱われているかを示します。 `currentPreferredUsage`の中の`hasName`フィールドには、現在の分類群の学名が含まれています。 つまり、Accepted Nameがある場合は、`currentPreferredUsage`の中の`hasName`フィールドにその学名が表示されます。

## リクエストを作成してAPIに送信する

[`httr2::request()`](https://httr2.r-lib.org/reference/request.html)関数を使って、APIに送るリクエストの土台を作ります。

``` downlit
req <- request(endpoint)
```

GraphQLの`query`をJSONとして入れる。

``` downlit
req <- req_body_json(
  req,
  list(query = query),
  auto_unbox = TRUE
)
```

実際にWFOへ送信します。

``` downlit
resp <- req_perform(req)
```

返ってきたJSONをRの`list`に変換します。 これで、APIからのレスポンスをRで扱えるようになります。

``` downlit
x <- resp_body_json(resp, simplifyVector = FALSE)
```

> **NOTE:**
>
> baseRなどのパイプ演算子`|>` (native pipe operator)を使うと、コードがより読みやすくなります。

## Checking the Result

The `x` object stores the API response as an R list.

``` downlit
print(x)
```

> **NOTE:**

Ten candidates were returned because the query specified `limit: 10`. Let’s inspect the first result.

``` downlit
x$data$taxonNameSuggestion[[1]]
```

> **NOTE:**

The three fields `id`, `fullNameStringHtml`, and `currentPreferredUsage` were returned.

The field to focus on is `hasName` inside `currentPreferredUsage`. This field contains the scientific name of the current taxon.

``` downlit
x$data$taxonNameSuggestion[[1]]$currentPreferredUsage
```

> **NOTE:**

In this example, the `hasName` field inside `currentPreferredUsage` displays the scientific name “*Quercus serrata* Murray”.

``` downlit
x$data$taxonNameSuggestion[[1]]$id
x$data$taxonNameSuggestion[[1]]$currentPreferredUsage$hasName$id
```

> **NOTE:**

Comparing `x$data$taxonNameSuggestion[[1]]$id` with `x$data$taxonNameSuggestion[[1]]$currentPreferredUsage$hasName$id`, the two values are identical.

This shows that the searched scientific name `"Quercus serrata"` is currently treated as `"Quercus serrata"`.

In this way, you can retrieve an accepted name from a searched scientific name.

## Creating a Function to Retrieve Accepted Names

In practical work, it is useful to wrap the process in functions.

Here, I turn the steps above into functions and create a function that retrieves the accepted name from a scientific name. First, create `get_wfo_suggestions()`, which retrieves candidates from a scientific name.

In addition to the query above, this function also retrieves fields such as `fullNameStringNoAuthorsPlain`, `authorsString`, and `rank`. The `rank` field is especially important because it shows the taxonomic rank of the searched name. For example, it lets you distinguish whether the name is at the rank of `species`, `subspecies`, `variety`, and so on.

When retrieving an accepted name, it is often useful to look for an accepted name at the same rank as the searched name, so this function also retrieves rank information.

``` downlit
get_wfo_suggestions <- function(
  name,
  limit = 10,
  endpoint = "https://list.worldfloraonline.org/gql.php"
) {
  query <- '
  query NameSearch($terms: String!, $limit: Int) {
    taxonNameSuggestion(
      termsString: $terms
      limit: $limit
    ) {
      id
      fullNameStringPlain
      fullNameStringNoAuthorsPlain
      authorsString
      rank
      currentPreferredUsage {
        hasName {
          id
          fullNameStringPlain
          fullNameStringNoAuthorsPlain
          authorsString
          rank
        }
      }
    }
  }
  '

  req <- request(endpoint)

  req <- req_body_json(
    req,
    list(
      query = query,
      variables = list(
        terms = name,
        limit = limit
      )
    ),
    auto_unbox = TRUE
  )

  resp <- req_perform(req)
  x <- resp_body_json(resp, simplifyVector = FALSE)

  res <- x$data$taxonNameSuggestion

  if (is.null(res) || length(res) == 0) {
    return(data.frame())
  }

  get_value <- function(z, field) {
    if (is.null(z[[field]])) {
      NA_character_
    } else {
      z[[field]]
    }
  }

  get_accepted <- function(z, field) {
    if (is.null(z$currentPreferredUsage)) {
      NA_character_
    } else if (is.null(z$currentPreferredUsage$hasName[[field]])) {
      NA_character_
    } else {
      z$currentPreferredUsage$hasName[[field]]
    }
  }

  out <- data.frame(
    input = name,
    id = sapply(res, get_value, field = "id"),
    name = sapply(res, get_value, field = "fullNameStringPlain"),
    name_no_author = sapply(
      res,
      get_value,
      field = "fullNameStringNoAuthorsPlain"
    ),
    authors = sapply(res, get_value, field = "authorsString"),
    rank = sapply(res, get_value, field = "rank"),
    accepted_id = sapply(res, get_accepted, field = "id"),
    accepted_name = sapply(res, get_accepted, field = "fullNameStringPlain"),
    accepted_name_no_author = sapply(
      res,
      get_accepted,
      field = "fullNameStringNoAuthorsPlain"
    ),
    accepted_authors = sapply(res, get_accepted, field = "authorsString"),
    accepted_rank = sapply(res, get_accepted, field = "rank"),
    stringsAsFactors = FALSE
  )

  out$is_accepted <- !is.na(out$accepted_id) & out$id == out$accepted_id

  out
}
```

つぎに、学名からaccepted nameを取得する関数`get_accepted_name()`を作成します。

``` downlit
get_accepted_name <- function(name, rank = "species") {
  tab <- get_wfo_suggestions(name)

  if (nrow(tab) == 0) {
    return(NA)
  }

  hit <- tab[
    tab$rank == rank &
      tab$name_no_author == name,
  ]

  if (nrow(hit) == 0) {
    return(NA)
  }

  hit[1, ]
}
```

`get_accepted_name()`関数は、学名とランクを引数に取り、`get_wfo_suggestions()`関数を呼び出して候補を取得します。

``` downlit
result <- get_wfo_suggestions("Quercus serrata")
print(result)
```

> **NOTE:**

Use `get_accepted_name()` to retrieve the row that contains the accepted name for a scientific name.

``` downlit
accepted_name <- get_accepted_name("Quercus serrata")
print(accepted_name)
```

> **NOTE:**

## Notes on Using the API

The WFO Plant List API is publicly available, but sending a large number of requests in a short time may **place load on the server**. Searching a small number of names for learning or checking is fine, but when processing many scientific names at once, keep the following points in mind.

- Save or cache results so that the same name is not queried repeatedly.
- Add [`Sys.sleep()`](https://rdrr.io/r/base/Sys.sleep.html) in loops when needed to avoid continuous access.
- For large datasets, consider using the published download data or a local workflow instead of trying to retrieve all data through the API.
- Do not accept candidates returned by the API without review; check `rank`, WFO ID, `currentPreferredUsage`, and accepted name.
- Because `taxonNameSuggestion()` is for candidate search, make the candidate-review rules explicit when doing strict bulk matching.

For example, when running a loop, you can add [`Sys.sleep()`](https://rdrr.io/r/base/Sys.sleep.html) as follows to avoid continuous access.

``` downlit
for (nm in names) {
  result <- get_accepted_name(nm)
  Sys.sleep(0.5) # サーバー負荷を下げるため少し待つ
}
```

また、WFO Plant Listでは、APIと同じデータをZenodoからダウンロードでき、DOI付きで引用可能です。そのため、多数の名前を処理する研究用途や、再現性を重視する解析では、APIだけに依存するのではなく、使用したWFO Plant Listのリリース版を明記し、Zenodo上のデータを利用・引用することも検討します。

Zenodo Link: [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.18007552.svg)](https://doi.org/10.5281/zenodo.18007552)
