# Rでベクトルを作成する

r

Rでベクトルを作成するいろいろな方法をまとめます

Published

2024-06-18

Modified

2024-06-18

Rでベクトルを作成するいろいろな方法をまとめます。 ここで紹介する関数は以下になります。

- [`c()`](https://rdrr.io/r/base/c.html)
- `:`
- [`seq()`](https://rdrr.io/r/base/seq.html)
- [`seq_len()`](https://rdrr.io/r/base/seq.html)
- [`seq_along()`](https://rdrr.io/r/base/seq.html)
- [`rep()`](https://rdrr.io/r/base/rep.html)

## `c()`と`:`

Rで最も簡単なベクトルの作成方法は[`c()`](https://rdrr.io/r/base/c.html)と`:`を使用することです。

[`c()`](https://rdrr.io/r/base/c.html)の中にカンマ(`,`)区切りで値を並べるとベクトルになります。 `c`はcombine(結合する)に由来しています。

``` downlit
c(1, 2, 3)
```

    [1] 1 2 3

`[start]:[end]`という感じで、始点と終点を指定してベクトルを作成することもできます。

``` downlit
1:3
```

    [1] 1 2 3

これらは非常に頻繁に使用するので、覚えておくと便利です。

## `seq()`

[`seq()`](https://rdrr.io/r/base/seq.html)関数はsequence(~を順番に並べる)ことに由来しており、その名の通り、`()`内に指定した通りに値を並べてくれます。

最も基本的な使い方は、始めと終わりの数を指定してベクトルを作成する方法です。

``` downlit
seq(1, 3) # seq(start, end)
```

    [1] 1 2 3

``` downlit
seq(from = 1, to = 3) # 丁寧な書き方
```

    [1] 1 2 3

値を一つだけ指定すると、1からその数まで1ずつ増加するベクトルを作成します。

``` downlit
seq(3)
```

    [1] 1 2 3

1から始まる場合は、[`seq_len()`](https://rdrr.io/r/base/seq.html)関数を使用したほうが速く動きます。

``` downlit
seq_len(5) # 1~5までのベクトル
```

    [1] 1 2 3 4 5

### 上昇幅を指定してベクトルを作成する

デフォルトでは1ずつ上昇しますが、引数`by`を変更すると上昇数値を変更できます。

``` downlit
seq(from = 1, to = 3, by = 0.5) # 0.5ずつ増加
```

    [1] 1.0 1.5 2.0 2.5 3.0

### 長さを指定してベクトルを作成する

引数`length.out`を指定すると、長さを指定してベクトルを作成できます。 始めと終わりの値を等間隔に分割してくれます。

``` downlit
seq(from = 1, to = 3, length.out = 6) # 長さ6のベクトル
```

    [1] 1.0 1.4 1.8 2.2 2.6 3.0

あるベクトルと同じ長さのベクトルを作成するには[`seq_along()`](https://rdrr.io/r/base/seq.html)を使用します。

``` downlit
x <- seq_along(c("A", "B", "C", "D", "E"))
seq_along(x)
```

    [1] 1 2 3 4 5

これは、`for`ループを使用する際に便利です。 `for`ループを書く時、下のように書くことが多いと思います。

``` downlit
x <- c("A", "B", "C", "D", "E")
for (i in 1:length(x)) {
  print(x[i])
}
```

    [1] "A"
    [1] "B"
    [1] "C"
    [1] "D"
    [1] "E"

これを[`seq_along()`](https://rdrr.io/r/base/seq.html)を用いて書き直すと、以下のようになります。

``` downlit
x <- c("A", "B", "C", "D", "E")
for (i in seq_along(x)) {
  print(x[i])
}
```

    [1] "A"
    [1] "B"
    [1] "C"
    [1] "D"
    [1] "E"

あまり違いはありませんが、ループに用いるベクトルの長さが0(空ベクトル)の場合の処理が変わります。

## `rep()`

同じ値を繰り返すベクトルを作成するには、[`rep()`](https://rdrr.io/r/base/rep.html)関数を使用します。 repeatに由来します。

``` downlit
rep(3, 5) # 3を5回繰り返す
```

    [1] 3 3 3 3 3

ベクトルを繰り返すこともできます。

``` downlit
rep(1:3, 3) # 1~3を3回繰り返す
```

    [1] 1 2 3 1 2 3 1 2 3

``` downlit
rep(1:3, times = 3) # 上と同じ
```

    [1] 1 2 3 1 2 3 1 2 3

それぞれの値をまとめて繰り返すこともできます。

``` downlit
rep(1:3, each = 3) # それぞれの値を3回繰り返す
```

    [1] 1 1 1 2 2 2 3 3 3

繰り返す回数を値ごとに指定できます。

``` downlit
rep(1:3, c(1, 2, 1)) # 1は1回、2は2回、3は1回
```

    [1] 1 2 2 3

長さを指定することもできます。 長さが優先されるので、繰り返しが途中の場合は切り捨てられます。

``` downlit
rep(1:3, length.out = 5) # 長さ5まで繰り返す
```

    [1] 1 2 3 1 2

## 活用例

これらのベクトルの作成は、データフレームでIDやグループを作成したり、プロットの点を補完したりするときに活用されます。 例えば、A~Cまでのグループをデータシートの各行に振りたい時は`rep(c("A", "B", "C"), each = 5)`とすれば、簡単にグループを作成することができます。 また、サインカーブなどの関数を描画したいときは、以下のようにすると簡単に関数を描画できます。

``` downlit
x <- seq(from = 0, to = pi, length.out = 100)
plot(x, sin(x))
```

![](index_files/figure-html/unnamed-chunk-17-1.png)

## まとめ

個人的には[`c()`](https://rdrr.io/r/base/c.html)や`:`はほぼ毎日出てきますが、[`seq()`](https://rdrr.io/r/base/seq.html)系や[`rep()`](https://rdrr.io/r/base/rep.html)はたまに使うといった程度なので、ふと長いベクトルが必要なときにサクッとできないことも多いです。 調べればすぐに分かりますが、必要なときに簡単に作成できると便利だと思いました。
