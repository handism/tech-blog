---
title: 今度はGitHub Copilot Proにも課金して初期設定する
date: 2026-04-03
tags: [AI, GitHub Copilot Pro]
category: AI
image: github-copilot-pro-introduction.webp
---

## GitHub Copilot Proとは

GitHub Copilot Proは、GitHubが提供するAIコーディングエージェントのCLIツール。  
単なるコード補完ではなく、ターミナルやVSCodeから自然言語で指示するだけでファイルの編集・作成・テスト実行・Git操作まで自律的にこなしてくれる。

いわゆる「バイブコーディング」（ノリで指示を投げて、AIに実装を任せるスタイル）を本格的にやりたくて課金してみた。

## GitHub Copilot Proに課金しました

GitHubのチャット画面の左下メニューから「プランをアップグレード」を選ぶと課金ページに移動できる。
プランはProとMaxがあるが、まずはProプランの月間契約にした。月20ドル。
クレカ情報を入力して完了。2026/4/3から課金開始。

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


### コミットメッセージ


### Issueの対応

これもCopilotをAssigeesに追加するだけ。CopilotがIssueを読んで、対応方法をコメントしてくれる。


### PRのレビュー依頼

簡単。ReviewersとしてCopilotをアサインするだけ。

もしくはReview PRのコマンドでPRのレビュー依頼ができる。





