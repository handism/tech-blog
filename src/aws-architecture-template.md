---
title: AWSで非機能要件を実現するには
date: 2024-05-21
tags: [AWS, Infrastructure]
image: many-clouds.webp
---


## 経緯

AWSでシステムを構築するにあたり、毎回1からアーキテクチャを考えるのは大変なので、個人的なテンプレートを作っておいてどんどん楽していきたい。

ここでは、各種非機能要件ごとにAWSでどう構築すべきかを考えていく。

## コスト削減

### コストのチェック
* AWS Budgets
* AWS Cost Explorer

まずはここら辺のサービスを見てコストをチェックしていく。

Billing Alertを設定しておくのもあり。

### インスタンスタイプの見直し

利用しているインスタンスが過剰スペックになっていないか確認。適切なサイズのインスタンスにスケールダウンすることでコストを削減できる。スポットインスタンスを利用することで、コストを大幅に削減することも可能。

開発環境だけRDSやECSのスペックを落とすってのもあり。


### リザーブドインスタンスやSavings Plansの活用

リザーブドインスタンス（RI）やSavings Plansを利用することで、1年や3年の契約を前提に大幅な割引を受けることができる。


### 未使用のリソースの整理

使用していないインスタンス、EBSボリューム、Elastic IPアドレス、スナップショットなどが残っていないか確認し、不要なものは削除。

また、開発環境は1AZ構成にするなども有効だし、使用しない夜間はEC2やRDSは停止しておくのもかなり有効な手段。


### ストレージの最適化

S3のストレージクラスを見直し、アクセス頻度に応じて適切なクラスにデータを移動することでコストを削減できる。

データのライフサイクルポリシーを設定し、古いデータを自動的に削除またはアーカイブすることも検討。



## AWSアカウント準備

* アカウント作成
* AWS Control Tower
  * ランディングゾーンの設定
* AWS CloudTrailの有効化
* IAMユーザーの作成
* AWS Organization


## コスト管理




## セキュリティ管理

* AWS Security Hubの有効化
* Amazon GuardDutyの有効化

* AWS Trusted Advisor

* Amazon CloudWatch
* AWS Systems Manager
* AWS Step Functions

* AWS WAF

* Amazon EventBridge