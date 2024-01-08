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

SOAの試験内容は以下の通りとのこと。

```
第 1 分野: モニタリング、ロギング、および修復 (採点対象コンテンツの 20%)
第 2 分野: 信頼性と事業の継続性 (採点対象コンテンツの 16%)
第 3 分野: デプロイ、プロビジョニング、およびオートメーション (採点対象コンテンツの 18%)
第 4 分野: セキュリティとコンプライアンス (採点対象コンテンツの 16%)
第 5 分野: ネットワークとコンテンツ配信 (採点対象コンテンツの 18%)
第 6 分野: コストとパフォーマンスの最適化 (採点対象コンテンツの 12%)
```


## 試験対象のサービス

SOAの試験対象のサービスは、以下PDFに列記されているためそれごとに学んでいったほうが効率的。逆に対象外のサービスも列記されている。

https://d1.awsstatic.com/ja_JP/training-and-certification/docs-sysops-associate/AWS-Certified-SysOps-Administrator-Associate_Exam-Guide.pdf

デプロイやプロビジョニングの自動化…と聞いて真っ先に思い浮かぶのは`AWS CodePipeline`、`AWS CodeBuild`、`AWS CodeCommit`、`AWS CodeDeploy`らへんだったが、本試験では対象外とのこと。



### 分析

#### Amazon OpenSearch Service



### アプリケーション統合

#### Amazon EventBridge


#### Amazon Simple Notification Service (Amazon SNS)


#### Amazon Simple Queue Service (Amazon SQS)


### クラウド財務管理

#### AWS Cost and Usage Report


#### AWS Cost Explorer


#### Savings Plans


### コンピューティング

#### AWS Auto Scaling


#### Amazon EC2


#### Amazon EC2 Auto Scaling


#### Amazon EC2 Image Builder


#### AWS Lambda


### データベース

#### Amazon Aurora


#### Amazon DynamoDB


#### Amazon ElastiCache


#### Amazon RDS


### デベロッパーツール

#### AWS のツールと SDK



### マネジメントとガバナンス


#### AWS CLI


#### AWS CloudFormation

AWSリソースのデプロイ自動化としては`AWS CloudFormation`が便利。Infrastructure as Code（IaC）という概念があり、インフラをコードで管理することで様々なメリットがある。

* 環境ごとに`手動によるミスなく`同じ内容のインフラを構築でき、環境ごとに差異を表現することも可能
* システムごとにコードを使いまわすことで設計・構築の`効率化`ができる
* コードを`Git`や`AWS CodeCommit`などで管理することによって
`履歴管理`ができ、差分も取りやすいので`レビューが容易`

CloudFormationには`リソース`、`テンプレート`、`スタック`の概念がある。

| リソース | テンプレート | スタック |
| --- | --- | --- |
| 構築対象のAWSインフラの単位のこと。 | インフラ構築の手続き内容を記載したコードのこと。YAMLやJSONで記載する。 | テンプレートを読み込ませて構築したリソースの集合体のこと。 |


#### AWS CloudTrail


#### Amazon CloudWatch


#### AWS Compute Optimizer


#### AWS Config


#### AWS Control Tower


#### AWS Health Dashboard


#### AWS License Manager


#### AWS マネジメントコンソール


#### AWS Organizations


#### AWS Service Catalog


#### AWS Systems Manager


#### AWS Trusted Advisor



### 移行と転送

#### AWS DataSync


#### AWS Transfer Family


### ネットワークとコンテンツ配信

#### Amazon CloudFront


#### Elastic Load Balancing (ELB)


#### AWS Global Accelerator


#### Amazon Route 53


#### AWS Transit Gateway


#### Amazon VPC


#### AWS VPN


### セキュリティ、アイデンティティ、コンプライアンス

#### AWS Certificate Manager (ACM)


#### Amazon Detective


#### AWS Directory Service


#### AWS Firewall Manager


#### Amazon GuardDuty


#### AWS Identity and Access Management (IAM)


#### AWS Identity and Access Management Access Analyzer


#### Amazon Inspector


#### AWS Key Management Service (AWS KMS)


#### AWS Secrets Manager


#### AWS Security Hub


#### AWS Shield


#### AWS WAF



### ストレージ

#### AWS Backup


#### Amazon Elastic Block Store (Amazon EBS)


#### Amazon Elastic File System (Amazon EFS)


#### Amazon FSx


#### Amazon S3


#### Amazon S3 Glacier


#### AWS Storage Gateway