---
title: 楕円フーリエ解析
layout: post
author: Kaede Konrai
---

輪郭形状の解析のための楕円フーリエ解析について、理論から実装までのメモです。

## 楕円フーリエ解析とは

輪郭 contour の解析のために用いられる解析方法です。
形態計測学 Morphometricsで用いられます。

- 輪郭がそれぞれのサンプルでどのくらい似ているのか
- サンプル同士の輪郭形状の違いがどのようなものか

といったことを定量化および可視化することができます。
研究例としては、以下のような研究が挙げられます。
本ページでは、理論からRによる実装、解析を含めた説明を試みます。

## チェインコード

文献によって方向や開始点などが若干異なりますが、方向に数字を結びつけたものをチェインと呼び、その数字を並べたベクトルをチェインコードと呼びます。

$$
V = a_1 a_2 a_3 \cdots a_K
$$

ここで、$$V$$がチェインコードで$$ a_1 a_2 a_3 \cdots a_K $$がそれぞれのチェインになります。
おそらく最初に提唱されたのはFreeman(1974)だそうです。
ここでは以下の図のように、右方向から時計回りに8方向に伸びる矢印にそれぞれ0~7までの数字を当てはめます。

<div id="chaincode" style="width:600px;height:600px;"></div>
<script src="{{ site.baseurl }}/assets/js/chaincode.js"></script>

簡単な例を挙げて輪郭形状をチェインコードで表してみます。

ここでは、すべての方向を含むような単純な八角形を考えます。

チェインコードは以下のように表されます。

$$
V = 07654321
$$

図示すると以下のようになります。

<div id="chaincode_ex" style="width:600px;height:600px;"></div>
<script src="{{ site.baseurl }}/assets/js/chaincode_ex.js"></script>

この八角形は正八角形ではないことに注意が必要です。

すなわち、すべての辺の長さが同じではないということです。

縦横に移動する場合は長さが$$1$$になりますが、斜めに移動する場合は長さは$$\sqrt{2}$$になります。

それぞれのチェインの$$x$$座標と$$y$$座標の移動とその長さの対応は以下の表のようになります。

<style>
table {
 border-collapse: collapse; /*隣接する枠線を重ねて表示*/
 border-spacing: 0; /*枠線を間隔をなしに*/
 text-align: center;
}
table th {
 background: #e3f6f5;
 border: solid 1px #666666;
 padding: 10px;
}
table td {
 border: solid 1px #666666;
 padding: 10px;
}
</style>
| チェイン | $$x$$方向変位 | $$y$$方向変位 | 長さ           |
| ---- | --------- | --------- | ------------ |
| 0    | 1         | 0         | 1            |
| 1    | 1         | 1         | $$\sqrt{2}$$ |
| 2    | 0         | 1         | 1            |
| 3    | -1        | 1         | $$\sqrt{2}$$ |
| 4    | 0         | -1        | 1            |
| 5    | -1        | -1        | $$\sqrt{2}$$ |
| 6    | 0         | -1        | 1            |
| 7    | 1         | -1        | $$\sqrt{2}$$ |

## 楕円フーリエ係数の算出

## 説明力

## 標準化

$$
\left[
\begin{array}{rr}
a_n^{**} & b_n^{**} \\
c_n^{**} & d_n^{**} \\
\end{array}
\right]
=
\left[
\begin{array}{rr}
\cos \psi & \sin \psi \\
-\sin \psi & \cos \psi \\
\end{array}
\right]
\left[
\begin{array}{rr}
a_n & b_n \\
c_n & d_n \\
\end{array}
\right]
\left[
\begin{array}{rr}
\cos \frac{2 \pi n t}{T} &  -\sin \frac{2 \pi n t}{T} \\
\sin \frac{2 \pi n t}{T} &\cos \frac{2 \pi n t}{T} \\
\end{array}
\right]
$$

## 主成分分析

## 逆フーリエ変換