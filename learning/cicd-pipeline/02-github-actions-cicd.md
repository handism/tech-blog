---
title: GitHub Actionsを用いたCIの実践
date: 2026-06-21
order: 2
draft: false
---

現代のWeb開発で最も人気のあるCI/CDプラットフォームの1つが **GitHub Actions** です。GitHubリポジトリと完全に統合されており、YAMLファイルで定義するだけで簡単に自動化処理を組み込むことができます。本章では、GitHub Actionsの基本概念と、実践的なCIパイプラインの記述方法を学びます。

---

## 1. GitHub Actions の主要概念

*   **ワークフロー (Workflows)**:
    リポジトリに設定する自動化プロセスの単位です。`.github/workflows/` ディレクトリ配下に YAML 形式で作成します。
*   **イベント (Events)**:
    ワークフローを実行するトリガー（きっかけ）です。例: 「コードが `main` ブランチにプッシュされた時」「プルリクエストが作成された時」。
*   **ジョブ (Jobs)**:
    同一の仮想マシン（ランナー）上で実行される、複数の「ステップ」の集まりです。複数のジョブはデフォルトで並列に実行されます。
*   **ステップ (Steps)**:
    実行される個々のタスクやコマンドです。
*   **アクション (Actions)**:
    よく使われる処理（Node.jsのセットアップやチェックアウトなど）を再利用可能なモジュールにしたものです。

---

## 2. 実践的なCIワークフローの例

以下は、Node.js プロジェクトにおいて、コードがプッシュされた際に自動的にコードフォーマット (Prettier) や 静的解析 (ESLint) を実行し、ユニットテストを通してビルドの成否をチェックする YAML 定義です。

```yaml:.github/workflows/ci.yml
name: Node.js CI

# ワークフローを実行するトリガー条件を指定
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  # ジョブ名「test-and-build」を定義
  test-and-build:
    # 実行環境として Ubuntu（最新版）の仮想マシンを使用
    runs-on: ubuntu-latest

    steps:
      # 1. リポジトリのコードを仮想マシンにチェックアウト（取得）
      - name: Checkout repository
        uses: actions/checkout@v4

      # 2. Node.js 環境をセットアップ
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm' # npm依存関係のキャッシュを有効化して高速化

      # 3. 依存パッケージのインストール
      - name: Install dependencies
        run: npm ci

      # 4. リンター（コードチェック）の実行
      - name: Run Lint
        run: npm run lint

      # 5. テストの実行
      - name: Run Tests
        run: npm run test:unit

      # 6. ビルドが通るかチェック
      - name: Run Build
        run: npm run build
```

---

## 3. パイプラインを高速化するテクニック

CIパイプラインは開発者が頻繁に待つことになるため、実行速度の最適化が非常に重要です。

*   **キャッシュ (Caching) の活用**:
    上記の `actions/setup-node` の `cache: 'npm'` のように、`node_modules` などの依存関係ファイルをキャッシュしておくことで、毎回の `npm install` の時間を劇的に（数分から数十秒へ）削減できます。
*   **並列ジョブ (Parallel Jobs)**:
    テストジョブと、静的チェックジョブを別々のJobに分割して並列実行させることで、全体の完了時間を短縮できます。

---

## まとめ

*   GitHub Actions の設定は **`.github/workflows/*.yml`** に記述する。
*   **ジョブ (Jobs)** は並列で走り、その中の **ステップ (Steps)** は順次コマンドを実行する。
*   **キャッシュ** などを駆使して、開発者を待たせない「高速なCIパイプライン」を維持することが重要である。
