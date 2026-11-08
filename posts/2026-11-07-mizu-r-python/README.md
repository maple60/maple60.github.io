# mizu・reticulate・CSVの比較を再実行する

## 環境

- 同一ホスト上のR 4.3以降と64ビットのPython 3.10以降を使います。Pythonはreticulateから埋め込み可能なCPythonを選びます。
- Rで `install.packages(c("mizu", "reticulate", "knitr", "rmarkdown"))` を実行します。プロジェクトのrenvを変更せずに試す場合は、プロジェクト外のRセッションで専用ライブラリにインストールし、実行時に `R_LIBS_USER` をその場所に設定します。
- Pythonの仮想環境に `python -m pip install "pymizu[numpy]"` を実行します。パッケージの版を揃え、R/Python両方向でワーカーが起動することを確認します。開発版を使った場合はコミットも記録します。
- Quartoは記事のレンダリングに必要です。計測には不要です。

## 実行

このREADMEがあるディレクトリから実行します。仮想環境のPythonへの絶対パスを指定してください。

```sh
export MIZU_PYTHON=/path/to/venv/bin/python
Rscript --vanilla bench/run.R
```

PowerShellの場合は次のように設定します。

```powershell
$env:MIZU_PYTHON = 'C:/path/to/venv/Scripts/python.exe'
Rscript --vanilla bench/run.R
```

`MIZU_REPEATS` の既定値は7、最小値は3です。 `MIZU_MAX_WORKERS` でワーカー数の上限を下げられます。ベンチマークは物理コアを1つ、物理メモリを1 GiB残す目安で上限を決め、ワーカー1つあたり1 GiBを見込みます。情報が取れなければ1に制限します。コンテナなどでホストより割当が少ない場合は、実際の割当を基に上限を設定します。80 MB条件では入力、演算結果、転送バッファなどが同時に存在し、CSVも入出力ファイルを作るので、空きメモリと一時領域に余裕を持たせます。

## 出力の読み方

- `results/environment.txt` にRとPythonの版、依存パッケージ、OS、CPU、物理コア数、メモリ、シードを記録します。
- `results/samples.csv` は試行単位の出力です。 `size` はAでは呼び出し回数、Bでは入力のバイト数、C・Dでは入力の要素数、Eではワーカー数です。Eの0は逐次実行です。 `rep=0` のエラーはウォームアップまたは準備の失敗です。
- `results/summary.csv` は条件ごとの成功数、エラー数、スキップ数、中央値、第1・第3四分位です。秒で記録します。エラーが出た条件は以降の繰り返しを打ち切ります。
- Bの `compute` はPythonで演算を計った区間です。CSVの `process` はPython起動、読み込み、演算、書き出しを含みます。Bのmizuでは送信と受信を別々に計っていません。 `roundtrip` から `compute` を引いた値にも、タスクの投入や待機が含まれます。
- 初期化の `ready` は処理可能になるまでの時間です。CSVはNumPyが利用できることを別プロセスで確認した時間で、各往復にも別途プロセス起動を含みます。
- `MIZU_RESULTS` を指定すると別の場所へ出力できます。スモークテストと公開する計測を分けるときに使います。

リポジトリのルートに戻り、次のコマンドで図と表を再生成します。サイト用のknitrとrmarkdownが必要です。 `results/samples.csv` がない場合は記事にその旨が表示されます。

```sh
quarto render posts/2026-11-07-mizu-r-python/index.qmd --profile ja
```

