# Extracting File Names in R

r

How to extract file names in R with [`basename()`](https://rdrr.io/r/base/basename.html) and `file.path_sans_ext()`.

Published

2026-02-06

Modified

2026-02-06

> **NOTE:**
>
> Original Japanese version: [Rでファイル名を抽出する方法](../../../posts/2026-02-06-r-extract-filename/index.llms.md)

When handling file paths in R, you may want to extract only the file name or obtain the file name without its extension. This article summarizes how to extract file names in R using [`basename()`](https://rdrr.io/r/base/basename.html) and [`tools::file_path_sans_ext()`](https://rdrr.io/r/tools/fileutils.html).

## Extracting the File Name

Use the [`basename()`](https://rdrr.io/r/base/basename.html) function to extract a file name from a file path.

``` downlit
file_path <- "/path/to/your/file/data.csv"
file_name <- basename(file_path)
print(file_name)
```

    [1] "data.csv"

The file name alone is extracted from the file path that includes the directory path.

## Extracting the File Name Without the Extension

Use the [`file_path_sans_ext()`](https://rdrr.io/r/tools/fileutils.html) function from the `tools` package to obtain a file name without its extension.

``` downlit
library(tools)
file_path <- "/path/to/your/file/data.csv"
file_name_no_ext <- file_path_sans_ext(basename(file_path))
print(file_name_no_ext)
```

    [1] "data"

This obtains the file name without the extension.

> **NOTE:**
>
> The function name is a little long and hard to remember, but it becomes easier if you remember its meaning. `sans` is French for “without.” It corresponds to the English word `without`. Also, `ext` is short for “extension.” Therefore, [`file_path_sans_ext()`](https://rdrr.io/r/tools/fileutils.html) means “file path without extension.”

## Example

This is useful when combining data with corresponding image file names and storing them in a data frame.

``` downlit
file_paths <- c(
  "/path/to/your/file/data1.csv",
  "/path/to/your/file/data2.csv",
  "/path/to/your/file/data3.csv"
)
file_names <- basename(file_paths)
file_names_no_ext <- file_path_sans_ext(file_names)
df <- data.frame(value = c(10, 20, 30), file_name = file_names_no_ext)
print(df)
```

      value file_name
    1    10     data1
    2    20     data2
    3    30     data3

In this way, file names can be included in a data frame.
