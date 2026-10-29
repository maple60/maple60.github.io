# Using the WFO Plant List API from R

r

Use the World Flora Online Plant List API from R to retrieve accepted names from scientific names.

Published

2026-06-16

Modified

2026-06-16

[日本語版](../../../posts/2026-06-16-wfo-r/)

[The World Flora Online](https://www.worldfloraonline.org/) is a global database of plant information. It also provides an API as the [WFO Plant List API](https://list.worldfloraonline.org/), so this article shows how to access it from R and retrieve accepted names from scientific names.

## Installing Packages

Install the `httr2` package to make API requests easier. Because API responses are returned as JSON, also install the `jsonlite` package.

After installation, load the packages with [`library()`](https://rdrr.io/r/base/library.html).

``` downlit
# install.packages(c("httr2", "jsonlite"))
# renv::install(c("httr2", "jsonlite")) # renvを使用している場合はこちら
library(httr2)
library(jsonlite)
```

## Specifying the Endpoint

The API endpoint is the following URL.

``` downlit
endpoint <- "https://list.worldfloraonline.org/gql.php"
```

## Creating a Query to Search by Scientific Name

The search is written as a GraphQL query. Here, I create a query that searches for the scientific name `"Quercus serrata"` (called Konara in Japanese).

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

This query does the following.

- Calls the `taxonNameSuggestion` field
- Sets the scientific name to search for in the `termsString` argument
- Sets the maximum number of search results in the `limit` argument
- Retrieves `id`, `fullNameStringHtml`, and `currentPreferredUsage` fields as the query result

`fullNameStringHtml` is the searched scientific name expressed in HTML format. `currentPreferredUsage` shows which taxon the name is currently treated as. The `hasName` field inside `currentPreferredUsage` contains the scientific name of the current taxon. In other words, when an accepted name exists, that name appears in the `hasName` field inside `currentPreferredUsage`.

## Creating and Sending the Request

Use [`httr2::request()`](https://httr2.r-lib.org/reference/request.html) to create the base request for the API.

``` downlit
req <- request(endpoint)
```

Add the GraphQL `query` as JSON.

``` downlit
req <- req_body_json(
  req,
  list(query = query),
  auto_unbox = TRUE
)
```

Then send it to WFO.

``` downlit
resp <- req_perform(req)
```

Convert the returned JSON into an R `list`. This makes the API response usable from R.

``` downlit
x <- resp_body_json(resp, simplifyVector = FALSE)
```

``` downlit
print(x)
```

``` downlit
x$data$taxonNameSuggestion[[1]]
```

``` downlit
x$data$taxonNameSuggestion[[1]]$currentPreferredUsage
```

``` downlit
x$data$taxonNameSuggestion[[1]]$id
x$data$taxonNameSuggestion[[1]]$currentPreferredUsage$hasName$id
```

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

Next, create `get_accepted_name()`, a function that retrieves the accepted name from a scientific name.

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

The `get_accepted_name()` function takes a scientific name and rank, then calls `get_wfo_suggestions()` to retrieve candidates.

``` downlit
result <- get_wfo_suggestions("Quercus serrata")
print(result)
```

``` downlit
accepted_name <- get_accepted_name("Quercus serrata")
print(accepted_name)
```

``` downlit
for (nm in names) {
  result <- get_accepted_name(nm)
  Sys.sleep(0.5) # サーバー負荷を下げるため少し待つ
}
```

The WFO Plant List also provides the same data as the API through Zenodo, with a DOI that can be cited. For research use cases that process many names or require reproducibility, consider not relying only on the API. Instead, specify the WFO Plant List release used and use or cite the data available on Zenodo.

Zenodo Link: [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.18007552.svg)](https://doi.org/10.5281/zenodo.18007552)
