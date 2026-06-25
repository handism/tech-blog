# Cost Checklist for AWS CloudFormation

## Core

- サーバーレス優先（Lambda, API Gateway, DynamoDB, S3）
- 常時起動リソース（EC2, NAT Gateway, 常設ECS）を必要時のみ採用
- マルチAZは要件ベースで有効化（不要なら単一AZで開始）
- 開発/検証環境は停止可能設計にする

## Compute

- LambdaはARM64を検討する
- Lambdaメモリ/タイムアウトを最小から調整する
- Provisioned ConcurrencyはSLO要件がある場合のみ有効化する
- コンテナ採用時はFargate Spotやオートスケーリングを検討する

## Data

- DynamoDBはオンデマンド課金を初期値とする
- S3 LifecycleでIA/Glacier移行と期限削除を設定する
- 不要なレプリケーションや高頻度バックアップを避ける
- 暗号化は有効化しつつKMSキー設計を過剰化しない

## Network

- 外向き通信要件がなければNAT Gatewayを避ける
- CloudFrontキャッシュを使ってオリジン負荷を削減する
- データ転送課金（AZ間/リージョン間/インターネット向け）を明示する

## Observability

- CloudWatch Logs保持期間を要件最小にする（例: 7-30日）
- メトリクス/アラームは重要SLOに絞る
- 高コストな詳細ログは必要期間だけ有効化する

## Governance

- タグ（Owner, Env, CostCenter, System）を必須化する
- AWS Budgetsとアラート通知を追加する
- 予算・上限・削除ポリシーをOutputsまたはREADMEに明記する
