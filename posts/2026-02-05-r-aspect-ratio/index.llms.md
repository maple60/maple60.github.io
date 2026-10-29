# Rのプロットのアスペクト比を設定する方法

r

`asp`パラメータを使ってRのプロットのアスペクト比を調整する方法についてです。

公開

2026-02-04

更新日

2026-02-04

[English version](../../en/posts/2026-02-05-r-aspect-ratio/)

Rのプロット関数(例えば[`plot()`](https://rdrr.io/r/graphics/plot.default.html))では、`asp`パラメータを使用してアスペクト比を設定できます。 アスペクト比は、y軸の単位長さがx軸の単位長さの何倍であるかを指定します。

## `asp`パラメータの使用例

[`plot()`](https://rdrr.io/r/graphics/plot.default.html)内に`asp`パラメータを指定することで、アスペクト比を調整できます。

``` downlit
plot(1:10, 1:10) # default aspect ratio
```

![](index_files/figure-html/unnamed-chunk-1-1.png)

``` downlit
plot(1:10, 1:10, asp = 1) # aspect ratio 1:1
```

![](index_files/figure-html/unnamed-chunk-1-2.png)

上記の例では、`asp = 1`と設定しているため、x軸とy軸の単位長さが等しくなります。 もし`asp = 2`と設定すると、y軸の単位長さがx軸の単位長さの2倍になります。

``` downlit
plot(1:10, 1:10, asp = 2)
```

![](index_files/figure-html/unnamed-chunk-2-1.png)

## プロット領域も含めたアスペクト比の調整

これは、1:1プロットを作るときに便利です。 1:1の線を描画したい場合などに使用します。 このとき、プロット領域の形状によっては、実際の表示が正方形にならないことがあります。 その場合は、`par(pty = "s")`を使用してプロット領域を正方形に設定することもできます。

``` downlit
par(pty = "s") # set the plot region to a square

x <- rnorm(10, mean = 1, sd = 0.1) * 1:10
y <- rnorm(10, mean = 1, sd = 0.1) * 1:10

plot(x, y, asp = 1)
plot(x, y, asp = 1)
abline(0, 1, lty = 2)
```

![](index_files/figure-html/unnamed-chunk-3-1.png)

``` downlit
par(pty = "m") # restore the plot region setting
```

> **NOTE:**
>
> - [`rnorm()`](https://rdrr.io/r/stats/Normal.html): 正規分布に従う乱数を生成する関数です。ここでは、平均1、標準偏差0.1の乱数を生成しています。
> - `abline(0, 1, lty = 2)`: y = xの直線を破線で描画しています。`lty = 2`は破線を意味します。
