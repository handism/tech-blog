---
title: 今度はGitHub Copilot Proにも課金して初期設定する
date: 2026-04-03
tags: [AI, GitHub Copilot Pro]
category: AI
image: github-copilot-pro-introduction.webp
---

## GitHub Copilot Proにも課金しました

Claude Code、すぐレート制限きちゃうわ…。もう週制限きてしまったのでGeminiとかAmazon Qとかの無料のやつを使ってなんとか凌いでいる…。  
来月からはもうGitHub Copilotに乗り換えることにした。メリットは以下と考えている。
* ①GitHub Copilot Coding Agent
	* これが良くて、Issue画面でCopilotをAssigneesでアサインするだけで勝手に対応してくれてPR作成してくれるのがまじ便利。
	* PRも同様に、アサインだけで勝手にRVしてくれるのが最強。仕事でもマジで無限に助けられてる。
	* これなら職場でもスマホから簡単に指示出しできてめっちゃ楽になるなぁ！
* ②コストが安い
	* これも良い。Claude Codeは毎月20ドルだけど、GitHubは10ドルで良い。しかも、Claude Codeはレート制限くると何もできなくなるのに対して、GitHubは弱いモデルなら無料で使い続けられるのが激アツすぎる。性能は落ちるけどVSCodeの拡張機能でのAgent開発はずっと続けられるってことですごくありがたい。
* ③コミットメッセージ自動生成が無料プランだと50回制限なのに、有料プランだと回数制限なし
* ④会社でも使用してるのでノウハウが共有できる

ってことで早速Proを契約した。月10ドル。クレカ情報を入力して完了。2026/4/3から課金開始した。

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

### まずはとりあえずinit

```sh
/init
```

### コミットメッセージ

VSCodeでGitのコミットメッセージを生成してくれるのがめっちゃ便利。  
無料プランだとすぐレート制限きてたけど、Proなら使い放題っぽい。


### Issueの対応

CopilotをAssigeesに追加するだけですごく簡単。  
CopilotがIssueを読んで、自動で対応してくれる。

### PRのレビュー依頼

これも簡単。ReviewersとしてCopilotをアサインするだけ。
もしくはReview PRのコマンドでPRのレビュー依頼ができる。  

## 感想

- 一旦はレート制限がなくなったので、開発のやめ時が無くなってしまった
- 性能はやっぱりClaude Codeの方が良かったので、今後は使い分けかなぁ
- 生成AIのリソースをあるものをうまくやりくりして使いこなすのが風来のシレンみたいで楽しい