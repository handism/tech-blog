# AWSベストプラクティス IaCリポジトリ

このリポジトリは、AWSの様々なアーキテクチャパターンをベストプラクティスに沿って実装した、Infrastructure as Code (IaC) のテンプレート集です。

## 概要

このリポジトリの目的は、一般的なAWSのユースケースに対して、すぐに利用できる、よく設計されたソリューションを提供することです。テンプレートはAWS CloudFormationで記述されており、セキュリティ、スケーラビリティ、コスト効率を考慮して設計されています。

## ディレクトリ構成

- `iac/`: 各アーキテクチャのCloudFormationテンプレートが格納されています。
- `draw.io/`: アーキテクチャ図の元ファイルが格納されています。
- `img/`: エクスポートされたアーキテクチャ図の画像が格納されています。

## 利用可能なアーキテクチャパターン

`iac`ディレクトリには、以下のアーキテクチャパターンのテンプレートが含まれています。

- **コンテナオーケストレーション**: Amazon ECSまたはEKSを使用してコンテナオーケストレーション環境をデプロイします。
- **コスト最適化サーバーレス**: API Gateway、Lambda、DynamoDBを使用してコスト最適化されたサーバーレスアプリケーションを実装します。
- **高可用性パターン**: 複数のアベイラビリティゾーンにまたがる高可用で耐障害性のあるアーキテクチャをセットアップします。
- **Langfuse on AWS**: AWS上にLangfuse可観測性プラットフォームをデプロイします。
- **マルチテナントSaaS**: Cognito、API Gateway、Lambda、DynamoDBを使用してテナント分離されたSaaSアプリケーションを構築します。
- **S3静的ウェブサイト**: Amazon S3とCloudFrontを使用して、セキュアでスケーラブルな静的ウェブサイトをホストします。
- **サーバーレスAPI**: API GatewayとLambdaを使用して標準的なサーバーレスAPIを作成します。
- **ストリーミングアーキテクチャ**: リアルタイムデータストリーミングアーキテクチャを構築します。
- **3層アーキテクチャ**: 古典的な3層ウェブアプリケーションをデプロイします。
- **VPC Latticeサービス間通信**: VPC Latticeを使用したサービス間通信を実証します。

## 利用方法

1.  `iac`ディレクトリに移動します。
2.  ユースケースに合ったテンプレートを選択します。
3.  AWSマネジメントコンソールまたはAWS CLIを使用してスタックをデプロイします。

### AWS CLIでのデプロイ例

```bash
aws cloudformation create-stack \
  --stack-name my-architecture-stack \
  --template-body file://iac/<template-name>.yaml \
  --parameters ParameterKey=MyParameter,ParameterValue=MyValue \
  --capabilities CAPABILITY_IAM
```

**注意:** 各テンプレートには固有のパラメータや要件があります。詳細については、`iac/README.md`内の各テンプレートのドキュメントや、テンプレートファイル自体を確認してください。

## Skills

この指示を再利用できるよう、以下のSkillを追加しています。

- Skill名: `$aws-themed-cfn-drawio`
- 定義: `skills/aws-themed-cfn-drawio/SKILL.md`
- 役割: 毎回ユーザーが指定するAWSアーキテクチャテーマに従って、CloudFormationとDraw.io図を整合して作成する
- 参照資料:
  - `skills/aws-themed-cfn-drawio/references/cost-checklist.md`
  - `skills/aws-themed-cfn-drawio/references/drawio-aws-2026.md`

### 指示出し方法

Skillを使うときは、プロンプト内でSkill名を明示し、あわせて今回のアーキテクチャテーマを渡します。

最短例:

```text
「高可用なWebアプリケーション構成」のテーマで$aws-themed-cfn-drawio を実行して。
```
