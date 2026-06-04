# Showing File Names on Code Blocks in Quarto

quarto

A note on how to show file names on code blocks in Quarto.

Published

2026-01-24

Modified

2026-01-24

> **NOTE:**
>
> Original Japanese version: [Quartoでコードブロックのファイル名を表示する](../../../posts/2026-01-24-code-filename/index.llms.md)

This is a note on how to show file names on code blocks. You can show a file name by adding the `filename` attribute to a code block.

Write it like this:

```` markdown
```{.python filename="example.py"}
print("Hello, World!")
```
````

It is displayed as follows.

``` python
print("Hello, World!")
```

The ```` ```{.python} ```` part means that syntax highlighting is applied, but the code is not executed. It has the same meaning as ```` ```python ````. However, when displaying a file name, you need to use the former form.

## References

- [HTML Code Blocks - Quarto](https://quarto.org/docs/output-formats/html-code.html#code-filename)
- [Markdown Basics - Quarto](https://quarto.org/docs/authoring/markdown-basics.html#source-code)
