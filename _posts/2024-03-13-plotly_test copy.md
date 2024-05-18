---
title: Plotlyを使ってみる
layout: post
tags: [JavaScript, R, Python]
---

[Plotly](https://plotly.com/graphing-libraries/)はいろいろな言語で使用できる、オープンソースのインタラクティブグラフ作成ライブラリです。
Javascriptはもちろん、PythonやRでも利用できます。
試しに下に[Getting Started in JavaScript](https://plotly.com/javascript/getting-started/)の例を埋め込んでみます。

<div id="tester" style="width:600px;height:250px;"></div>

<script>
	TESTER = document.getElementById('tester');
	Plotly.newPlot( TESTER, [{
	x: [1, 2, 3, 4, 5],
	y: [1, 2, 4, 8, 16] }], {
	margin: { t: 0 } } );
</script>

埋め込んだのは、以下のようなものになります。

{% highlight html linenos %}
<head>
  <script src="https://cdn.plot.ly/plotly-2.29.1.min.js" charset="utf-8"></script>
</head>

[Plotly](https://plotly.com/graphing-libraries/)はいろいろな言語で使用できる、オープンソースのインタラクティブグラフ作成ライブラリです。
Javascriptはもちろん、PythonやRでも利用できます。
試しに下に[Getting Started in JavaScript](https://plotly.com/javascript/getting-started/)の例を埋め込んでみます。

<div id="tester" style="width:600px;height:250px;"></div>

<script>
	TESTER = document.getElementById('tester');
	Plotly.newPlot( TESTER, [{
	x: [1, 2, 3, 4, 5],
	y: [1, 2, 4, 8, 16] }], {
	margin: { t: 0 } } );
</script>
{% endhighlight %}

これはjekyllのPostにそのまま入れてみました。
うまくいっているので、多分これで合っているのでしょう。
しかし、headタグはここではなく、テンプレートに埋め込んだほうが良い気がします。
埋め込んだ新しいテンプレートを作成するのも良いかもしれません。
色々活用方法がありそうです。
