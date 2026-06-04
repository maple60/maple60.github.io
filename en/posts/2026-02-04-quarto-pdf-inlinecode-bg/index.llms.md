# Adding Background Color to Inline Code Blocks in Quarto PDF Output

quatro

latex

A note on using LaTeX’s xcolor package to add background color to inline code blocks in Quarto PDF output.

Published

2026-02-04

Modified

2026-02-04

> **NOTE:**
>
> Original Japanese version: [QuartoでPDF出力時にインラインコードブロックに背景色を付ける方法](../../../posts/2026-02-04-quarto-pdf-inlinecode-bg/index.llms.md)

Unlike HTML output, Quarto PDF output does not provide a default setting for adding background color to inline code blocks.

I used LaTeX’s [xcolor](https://ctan.org/pkg/xcolor) package to add background color to inline code blocks, so this article summarizes the method.

## Preamble Settings

First, add the `include-in-header` option to the YAML header as follows, and specify a file that contains the preamble for loading the [xcolor](https://ctan.org/pkg/xcolor) package and setting the background color. Here, that file is named `preamble.tex`.

``` yaml
---
format:
  pdf:
    include-in-header: preamble.tex
---
```

With the `include-in-header` option, the specified content is added before the document. In LaTeX terms, this corresponds to the preamble.

In this example, the `preamble.tex` file is assumed to be saved in the same directory as the document. If it is saved in another directory, specify it with a relative or absolute path. The file name can also be changed to any name.

## Contents of the Preamble

Next, create `preamble.tex` and write the following content.

``` latex
\usepackage{xcolor}

\definecolor{inlinecodebg}{RGB}{245,245,245}

\let\OldTexttt\texttt
\renewcommand{\texttt}[1]{%
  \colorbox{inlinecodebg}{\OldTexttt{#1}}%
}
```

> **NOTE:**
>
> - `\usepackage{xcolor}`: loads the xcolor package. This makes it possible to define colors and set background colors.
> - `\definecolor{inlinecodebg}{RGB}{245,245,245}`: defines a background color named `inlinecodebg`. This example uses a light gray, but you can change the RGB values to use any color.
> - `\let\OldTexttt\texttt` and `\renewcommand{\texttt}[1]{...}`: saves the existing `\texttt` command and defines a new `\texttt` command with a background color. This makes inline code blocks appear with a background color.
>
> The reason for using `\OldTexttt` is to preserve the original functionality of the `\texttt` command while adding new behavior.
>
> The `\texttt` command is a LaTeX command for displaying text in a monospaced, typewriter-style font, and Quarto uses it for inline code blocks.

## Checking the Result

After applying the settings above, create a Quarto document containing inline code blocks and output it as PDF. If you want to change the color, adjust the RGB values while checking the PDF output.

## References

- [CTAN: Package xcolor](https://ctan.org/pkg/xcolor)
- [PDF Basics - Quarto](https://quarto.org/docs/output-formats/pdf-basics.html)
- [PDF Options - Quarto](https://quarto.org/docs/reference/formats/pdf.html)
