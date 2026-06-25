# Langfuse on AWS - CloudFormation Template

## 概要

このCloudFormationテンプレートは、LangfuseをAWS上にデプロイするための完全なインフラストラクチャを構築します。ECS Fargate、RDS PostgreSQL、Application Load Balancerを使用した本番環境対応の構成です。

## アーキテクチャ

### 構成要素

- **VPC**: 10.0.0.0/16 CIDR、マルチAZ構成
- **Public Subnets**: ALBとECS Fargateタスク用（2つのAZ）
- **Private Subnets**: RDS PostgreSQL用（2つのAZ）
- **Application Load Balancer**: インターネット向けHTTP/HTTPSエンドポイント
- **ECS Fargate**: Langfuseコンテナのサーバーレス実行環境
- **RDS PostgreSQL 16.4**: マネージドデータベース（db.t4g.micro）
- **CloudWatch Logs**: アプリケーションログの集約
- **IAM Roles**: 最小権限の原則に基づく権限管理

## セキュリティのベストプラクティス

1. **ネットワーク分離**
   - データベースはプライベートサブネットに配置
   - セキュリティグループによる厳密なアクセス制御
   - パブリックアクセスの無効化

2. **データ保護**
   - RDS暗号化有効（保管時）
   - 自動バックアップ（7日間保持）
   - 削除保護有効
   - スナップショット作成（削除時）

3. **IAM**
   - ECSタスク実行ロールの最小権限
   - マネージドポリシーの使用

4. **監視**
   - CloudWatch Logsによるログ集約
   - CPU/メモリ使用率のアラーム
   - RDS PostgreSQLログのエクスポート

## デプロイ方法

### 前提条件

- AWS CLI がインストールされていること
- 適切なAWS認証情報が設定されていること
- 以下のシークレット値を準備：
  - データベースパスワード（16文字以上）
  - NextAuth Secret（32文字以上）
  - Salt（32文字以上）

### シークレットの生成

```bash
# ランダムな文字列を生成
openssl rand -base64 32

# または
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### デプロイコマンド

```bash
# パラメータファイルの作成
cat > parameters.json << EOF
[
  {
    "ParameterKey": "Environment",
    "ParameterValue": "prod"
  },
  {
    "ParameterKey": "DBUsername",
    "ParameterValue": "langfuse"
  },
  {
    "ParameterKey": "DBPassword",
    "ParameterValue": "YOUR_SECURE_PASSWORD_HERE"
  },
  {
    "ParameterKey": "NextAuthSecret",
    "ParameterValue": "YOUR_NEXTAUTH_SECRET_HERE"
  },
  {
    "ParameterKey": "Salt",
    "ParameterValue": "YOUR_SALT_HERE"
  }
]
EOF

# スタックの作成
aws cloudformation create-stack \
  --stack-name langfuse-production \
  --template-body file://iac/langfuse-on-aws.yaml \
  --parameters file://parameters.json \
  --capabilities CAPABILITY_IAM

# スタックの状態確認
aws cloudformation describe-stacks \
  --stack-name langfuse-production \
  --query 'Stacks[0].StackStatus'

# 出力値の取得
aws cloudformation describe-stacks \
  --stack-name langfuse-production \
  --query 'Stacks[0].Outputs'
```

### デプロイ後の確認

```bash
# ALBのDNS名を取得
ALB_DNS=$(aws cloudformation describe-stacks \
  --stack-name langfuse-production \
  --query 'Stacks[0].Outputs[?OutputKey==`LangfuseURL`].OutputValue' \
  --output text)

# ヘルスチェック
curl -I $ALB_DNS/api/public/health

# ブラウザでアクセス
echo "Langfuse URL: $ALB_DNS"
```

## パラメータ

| パラメータ | 説明 | デフォルト | 必須 |
|-----------|------|-----------|------|
| Environment | 環境名（dev/prod） | prod | No |
| DBUsername | データベースユーザー名 | langfuse | No |
| DBPassword | データベースパスワード | - | Yes |
| NextAuthSecret | NextAuth暗号化シークレット | - | Yes |
| Salt | APIキーハッシュ用Salt | - | Yes |

## 出力値

| 出力 | 説明 |
|------|------|
| LangfuseURL | LangfuseアプリケーションURL |
| DatabaseEndpoint | RDS PostgreSQLエンドポイント |
| ECSClusterName | ECSクラスター名 |
| ALBDNSName | ALBのDNS名 |

## コスト見積もり（月額）

### 最小構成（開発環境）
- **ECS Fargate**: 0.5 vCPU, 1GB RAM, 24時間稼働
  - 約 $15/月
- **RDS db.t4g.micro**: 20GB gp3ストレージ
  - 約 $15/月
- **Application Load Balancer**: 
  - 約 $16/月（基本料金）
- **データ転送**: 1GB/月
  - 約 $0.09/月
- **CloudWatch Logs**: 1GB/月
  - 約 $0.50/月

**合計: 約 $46.59/月**

### 本番環境（高可用性）
- **ECS Fargate**: 1 vCPU, 2GB RAM, 2タスク, 24時間稼働
  - 約 $60/月
- **RDS db.t4g.small**: 100GB gp3ストレージ、Multi-AZ
  - 約 $60/月
- **Application Load Balancer**: 
  - 約 $25/月
- **データ転送**: 100GB/月
  - 約 $9/月
- **CloudWatch Logs**: 10GB/月
  - 約 $5/月

**合計: 約 $159/月**

## カスタマイズ

### ECS Fargateのスケーリング

```yaml
ECSService:
  Properties:
    DesiredCount: 2  # タスク数を増やす
