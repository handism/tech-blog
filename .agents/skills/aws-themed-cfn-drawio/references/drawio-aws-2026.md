# Draw.io with Official AWS 2026 Icons

## Rule

- AWSサービス表現はAWS公式提供のAWS Architecture Icons（2026版）を使う
- 非公式アイコンや汎用図形での代替は、ユーザー明示許可がない限り行わない

## Workflow

1. AWS公式配布元からAWS 2026アイコンセットを取得する
2. Draw.io（diagrams.net）にライブラリとして取り込む
3. 作成図でAWSサービスは取り込んだアイコンのみを使う
4. レイヤー/グループで境界（Internet, AWS Cloud, Region, VPC, Subnet）を明確にする
5. 通信は矢印とラベル（HTTPS, Invoke, Read/Writeなど）で明示する

## Consistency Checks

- `iac/*.yaml` の主要リソースが `draw.io/*.drawio` に存在する
- 図の通信方向がCloudFormation設計と一致する
- 冗長な装飾より可読性を優先する（線交差を減らす）

## If Icon Pack Is Missing

- 取得済みのAWS 2026アイコンセットの場所をユーザーに確認する
- 入手できない場合は作図を保留し、必要ファイルの提供を依頼する
- 代替案を使う場合は「公式AWS 2026ではない」ことを明記する
