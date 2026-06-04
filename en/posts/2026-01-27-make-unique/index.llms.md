# Removing Duplicate Vector Elements in R

r

A note on using the [`make.unique()`](https://rdrr.io/r/base/make.unique.html) function to make duplicate vector elements unique.

Published

2026-01-27

Modified

2026-01-27

> **NOTE:**
>
> Original Japanese version: [Rでベクトルの重複を取り除く方法](../../../posts/2026-01-27-make-unique/index.llms.md)

## Using the `make.unique()` Function

This is a note on how to handle duplicate elements in a vector in R and turn them into unique elements. With the [`make.unique()`](https://rdrr.io/r/base/make.unique.html) function, duplicate elements can be automatically converted into unique values by adding suffixes. The usage is as follows.

``` downlit
make.unique(names, sep = ".")
```

- `names`: a character vector you want to make unique
- `sep`: the separator used before the suffix added to duplicate elements; the default is a dot, `.`

## Example

Suppose we have the following vector.

``` downlit
x <- c("apple", "banana", "apple", "orange", "banana")
```

Applying [`make.unique()`](https://rdrr.io/r/base/make.unique.html) to this vector gives the following result.

``` downlit
unique_x <- make.unique(x)
print(unique_x)
```

    [1] "apple"    "banana"   "apple.1"  "orange"   "banana.1"

Because `apple` and `banana` are duplicated, `.1` is added after the repeated words.

## Closing Note

I cannot remember exactly where I used this function, but I remembered using it before and left this note. The opportunities to use it may be limited, but it can be useful to know.
