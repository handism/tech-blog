---
title: VitePressで作った技術ブログをVuetifyでカスタマイズする
description: VitePressで作った技術ブログをVuetifyでカスタマイズする
---

[[toc]]

## 前提
* npmのバージョン：10.2.3
* node.jsのバージョン：v20.10.0
* Vue.jsのバージョン：3.3.4
* VitePressのバージョン：v1.0.0-rc.30
* 既にVitePressが構築できていることが前提
* Macを使用


## やりたいこと
前回、VitePressで技術ブログを自作したものの、まだまだ足りていない部分があるので追加していく。  

まずは、記事上部のタイトル表示をかっこよくし、カテゴリのリンクと更新日を表示するようにしたい。  


## カスタムテーマを作成する
参考：https://vitepress.dev/guide/custom-theme
↑を見る感じ、VitePressには「カスタムテーマ」という要素があるとのこと。  
どうやらWordPressの自作テーマのように、テーマをカスタマイズできる機能のようなので、実践していく。


## テーマエントリーファイル（index.mjs）を作成する
`.vitepress/theme/`に`index.mjs`を追加する。  
こちらが「テーマエントリーファイル」という要素で、ーーー


## デフォルトテーマを拡張する
参考：https://vitepress.dev/guide/extending-default-theme