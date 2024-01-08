---
title: AWS Certified SysOps Administrator - Associate認定を対策する
tags: [AWS, Infastructure]
image: cloud-fantasy.webp
---


## 経緯

この度、`AWS Certified SysOps Administrator - Associate`を受験すべく対策を行っていく。長いので以下`SOA`と呼ぶ。


## SOA試験について
* 試験時間130分、受験料150USD
* 試験方法はPearson VUE テストセンターまたはオンラインでの監督付き試験
* 本来は「試験ラボ」というフェーズがあるらしいけど、2023/03/28以降は一時的に含まれなくなっている
* 合格スコアは`720 / 1000`
* 試験対象は「クラウド
オペレーションの役割を担うシステムアドミニストレーター」で、取得すると、「AWS でのワークロードのデプロイ、管理、運用の経験
」が証明される


## SOAの試験対策

SOAの試験内容は以下の通り。分野ごとに対策していく。

```
第 1 分野: モニタリング、ロギング、および修復 (採点対象コンテンツの 20%)
第 2 分野: 信頼性と事業の継続性 (採点対象コンテンツの 16%)
第 3 分野: デプロイ、プロビジョニング、およびオートメーション (採点対象コンテンツの 18%)
第 4 分野: セキュリティとコンプライアンス (採点対象コンテンツの 16%)
第 5 分野: ネットワークとコンテンツ配信 (採点対象コンテンツの 18%)
第 6 分野: コストとパフォーマンスの最適化 (採点対象コンテンツの 12%)
```


### 第1分野：モニタリング、ロギング、および修復

* Amazon CloudWatch Logs
* AWS CloudTrailログ
* Amazon Simple Notification Service（SNS）
* Service Quotas
* AWS Health Events


### 第2分野：信頼性と事業の継続性

* AWS Auto Scaling
* キャッシュ
* Amazon RDS レプリカ
* 疎結合アーキテクチャ
* 水平スケーリング、垂直スケーリング
* ELB、Amazon Route 53ヘルスチェック
* マルチAZ
* 耐障害性（EFS、EIP）
* Route 53ルーティングポリシー
* バックアップ（AWS Backup、RDSスナップショット、Amazon Data Lifecycle Manager）
* クロスリージョンレプリケーション（CRR）
* DR



### 第3分野：デプロイ、プロビジョニング、およびオートメーション
デプロイやプロビジョニングの自動化…と聞いて真っ先に思い浮かぶのは`AWS CodePipeline`、`AWS CodeBuild`、`AWS CodeCommit`、`AWS CodeDeploy`らへんなんだけど、本試験では対象外。

AWSリソースのデプロイ自動化としては`AWS CloudFormation`が便利。Infrastructure as Code（IaC）という概念があり、インフラをコードで管理することで様々なメリットがある。

* 環境ごとに`手動によるミスなく`同じ内容のインフラを構築でき、環境ごとに差異を表現することも可能
* システムごとにコードを使いまわすことで設計・構築の`効率化`ができる
* コードを`Git`や`AWS CodeCommit`などで管理することによって
`履歴管理`ができ、差分も取りやすいので`レビューが容易`

CloudFormationには`リソース`、`テンプレート`、`スタック`の概念がある。

| リソース | テンプレート | スタック |
| --- | --- | --- |
| 構築対象のAWSインフラの単位のこと。 | インフラ構築の手続き内容を記載したコードのこと。YAMLやJSONで記載する。 | テンプレートを読み込ませて構築したリソースの集合体のこと。 |

* EC2 Image Builder
* CloudFormation StackSets
* Service Quotas
* Systems Manager
* EventBridge
* AWS Config

* ブルー/グリーンデプロイ
* ローリング
* Canary




### 第4分野：セキュリティとコンプライアンス

* IAM
* CloudTrail
* IAM Access Analyzer
* IAM Policy Simulator
* SCP
* AWS Trusted Advisor
* AWS Control Tower
* AWS Organizations
* KMS
* ACM
* AWS Secrets Manager
* Systems Manager
* AWS Security Hub
* Amazon GuardDuty
* AWS Config
* Amazon Inspector


### 第5分野：ネットワークとコンテンツ配信

* VPC
* Systems Manager Session Manager
* VPN
* AWS WAF
* AWS Shield
* Route 53
* Amazon CloudFront
* S3オリジンアクセスコントロール


### 第6分野：コストとパフォーマンスの最適化

* コスト割り当てタグ
* Trusted Advisor
* AWS Compute Optimizer
* AWS Cost Exploerer
* AWS Budgets
* EC2スポットインスタンス
* パフォーマンスメトリクス