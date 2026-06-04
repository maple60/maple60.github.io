# Calculating Cumulative Sums in R

r

Calculate cumulative sums with the `cumsum` function.

Published

2024-03-14

Modified

2024-03-14

> **NOTE:**
>
> Original Japanese version: [Rで累積和を求める](../../../posts/2024-03-14-cumsum/index.llms.md)

This is how to calculate cumulative sums in R. A cumulative sum adds each value step by step as you move through a vector. For example, for `1, 2, 3`, the first value is `1` because there is no previous value. The second value is \\1 + 2 = 3\\, and the third value is \\3 + 3 = 6\\, so the result is `1, 3, 6`.

In R, you can calculate this easily with the `cumsum` function.

``` downlit
x <- c(1, 2, 3)
cumsum(x)
```

    [1] 1 3 6
