---
title: Rで色相環を作成する
layout: post
tags: R
---

もともとはDeepFlowというアルゴリズムを色々試していたときに、成果物に挿入しようと思って模索したときに作ったコードです。
Rで実現しました。
PDFやSVGといったベクタ形式で描画するとありえないくらい重くなるので、pngやjpegなどラスタ画像(透過すること多いのでPNGがおすすめ)で描画することが必要です。

{% highlight r linenos %}
len <- 1000
r <- seq(from=0, to=1, length.out=len)
theta <- seq(from=0, to=2*pi, length.out=len)
png("color_ling.png")
plot(-1:1, -1:1, asp=1, axes=FALSE, xlab="", ylab="", type="n")
for(i in 1:len){
    ri <- r[i]
    for(j in 1:len){
        if(j==1){thetai0<-0}else{thetai0 <- theta[j-1]}
        thetai1 <- theta[j]
        segments(ri*cos(thetai0), ri*sin(thetai0), ri*cos(thetai1), ri*sin(thetai1), col=hsv(h=thetai1/(2*pi), s=ri, v=1))
    }
}
dev.off()
{% endhighlight %}
