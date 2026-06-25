# MCP Server on AWS

## 概要

このテンプレートは、Model Context Protocol (MCP) サーバーをAWS上にサーバーレスアーキテクチャで構築します。MCPは、AIモデルとアプリケーション間のコンテキスト共有を標準化するプロトコルです。

## アーキテクチャ

### 主要コンポーネント

- **API Gateway (REST API)**: クライアントからのHTTPSリクエストを受け付けるエントリーポイント
- **Lambda (ARM64)**: MCPプロトコルの処理ロジックを実行（Python 3.12）
- **DynamoDB**: セッション情報とコンテキストデータを管理（オンデマンド課金）
- **S3**: モデルアーティファクトやファイルを保存
- **CloudWatch Logs**: Lambda実行ログの保存（30日保持）
- **CloudWatch Alarm**: Lambda関数のエラー監視
- **IAM Role**: Lambda実行に必要な最小権限を付与

### アーキテクチャの特徴

1. **サーバーレス設計**: 常時起動リソースなし、使用量に応じた課金
2. **高可用性**: マネージドサービスによる自動スケーリングと冗長化
3. **セキュリティ**: 暗号化、最小権限IAM、パブリックアクセスブロック
4. **コスト最適化**: ARM64 Lambda、オンデマンドDynamoDB、S3ライフサイクル
5. **可観測性**: CloudWatch統合による包括的な監視

## デプロイ方法

### 前提条件

- AWS CLI がインストールされ、設定されていること
- 適切なIAM権限を持つAWSアカウント

### デプロイコマンド

```bash
aws cloudformation create-stack \
  --stack-name mcp-server-dev \
  --template-body file://iac/mcp-server.yaml \
  --parameters \
    ParameterKey=Environment,ParameterValue=dev \
    ParameterKey=LogRetentionDays,ParameterValue=30 \
  --capabilities CAPABILITY_NAMED_IAM \
  --region ap-northeast-1
```

### パラメータ

| パラメータ名 | 説明 | デフォルト値 | 許可値 |
|------------|------|------------|--------|
| Environment | 環境名 | dev | dev, staging, prod |
| LogRetentionDays | CloudWatch Logs保持期間（日） | 30 | 1, 3, 5, 7, 14, 30, 60, 90 |

## API仕様

### エンドポイント

```
POST https://{api-id}.execute-api.{region}.amazonaws.com/{environment}/mcp
```

### リクエスト例

#### セッション作成

```json
{
  "action": "create_session",
  "userId": "user123"
}
```

レスポンス:
```json
{
  "sessionId": "uuid-v4-string"
}
```

#### コンテキスト取得

```json
{
  "action": "get_context",
  "sessionId": "uuid-v4-string"
}
```

#### コンテキスト更新

```json
{
  "action": "update_context",
  "sessionId": "uuid-v4-string",
  "context": {
    "key": "value",
    "data": "..."
  }
}
```

## セキュリティ

### 実装済みセキュリティ対策

- ✅ S3バケット暗号化（AES256）
- ✅ S3パブリックアクセスブロック
- ✅ DynamoDB暗号化（SSE）
- ✅ DynamoDBポイントインタイムリカバリ
- ✅ 最小権限IAMロール
- ✅ API Gateway HTTPS通信
- ✅ Lambda実行ロールの分離

### 推奨される追加対策

- API Gateway認証（Cognito、Lambda Authorizer）
- WAF設定（レート制限、SQLインジェクション対策）
- VPC Endpoint経由のプライベート通信
- AWS Secrets Managerによる機密情報管理

## コスト最適化

### 実装済み最適化

1. **Lambda ARM64アーキテクチャ**: x86比で最大34%のコスト削減
2. **DynamoDBオンデマンド課金**: 予測不可能なトラフィックに最適
3. **S3ライフサイクルポリシー**: 90日後に自動削除
4. **CloudWatch Logs保持期間**: 30日に制限
5. **DynamoDB TTL**: 24時間後にセッション自動削除

### 想定コスト（月間）

低トラフィック（1万リクエスト/月）の場合:
- API Gateway: $0.035
- Lambda: $0.20
- DynamoDB: $0.25
- S3: $0.023
- CloudWatch: $0.50
- **合計: 約$1.00/月**

## 監視とアラート

### CloudWatch メトリクス

- Lambda実行時間
- Lambda エラー数
- API Gateway 4xx/5xx エラー
- DynamoDB 読み取り/書き込みキャパシティ

### アラーム

- Lambda エラー数が5分間で5回を超えた場合にアラート

## 運用

### スタック更新

```bash
aws cloudformation update-stack \
  --stack-name mcp-server-dev \
  --template-body file://iac/mcp-server.yaml \
  --parameters \
    ParameterKey=Environment,ParameterValue=dev \
    ParameterKey=LogRetentionDays,ParameterValue=30 \
  --capabilities CAPABILITY_NAMED_IAM
```

### スタック削除

```bash
# S3バケットを空にする
aws s3 rm s3://mcp-server-artifacts-{account-id}-{region} --recursive

# スタック削除
aws cloudformation delete-stack --stack-name mcp-server-dev
```

## トラブルシューティング

### Lambda関数のログ確認

```bash
aws logs tail /aws/lambda/mcp-processor-dev --follow
```

### DynamoDBテーブルの確認

```bash
aws dynamodb scan --table-name mcp-sessions-dev --limit 10
```

### API Gatewayのテスト

```bash
curl -X POST https://{api-id}.execute-api.{region}.amazonaws.com/dev/mcp \
  -H "Content-Type: application/json" \
  -d '{"action":"create_session","userId":"test-user"}'
```

## ベストプラクティス反映

### 2024年最新ベストプラクティス

1. **Lambda Python 3.12**: 最新ランタイムで性能向上
2. **ARM64アーキテクチャ**: コストとパフォーマンスの最適化
3. **DynamoDB PAY_PER_REQUEST**: 予測不可能なワークロードに最適
4. **API Gateway Proxy統合**: シンプルで保守性の高い統合方式
5. **CloudWatch統合トレーシング**: X-Rayによる分散トレーシング対応

### 参考資料

- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [API Gateway Best Practices](https://docs.aws.amazon.com/apigateway/latest/developerguide/best-practices.html)

## ライセンス

このテンプレートはMITライセンスの下で提供されています。
