# Using Japanese in Quarto PDF Output

quarto

How to display Japanese correctly in Quarto by setting the CJKmainfont option.

Published

2026-02-03

Modified

2026-02-03

[日本語版](../../../posts/2026-02-03-quarto-japanese/)

When outputting PDFs with [Quarto](https://quarto.org/), Japanese may not be displayed correctly with the default settings. This is because the LaTeX settings do not support Japanese by default. This article introduces settings for using Japanese in Quarto.

## Preparation for PDF Output

To output PDF, [LaTeX](https://www.latex-project.org/) needs to be installed. The officially recommended option is [TinyTeX](https://yihui.org/tinytex/).

Install it by running the following command in a terminal.

``` bash
quarto install tinytex
```

> **NOTE:**
>
> LaTeX is a typesetting system for creating high-quality documents. It is widely used especially for academic papers and technical documents. Although there are many commands to learn, you do not need a deep understanding of LaTeX just to output PDFs from Quarto.

> **NOTE:**
>
> If you try to output a PDF when LaTeX is not installed, an error occurs. In that case, Quarto displays a message suggesting that you run `quarto install tinytex` to install TeX.

## How to Output PDF

To output PDF with Quarto, specify `format: pdf` in the YAML header.

``` yaml
---
title: "Document Title"
format: pdf
---
```

With this setting, Quarto generates the document in PDF format. However, Japanese may not display correctly as-is.

## Settings for Displaying Japanese Correctly

To display Japanese correctly, add the following setting to the YAML header.

``` yaml
---
title: "Document Title"
format:
  pdf:
    CJKmainfont: "BIZ UDPGothic"  # specify the Japanese font to use
---
```
