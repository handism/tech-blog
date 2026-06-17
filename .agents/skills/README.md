# Skills

このディレクトリには、プロジェクト専用のカスタムスキル定義を格納します。

## スキルの追加方法

特定の自動化タスクや固有ツール操作などの高度なスキルを定義する場合、以下のようにサブフォルダを配置します。

```
.agents/skills/
└── [skill-name]/
    ├── SKILL.md                 # YAML フロントマター（name, description 等）と指示書
    └── scripts/                 # スキル実行用スクリプト（Python, Bash 等）
```
