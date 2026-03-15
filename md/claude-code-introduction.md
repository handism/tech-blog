---
title: Claude Codeに課金して初期設定する
date: 2026-03-15
tags: [AI, Agent, Programming]
category: IT
image: claude-code-introduction.webp
---

## Claude Codeに課金しました

バイブコーディングに興味があって、色々AIエージェントを試してみているのだが、今回はClaude Codeに課金してみた。

Claudeのチャットの左下のメニューから「プランをアップグレード」で課金画面へ。  
Proプランで年間じゃなくて月間契約にしたので20ドル/月。  
クレカ情報とかを入力したら契約できた。

## Claude Codeをインストール

https://code.claude.com/docs/ja/quickstart

```sh
curl -fsSL https://claude.ai/install.sh | bash

or

brew install --cask claude-code
```

```sh
brew upgrade claude-code
```

## VSCodeにClaude Code拡張機能をインストール

「Claude.ai Subscription」ボタンを押す

## 使用方法

VSCodeのコマンドパレットから「Claude Code: New Conversation」を選択すると、チャットウィンドウが開く。

```sh
claude
```

チャットウィンドウで、質問や指示を入力すると、Claude Codeがコードの提案や説明を返してくれる。

初期設定

- Dark Mode
- Claude account with subscription
- Yes, use recommended settings
- Yes, I trust this folder

```sh
/statusline
/init
```

/initでCLAUDE.mdを自動生成可能
