# jpplantnames Rパッケージについて

r

jpplantnames Rパッケージについて簡単にまとめます。

Published

2026-06-17

Modified

2026-06-17

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
>
> ``` text
> [1] "Quercus serrata"
> ```

命名者の情報が欲しい場合は、`with_author = TRUE`を指定します。

``` downlit
scientific_name("コナラ", with_author = TRUE)
```

> **NOTE:**
>
> ``` text
> [1] "Quercus serrata Murray"
> ```

複数の和名から一気に学名を知りたい場合は、ベクトルにして渡すこともできます。

``` downlit
scientific_name(c("コナラ", "アカマツ", "イチョウ"))
```

> **NOTE:**
>
> ``` text
> [1] "Quercus serrata"  "Pinus densiflora" "Ginkgo biloba"
> ```

## 学名から和名を取得する

学名から和名を取得したい場合は、[`japanese_name_search()`](https://maple60.github.io/jpplantnames/reference/japanese_name_search.html)関数を使用します。

``` downlit
japanese_name_search("Quercus serrata", field = "scientific")
```

> **NOTE:**
>
> ``` text
>                      和名                   別名                                        学名 source
> 1                  コナラ                 コナラ                             Quercus serrata     GL
> 2                  コナラ                 ハハソ                             Quercus serrata     GL
> 3                  コナラ                   ナラ                             Quercus serrata     GL
> 4            シダレコナラ           シダレコナラ                Quercus serrata f. dependens     GL
> 5            テリハコナラ           テリハコナラ                 Quercus serrata f. donarium     GL
> 6            ナガミコナラ           ナガミコナラ               Quercus serrata f. longicarpa     GL
> ...
> 31           マルバコナラ           ビワバコナラ Quercus serrata var. pseudovariabilis     YL
> ```

この検索の場合、`"Quercus serrata"`を学名に含むすべてのデータが返されます。 特定の学名に完全一致する和名を知りたい場合は、`exact = TRUE`を指定します。

``` downlit
japanese_name_search("Quercus serrata", field = "scientific", exact = TRUE)
```

> **NOTE:**
>
> ``` text
>     和名           別名             学名 source
> 1 コナラ         コナラ Quercus serrata     GL
> 2 コナラ         ハハソ Quercus serrata     GL
> 3 コナラ           ナラ Quercus serrata     GL
> 4 コナラ         コナラ Quercus serrata     YL
> 5 コナラ アツカワコナラ Quercus serrata     YL
> 6 コナラ           ナラ Quercus serrata     YL
> 7 コナラ         ハハソ Quercus serrata     YL
> ```

これでも複数のデータが返される場合があります。 これは、同じコナラに対して、複数の和名・別名行が登録されているからです。

## あいまいな和名を検索する

野帳を電子化したときに、和名などに誤字が生じる場合があります。 例えば、「コナラ」を「コラナ」と誤って入力してしまうことがあるかもしれません。 このような場合、[`japanese_name_suggest()`](https://maple60.github.io/jpplantnames/reference/japanese_name_suggest.html)関数を使用して、あいまいな和名から、正しい和名を検索することができます。

``` downlit
japanese_name_suggest("コラナ")
```

> **NOTE:**
>
> ``` text
>     query matched_value distance     score match_type   和名           別名             学名 source
> 1  コラナ        コナラ        1 0.3333333      fuzzy コナラ         コナラ Quercus serrata     GL
> 2  コラナ        コナラ        1 0.3333333      fuzzy コナラ         ハハソ Quercus serrata     GL
> 3  コラナ        コナラ        1 0.3333333      fuzzy コナラ           ナラ Quercus serrata     GL
> 4  コラナ        コナラ        1 0.3333333      fuzzy コナラ         コナラ Quercus serrata     WF
> 5  コラナ        コナラ        1 0.3333333      fuzzy コナラ         ハハソ Quercus serrata     WF
> 6  コラナ        ガラナ        1 0.3333333      fuzzy ガラナ         ガラナ  Paullinia cupana     WF
> ```

ほかには、「タラヨウ」を「タロヨウ」などと誤って入力してしまうこともあるかもしれません。

``` downlit
japanese_name_suggest("タロヨウ")
```

> **NOTE:**
>
> ``` text
>      query matched_value distance score match_type       和名       別名                                  学名 source
> 1  タロヨウ      タラヨウ        1  0.25      fuzzy   タラヨウ   タラヨウ                       Ilex latifolia     GL
> 2  タロヨウ      タラヨウ        1  0.25      fuzzy   タラヨウ   タラヨウ                       Ilex latifolia     WF
> 3  タロヨウ      タラヨウ        1  0.25      fuzzy   タラヨウ   タラヨウ                       Ilex latifolia     YL
> 4  タロヨウ    キタゴヨウ        2  0.40      fuzzy キタゴヨウ キタゴヨウ    Pinus parviflora var. pentaphylla     GL
> 5  タロヨウ    キタゴヨウ        2  0.40      fuzzy キタゴヨウ キタゴヨウ    Pinus parviflora var. pentaphylla     WF
> ```

このあいまい検索では、入力された和名とチェックリスト中の和名を比較し、候補ごとの文字列距離を計算します。現在の実装では、`stringdist` パッケージが利用可能な場合、[`stringdist::stringdist()`](https://rdrr.io/pkg/stringdist/man/stringdist.html) 関数を `method = "osa"` で使用しています。`osa` は Optimal String Alignment distance、すなわち制限付き Damerau–Levenshtein 距離であり、文字の挿入・削除・置換に加えて、隣接する文字の入れ替えも考慮します。そのため、単純な入力ミスや文字順の入れ替わりを含む和名に対して、近い候補を提示できます。

## GBIFの学名と照合する

[`gbif_match()`](https://maple60.github.io/jpplantnames/reference/gbif_match.html)関数を使用して、[GBIF](https://www.gbif.org/) (Global Biodiversity Information Facility)の学名と照合することができます。

``` downlit
gbif_match("Quercus serrata")
```

> **NOTE:**
>
> ``` text
>             input usageKey         scientificName   canonicalName    rank   status confidence
> 1 Quercus serrata  2879649 Quercus serrata Murray Quercus serrata SPECIES ACCEPTED         97
>   matchType kingdom   family   genus         species
> 1     EXACT Plantae Fagaceae Quercus Quercus serrata
> ```

## WFOの学名と照合する

別のデータベースである[WFO](https://wfoplantlist.org/) (World Flora Online)の学名と照合することもできます。

``` downlit
wfo_accepted_name("Quercus serrata")
```

> **NOTE:**
>
> ``` text
>             input matched_wfo_id           matched_name matched_name_no_author matched_rank
> 1 Quercus serrata wfo-0000293164 Quercus serrata Murray        Quercus serrata      species
>   matched_role accepted_wfo_id          accepted_name accepted_name_no_author accepted_rank
> 1     accepted  wfo-0000293164 Quercus serrata Murray         Quercus serrata       species
>   accepted_role is_accepted n_candidates match_status cached
> 1      accepted        TRUE           10    ambiguous   TRUE
> ```

部分一致として検索したい場合は、[`wfo_suggest()`](https://maple60.github.io/jpplantnames/reference/wfo_suggest.html)関数を使用します。

``` downlit
wfo_suggest("Quercus serrata")
```

> **NOTE:**
>
> ``` text
>              input         wfo_id                                      name
> 1  Quercus serrata wfo-0000293164                    Quercus serrata Murray
> 2  Quercus serrata wfo-0000293165                     Quercus serrata Roxb.
> 3  Quercus serrata wfo-0001062616                    Quercus serrata Thunb.
> 4  Quercus serrata wfo-0000293167      Quercus serrata var. attenuata Blume
> 5  Quercus serrata wfo-0000293168 Quercus serrata var. brevipetiolata (A.DC.) Nakai
> ...
> ```

## 和名から種の情報を取得する

和名から関連する種の情報を取得することもできます。 [`japanese_name_info()`](https://maple60.github.io/jpplantnames/reference/japanese_name_info.html)関数を使用します。 基本的には変数に入れておくと便利です。 [`print()`](https://rdrr.io/r/base/print.html)で表示すると、簡易表示ができます。

``` downlit
jp_info <- japanese_name_info("コナラ")
print(jp_info)
```

> **NOTE:**
>
> ``` text
> Japanese name info: コナラ
>
> Japanese-name checklist:
>   Scientific name: Quercus serrata Murray
>   Candidates: 9
>   Status: matched
>
> Use x$summary, x$japanese_name, x$wfo, and x$gbif for data frames.
> ```

これは **和名「コナラ」について、チェックリスト上では `Quercus serrata Murray` にマッチした、候補行は9件あった、という簡易レポート**です。

変数はリスト形式になっているため、詳しい情報を見たいときは、`$`でアクセスできます。 `$summary`で、簡易レポートをデータフレーム形式で展開します。

``` downlit
jp_info$summary
```

> **NOTE:**
>
> ``` text
>    input matched japanese_name scientific_name scientific_name_with_author n_japanese_name_candidates match_status
> 1 コナラ    TRUE        コナラ Quercus serrata      Quercus serrata Murray                          9      matched
> ```

`$japanese_name`で、和名の情報をデータフレーム形式で展開できます。

``` downlit
jp_info$japanese_name
```

> **NOTE:**
>
> ``` text
>   input  query is_preferred   和名           別名                                        学名 source
> 1 コナラ コナラ         TRUE コナラ         コナラ                             Quercus serrata     GL
> 2 コナラ コナラ        FALSE コナラ         ハハソ                             Quercus serrata     GL
> 3 コナラ コナラ        FALSE コナラ           ナラ                             Quercus serrata     GL
> 4 コナラ コナラ        FALSE コナラ         コナラ Quercus serrata subsp. serrata var. serrata     WF
> 5 コナラ コナラ        FALSE コナラ         ハハソ Quercus serrata subsp. serrata var. serrata     WF
> 6 コナラ コナラ        FALSE コナラ         コナラ                             Quercus serrata     YL
> 7 コナラ コナラ        FALSE コナラ アツカワコナラ                             Quercus serrata     YL
> 8 コナラ コナラ        FALSE コナラ           ナラ                             Quercus serrata     YL
> 9 コナラ コナラ        FALSE コナラ         ハハソ                             Quercus serrata     YL
> ```

GBIFやWFOのデータと照合したい場合は、`wfo = TRUE`や`gbif = TRUE`を指定します。

``` downlit
jp_info <- japanese_name_info("コナラ", wfo = TRUE, gbif = TRUE)
jp_info$wfo
jp_info$gbif
```

> **NOTE:**
>
> ``` text
>             input matched_wfo_id           matched_name matched_name_no_author matched_rank
> 1 Quercus serrata wfo-0000293164 Quercus serrata Murray        Quercus serrata      species
>   matched_role accepted_wfo_id          accepted_name accepted_name_no_author accepted_rank
> 1     accepted  wfo-0000293164 Quercus serrata Murray         Quercus serrata       species
>   accepted_role is_accepted n_candidates match_status cached
> 1      accepted        TRUE           10    ambiguous   TRUE
>
>             input usageKey         scientificName   canonicalName    rank   status confidence
> 1 Quercus serrata  2879649 Quercus serrata Murray Quercus serrata SPECIES ACCEPTED         97
>   matchType kingdom   family   genus         species
> 1     EXACT Plantae Fagaceae Quercus Quercus serrata
> ```

つまり、`japanese_name_info`はこれまでの関数を束ねたものというイメージです。
