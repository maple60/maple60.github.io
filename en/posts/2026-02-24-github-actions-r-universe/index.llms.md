# Notes on Using r-universe Packages with GitHub Actions and renv

github

r

When using GitHub Pages with GitHub Actions, renv, and r-universe packages, renv may not work correctly in the GitHub Actions environment. This article explains the cause and solution.

Published

2026-02-24

Modified

2026-02-24

[日本語版](../../../posts/2026-02-24-github-actions-r-universe/)

## Symptom

This website is created with GitHub Pages through GitHub Actions. R packages are managed with renv. When using packages from [r-universe](https://r-universe.dev/search), renv sometimes did not work correctly in the GitHub Actions environment.

Specifically, after writing an article that used the `rnaturalearthhires` package, the build produced the following error.

    # Downloading packages -------------------------------------------------------
    - Querying repositories for available source packages ... Done!
    Error: code 22]

This error occurred because renv could not correctly recognize the r-universe package in the GitHub Actions environment.

## Solution

When I checked the `renv.lock` file, the r-universe URL was not included in the “Repositories” section. Because of this, renv in the GitHub Actions environment could not recognize the r-universe package.

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

By running the following code locally and adding the r-universe URL to the “Repositories” section of `renv.lock`, renv in the GitHub Actions environment became able to recognize the r-universe package.

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
    - cluster    [2.1.8.2 -> 2.1.8.1]
    - foreign    [0.8-91 -> 0.8-90]
    - lattice    [0.22-9 -> 0.22-7]
    - mgcv       [1.9-4 -> 1.9-3]
    - survival   [3.8-6 -> 3.8-3]

    The version of R recorded in the lockfile will be updated:
    - R          [4.5.3 -> 4.5.2]

    - Lockfile written to "~/github/maple60.github.io/renv.lock".

This code uses the [`options()`](https://rdrr.io/r/base/options.html) function to specify the CRAN and r-universe repositories. Then it runs `renv::snapshot(force = TRUE)` to update the `renv.lock` file.

After running this code, the r-universe URL is added to the “Repositories” section of `renv.lock`.

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

After that, commit the change and build with GitHub Actions. The error should be resolved, and the r-universe package can be used.
