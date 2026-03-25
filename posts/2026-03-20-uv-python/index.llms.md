# Pythonで最低限のuvによる環境管理

python

uv

Pythonの環境管理ツールであるuvを使用して、最低限の環境管理方法をまとめます

Published

2026-03-20

Modified

2026-03-20

## uvとは

[uv](https://docs.astral.sh/uv/)とは、Pythonの環境管理ツールです。 他の環境管理ツールには、[venv](https://docs.python.org/3/library/venv.html)や[virtualenv](https://virtualenv.pypa.io/en/latest/)などがあります。

uvは他の環境管理と比べても新し目で、速度や安定性、使いやすさなどが特徴です。 筆者もこれまではvenvを使用していましたが、uvに乗り換えてからは速度や安定性の向上を感じています。

また、OpenAIも2026年3月19日にuvの開発会社である[Astral](https://astral.sh/)を買収したこともあり、今後さらにuvの開発が加速することが期待されます。

これまで乱立していたPythonの環境管理ツールも、uvに統一されていく可能性が高いと考えられます。

大規模なプロジェクトでももちろん使用する恩恵が大きいですが、筆者のような小規模な個人開発でも、環境管理の手間が減るため、非常におすすめです。 今回は、筆者のよく使う、小規模な個人開発向けの最低限で汎用性のあるuvによる環境管理方法をまとめます。

## uvのインストール

uvのインストールの方法は何通りかあります。

MacやLinuxの場合は、以下のコマンドでインストールできます。

``` bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Windowsの場合は、以下のコマンドでインストールできます。

``` powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

また、Pythonのパッケージマネージャであるpipを使用してインストールすることもできます。

``` bash
pip install uv
```

その他にもいくつかの方法が公式サイトで紹介されているため、自分にあった方法でインストールしてください。

- [Installing uv - Astral](https://docs.astral.sh/uv/getting-started/installation/)

私は確か通常のコマンドラインでインストールしたと思います。

## uvの使用方法

### プロジェクトの初期化

プロジェクトのルートディレクトリで、以下のコマンドを実行して、uvのプロジェクトを初期化します。

``` bash
uv init
```

このコマンドで、プロジェクトのルートディレクトリに、以下のファイルが作成されます。

``` bash
├── .gitignore
├── .python-version
├── README.md
├── main.py
└── pyproject.toml
```

- `.gitignore`: Gitで管理しないファイルやディレクトリを指定するためのファイルです。
- `.python-version`: uvが管理するPythonのバージョンを指定するためのファイルです。
- `README.md`: プロジェクトの説明や使い方などを記載するためのファイルです。
- `main.py`: プロジェクトのメインのPythonファイルです。
- `pyproject.toml`: uvが管理するPythonのパッケージや依存関係を指定するためのファイルです。

### 仮想環境を作成する

プロジェクトのルートディレクトリで、以下のコマンドを実行して、仮想環境を作成します。

``` bash
uv venv
```

このコマンドで、プロジェクトのルートディレクトリに、`.venv`という名前の仮想環境が作成されます。

### パッケージを追加する

`uv add`コマンドを使用して、プロジェクトに必要なパッケージを追加します。

    uv add numpy

このコマンドで、`numpy`というパッケージがプロジェクトに追加されます。 追加されたパッケージは、`pyproject.toml`ファイルに記載されます。

### 仮想環境をアクティベートする

プロジェクトのルートディレクトリで、以下のコマンドを実行して、仮想環境をアクティベートします。

なお、アクティベートコマンドは、仮想環境作成時にターミナルに表示されるため、そのまま実行すれば問題ありません。

## Linux/Mac

``` bash
source .venv/bin/activate
```

## Windows

``` powershell
.venv\Scripts\activate
```

## 仮想環境内でコードを実行する

`.py`ファイルであれば、`uv run`コマンドを使用して、仮想環境内でコードを実行することができます。

``` bash
uv run main.py
```

もし[Positron](https://positron.posit.co/)などで`.qmd`ファイルを仮想環境内で簡単に実行したい場合は、以下のようにします。

1.  Positoronの右上にある、“Select Interpreter Session”をクリックします。
2.  “New Interpreter Session…”をクリックします。
3.  作成した仮想環境が表示されるので、選択します。
4.  通常通り、`.qmd`ファイルを実行します。

これで簡単に仮想環境内でコードを実行することができます。
