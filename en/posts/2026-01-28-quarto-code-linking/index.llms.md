# Adding Documentation Links to Functions in Quarto Code Blocks

r

A note on using the `code-link` option to add documentation links to functions in Quarto code blocks.

Published

2026-01-28

Modified

2026-01-28

> **NOTE:**
>
> Original Japanese version: [Quartoのコードブロック内の関数にドキュメントリンクをつける方法](../../../posts/2026-01-28-quarto-code-linking/index.llms.md)

This is a note on how to automatically add documentation links to functions used inside Quarto code blocks. With the `code-link` option, links can be added to the documentation corresponding to functions inside code blocks.

Add the following setting to the `_quarto.yml` file.

``` yaml
format:
  html:
    code-link: true
```

With this setting, function names in code blocks are displayed with links in HTML output.

## Example

When functions are used in inline code or code blocks, links are added automatically. For example, write an R code block as follows.

- Example sentence: If you use the [`unique()`](https://rdrr.io/r/base/unique.html) function like this, you can remove duplicate values from a vector.

Links are also added inside code blocks.

``` downlit
x <- c("apple", "banana", "apple", "orange", "banana")
unique_x <- unique(x)
print(unique_x)
```

    [1] "apple"  "banana" "orange"

When you hover over each function, an underline appears to indicate that it has a link. Clicking it takes you to the corresponding documentation page. In this example, links are probably added to the [`c()`](https://rdrr.io/r/base/c.html), [`unique()`](https://rdrr.io/r/base/unique.html), and [`print()`](https://rdrr.io/r/base/print.html) functions.

## Notes

- The `code-link` option is supported only by the [knitr](https://yihui.org/knitr/) engine. Links do not seem to be generated when using other engines, because Quarto internally uses the [downlit](https://downlit.r-lib.org/) package. In short, it works only for R code blocks.
- It seems that `code-link` cannot be used together with the `code-line-numbers` or `code-annotations` options. If those options are enabled, the `code-link` option is ignored.

> **TIP:**
>
> The `code-line-numbers` option adds line numbers to code blocks.
>
> The `code-annotations` option adds annotations to code blocks.

## References

- [knitr - Elegant, flexible, and fast dynamic report generation with R - Yihui Xie \| 谢益辉](https://yihui.org/knitr/)
- [CRAN: Package knitr](https://cran.r-project.org/web/packages/knitr/index.html)
- [HTML Code Blocks - Quarto](https://quarto.org/docs/output-formats/html-code.html)
- [Code Annotation - Quarto](https://quarto.org/docs/authoring/code-annotation.html)
