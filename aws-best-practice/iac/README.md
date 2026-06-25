# Cost-Optimized Serverless Architecture

## 概要

このCloudFormationテンプレートは、AWSのベストプラクティスに準拠した、コスト最適化されたサーバーレスアーキテクチャを構築します。

## アーキテクチャ

### 構成要素

- **API Gateway**: RESTful APIエンドポイント（リージョナル）
- **Lambda Function**: ARM64アーキテクチャ、Python 3.12ランタイム
- **DynamoDB**: オンデマンド課金モード
- **S3 Bucket**: ライフサイクルポリシー付き
- **CloudWatch**: ログとアラーム
- **IAM Role**: 最小権限の原則

## コスト最適化の特徴

1. **Lambda ARM64アーキテクチャ**: x86と比較して約20%のコスト削減
2. **DynamoDB オンデマンド課金**: 使用量に応じた課金で、予測不可能なワークロードに最適
3. **S3 ライフサイクルポリシー**:
   - 30日後: Standard-IA（低頻度アクセス）に移行
   - 90日後: Intelligent-Tiering に移行
4. **CloudWatch Logs 保持期間**: 7日間（開発環境向け）
5. **Lambda メモリ**: 最小の128MB
6. **API Gateway スロットリング**: 不要なコストを防ぐ

## セキュリティのベストプラクティス

1. **S3 暗号化**: AES256による暗号化
2. **S3 パブリックアクセスブロック**: すべてのパブリックアクセスをブロック
3. **DynamoDB 暗号化**: 保管時の暗号化が有効
4. **IAM 最小権限**: 必要最小限の権限のみを付与
5. **S3 バージョニング**: データ保護のため有効化
6. **DynamoDB ポイントインタイムリカバリ**: データ復旧機能

## デプロイ方法

### 前提条件

- AWS CLI がインストールされていること
- 適切なAWS認証情報が設定されていること

### デプロイコマンド

```bash
# スタックの作成
aws cloudformation create-stack \
  --stack-name cost-optimized-serverless \
  --template-body file://iac/cost-optimized-serverless.yaml \
  --parameters ParameterKey=Environment,ParameterValue=dev \
  --capabilities CAPABILITY_IAM

# スタックの状態確認
aws cloudformation describe-stacks \
  --stack-name cost-optimized-serverless

# スタックの更新
aws cloudformation update-stack \
  --stack-name cost-optimized-serverless \
  --template-body file://iac/cost-optimized-serverless.yaml \
  --parameters ParameterKey=Environment,ParameterValue=prod \
  --capabilities CAPABILITY_IAM

# スタックの削除
aws cloudformation delete-stack \
  --stack-name cost-optimized-serverless
```

## 出力値

デプロイ後、以下の値が出力されます：

- **ApiEndpoint**: API GatewayのエンドポイントURL
- **BucketName**: S3バケット名
- **TableName**: DynamoDBテーブル名
- **LambdaFunctionArn**: Lambda関数のARN

## パラメータ

- **Environment**: 環境名（dev または prod）
  - デフォルト: dev

## 監視とアラーム

- **Lambda エラーアラーム**: 5分間で5回以上のエラーが発生した場合にアラート

## コスト見積もり（月額）

### 開発環境（低トラフィック）
- API Gateway: 100万リクエスト = $3.50
- Lambda: 100万リクエスト（128MB、100ms） = $0.20
- DynamoDB: 100万読み取り/書き込み = $1.25
- S3: 10GB ストレージ = $0.23
- CloudWatch Logs: 1GB = $0.50

**合計: 約 $5.68/月**

### 本番環境（中トラフィック）
- API Gateway: 1000万リクエスト = $35.00
- Lambda: 1000万リクエスト = $2.00
- DynamoDB: 1000万読み取り/書き込み = $12.50
- S3: 100GB ストレージ = $2.30
- CloudWatch Logs: 10GB = $5.00

**合計: 約 $56.80/月**

## カスタマイズ

### Lambda メモリの調整

```yaml
ApiFunction:
  Properties:
    MemorySize: 256  # 128から256に変更
```

### ログ保持期間の変更

```yaml
ApiLogGroup:
  Properties:
    RetentionInDays: 30  # 7から30に変更
```

### DynamoDB を プロビジョニングモードに変更

```yaml
DataTable:
  Properties:
    BillingMode: PROVISIONED
    ProvisionedThroughput:
      ReadCapacityUnits: 5
      WriteCapacityUnits: 5
```

## トラブルシューティング

### Lambda関数がDynamoDBにアクセスできない

IAMロールの権限を確認してください。LambdaExecutionRoleにDynamoDBへのアクセス権限が付与されているか確認します。

### API Gatewayが502エラーを返す

Lambda関数のログをCloudWatch Logsで確認してください。関数のタイムアウトやメモリ不足の可能性があります。

## 参考資料

- [AWS Lambda Pricing](https://aws.amazon.com/lambda/pricing/)
- [DynamoDB Pricing](https://aws.amazon.com/dynamodb/pricing/)
- [S3 Pricing](https://aws.amazon.com/s3/pricing/)
- [API Gateway Pricing](https://aws.amazon.com/api-gateway/pricing/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
