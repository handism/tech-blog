---
title: Dockerの基本概念とアーキテクチャ
date: 2026-06-20
order: 1
draft: false
---

Dockerは、アプリケーションを開発・デプロイ・実行するためのオープンソースのプラットフォームです。
「コンテナ」と呼ばれる独立した環境を利用することで、開発環境と本番環境の差異をなくし、どこでも同じように動作させることができます。

第1章では、Dockerがどのような仕組みで動いているのか、その「アーキテクチャ（構造）」を図解で分かりやすく解説します。

---

## 1. Dockerの全体像（3大要素）

Dockerのアーキテクチャは、主に以下の3つの役割に分かれています。

1. **Client（クライアント）**
   * 私たちがターミナルで入力する `docker` コマンド（CLI）です。ユーザーからの指示をDocker Daemonに送信します。
2. **Host（ホスト / Docker Daemon）**
   * 実際にコンテナやイメージを管理し、実行するサーバーです。裏で動いている本体（Daemon）や、ダウンロードされたイメージ、実行中のコンテナがここに存在します。
3. **Registry（レジストリ）**
   * Dockerイメージを保管・配布する場所です。デフォルトでは公式の「Docker Hub」が使われます。

---

## 2. アーキテクチャの相互関係（図解）

これら3つの要素がどのように連携して動くのか、Mermaidダイアグラムで表すと以下のようになります。

```mermaid
graph LR
  subgraph Client [Client (CLI)]
    C1[docker build]
    C2[docker pull]
    C3[docker run]
  end

  subgraph Host [Docker Host]
    D(Docker Daemon)
    
    subgraph LocalStorage [LocalStorage]
      I1[Images]
      I2[(Containers)]
    end
  end

  subgraph Registry [Registry (Docker Hub)]
    R[Official / Custom Images]
  end

  %% リレーション
  C1 -.->|1. ビルド要求| D
  C2 -.->|2. プル要求| D
  C3 -.->|3. 実行要求| D
  
  D <-->|イメージ検索 & ロード| R
  D -->|イメージ構築/保存| I1
  D -->|インスタンス化| I2
  I1 -->|ベースとなる| I2

  style Client fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a
  style Host fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#14532d
  style Registry fill:#faf5ff,stroke:#a855f7,stroke-width:2px,color:#581c87
```

### コマンドが実行されたときの流れ

* **`docker pull` を実行したとき**:
  1. Client から Host (Docker Daemon) へ「イメージが欲しい」というリクエストが飛びます。
  2. Daemon はローカルにイメージがない場合、Registry (Docker Hub) へアクセスしてイメージをダウンロード（プル）し、Host 内に保存します。

* **`docker run` を実行したとき**:
  1. Client から Daemon へ「コンテナを起動して」と指示します。
  2. Daemon は指定されたイメージを元に、Host 上で隔離された実行環境（コンテナ）を作成し、起動します。

---

## 3. なぜDockerを使うと「どこでも動く」のか？

従来の仮想マシン（VM）は、ハードウェアを仮想化し、その上で丸ごと「ゲストOS」を動かしていました。そのため、起動が遅く、動作も重いという課題がありました。

一方、Dockerは **ホストOSのカーネル（OSの心臓部）を共有** し、プロセスを隔離する技術（NamespacesやCgroupsなど）を使用します。これにより、OSを丸ごと起動する必要がなくなり、非常に軽量かつ高速に動作させることができます。

次のチャプターでは、よく混同される「イメージ」と「コンテナ」の違いについて、さらに深掘りして学びましょう！
