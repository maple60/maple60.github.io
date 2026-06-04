# Enabling Quarto Code Linking in GitHub Actions

r

quarto

A note on enabling code linking when building a Quarto website with GitHub Actions.

Published

2026-01-29

Modified

2026-01-29

> **NOTE:**
>
> Original Japanese version: [Github ActionsでQuartoのコードリンク機能を有効にする方法](../../../posts/2026-01-29-quarto-code-linking-github-action/index.llms.md)

When creating a website with Quarto, code links did not work after the site was built with GitHub Actions, even though the `code-link` option was enabled. This is a note on how I solved that problem. Please note that the explanation is somewhat loosely organized.

> **CAUTION:**
>
> The `code-link` option is supported only by the knitr engine. For that reason, it works only for R code blocks.

## What Is the `code-link` Option?

The `code-link` option automatically adds documentation links to functions used inside Quarto code blocks. When this option is enabled, function names inside code blocks are displayed with links, and clicking them opens the corresponding documentation page.

For example, if you write `plot()`, a link appears when you hover over the function, and clicking it takes you to the official R documentation page for `plot()`. If everything is working, the link should be added correctly.

> **NOTE:**
>
> See the following official documentation for the `code-link` option.
>
> - [HTML Code Blocks - Quarto](https://quarto.org/docs/output-formats/html-code.html#code-linking)
> - [HTML Options - Quarto](https://quarto.org/docs/reference/formats/html.html#code)

## Current Situation

I currently build this Quarto website with GitHub Actions.

> **NOTE:**
>
> See the following official documentation for building a Quarto website with GitHub Actions.
>
> - [GitHub Pages - Quarto](https://quarto.org/docs/publishing/github-pages.html#github-action)

Here is an excerpt from `_quarto.yml`.

``` yaml
format:
  html:
    code-link: true
    code-line-numbers: false
    code-annotations: false
```

This should enable `code-link`. In fact, **when I built the site locally, documentation links were added to functions inside code blocks.**

However, **when the site was built with GitHub Actions, code links were not added.** When I checked the source code, links to the functions had not been generated.

## Possible Cause and Solution

I suspected that the [downlit](https://downlit.r-lib.org/) package, which is required for code linking, was not working properly during the GitHub Actions build.

So I modified `.github/workflows/publish.yml` as follows.

``` yaml
on:
  workflow_dispatch:
  push:
    branches: main

name: Quarto Publish

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Quarto
        uses: quarto-dev/quarto-actions/setup@v2

      - name: Install R
        uses: r-lib/actions/setup-r@v2
        with:
          r-version: "4.5.2"

      - name: Install system dependencies
        run: |
          sudo apt-get update
          sudo apt-get install -y \
            libpng-dev \
            libjpeg-dev \
            libtiff-dev \
            libfftw3-dev \
            libglpk-dev \
            libx11-dev \
            libxt-dev \
            pandoc

      - name: Install R Dependencies
        uses: r-lib/actions/setup-renv@v2
        with:
          cache-version: 1

      - name: Render and Publish
        uses: quarto-dev/quarto-actions/publish@v2
        with:
          target: gh-pages
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

This was adjusted based on errors I encountered, while using the Quarto documentation’s [Example: Knitr with renv](https://quarto.org/docs/publishing/github-pages.html#example-knitr-with-renv) as a reference.

The concrete changes were the `r-version: "4.5.2"` setting and the `Install system dependencies` step.

## Steps Toward the Actual Fix

The concrete flow is as follows.

### 1. Check `freeze`

Check that `freeze: auto` is set in `_quarto.yml`.

``` yaml
execute:
  freeze: auto
```

> **NOTE:**
>
> See the following official documentation for the `freeze` option.
>
> - [Managing Execution - Quarto](https://quarto.org/docs/projects/code-execution.html#freeze)

After that, render the site once in the local environment.

``` bash
quarto render
```

After rendering, confirm that the `_freeze` folder has been generated.

### 2. Set Up renv

If you are not already using `renv`, set it up in the project. If the `renv` package is not installed, install it with the following command.

``` r
install.packages("renv")
```

> **NOTE:**
>
> See the following official documentation for the `renv` package.
>
> - [Introduction to renv - renv](https://rstudio.github.io/renv/articles/renv.html)

After installation, initialize `renv` with the following command.

``` r
renv::init()
```

When `renv` is initialized, related files and folders such as `renv.lock` are generated in the project. Commit these files to the GitHub repository.

> **NOTE:**
>
> Directories such as `renv/library` are included in `renv/.gitignore`, so they are not committed. The default settings are fine.

### 3. Initialize the Publishing Site and Create the Branch

Run the following command.

``` bash
quarto publish gh-pages
```

### 4. Create the GitHub Actions Workflow File

Create `.github/workflows/publish.yml` and configure it as follows.

``` yaml
on:
  workflow_dispatch:
  push:
    branches: main

name: Quarto Publish

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Quarto
        uses: quarto-dev/quarto-actions/setup@v2

      - name: Install R
        uses: r-lib/actions/setup-r@v2
        with:
          r-version: "4.5.2"

      - name: Install system dependencies
        run: |
          sudo apt-get update
          sudo apt-get install -y \
            libpng-dev \
            libjpeg-dev \
            libtiff-dev \
            libfftw3-dev \
            libglpk-dev \
            libx11-dev \
            libxt-dev \
            pandoc

      - name: Install R Dependencies
        uses: r-lib/actions/setup-renv@v2
        with:
          cache-version: 1

      - name: Render and Publish
        uses: quarto-dev/quarto-actions/publish@v2
        with:
          target: gh-pages
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

In short, this file does the following:

- Checks out the repository
- Sets up Quarto
- Installs R
- Installs required system dependencies
- Installs R packages with `renv`
- Renders and publishes the Quarto document

For the R version in the following part, it is probably safer to match the version of R used by `renv`.

``` yaml
      - name: Install R
        uses: r-lib/actions/setup-r@v2
        with:
          r-version: "4.5.2"
```

The `Install system dependencies` section was added while checking errors. Adjust it as needed based on the errors you see.

``` yaml
      - name: Install system dependencies
        run: |
          sudo apt-get update
          sudo apt-get install -y \
            libpng-dev \
            libjpeg-dev \
            libtiff-dev \
            libfftw3-dev \
            libglpk-dev \
            libx11-dev \
            libxt-dev \
            pandoc
```

### 5. Commit and Push to the GitHub Repository

Commit and push the changes so far to the GitHub repository.

``` bash
git add .
git commit -m "Set up GitHub Actions for Quarto with code-linking"
git push origin main
```

Recently I have been using [GitHub Desktop](https://github.com/apps/desktop), so I committed and pushed through the GUI.

This triggers GitHub Actions and builds the Quarto website. Check the Actions tab on GitHub.

The [official documentation example](https://quarto.org/docs/publishing/github-pages.html#github-action) does not include the `Install system dependencies` section.

However, in my environment, without this section the build failed with an error in the `Install R Dependencies` step.

Specifically, I saw errors such as `Error: Error: Error installing package 'tiff':`.

If this kind of error appears, try adding the `Install system dependencies` section.

For example, when the `Error: Error: Error installing package 'tiff':` error appeared, adding `libtiff-dev` solved it.

``` yaml
      - name: Install system dependencies
        run: |
          sudo apt-get update
          sudo apt-get install -y \
            libtiff-dev \
```

After repeating this kind of trial and error several times, the final `.github/workflows/publish.yml` file became the one shown earlier.

> **NOTE:**
>
> Each build action took about eight minutes. Persistent trial and error may be necessary. I do not know whether my `.github/workflows/publish.yml` file can be used as-is, but I hope it is a useful reference.

### 6. Add the `downlit` and `xml2` Packages to `renv`

After the steps above, I thought that the GitHub Actions build of the Quarto website would finish without errors and that code links would work correctly, but it still did not work.

The `Render and Publish` step showed the following warning.

``` bash
Warning message:
The downlit and xml2 packages are required for code linking
```

It seems that these packages were included in my local environment, but they were not recognized as explicit dependencies in the GitHub Actions build environment.

So I added the following lines to the beginning of the `.qmd` file to be rendered.

``` r
renv::install(c("downlit", "xml2"))
library(downlit)
library(xml2)
renv::snapshot()
```

In this state, I built locally once and confirmed that the `renv.lock` file had been updated. Then I committed and pushed the `renv.lock` file to the GitHub repository. When I checked the GitHub Actions log, the previous warning no longer appeared. When I checked the website actually built on GitHub, code links were working correctly.

After that, code links continued to work even after I removed the lines I had inserted:

``` r
renv::install(c("downlit", "xml2"))
library(downlit)
library(xml2)
renv::snapshot()
```

> **NOTE:**
>
> I do not know whether this is the best way, but in my case it worked. There may be a better method.

## Closing Note

This article ended up somewhat scattered, but I wanted to leave a note on enabling code linking when building a Quarto website with GitHub Actions. I hope it helps someone facing the same problem.
