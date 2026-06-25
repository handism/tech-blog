# Common Skill Spec (Agent-Agnostic)

## Purpose

ユーザーが指定したテーマに従うAWS構成をCloudFormation (YAML) で作成し、同一構成のDraw.io図を公式AWS 2026アイコンで作る。

## Inputs

- architecture_theme: string
- workload_type: `api|batch|static|event`
- availability: `single-az|multi-az`
- traffic_level: `low|medium|high`
- data_retention_days: integer
- region: string (例: `ap-northeast-1`)
- constraints: free text

## Required Outputs

1. CloudFormation YAML: `iac/<name>.yaml`
2. Draw.io file: `draw.io/<name>.drawio`
3. Optional SVG export: `img/<name>.drawio.svg`
4. Summary（以下を含める）
- theme alignment decisions (3-7 points)
- best-practice source links (AWS official)
- icon usage note (AWS 2026)

## Workflow Contract

1. アーキテクチャテーマを最優先入力として扱い、未指定時は追加確認が必要
2. `aws-iac` サーバーが使える場合は優先利用する
3. CloudFormationは次を必須にする
- Parameters/Outputs
- least privilege IAM
- encryption at rest
- logs with retention
4. 最新要件がある場合はAWS公式一次情報を確認し、確認日を明記する
5. Draw.io図はIaCと1:1対応を担保する
6. AWSサービスは公式AWS 2026アイコンを使う
7. IaCと図の整合性チェックを実施する

## Non-Goals

- Terraform/CDK生成は対象外（明示依頼時のみ）
- 構成図の過度な装飾は対象外

## Quality Gates

- YAML構文エラーがない
- 主要リソース欠落がない
- 通信方向と境界が一致する
- テーマ反映の意図が説明されている
