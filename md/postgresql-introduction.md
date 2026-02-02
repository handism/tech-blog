---
title: PostgreSQLに再入門する
date: 2026-01-28
tags: [PostgreSQL, DB]
category: Infrastructure
image: postgresql-introduction.webp
---

## 基本

### 全般

- SQLの大文字小文字は区別されない
- セミコロンまでがコマンドとして扱われる
- 文字列定数はシングルクォートで囲む
- DDL：データ定義言語
- DML：データ操作言語
- DCL：トランザクション制御のためのコマンド

### 内部構造

- ヒープ（Heap）：データ
- FSM（Free Space Map）：空き管理
- VM（Visibility Map）：見えるか管理

### インデックス

- データそのものは入っておらず、どこにあるかだけを高速に引ける機能のこと
- PostgreSQLの動き
  - インデックスを探す
  - 行の住所を得る
  - テーブル本体から行を読む
- Index Scan VS Index Only Scan
  - Index Scan：Heapも見る場合
  - Index Only Scan：Indexだけで完結するので早い
    - SELECT列が全部インデックスに含まれる場合はこっちになる
- 種類はいくつかある
  - B-tree：順序があるデータ向き（デフォルトはこれ）
    - 階層的な木構造で、データをソート済みで格納
  - BRIN：超軽量インデックス
  - GiST：普通の比較ができないデータ用
- インデックスが使われる基本条件
  - WHERE句にインデックス対象の列が含まれる
  - 対応するインデックスタイプと演算子の組み合わせであること
  - PostgreSQLがコストベースでインデックスを選択すると判断した場合
- 複合インデックスの順序
  - 左端一致：INDEX(a, b, c)の場合
    - aだけ
    - a, b
    - a, b, cの時に効きやすい（b単独では基本効かない）
  - 選択性の高い列を左に
  - 並び・ソート要件も考慮
- インデックスの利点
  - 高速検索
  - 重複防止
  - 統計情報改善
  - デッドロック回避
- インデックスの注意点
  - 書き込み性能の低下
    - HeapだけでなくIndexもUPDATEしなきゃいけないので、Index数が増えるほど地獄
  - ディスク使用量増加
  - 過剰なインデックス
  - ANALYZEの偏り
  - WHEREの関数化に注意
- インデックスのいらない判断
  - 使われていない：idx_scan = 0
  - 重複している
  - 更新頻度が高いが効果が薄い
  - JSONB乱立

### MVCC

- Multi Version Concurrency Control
- 更新すると、上書きしないで新しい行を作るっていう仕組み
  - 同時アクセスを壊さないため
  - インデックスもこの挙動になる

### VACUUMとautovacuum

- 死んだ行（Dead Taple）を回収して、再利用可能にする掃除のこと
- VACUUM：軽い、ロックほぼなし
- VACUUM FULL：超重い、EXCLUSIVE LOCK（本番環境で絶対使ってはいけない！！！）
- autovacuum：PostgreSQLが勝手に走らせるVACUUMのこと。一定条件で自動起動
  - デフォルトの動く条件は遅すぎるので、本番ではチューニング必須

### 実行計画

- EXPLAIN ANALYZEをつけると実行計画がわかる
- 見方
  - Scanの種類
    - Seq Scan：危険信号
    - Index Scan：OK
    - Bitmap Index Scan：行数多めだけどOK
  - actual time
  - rows：予想 vs 実際
- JOINは3種類を状況で自動選択
  - Nested Loop：少ない×インデックス
  - Hash Join：中〜大量
  - Merge Join：並び済み

### メジャーバージョンアップの方法

- 論理レプリケーションによる方法、サーバ停止時間は数秒でアップグレードできる
  - 移行元の古いメジャーバージョンをプライマリサーバ、移行先の新しいメジャーバージョンをスタンバイサーバとして論理レプリケーション
  - 新しいメジャーバージョンをプライマリに切り替え、移行元を停止
  - スイッチオーバ
