# Using Japanese in Quarto PDF Output

quarto

How to display Japanese correctly in Quarto by setting the CJKmainfont option.

Published

2026-02-03

Modified

2026-02-03

> **NOTE:**
>
> Original Japanese version: [QuartoのPDF出力で日本語を使う](../../../posts/2026-02-03-quarto-japanese/index.llms.md)

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

For `CJKmainfont`, specify the name of a Japanese font installed on the system. Examples include `"BIZ UDPGothic"` and `"Noto Sans CJK JP"`.

You can also specify `mainfont: "Font Name"`, but in that case letters and numbers are also displayed with the specified font, so care is needed.

> **NOTE:**
>
> `CJKmainfont` is an option that specifies the font used to display Japanese in LaTeX. The letters C, J, and K stand for Chinese, Japanese, and Korean. These languages contain many characters, so dedicated fonts are required.

> **NOTE:**
>
> To check font files available to LaTeX, run the following command in a terminal.
>
> ### Windows
>
> ``` bash
> Get-ChildItem C:\Windows\Fonts | Select-Object Name
> ```
>
> ### macOS/Linux
>
> I have not confirmed this, but I think the following command can be used.
>
> ``` bash
> ls /Library/Fonts/
> ```

## References

- [PDF Basics - Quarto](https://quarto.org/docs/output-formats/pdf-basics.html)
- [PDF Options - Quarto](https://quarto.org/docs/reference/formats/pdf.html)
