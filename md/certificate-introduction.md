---
title: SSL/TLS証明書関連の知識をまとめてみる
date: 2026-01-27
tags: [certificate]
category: Security
image: certificate-introduction.webp
---

## CA

- 証明書局のこと。インターネットの身元保証人
- DigiCert、GlobalSign、Let's Encrypt、Sectigo
- 階層構造がある
  - ルートCA：OS・ブラウザに直接デフォルトで入っていてMSとかAppleとかGoogleとかが管理してる、普段はオフラインでHSMで厳重管理
    - 中間CA：実際の発行業務を担当、侵害されても影響を限定できる、オンラインで運用可能
      - サーバー証明書（example.com）：Webサーバに限定
      - クライアント証明書
- 社内CAの場合
  - Active DirectoryのGPOとかMDMとか設定プロファイルで社内に配布できる
- Chrome/EdgeはOSの信頼ストアを使うのでOSに入れればOK、Firefoxだけ独自のルートストアなので要注意

## PKI

- Public Key Infrastructure
- 公開鍵暗号を社会インフラとして安全に使うための仕組み一式のこと
- 信頼の連鎖：OSやブラウザはルートCAだけ信頼すれば良い

## 証明書の違い

- SSL/TLS証明書（https用）：TLS通信で使われる証明書の総称。中身はほぼサーバー証明書
- サーバー証明書：「このサーバーは本物です」を示す。ブラウザが証明書を検証してWebサーバーにアクセス
  - WebサイトとかAPIとかロードバランサーとか
  - EKU（Extended Key Usage）：serverAuth
  - CN=example.com
- クライアント証明書：「このアクセスしてきた人（端末・アプリ）は誰か」を示す。クライアントが証明書をサーバに対して提示する
  - VPN接続とかmTLSとか
  - EKU：clientAuth
  - CN=device-123とか名前とか

- これらは全部「X.509」っていうフォーマット自体は同じだけど、用途に応じて用途制限が入ってる
  - フィールド構造が厳密なので実装差異が出にくい
  - ITU-T（国際電気通信連合）が出した「Xシリーズ勧告の509番目」という意味
    - Xシリーズ：データ通信・情報処理を扱うカテゴリ

## 本人確認

- DV：ドメイン認証
- OV：組織認証
- EV：拡張認証

## 実際の挙動

- ブラウザは
  - サーバー証明書
  - 中間CA証明書
  - ルートCA（ローカルに保存）
    - を検証して信頼の連鎖を確認

## OpenSSL

- 暗号と証明書（X.509）を扱うための、世界標準レベルの道具箱
- MacやLinuxにはデフォルトで入ってる、Windowsはデフォルトでは入ってない
  - WindowsはPowerShellとか別の手段がすでに入ってるので不要
- 暗号ライブラリとコマンドの両方の側面がある
  - 暗号アルゴリズム
  - TLS/SSLの実装
  - X.509証明書の処理
  - 鍵生成・署名・検証
