---
title: Dockerfileの書き方とマルチステージビルド
date: 2026-06-20
order: 3
draft: false
---

コンテナイメージを自分で作成（ビルド）するには、**Dockerfile（ドッカーファイル）** と呼ばれる設定ファイルを使用します。

第3章では、Dockerfileの基本的な書き方から、イメージの容量を劇的に削減するテクニックである「マルチステージビルド」までを図解で分かりやすく学びます。

---

## 1. Dockerfileの基本命令

Dockerfileは、コンテナの「設計図」です。テキストファイルに上から順にコマンドを記述していくことで、独自のイメージを自動構築できます。

代表的な命令には以下のようなものがあります。

| 命令 | 役割 | 例 |
| :--- | :--- | :--- |
| `FROM` | ベースとなるイメージを指定（必須） | `FROM node:20-alpine` |
| `WORKDIR` | コンテナ内の作業ディレクトリを設定 | `WORKDIR /app` |
| `COPY` | ホスト（PC）のファイルをコンテナ内にコピー | `COPY package.json .` |
| `RUN` | イメージ構築時（ビルド時）にコマンドを実行 | `RUN npm install` |
| `CMD` | コンテナ起動時にデフォルトで実行するコマンド | `CMD ["npm", "start"]` |
| `EXPOSE` | コンテナが開放するポート番号（ドキュメント用） | `EXPOSE 3000` |

---

## 2. イメージレイヤーとビルドキャッシュの仕組み

Dockerfileの各命令（特に `RUN`、`COPY`、`ADD`）は、実行されるたびに **「イメージレイヤー」** と呼ばれる読み取り専用の層を作成します。

Dockerはビルドを高速化するため、**「変更がないレイヤーは前回のキャッシュを再利用する」** という仕組みを持っています。

### キャッシュを活かすDockerfileの書き方

例えば、ソースコードを変更するたびに `npm install` が走り直すとビルドが遅くなります。そのため、依存関係の定義ファイルだけを先にコピーしてインストールします。

```dockerfile:Dockerfile
# 良い例：キャッシュが効率的に使われる
FROM node:20-alpine
WORKDIR /app

# 先に依存関係をコピーしてインストール（package.jsonが変わらない限りキャッシュされる）
COPY package.json package-lock.json ./
RUN npm install

# その後にソースコード全体をコピー（コードの変更があってもnpm installはスキップされる）
COPY . .

CMD ["npm", "run", "dev"]
```

---

## 3. マルチステージビルド（Multi-stage Build）とは？

アプリケーションをビルドする際、コンパイルや依存ファイルのインストールには多くのツール（コンパイラ、npmパッケージなど）が必要ですが、**本番環境で実行する段階では不要なファイル** がたくさんあります。

**マルチステージビルド** は、一つのDockerfile内に複数の `FROM` を記述し、**「ビルド用の一時コンテナ」から「本番用の軽量コンテナ」へ最小限の成果物だけをコピーする** 技術です。

これにより、イメージサイズを小さく保ち、セキュリティリスク（余分なライブラリに含まれる脆弱性）を減らすことができます。

### マルチステージビルドの仕組み（図解）

```mermaid
graph TD
  subgraph BuildStage [1. ビルド用ステージ (node:20)]
    B_Base[ベース: node:20] --> B_Install[依存関係のインストール]
    B_Install --> B_Build[ビルド実行 (Next.js/Vite等)]
    B_Build --> B_Output[/app/out (HTML/CSS/JS)]
  end

  subgraph ProductionStage [2. 本番用ステージ (nginx:alpine)]
    P_Base[ベース: nginx:alpine] --> P_Copy[成果物のみをコピー]
    P_Output -->|COPY --from=build| P_Copy
    P_Copy --> P_Run[Nginxで軽量配信]
  end

  style BuildStage fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a
  style ProductionStage fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#14532d
```

### 具体的なDockerfileの例（Next.jsなどの静的ビルド配信）

```dockerfile:Dockerfile
# --- 1. ビルドステージ ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build # 静的ファイルを /app/out に出力

# --- 2. 本番実行ステージ ---
FROM nginx:alpine
# 前のステージ（builder）からビルドされたHTMLファイルだけをコピーして配置
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

この方法を使うと、本番イメージには Node.js や `node_modules` などが含まれず、Nginxと生成された静的ファイル（数MB〜数十MB程度）だけになるため、非常に軽量になります。

---

## まとめ

*   **Dockerfile** はコンテナの構築手順を記述した設計図。
*   変更頻度の低い命令（パッケージインストールなど）を上に書くことで、**ビルドキャッシュ** を効率よく使える。
*   **マルチステージビルド** を使うと、開発ツールを排除した「本番に必要な最小限のファイル」だけでイメージを作れるため、軽量かつ安全になる。

次は、複数のコンテナを組み合わせて動かす「Docker Compose」について学びましょう！
