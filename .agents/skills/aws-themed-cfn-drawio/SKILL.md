---
name: aws-themed-cfn-drawio
description: AWSアーキテクチャをCloudFormation(YAML)で設計し、そのIaCに対応するDraw.io構成図を作成する。ユーザーが指定したアーキテクチャのテーマに従って構成を作る必要があるとき、`aws-iac`サーバーの利用を求められたとき、最新ベストプラクティス反映を求められたとき、公式AWSアイコン（AWS 2026）を使った図面作成を求められたときに使う。
---

# AWS Themed CFN + Draw.io

## Goal

以下を一貫して作成する。

- `iac/<name>.yaml`: 指定テーマに沿ったCloudFormationテンプレート
- `draw.io/<name>.drawio`: テンプレートと整合したAWS構成図
- 必要に応じて `img/<name>.drawio.svg`: 図のエクスポート

## Workflow

1. 要件を短く確定する  
最初に以下を確認する。アーキテクチャテーマは必須入力として扱い、以降の設計と図面はそのテーマに従う。
- アーキテクチャテーマ
- ワークロード種別（API / バッチ / 静的配信 / イベント駆動）
- 可用性要件（単一AZ許容か、マルチAZ必須か）
- データ保持期間とバックアップ要件
- 想定トラフィック（低 / 中 / 高）

2. `aws-iac`サーバーを優先利用する  
`aws-iac`が利用可能なら、テンプレート骨子・パラメータ・リソース設計を取得して反映する。  
利用不可なら、このリポジトリの `iac/` 既存テンプレートを参考に自力で生成する。

3. CloudFormation YAMLを作成する  
以下を必ず満たす。
- YAMLで記述する
- Parameters / Outputs を定義する
- 最小権限IAM、暗号化、ログ保持を含める
- ユーザー指定テーマに沿った設計意図を反映する
- コスト最適化指定がある場合は [cost-checklist.md](references/cost-checklist.md) を併用する

4. 最新ベストプラクティスを確認する  
「最新」要件がある場合、生成前に一次情報（AWS公式ドキュメント）を確認する。  
回答では確認日を明示し、反映したポイントを箇条書きで示す。

5. Draw.io図を作成する  
IaCのリソース構成・通信経路と1:1対応する図を `draw.io/` に作成する。  
アイコンは公式AWSアイコン（AWS 2026）を使用する。手順は [drawio-aws-2026.md](references/drawio-aws-2026.md) を優先する。

6. 整合性チェックを実施する  
最低限以下を確認する。
- IaCにある主要リソースが図に存在する
- 図にある主要リソースがIaCに存在する
- 通信方向・公開境界（Internet/VPC/Subnet）が一致する

## Design Rules

- 構成判断は毎回のアーキテクチャテーマを最優先にする
- 明示されていない設計パラメータは、テーマと要件に矛盾しない妥当な既定値を採用する
- セキュリティ、可観測性、運用性はテーマに関係なく最低限確保する
- 将来拡張を考慮し、可能な範囲でパラメータ化する
- コスト最適化は常時前提にせず、要件に含まれる場合のみ強く最適化する

## Output Contract

作業完了時は以下を報告する。

1. 生成・更新したファイルパス
2. テーマへの反映要点（3-7項目）
3. 最新ベストプラクティス確認元（AWS公式URL）
4. 図で使用したAWS 2026アイコンの適用方法
5. 未解決事項（あれば）

## References

- コスト最適化チェック: [cost-checklist.md](references/cost-checklist.md)
- Draw.io + AWS 2026アイコン運用: [drawio-aws-2026.md](references/drawio-aws-2026.md)
- 共通仕様（エージェント非依存）: [common-spec.md](references/common-spec.md)
- エージェント別マッピング: [agent-mapping.md](references/agent-mapping.md)
