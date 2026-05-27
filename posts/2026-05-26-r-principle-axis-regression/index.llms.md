# Rで2変量PCAとPrincipal axis regressionの基礎を理解する

r

共分散行列・固有値・固有ベクトルから2変量データの主軸を求めます

Published

2026-05-26

Modified

2026-05-27

**Principal axis regression** (PAR)は、主成分分析 (PCA)と似たような考え方で、2変量データの主要な変動方向を直線として捉えるために使用されます。 文献では、関連する2変量のline-fitting方法として、major axis (MA) や standardised major axis (SMA) がよく扱われます ([Warton et al. 2006](#ref-warton2006))。本記事ではこのうち、共分散行列の第1固有ベクトルを主軸として使うMAに近い考え方を扱います。

本記事では、共分散行列の第1固有ベクトルを主軸として使う、major axis regressionに近い実装を扱います。 以下では、RでPrincipal axis regressionを実装してみます。

## Principal axis regressionの概要

Principal axis regressionは、データの**共分散行列**を計算し、その**固有値**と**固有ベクトル**を求めることで、データの主要な変動方向を特定します。 **第1固有ベクトルはもっとも分散が大きい方向**、**第2固有ベクトルはそれに直交する方向**を表します。

よく用いられるordinary least squares regression (OLS; 最小二乗回帰)では、目的変数と説明変数を分けて、目的変数方向の誤差が小さくなるように直線を当てはめます。 一方でPARでは、どちらか一方を目的変数として固定するのではなく、2変量の点群全体の変動方向を表す直線を求めます。

## Rでの実装

RでPrincipal axis regressionを実装するためには、以下の手順を踏む必要があります。

1.  データの準備
2.  共分散行列の計算
3.  固有値と固有ベクトルの計算
4.  主軸の傾きと切片の計算
5.  可視化

なお、ここでは\\x\\と\\y\\を同じスケールの模擬データとして扱います。 実データで2つの変数の単位やスケールが大きく異なる場合は、log変換や標準化を行うか、共分散行列ではなく相関行列を使うかを検討する必要があります。 共分散行列を使う方法と相関行列を使う方法では、推定される軸の向きが変わることがあります。

> **NOTE:**
>
> Rの実装のセクションでは、詳しい数式の説明は省略し、コードを中心に説明します。 数式を用いたメカニズムの説明は、次のセクションで行います。

### データの準備

まず、適当なデータセットを用意します。 ここでは、[`rnorm()`](https://rdrr.io/r/stats/Normal.html)関数を使用して、ランダムなデータを生成します。 主軸を \\y = \alpha + \beta x\\ として、ノイズを加えたデータを生成します。

``` downlit
set.seed(123)
n <- 100
beta <- 1.5
alpha <- 1

# 主軸方向のスコア
t <- rnorm(n, mean = 0, sd = 2)

# 主軸に直交するノイズ
e <- rnorm(n, mean = 0, sd = 0.5)

# 主軸方向ベクトルと直交方向ベクトル
v1 <- c(1, beta) / sqrt(1 + beta^2)
v2 <- c(-beta, 1) / sqrt(1 + beta^2)

x <- t * v1[1] + e * v2[1]
y <- alpha + t * v1[2] + e * v2[2]

plot(x, y, asp = 1, pch = 16)
```

![](index_files/figure-html/unnamed-chunk-1-1.png)

### 共分散行列の計算

共分散行列は、以下のように表されます。

\\ \Sigma = \begin{bmatrix}\sigma\_{xx} & \sigma\_{xy} \\ \sigma\_{yx} & \sigma\_{yy}\end{bmatrix} \\

ここで、\\\sigma\_{xx}\\は\\x\\の分散、\\\sigma\_{yy}\\は\\y\\の分散、\\\sigma\_{xy}\\は\\x\\と\\y\\の共分散を表します。 なお、共分散とは、2つの変数がどの程度一緒に変動するかを示す指標です。 以下のように計算されます。

\\ \sigma\_{xy} = \frac{1}{n-1} \sum\_{i=1}^{n} (x_i - \bar{x})(y_i - \bar{y}) \\

Rでは、[`cov()`](https://rdrr.io/r/stats/cor.html)関数を使用して共分散行列を簡単に計算することができます。

``` downlit
cov_matrix <- cov(cbind(x, y))
cov_matrix
```

             x        y
    x 1.227713 1.447200
    y 1.447200 2.338984

### 固有値と固有ベクトルの計算

共分散行列の固有値と固有ベクトルを計算するためには、[`eigen()`](https://rdrr.io/r/base/eigen.html)関数を使用します。 ちなみに、固有値はデータの変動の大きさを表し、固有ベクトルはその変動の方向を表します。 Rの[`eigen()`](https://rdrr.io/r/base/eigen.html)は固有値を大きい順に返すため、`vectors`の1列目が第1主軸、2列目が第2主軸に対応します。

``` downlit
eigen_result <- eigen(cov_matrix, symmetric = TRUE)
eigen_result
```

    eigen() decomposition
    $values
    [1] 3.3335480 0.2331491

    $vectors
              [,1]       [,2]
    [1,] 0.5663796 -0.8241445
    [2,] 0.8241445  0.5663796

[`eigen()`](https://rdrr.io/r/base/eigen.html)関数は、固有値と固有ベクトルをリスト形式で返します。 固有値は`values`、固有ベクトルは`vectors`に格納されます。 \\x\\と\\y\\の2次元のデータの場合、2つの固有値と対応する固有ベクトルが得られます。

``` downlit
eigen_values <- eigen_result$values
eigen_vectors <- eigen_result$vectors

print(paste("第1主軸の固有値:", eigen_values[1]))
```

    [1] "第1主軸の固有値: 3.33354798737934"

``` downlit
print(paste("第2主軸の固有値:", eigen_values[2]))
```

    [1] "第2主軸の固有値: 0.233149107828597"

``` downlit
print(paste(
  "第1主軸の固有ベクトル: (",
  eigen_vectors[1, 1],
  ", ",
  eigen_vectors[2, 1],
  ")",
  sep = ""
))
```

    [1] "第1主軸の固有ベクトル: (0.566379566968877, 0.824144517739545)"

``` downlit
print(paste(
  "第2主軸の固有ベクトル: (",
  eigen_vectors[1, 2],
  ", ",
  eigen_vectors[2, 2],
  ")",
  sep = ""
))
```

    [1] "第2主軸の固有ベクトル: (-0.824144517739545, 0.566379566968877)"

> **NOTE:**
>
> 固有ベクトルの符号は任意です。例えば、\\(u_x, u_y)\\ と \\(-u_x, -u_y)\\ は同じ軸方向を表します。 そのため、直線の傾き \\u_y/u_x\\ は変わりませんが、次の記事で扱う「軸どうしの角度」を計算する場合には、この符号の任意性に注意する必要があります。

### 可視化

固有ベクトル、すなわち主要な変動方向をデータポイントとともにプロットしてみます。 データの中心をベクトルが通るようにします。 つまり、直線が\\y=a + bx\\のとき、\\a\\と\\b\\は以下のように計算されます。

\\ a = \bar{y} - b \bar{x} \\

ここで、\\\bar{x}\\と\\\bar{y}\\はそれぞれ\\x\\と\\y\\の平均値です。 また、\\b\\は固有ベクトルの比率で計算されます。 第1主軸を赤、第2主軸を青で描きます。

``` downlit
# 第1主軸と第2主軸の傾き
major_axis_slope <- eigen_vectors[2, 1] / eigen_vectors[1, 1]
minor_axis_slope <- eigen_vectors[2, 2] / eigen_vectors[1, 2]

# データの中心を通るように切片を計算
major_axis_intercept <- mean(y) - major_axis_slope * mean(x)
minor_axis_intercept <- mean(y) - minor_axis_slope * mean(x)

# データポイントと主要な変動方向をプロット
plot(x, y, asp = 1, pch = 16, main = "Principal Axis Regression")

# 第1主軸の線を追加
abline(
  a = major_axis_intercept,
  b = major_axis_slope,
  col = 2,
  lwd = 3
)

# 第2主軸の線を追加
abline(
  a = minor_axis_intercept,
  b = minor_axis_slope,
  col = 4,
  lwd = 3
)
```

![](index_files/figure-html/unnamed-chunk-5-1.png)

## PCAとの関係

ここで行った計算は、2変量データに対するPCAと同じです。 PCAでは、共分散行列の固有値・固有ベクトルを求めることで、データのばらつきが大きい方向から順に新しい軸を定義します。

今回の例では、元の軸は \\x\\ と \\y\\ ですが、固有値分解によって新しく得られる軸は第1主軸と第2主軸です。

- 第1主軸：データが最も大きくばらつく方向
- 第2主軸：第1主軸に直交する方向
- 第1固有値：第1主軸方向の分散
- 第2固有値：第2主軸方向の分散

したがって、principal axis regression や major axis regression は、2変量PCAで得られる第1主軸を、2変量データを要約する直線として解釈したものと考えることができます。

## 共分散行列、固有値、固有ベクトルが表す意味

今回は、共分散行列の固有値と固有ベクトルを用いて、データの主要な変動方向を特定しました。 このメカニズムについて、本文では詳しく説明していませんでした。 どうして共分散行列や固有ベクトルを使うと、主軸が求められるのでしょうか。

直感的には、主軸とは**散布図の点群の真ん中を通り、データのばらつきを最もよく表す直線**です。

たとえば、散布図に適当な直線を1本引いたとします。 このとき、それぞれの点から直線に向かって垂線を下ろすと、点がその直線からどれだけ離れているかを測ることができます。

主軸としてよい直線とは、各点から直線までの距離が全体として小さくなるような直線です。 つまり、点群の流れに沿っている直線ほど、主軸としてよい直線だと考えられます。

一方で、これは別の見方もできます。 点群にうまく沿った直線では、各点はその直線方向に大きくばらついています。 逆に、点群に合っていない直線では、直線方向のばらつきは小さく、直線から外れた方向のずれが大きくなります。

したがって、主軸は**データをその方向に見たとき、ばらつきが最も大きくなる方向**と考えることができます。

この「ある方向に見たときのばらつき」を計算するために使うのが、**共分散行列**です。

2変量データの各点を、平均を中心にした形で

\\ x_i - \bar{x}, \quad y_i - \bar{y} \\

とします。 ここで、ある方向を表すベクトルを\\\mathbf{u}\\を以下のように定義します。

\\ \mathbf{u} = \begin{bmatrix} u_x \\ u_y \end{bmatrix} \\

このベクトルは、直線の向きを表します。

各点がこの方向にどれくらい進んでいるかは、次のように計算できます。

\\ s_i = u_x (x_i - \bar{x}) + u_y (y_i - \bar{y}) \\

ここで、\\s_i\\は点\\i\\が方向\\\mathbf{u}\\に沿ってどれだけ進んでいるかを表すスカラー値です。 つまり、それぞれの点の「直線方向の位置」のようなものです。 この \\s_i\\ のばらつきが大きいほど、その直線方向にデータが大きく広がっていることになります。

このばらつきを計算するために、共分散行列を使います。 共分散行列\\\Sigma\\は、データのばらつきと変動の方向を表す行列です。 ある方向\\\mathbf{u}\\に沿ったばらつきは、次のように計算されます。

\\ \text{Var}(s) = \mathbf{u}^T \Sigma \mathbf{u} \\

また、共分散行列\\\Sigma\\は次のように表されます。

\\ \Sigma = \begin{bmatrix}\sigma\_{xx} & \sigma\_{xy} \\ \sigma\_{yx} & \sigma\_{yy}\end{bmatrix} \\

ここで、\\\sigma\_{xx}\\は\\x\\の分散、\\\sigma\_{yy}\\は\\y\\の分散、\\\sigma\_{xy}\\は\\x\\と\\y\\の共分散を表します。 分散は、データが平均からどれだけ広がっているかを表す指標であり、共分散は2つの変数がどの程度一緒に変動するかを示す指標です。

分散は以下のように計算されます。

\\ \sigma_s^2 = \frac{1}{n-1} \sum\_{i=1}^{n} (s_i - \bar{s})^2 \\

また、共分散は以下のように計算されます。

\\ \sigma\_{xy} = \frac{1}{n-1} \sum\_{i=1}^{n} (x_i - \bar{x})(y_i - \bar{y}) \\

つまり、共分散行列は、任意の方向 \\\mathbf{u}\\ に対して、**その方向のばらつきがどれくらいかを計算するための情報を持っている**と考えることができます。

では、どの方向 \\\mathbf{u}\\ を選べば、ばらつきが最大になるのでしょうか。

この問題を数学的に解くと、答えは共分散行列の**固有ベクトル**になります。 特に、最も大きい固有値に対応する**固有ベクトル**が、第1主軸の方向です。

簡単にまとめると、以下のようになります。

- **共分散行列**：データのばらつき方をまとめたもの
- **固有ベクトル**：ばらつきが大きい方向
- **固有値**：その方向にどれだけばらついているか

2変量データの場合、共分散行列の固有ベクトルは2つ得られます。

- **第1固有ベクトル**：最もばらつきが大きい方向
- **第2固有ベクトル**：第1固有ベクトルに直交する方向

このうち、第1固有ベクトルの方向を直線として描いたものが、今回のprincipal axis regression における主軸です。

## Rによる視覚的な理解

今回の仮想データを利用して、視覚的に理解を深めてみます。 まずは、冒頭の散布図を再度表示します。

``` downlit
set.seed(123)
n <- 100
beta <- 1.5
alpha <- 1
t <- rnorm(n, mean = 0, sd = 2)
e <- rnorm(n, mean = 0, sd = 0.5)
v1 <- c(1, beta) / sqrt(1 + beta^2)
v2 <- c(-beta, 1) / sqrt(1 + beta^2)
x <- t * v1[1] + e * v2[1]
y <- alpha + t * v1[2] + e * v2[2]
plot(x, y, asp = 1, pch = 16)
```

![](index_files/figure-html/unnamed-chunk-6-1.png)

次に、共分散行列を計算し、固有値と固有ベクトルを求めます。 固有ベクトルの符号は任意であるため、固有ベクトルの符号を統一するために、例えば第1主軸の\\x\\成分が正になるように調整します。

``` downlit
# 共分散行列と固有ベクトル
S <- cov(cbind(x, y))
eg <- eigen(S, symmetric = TRUE)

# 第1主軸の方向
u1 <- eg$vectors[, 1]
if (u1[1] < 0) {
  u1 <- -u1
}
```

> **NOTE:**
>
> 固有値や固有ベクトルは英語ではeigenvalueやeigenvectorと呼ばれます。 このため、Rの関数も[`eigen()`](https://rdrr.io/r/base/eigen.html)という名前になっています。

次に、比較用の適当な方向を用意し、それぞれの方向に対して、各点から直線への足を計算する関数を定義します。 ベクトルは、方向を表すために正規化して単位ベクトルにしておきます。

``` downlit
# データの中心
center <- c(mean(x), mean(y))

u0 <- c(1, 0.4) # 適当な方向のベクトル
u0 <- u0 / sqrt(sum(u0^2)) # 正規化して単位ベクトルにする

# 直線からの距離を計算する関数
get_foot_points <- function(x, y, u, center) {
  X <- cbind(x - center[1], y - center[2])
  score <- as.vector(X %*% u) # 各点のスコアを計算
  foot_centered <- outer(score, u) # スコアに基づいて足の位置を計算
  foot <- sweep(foot_centered, 2, center, "+") # 中心を足す
  foot
}

# 各点から直線への距離を計算
foot0 <- get_foot_points(x, y, u0, center)
foot1 <- get_foot_points(x, y, u1, center)
```

データの上に、適当に引いた直線と各点からその直線への足をプロットしてみます。

``` downlit
plot(x, y, asp = 1, pch = 16, xlab = "x", ylab = "y")
abline(
  a = center[2] - (u0[2] / u0[1]) * center[1],
  b = u0[2] / u0[1],
  col = "gray30",
  lwd = 2
)
segments(x, y, foot0[, 1], foot0[, 2], col = "gray70")
```

![](index_files/figure-html/unnamed-chunk-9-1.png)

次に、ここに第1主軸の線と、各点から第1主軸への足を追加してみます。

``` downlit
plot(x, y, asp = 1, pch = 16, xlab = "x", ylab = "y")
# 適当な方向の線と距離
abline(
  a = center[2] - (u0[2] / u0[1]) * center[1],
  b = u0[2] / u0[1],
  col = "gray30",
  lwd = 2
)
segments(x, y, foot0[, 1], foot0[, 2], col = "gray70")

# 第1主軸の線と距離
abline(
  a = center[2] - (u1[2] / u1[1]) * center[1],
  b = u1[2] / u1[1],
  col = 2,
  lwd = 3
)
segments(x, y, foot1[, 1], foot1[, 2], col = 3)
```

![](index_files/figure-html/unnamed-chunk-10-1.png)

この時の各点から直線までの距離の二乗和を計算して比較します。

``` downlit
# 適当な方向に対する、直線からの距離の二乗和
sum(sqrt(rowSums((cbind(x, y) - foot0)^2)))
```

    [1] 85.83191

``` downlit
# 第1主軸の方向に対する、直線からの距離の二乗和
sum(sqrt(rowSums((cbind(x, y) - foot1)^2)))
```

    [1] 37.87125

第1主軸の方が、適当な方向よりも点から直線への距離の二乗和が小さくなっていることがわかります。 つまり、データのばらつきにうまく沿った直線を選ぶと、点から直線への距離が全体として小さくなることがわかります。 第1主軸は、この距離の合計が最小になるような方向を表していることがわかります。

第2主軸も同様にプロットしてみます。

``` downlit
u2 <- eigen_vectors[, 2]
if (u2[1] < 0) {
  u2 <- -u2
}

plot(x, y, asp = 1, pch = 16, xlab = "x", ylab = "y")
# 第1主軸の線
abline(
  a = center[2] - (u1[2] / u1[1]) * center[1],
  b = u1[2] / u1[1],
  col = 2,
  lwd = 3
)
# 第2主軸の線
abline(
  a = center[2] - (u2[2] / u2[1]) * center[1],
  b = u2[2] / u2[1],
  col = 4,
  lwd = 3
)
```

![](index_files/figure-html/unnamed-chunk-12-1.png)

第1主軸はデータのばらつきに沿った方向を表し、第2主軸は第1主軸に直交する方向を表していることがわかります。

## まとめ

- Principal axis regressionは、共分散行列の固有値と固有ベクトルを用いて、2変量データの主要な変動方向を直線として捉える方法です。
- 共分散行列の第1固有ベクトルは、データのばらつきが最も大きい方向を表し、これが主軸になります。
- Rでは、[`cov()`](https://rdrr.io/r/stats/cor.html)関数で共分散行列を計算し、[`eigen()`](https://rdrr.io/r/base/eigen.html)関数で固有値と固有ベクトルを求めることができます。
- 主軸をデータとともにプロットすることで、データのばらつきの方向を視覚的に理解することができます
- PCAとPrincipal axis regressionは、共分散行列の固有値・固有ベクトルを用いてデータの主要な変動方向を特定する点で共通しています。

この記事では、2変量データから主軸を1本求める基本的な考え方を確認しました。 次の記事では、この第1固有ベクトルを使って、種ごとの代表値から求めた主軸と、種内変異を含めたときの主軸のずれを調べます。

- [RでPrincipal axis regressionをtrait spaceの回転に応用する](../2026-05-27-r-principle-axis-regression_example/)

## 参考文献

Warton, David I., Ian J. Wright, Daniel S. Falster, and Mark Westoby. 2006. “Bivariate Line-Fitting Methods for Allometry.” *Biological Reviews* 81 (2): 259–91. <https://doi.org/10.1017/S1464793106007007>.
