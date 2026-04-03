---
title: 今度はGitHub Copilot Proにも課金して初期設定する
date: 2026-04-03
tags: [AI, GitHub Copilot Pro]
category: AI
image: github-copilot-pro-introduction.webp
---

## GitHub Copilot Proにも課金しました

月10ドル。クレカ情報を入力して完了。2026/4/3から課金開始。

## GitHub Copilot Proをインストール

CLIのインストール方法は以下。

```sh
# Homebrewでインストール
brew install copilot-cli
```

アップデートは以下で実施。

```sh
brew upgrade copilot-cli
```

インストール後、ターミナルで `copilot` コマンドが使えるようになる。初回起動時にブラウザでGitHubアカウントの認証が行われる。

## モデルの選択

CLIは以下コマンドでモデルを選べる。

Copilotは、0xのモデルがあって、レート制限に引っかからず無限に使える。

```sh
/model
```

GPT-5 miniが0xなのでこれにする。

## 使い方

### ベストプラクティス

- **ツールは補助として使う**: Copilot の提案はそのまま受け入れず、必ず人間がレビューしてください。
- **プロンプトは明確に短く**: 目的・期待する出力・制約（言語・スタイル・テストの有無）を最初に書くと精度が上がります。
- **秘密情報を含めない**: トークンやパスワード、個人情報をプロンプトや公開リポジトリに書かないでください。
- **生成コードはlintとテストで検証**: 自動生成コードは `npm run lint`／`npm run test:unit` を実行して品質を確認してください。
- **小さなコミット単位で使う**: 生成や補助を使う場合は変更を小さく分け、差分レビューしやすくしてください。
- **レビュープロセスを維持**: PR レビューで Copilot 提案部分を重点的に確認し、セキュリティやパフォーマンス観点をチェックしてください。

### init

/init

### コミットメッセージ

### Issueの対応

これもCopilotをAssigeesに追加するだけ。CopilotがIssueを読んで、対応方法をコメントしてくれる。

### PRのレビュー依頼

簡単。ReviewersとしてCopilotをアサインするだけ。

もしくはReview PRのコマンドでPRのレビュー依頼ができる。
