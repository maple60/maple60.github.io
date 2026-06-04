# Fixing Code Linking Problems When Building a Quarto Site with GitHub Actions

quarto

github

Code linking may not work correctly when a Quarto site is built with GitHub Actions. This article explains the cause and solution.

Published

2026-02-25

Modified

2026-02-25

> **NOTE:**
>
> Original Japanese version: [QuartoのサイトをGitHub Actionsでビルドする際、code linkingが正しく動作しない問題の対処法](../../../posts/2026-02-23-github-actions-quarto-code-linking/index.llms.md)

## Symptom

This site is built with Quarto. Quarto has a feature called code linking, which automatically adds documentation links to functions. For example, when the `plot()` function is used inside a code block, a link to the documentation for `plot()` is added automatically.

> **NOTE:**
>
> For code linking, see the following official documentation.
>
> - [HTML Code Blocks - Quarto](https://quarto.org/docs/output-formats/html-code.html#code-linking)

I was building this site using that feature, but when it was built with GitHub Actions, code linking did not work correctly. However, code linking did work in local preview, so the problem occurred only when the site was built with GitHub Actions.

When I checked the GitHub Actions build log, the following warning appeared.

``` bash
Warning message:
The downlit and xml2 packages are required for code linking
```

## Solution

Apparently, the cause was that the `downlit` and `xml2` packages required for code linking were not installed in the GitHub Actions environment.

I manage packages with renv, but `downlit` and `xml2` were not included in the “Packages” section of the `renv.lock` file managed by renv.

Run the following code.

``` r
renv::install(c("downlit", "xml2"))
renv::snapshot(type = "all")
```

This installs the `downlit` and `xml2` packages and adds them to the `renv.lock` file.

> **NOTE:**
>
> Normally, I run `renv::snapshot()` to update the `renv.lock` file. However, if a package is not called with `library()` in the code, it is not added to `renv.lock`. For that reason, `renv::snapshot(type = "all")` needs to be run to add all installed packages to the `renv.lock` file.
>
> If you do not do that, you need to explicitly call these packages somewhere.

After updating `renv.lock`, commit it and push it to GitHub. Code linking started working correctly when the site was built with GitHub Actions.

## Reflection

It took time to notice that code linking worked locally but did not work on the built site. Solving the problem also took quite a while.

The clue was the warning shown in the GitHub Actions build log. Based on that warning, I learned that the packages required for code linking were not installed. This reminded me that checking build logs carefully is important when this kind of problem occurs.

When unexpected behavior occurs, it is important to inspect the logs carefully.
