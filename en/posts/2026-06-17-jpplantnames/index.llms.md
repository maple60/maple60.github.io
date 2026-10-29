# A Quick Introduction to the jpplantnames R Package

r

A short overview of the jpplantnames R package for looking up Japanese plant names, scientific names, and external database matches.

Published

2026-06-17

Modified

2026-06-17

[日本語版](../../../posts/2026-06-17-jpplantnames/)

This is a short overview of the `jpplantnames` R package, which I recently created. See the documentation below.

- [jpplantnames • jpplantnames](https://maple60.github.io/jpplantnames/)

## Installation and Loading the Library

Install the package as usual. At the moment, it is available only on GitHub, so install it with `pak`, `remotes`, `renv`, or a similar tool.

``` downlit
pak::pak("maple60/jpplantnames")
remotes::install_github("maple60/jpplantnames")
# renv::install("maple60/jpplantnames") # renvを使用している場合
```

After installation, load it with [`library()`](https://rdrr.io/r/base/library.html).

``` downlit
library(jpplantnames)
```

## Getting a Scientific Name from a Japanese Name

You can get a scientific name from a Japanese plant name with [`scientific_name()`](https://maple60.github.io/jpplantnames/reference/scientific_name.html). The first run takes a little time because the data are downloaded. An internet connection is required at that point. From the second run onward, cached data are used, so the result is returned quickly.

``` downlit
scientific_name("コナラ")
```

``` downlit
scientific_name("コナラ", with_author = TRUE)
```

``` downlit
scientific_name(c("コナラ", "アカマツ", "イチョウ"))
```

``` downlit
japanese_name_search("Quercus serrata", field = "scientific")
```

``` downlit
japanese_name_search("Quercus serrata", field = "scientific", exact = TRUE)
```

``` downlit
japanese_name_suggest("コラナ")
```

``` downlit
japanese_name_suggest("タロヨウ")
```

``` downlit
gbif_match("Quercus serrata")
```

``` downlit
wfo_accepted_name("Quercus serrata")
```

``` downlit
wfo_suggest("Quercus serrata")
```

``` downlit
jp_info <- japanese_name_info("コナラ")
print(jp_info)
```

``` downlit
jp_info$summary
```

``` downlit
jp_info$japanese_name
```

``` downlit
jp_info <- japanese_name_info("コナラ", wfo = TRUE, gbif = TRUE)
jp_info$wfo
jp_info$gbif
```
