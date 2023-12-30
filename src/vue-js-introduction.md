---
title: Vue.jsをあれこれ試してみる
tags: [vue, frontend]
---

## 前提
* npmのバージョン：10.2.3
* node.jsのバージョン：v20.10.0
* Vue.jsのバージョン：3.3.4
* Macを使用


## ①VSCodeの準備
入っていない場合はVSCodeをインストール  
https://code.visualstudio.com/download

### 拡張機能を入れる
* 日本語化
* Vue Language Features (Volar)


## ②Vue.jsのインストール
公式ページを参考にさせていただく。  
https://ja.vuejs.org/guide/quick-start.html

### Node.jsのインストール
https://nodejs.org/en  
`20.10.0 LTS`をインストール

### Vue.jsプロジェクトの作成
  
```zsh
mkdir git
cd git
npm create vue@latest
```

* Project nane: `[プロジェクト名]`
* 他は全部`Yes`
* `Testing Solution`は`Cypress`

### Vue.jsのインストール
ターミナルで以下のような感じで入力してVue.jsをインストールする。

```zsh
cd [プロジェクト名]
npm install
```

### ローカルで動作確認
開発中にローカルで動作確認したい場合は以下コマンドで。  
  
```zsh
npm run dev
```

`http://localhost:5173`でアプリにアクセスできる。めちゃくちゃお手軽！  
サーバーを止めるには`Ctrl + C`

コンソールにログを出したい場合は以下のような感じで。変数の値を確認したいときなどに便利。

```js
const tags = [tag1, tag2, tag3]
console.log(tags)
```


### 本番デプロイ
本番デプロイする場合は以下コマンド。  

```zsh
npm run build
```

`dist`フォルダ内に静的ファイルが生成されるので、中身をホスティングサーバにアップロードするだけ。

::: warning
ローカルの`file://`では動かないので注意。
:::

```zsh
npm run preview
```

`http://localhost:4173`で動作確認も可能。  
  

## ③コーディングする
ここからVue.jsのコーディングを開始する

::: tip
Vue.jsのスタイルガイドは以下。  
https://ja.vuejs.org/style-guide/
:::


### 組み込みコンポーネント

* component
* keep-alive
* transition
* transition-group
* slot
* teleport
* suspense


### 用途別ライブラリ

* ビルドツール：Vite（ヴィート）
* ルーティング、SPA：Vue Router
* データ集中管理：Pinia（ピーニャ）
* UI：Vuetify
* API送受信：axios
* SSG（静的サイトジェネレーション）：VitePress
* IDE：Volar


### その他勉強したいこと

* Composition API
* TypeScript
* ECMAScript
