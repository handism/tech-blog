# Draw.io AWS 2026 アイコン運用ガイド

## Rule

- AWSサービス表現はAWS公式提供のAWS Architecture Icons（2026版）を使う
- 非公式アイコンや汎用図形での代替は、ユーザー明示許可がない限り行わない
- draw.io CLIを使ってSVGをエクスポートする（手動エクスポート不可）

---

## Workflow

### drawioファイルの作成（XML直書き）

**優先アプローチ：既存drawioを参考にXMLを改変する**

```bash
# 類似パターンを参照
cat aws-patterns/draw.io/serverless-api.drawio
cat aws-patterns/draw.io/multi-tenant-saas.drawio
```

新規作成時は [aws-shape-ids.md](aws-shape-ids.md) のshapeIDを使用してmxGraph XMLを生成する。

### mxGraph XML の基本構造

```xml
<mxfile host="app.diagrams.net" version="29.5.2">
  <diagram name="Architecture" id="unique-id">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- AWS Cloud境界 -->
        <mxCell id="aws-cloud" value="AWS Cloud"
          style="sketch=0;points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_aws_cloud;strokeColor=#AAB7B8;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#232F3E;fontStyle=1;fontSize=14;container=1;collapsible=0;recursiveResize=0;pointerEvents=0;"
          vertex="1" parent="1">
          <mxGeometry x="80" y="60" width="1040" height="660" as="geometry"/>
        </mxCell>

        <!-- Region境界 -->
        <mxCell id="region" value="Region (ap-northeast-1)"
          style="sketch=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_region;strokeColor=#00A4A6;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#147EBA;fontSize=12;dashed=1;container=1;collapsible=0;recursiveResize=0;pointerEvents=0;"
          vertex="1" parent="aws-cloud">
          <mxGeometry x="40" y="40" width="960" height="580" as="geometry"/>
        </mxCell>

        <!-- サービスアイコン例（Lambda） -->
        <mxCell id="lambda-1" value="Lambda Function"
          style="sketch=0;outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#ED7100;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.lambda_function;"
          vertex="1" parent="region">
          <mxGeometry x="300" y="200" width="60" height="60" as="geometry"/>
        </mxCell>

        <!-- エッジ（矢印） -->
        <mxCell id="edge-1" value="Invoke"
          style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=2;strokeColor=#545B64;fontSize=11;"
          edge="1" parent="region" source="source-id" target="lambda-1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### 境界レイヤーの座標設計ガイド

| 境界 | 推奨padding | 用途 |
|---|---|---|
| AWS Cloud | 外枠 | 全体を囲む最外郭 |
| Region | AWS Cloudから40px内側 | リージョン限定リソース |
| VPC | Regionから40px内側 | ネットワーク境界 |
| AZ (a/c) | VPCから30px内側 | AZ分散構成 |
| Public Subnet | AZの上半分 | Internet経由アクセス可 |
| Private Subnet | AZの下半分 | 内部のみ |

アイコンの推奨サイズ: 60×60px（ラベルはverticalLabelPosition=bottom）

---

## SVGエクスポート（必須コマンド）

drawioファイル完成後、必ず以下を実行する。

```bash
# 単一ファイルのエクスポート
drawio --export --format svg \
  --embed-diagram \
  --svg-theme light \
  --border 10 \
  --output "aws-patterns/img/<name>.drawio.svg" \
  "aws-patterns/draw.io/<name>.drawio"

# フォルダ内の一括エクスポート
drawio --export --format svg \
  --embed-diagram \
  --svg-theme light \
  --border 10 \
  --recursive \
  --output "aws-patterns/img/" \
  "aws-patterns/draw.io/"
```

**オプション解説:**

| オプション | 意味 |
|---|---|
| `--embed-diagram` | SVG内にmxGraph XMLを埋め込む（draw.io再編集可能） |
| `--svg-theme light` | 白背景で出力（ダーク/ライト自動切り替え対応） |
| `--border 10` | 図の周囲に10pxの余白 |

---

## Consistency Checks

- `iac/*.yaml` の主要リソースが `draw.io/*.drawio` に存在する
- 図の通信方向がCloudFormation設計と一致する
- SVGが `img/` に生成されていること
- `gallery-meta.json` の `diagramFile` が正しいファイル名になっていること
