# Agent Mapping Guide

## Canonical Source

共通仕様は [common-spec.md](common-spec.md) を唯一の正本にする。  
各エージェント実装はこの正本へマッピングする。

## Codex

- Trigger: `$aws-themed-cfn-drawio`
- Skill body: `SKILL.md`
- UI metadata: `agents/openai.yaml`

## Claude Code

- 使い方: プロジェクトの `CLAUDE.md` または system prompt に共通仕様を貼る
- 推奨構成:
- section `Goal` <- common-spec `Purpose`
- section `Inputs` <- common-spec `Inputs`
- section `Workflow` <- common-spec `Workflow Contract`
- section `Quality Gates` <- common-spec `Quality Gates`

## Gemini (CLI / App)

- 使い方: reusable prompt/template として共通仕様を登録する
- 推奨: 入力スキーマを先頭に固定し、出力形式を箇条書きで固定する

## Amazon Q

- 使い方: カスタム指示またはプロジェクト規約に共通仕様を展開する
- 推奨: `aws-iac` サーバー優先、AWS公式一次情報確認、AWS 2026アイコン必須を明示する

## Portability Rules

- エージェント固有の呼び出し記法（`$skill-name` など）を正本に書かない
- 正本は「要件・入力・出力・品質ゲート」のみを定義する
- 具体的な起動コマンドはマッピング側に隔離する