```

### RDSインスタンスタイプの変更

```yaml
PostgresDB:
  Properties:
    DBInstanceClass: db.t4g.small  # より大きなインスタンス
    AllocatedStorage: 100  # ストレージ容量を増やす
```

### Multi-AZ構成の有効化

```yaml
PostgresDB:
  Properties:
    MultiAZ: true  # 高可用性構成
```

### HTTPSの有効化

1. ACMで証明書を作成
2. ALBListenerを以下のように変更：

```yaml
ALBListener:
  Type: AWS::ElasticLoadBalancingV2::Listener
  Properties:
    LoadBalancerArn: !Ref ALB
    Port: 443
    Protocol: HTTPS
    Certificates:
      - CertificateArn: arn:aws:acm:region:account:certificate/xxx
    DefaultActions:
      - Type: forward
        TargetGroupArn: !Ref ALBTargetGroup
```

## 監視とアラーム

### CloudWatch Alarms

テンプレートには以下のアラームが含まれています：

- **HighCPUAlarm**: CPU使用率が80%を超えた場合
- **HighMemoryAlarm**: メモリ使用率が80%を超えた場合

### ログの確認

```bash
# ECSタスクのログを確認
aws logs tail /ecs/langfuse-production --follow

# RDSログの確認
aws rds describe-db-log-files \
  --db-instance-identifier langfuse-production-postgres
```

## トラブルシューティング

### ECSタスクが起動しない

1. CloudWatch Logsでエラーを確認
```bash
aws logs tail /ecs/langfuse-production --follow
```

2. タスク定義の環境変数を確認
3. セキュリティグループの設定を確認

### データベース接続エラー

1. セキュリティグループでECSからRDSへの接続を許可しているか確認
2. DATABASE_URL環境変数が正しいか確認
3. RDSエンドポイントが正しいか確認

```bash
# RDSエンドポイントの確認
aws rds describe-db-instances \
  --db-instance-identifier langfuse-production-postgres \
  --query 'DBInstances[0].Endpoint.Address'
```

### ALBヘルスチェック失敗

1. ターゲットグループのヘルスチェック設定を確認
2. ECSタスクが正常に起動しているか確認
3. セキュリティグループでALBからECSへの通信を許可しているか確認

## メンテナンス

### データベースバックアップ

自動バックアップは毎日03:00-04:00（UTC）に実行されます。

手動スナップショットの作成：
```bash
aws rds create-db-snapshot \
  --db-instance-identifier langfuse-production-postgres \
  --db-snapshot-identifier langfuse-manual-snapshot-$(date +%Y%m%d)
```

### アプリケーションの更新

```bash
# 新しいタスク定義を登録
aws ecs register-task-definition \
  --cli-input-json file://new-task-definition.json

# サービスを更新
aws ecs update-service \
  --cluster langfuse-production-cluster \
  --service langfuse-production-service \
  --task-definition langfuse-production-task:NEW_REVISION
```

## スタックの削除

```bash
# 削除保護を無効化（必要な場合）
aws rds modify-db-instance \
  --db-instance-identifier langfuse-production-postgres \
  --no-deletion-protection

# スタックの削除
aws cloudformation delete-stack \
  --stack-name langfuse-production

# 削除状態の確認
aws cloudformation describe-stacks \
  --stack-name langfuse-production \
  --query 'Stacks[0].StackStatus'
```

## セキュリティ推奨事項

1. **シークレット管理**
   - AWS Secrets Managerの使用を検討
   - パラメータファイルは.gitignoreに追加

2. **ネットワーク**
   - 本番環境ではHTTPSを必須化
   - WAFの導入を検討

3. **アクセス制御**
   - ALBにセキュリティグループで特定IPからのアクセスのみ許可
   - VPN経由でのアクセスを検討

4. **監視**
   - CloudWatch Dashboardの作成
   - SNSトピックでアラーム通知

## 参考資料

- [Langfuse Documentation](https://langfuse.com/docs)
- [ECS Fargate Pricing](https://aws.amazon.com/fargate/pricing/)
- [RDS Pricing](https://aws.amazon.com/rds/postgresql/pricing/)
- [Application Load Balancer Pricing](https://aws.amazon.com/elasticloadbalancing/pricing/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
