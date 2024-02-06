---
title: AWS新規構築の個人的アーキテクチャテンプレートを作成する
date: 2024-01-30
tags: [AWS, Infrastructure]
image: cloud-fantasy.webp
---


## 経緯

AWSでシステムを構築するにあたり、毎回1からアーキテクチャを考えるのは大変なので、個人的なテンプレートを作っておいてどんどん楽していきたい。


## 非機能要求グレードより


## 可用性

### 継続性

* 運用スケジュール
* 業務継続性
* 目標復旧水準
* 稼働率


### 耐障害性


### 災害対策




### 回復性

* 復旧作業
* 可用性確認



## 性能・拡張性

### 通常時の業務量

### 業務量増大度

### 



### 運用・保守性


### 移行性


### セキュリティ


### システム環境・エコロジー








## AWSアカウント準備

* アカウント作成
* AWS Control Tower
  * ランディングゾーンの設定
* AWS CloudTrailの有効化
* IAMユーザーの作成
* AWS Organization


## コスト管理

* AWS Budgets
* AWS Cost Explorer


## セキュリティ管理

* AWS Security Hubの有効化
* Amazon GuardDutyの有効化

* AWS Trusted Advisor

* Amazon CloudWatch
* AWS Systems Manager
* AWS Step Functions

* AWS WAF

* Amazon EventBridge