import { SERVICE_PRESETS, AWSNode, AWSSubgraph, AWSEdge } from './aws-diagram-data';

interface GenerateMermaidCodeParams {
  nodes: AWSNode[];
  subgraphs: AWSSubgraph[];
  edges: AWSEdge[];
  direction: 'TD' | 'LR';
}

/**
 * AWSリソースと接続関係 of AWS定義から、Mermaid.jsのDSLコードを生成します。
 */
export function generateMermaidCode({
  nodes,
  subgraphs,
  edges,
  direction,
}: GenerateMermaidCodeParams): string {
  let code = `flowchart ${direction}\n`;

  // 共通スタイルクラス定義
  code += `  %% スタイルクラス定義\n`;
  code += `  classDef vpc fill:#f1f5f9,stroke:#3b82f6,stroke-width:2px,stroke-dasharray:0;\n`;
  code += `  classDef pubSubnet fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,stroke-dasharray:5 5;\n`;
  code += `  classDef privSubnet fill:#f0f9ff,stroke:#0ea5e9,stroke-width:2px,stroke-dasharray:5 5;\n`;
  code += `  classDef ecsCluster fill:#fff7ed,stroke:#f97316,stroke-width:2px,stroke-dasharray:0;\n`;
  code += `  classDef generalGroup fill:#fafafa,stroke:#a3a3a3,stroke-width:1px,stroke-dasharray:0;\n`;

  // サブグラフの再帰描画ヘルパー
  const renderSubgraph = (sgId: string, indent: string): string => {
    const sg = subgraphs.find((s) => s.id === sgId);
    if (!sg) return '';

    let res = `${indent}subgraph ${sg.id} [" ${sg.name} "]\n`;

    // 子サブグラフ
    const childSgs = subgraphs.filter((s) => s.parentId === sgId);
    childSgs.forEach((child) => {
      res += renderSubgraph(child.id, indent + '  ');
    });

    // 所属ノード
    const sgNodes = nodes.filter((n) => n.subgraphId === sgId);
    sgNodes.forEach((node) => {
      const preset = SERVICE_PRESETS[node.type];
      const iconTag = preset
        ? `<img src='${preset.iconUrl}' width='32' height='32' style='vertical-align:middle;margin-bottom:4px;' /><br/>`
        : '';
      res += `${indent}  ${node.id}["${iconTag}<b>${node.name}</b>"]\n`;
      if (preset) {
        res += `${indent}  style ${node.id} fill:#ffffff,stroke:${preset.color},stroke-width:1.5px\n`;
      }
    });

    res += `${indent}end\n`;

    // クラス適用
    let sgClass = 'generalGroup';
    if (sg.type === 'VPC') sgClass = 'vpc';
    else if (sg.type === 'PublicSubnet') sgClass = 'pubSubnet';
    else if (sg.type === 'PrivateSubnet') sgClass = 'privSubnet';
    else if (sg.type === 'ECSCluster') sgClass = 'ecsCluster';

    res += `${indent}style ${sg.id} fill:none\n`;
    res += `${indent}class ${sg.id} ${sgClass}\n`;

    return res;
  };

  // トップレベルのサブグラフ
  const rootSgs = subgraphs.filter((s) => !s.parentId);
  rootSgs.forEach((sg) => {
    code += renderSubgraph(sg.id, '  ');
  });

  // グループ未所属（ルート）ノード
  const rootNodes = nodes.filter((n) => !n.subgraphId);
  if (rootNodes.length > 0) {
    code += `  %% ルートノード\n`;
    rootNodes.forEach((node) => {
      const preset = SERVICE_PRESETS[node.type];
      const iconTag = preset
        ? `<img src='${preset.iconUrl}' width='32' height='32' style='vertical-align:middle;margin-bottom:4px;' /><br/>`
        : '';
      code += `  ${node.id}["${iconTag}<b>${node.name}</b>"]\n`;
      if (preset) {
        code += `  style ${node.id} fill:#ffffff,stroke:${preset.color},stroke-width:1.5px\n`;
      }
    });
  }

  // 接続関係の出力
  if (edges.length > 0) {
    code += `  %% 接続関係\n`;
    edges.forEach((edge) => {
      let connector = '-->';
      if (edge.style === 'dashed') connector = '-.->';
      else if (edge.style === 'bold') connector = '==>';

      const labelPart = edge.label ? `|${edge.label}|` : '';
      code += `  ${edge.from} ${connector}${labelPart} ${edge.to}\n`;
    });
  }

  return code;
}
