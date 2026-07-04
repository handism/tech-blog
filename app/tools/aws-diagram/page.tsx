'use client';

import ToolPageLayout from '@/src/components/ToolPageLayout';
import { useState, useEffect, useMemo, useRef, useId } from 'react';
import {
  Cloud,
  Plus,
  Trash2,
  Download,
  Copy,
  Check,
  RefreshCw,
  Layers,
  Network,
  BookOpen,
  AlertCircle,
  FileCode,
} from 'lucide-react';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';
import type Mermaid from 'mermaid';

// 1. AWSアイコン & カラー プリセット定義
interface ServicePreset {
  type: string;
  label: string;
  category: string;
  iconUrl: string;
  color: string;
}

const SERVICE_PRESETS: Record<string, ServicePreset> = {
  EC2: {
    type: 'EC2',
    label: 'EC2 (仮想サーバー)',
    category: 'Compute',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/Compute/EC2.png',
    color: '#FF9900',
  },
  Lambda: {
    type: 'Lambda',
    label: 'Lambda (サーバーレス関数)',
    category: 'Compute',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/Compute/Lambda.png',
    color: '#FF9900',
  },
  ECS: {
    type: 'ECS',
    label: 'ECS (コンテナサービス)',
    category: 'Compute',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/Compute/ElasticContainerService.png',
    color: '#FF9900',
  },
  EKS: {
    type: 'EKS',
    label: 'EKS (Kubernetesサービス)',
    category: 'Compute',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/Compute/ElasticKubernetesService.png',
    color: '#FF9900',
  },
  S3: {
    type: 'S3',
    label: 'S3 (オブジェクトストレージ)',
    category: 'Storage',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/Storage/SimpleStorageService.png',
    color: '#3F8624',
  },
  EFS: {
    type: 'EFS',
    label: 'EFS (共有ファイルシステム)',
    category: 'Storage',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/Storage/ElasticFileSystem.png',
    color: '#3F8624',
  },
  RDS: {
    type: 'RDS',
    label: 'RDS (リレーショナルDB)',
    category: 'Database',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/Database/RDS.png',
    color: '#2E7D32',
  },
  DynamoDB: {
    type: 'DynamoDB',
    label: 'DynamoDB (NoSQL DB)',
    category: 'Database',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/Database/DynamoDB.png',
    color: '#2E7D32',
  },
  ElastiCache: {
    type: 'ElastiCache',
    label: 'ElastiCache (Redis/Memcached)',
    category: 'Database',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/Database/ElastiCache.png',
    color: '#2E7D32',
  },
  Aurora: {
    type: 'Aurora',
    label: 'Aurora (高性能DB)',
    category: 'Database',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/Database/Aurora.png',
    color: '#2E7D32',
  },
  VPC: {
    type: 'VPC',
    label: 'VPC (仮想ネットワーク)',
    category: 'Networking',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/NetworkingContentDelivery/VPC.png',
    color: '#8C4FFF',
  },
  APIGateway: {
    type: 'APIGateway',
    label: 'API Gateway',
    category: 'Networking',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/ApplicationIntegration/APIGateway.png',
    color: '#A166FF',
  },
  Route53: {
    type: 'Route53',
    label: 'Route 53 (DNSサービス)',
    category: 'Networking',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/NetworkingContentDelivery/Route53.png',
    color: '#8C4FFF',
  },
  CloudFront: {
    type: 'CloudFront',
    label: 'CloudFront (CDN)',
    category: 'Networking',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/NetworkingContentDelivery/CloudFront.png',
    color: '#8C4FFF',
  },
  ALB: {
    type: 'ALB',
    label: 'Application Load Balancer',
    category: 'Networking',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/NetworkingContentDelivery/ElasticLoadBalancing.png',
    color: '#8C4FFF',
  },
  SQS: {
    type: 'SQS',
    label: 'SQS (キューイング)',
    category: 'Integration',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/ApplicationIntegration/SimpleQueueService.png',
    color: '#FF4F8B',
  },
  SNS: {
    type: 'SNS',
    label: 'SNS (通知サービス)',
    category: 'Integration',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/ApplicationIntegration/SimpleNotificationService.png',
    color: '#FF4F8B',
  },
  IAM: {
    type: 'IAM',
    label: 'IAM (アクセス権管理)',
    category: 'Security',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/SecurityIdentityCompliance/IAM.png',
    color: '#D11D25',
  },
  Cognito: {
    type: 'Cognito',
    label: 'Cognito (ユーザー認証)',
    category: 'Security',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/SecurityIdentityCompliance/Cognito.png',
    color: '#D11D25',
  },
  CloudWatch: {
    type: 'CloudWatch',
    label: 'CloudWatch (監視)',
    category: 'Management',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/ManagementGovernance/CloudWatch.png',
    color: '#4B5E78',
  },
  SecretsManager: {
    type: 'SecretsManager',
    label: 'Secrets Manager',
    category: 'Security',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/SecurityIdentityCompliance/SecretsManager.png',
    color: '#D11D25',
  },
};

// 2. データ型定義
interface AWSNode {
  id: string;
  name: string;
  type: string;
  subgraphId?: string;
}

interface AWSSubgraph {
  id: string;
  name: string;
  type: 'VPC' | 'PublicSubnet' | 'PrivateSubnet' | 'ECSCluster' | 'General';
  parentId?: string;
}

interface AWSEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  style: 'solid' | 'dashed' | 'bold';
}

// 3. テンプレート（プリセット）定義
const TEMPLATES = {
  threeTier: {
    name: '3層Webシステム',
    description:
      'ALB、Webサーバー、RDSで構成されるAWSの最も典型的な3層システム。VPCとパブリック・プライベートサブネットで境界線を定義します。',
    subgraphs: [
      { id: 'vpc1', name: 'Production VPC (10.0.0.0/16)', type: 'VPC' as const },
      {
        id: 'pubsub1',
        name: 'Public Subnet (10.0.1.0/24)',
        type: 'PublicSubnet' as const,
        parentId: 'vpc1',
      },
      {
        id: 'privsub1',
        name: 'Private Subnet (10.0.2.0/24)',
        type: 'PrivateSubnet' as const,
        parentId: 'vpc1',
      },
    ],
    nodes: [
      { id: 'dns', name: 'Route 53 (DNS)', type: 'Route53' },
      { id: 'cdn', name: 'CloudFront (CDN)', type: 'CloudFront' },
      { id: 'alb', name: 'Application Load Balancer', type: 'ALB', subgraphId: 'pubsub1' },
      { id: 'web1', name: 'Web EC2 01', type: 'EC2', subgraphId: 'privsub1' },
      { id: 'web2', name: 'Web EC2 02', type: 'EC2', subgraphId: 'privsub1' },
      { id: 'db1', name: 'Aurora Master', type: 'RDS', subgraphId: 'privsub1' },
    ],
    edges: [
      { id: 'e1', from: 'dns', to: 'cdn', label: 'DNS Resolve', style: 'solid' as const },
      { id: 'e2', from: 'cdn', to: 'alb', label: 'HTTPS', style: 'solid' as const },
      { id: 'e3', from: 'alb', to: 'web1', label: 'HTTP / 80', style: 'solid' as const },
      { id: 'e4', from: 'alb', to: 'web2', label: 'HTTP / 80', style: 'solid' as const },
      { id: 'e5', from: 'web1', to: 'db1', label: 'SQL / 3306', style: 'dashed' as const },
      { id: 'e6', from: 'web2', to: 'db1', label: 'SQL / 3306', style: 'dashed' as const },
    ],
  },
  serverless: {
    name: 'サーバーレスAPI',
    description:
      'API Gateway、Lambda、DynamoDBで構築された、サーバー管理不要で高スケールなAPI構成。',
    subgraphs: [{ id: 'security_boundary', name: '認証バウンダリ', type: 'General' as const }],
    nodes: [
      { id: 'client', name: 'Client App', type: 'Route53' },
      { id: 'apigw', name: 'API Gateway', type: 'APIGateway' },
      { id: 'cognito', name: 'Cognito Auth', type: 'Cognito', subgraphId: 'security_boundary' },
      { id: 'auth_func', name: 'Authorizer Lambda', type: 'Lambda' },
      { id: 'data_func', name: 'Data Processor Lambda', type: 'Lambda' },
      { id: 'dynamodb', name: 'User DynamoDB', type: 'DynamoDB' },
      { id: 's3_bucket', name: 'Assets Bucket', type: 'S3' },
    ],
    edges: [
      { id: 'e1', from: 'client', to: 'apigw', label: 'HTTPS /api/*', style: 'solid' as const },
      { id: 'e2', from: 'apigw', to: 'cognito', label: 'Verify User', style: 'dashed' as const },
      {
        id: 'e3',
        from: 'apigw',
        to: 'auth_func',
        label: 'Custom Authorize',
        style: 'solid' as const,
      },
      { id: 'e4', from: 'apigw', to: 'data_func', label: 'Proxy Request', style: 'solid' as const },
      { id: 'e5', from: 'data_func', to: 'dynamodb', label: 'Read/Write', style: 'solid' as const },
      {
        id: 'e6',
        from: 'data_func',
        to: 's3_bucket',
        label: 'Upload File',
        style: 'dashed' as const,
      },
    ],
  },
  ecsContainers: {
    name: 'ECSコンテナ & キャッシュ',
    description:
      'Fargateコンテナで稼働するECSサービスと、データベースへのクエリ負荷を下げるためのRedisキャッシュ構成。',
    subgraphs: [
      { id: 'vpc', name: 'App VPC (172.16.0.0/16)', type: 'VPC' as const },
      { id: 'pub_sub', name: 'Public Subnet', type: 'PublicSubnet' as const, parentId: 'vpc' },
      {
        id: 'priv_sub',
        name: 'App Private Subnet',
        type: 'PrivateSubnet' as const,
        parentId: 'vpc',
      },
      {
        id: 'ecs_cluster',
        name: 'ECS Cluster (Fargate)',
        type: 'ECSCluster' as const,
        parentId: 'priv_sub',
      },
    ],
    nodes: [
      { id: 'alb', name: 'Public ALB', type: 'ALB', subgraphId: 'pub_sub' },
      { id: 'task1', name: 'Container Task 01', type: 'ECS', subgraphId: 'ecs_cluster' },
      { id: 'task2', name: 'Container Task 02', type: 'ECS', subgraphId: 'ecs_cluster' },
      { id: 'redis', name: 'Redis Cache', type: 'ElastiCache', subgraphId: 'priv_sub' },
      { id: 'db', name: 'Aurora Serverless', type: 'RDS', subgraphId: 'priv_sub' },
    ],
    edges: [
      { id: 'e1', from: 'alb', to: 'task1', label: 'Target Group', style: 'solid' as const },
      { id: 'e2', from: 'alb', to: 'task2', label: 'Target Group', style: 'solid' as const },
      { id: 'e3', from: 'task1', to: 'redis', label: 'Get Cache', style: 'solid' as const },
      { id: 'e4', from: 'task2', to: 'redis', label: 'Get Cache', style: 'solid' as const },
      { id: 'e5', from: 'task1', to: 'db', label: 'Read/Write', style: 'dashed' as const },
      { id: 'e6', from: 'task2', to: 'db', label: 'Read/Write', style: 'dashed' as const },
    ],
  },
};

// 4. 動的Mermaidプレビューコンポーネント
let mermaidLib: typeof Mermaid | null = null;

function MermaidPreview({ chartCode }: { chartCode: string }) {
  const [svgHtml, setSvgHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const rawId = useId();
  const uniqueId = useRef(`mermaid-${rawId.replace(/:/g, '')}`);

  useEffect(() => {
    let active = true;
    const renderChart = async () => {
      try {
        if (typeof window === 'undefined') return;

        if (!mermaidLib) {
          const m = (await import('mermaid')).default;
          m.initialize({
            startOnLoad: false,
            theme: 'neutral',
            securityLevel: 'loose',
            flowchart: {
              useMaxWidth: true,
              htmlLabels: true,
            },
          });
          mermaidLib = m;
        }

        const { svg } = await mermaidLib.render(uniqueId.current, chartCode);
        if (active) {
          setSvgHtml(svg);
          setError(null);
        }
      } catch (err) {
        console.error('Mermaid render error:', err);
        const badElement = document.getElementById(uniqueId.current);
        if (badElement) {
          badElement.remove();
        }
        if (active) {
          const errMsg = err instanceof Error ? err.message : String(err);
          setError(
            errMsg || 'レンダリングエラーが発生しました。接続定義やIDの重複を確認してください。'
          );
        }
      }
    };

    renderChart();

    return () => {
      active = false;
    };
  }, [chartCode]);

  if (error) {
    return (
      <div className="p-4 border-2 border-border bg-card text-text rounded-xl font-mono text-xs whitespace-pre-wrap">
        <div className="font-extrabold flex items-center gap-1.5 mb-2 text-sm text-red-500">
          <AlertCircle className="w-4 h-4" />
          <span>プレビュー生成エラー</span>
        </div>
        <p className="text-text/80 mb-3">
          接続関係やリソースIDなどに不整合がある可能性があります。
        </p>
        <div className="bg-slate-950 text-red-400 p-3 rounded-lg overflow-x-auto max-h-[150px]">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center p-6 bg-card border-2 border-border rounded-xl min-h-[350px] overflow-auto">
      {svgHtml ? (
        <div
          className="mermaid-preview-container w-full max-w-full flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-text/50 gap-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-xs font-bold">構成図を描画中...</span>
        </div>
      )}
    </div>
  );
}

// 5. メインページコンポーネント
export default function AwsDiagramPage() {
  const [activeTab, setActiveTab] = useState<'nodes' | 'subgraphs' | 'edges' | 'templates'>(
    'nodes'
  );

  // 状態データ
  const [nodes, setNodes] = useState<AWSNode[]>([]);
  const [subgraphs, setSubgraphs] = useState<AWSSubgraph[]>([]);
  const [edges, setEdges] = useState<AWSEdge[]>([]);
  const [direction, setDirection] = useState<'TD' | 'LR'>('TD');

  // 入力フォーム用状態
  // 1. ノード追加用
  const [nodeId, setNodeId] = useState('');
  const [nodeName, setNodeName] = useState('');
  const [nodeType, setNodeType] = useState('EC2');
  const [nodeSubId, setNodeSubId] = useState('');

  // 2. サブグラフ追加用
  const [sgId, setSgId] = useState('');
  const [sgName, setSgName] = useState('');
  const [sgType, setSgType] = useState<
    'VPC' | 'PublicSubnet' | 'PrivateSubnet' | 'ECSCluster' | 'General'
  >('VPC');
  const [sgParentId, setSgParentId] = useState('');

  // 3. 接続追加用
  const [edgeFrom, setEdgeFrom] = useState('');
  const [edgeTo, setEdgeTo] = useState('');
  const [edgeLabel, setEdgeLabel] = useState('');
  const [edgeStyle, setEdgeStyle] = useState<'solid' | 'dashed' | 'bold'>('solid');

  const { copied, copy } = useCopyToClipboard();

  // テンプレート適用処理
  const loadTemplate = (key: keyof typeof TEMPLATES) => {
    const t = TEMPLATES[key];
    setNodes(t.nodes);
    setSubgraphs(t.subgraphs);
    setEdges(t.edges);
  };

  // LocalStorage からの状態復元
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('handism_aws_diagram_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        requestAnimationFrame(() => {
          if (parsed.nodes) setNodes(parsed.nodes);
          if (parsed.subgraphs) setSubgraphs(parsed.subgraphs);
          if (parsed.edges) setEdges(parsed.edges);
          if (parsed.direction) setDirection(parsed.direction);
        });
      } catch (e) {
        console.error('復元に失敗しました。デフォルトをロードします。', e);
        requestAnimationFrame(() => {
          loadTemplate('threeTier');
        });
      }
    } else {
      requestAnimationFrame(() => {
        loadTemplate('threeTier'); // 初回デフォルト
      });
    }
  }, []);

  // 状態が変化した際の自動保存
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (nodes.length === 0 && subgraphs.length === 0 && edges.length === 0) return;

    const data = { nodes, subgraphs, edges, direction };
    localStorage.setItem('handism_aws_diagram_data', JSON.stringify(data));
  }, [nodes, subgraphs, edges, direction]);

  // 全リセット処理
  const handleClearAll = () => {
    if (window.confirm('現在の構成図を全てクリアしますか？')) {
      setNodes([]);
      setSubgraphs([]);
      setEdges([]);
      localStorage.removeItem('handism_aws_diagram_data');
    }
  };

  // リソース（ノード）の追加
  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeName.trim()) {
      alert('表示名を入力してください。');
      return;
    }

    let cleanId = nodeId.trim().replace(/[^a-zA-Z0-9_]/g, '');
    if (!cleanId) {
      const count = nodes.filter((n) => n.type === nodeType).length + 1;
      cleanId = `${nodeType.toLowerCase()}_${count}`;

      let uniqueId = cleanId;
      let suffix = 1;
      while (nodes.some((n) => n.id === uniqueId) || subgraphs.some((s) => s.id === uniqueId)) {
        uniqueId = `${cleanId}_${suffix}`;
        suffix++;
      }
      cleanId = uniqueId;
    } else {
      if (nodes.some((n) => n.id === cleanId) || subgraphs.some((s) => s.id === cleanId)) {
        alert('そのIDは既に使われています。一意のIDを指定してください。');
        return;
      }
    }

    const newNode: AWSNode = {
      id: cleanId,
      name: nodeName.trim(),
      type: nodeType,
      subgraphId: nodeSubId || undefined,
    };

    setNodes([...nodes, newNode]);
    // リセット
    setNodeId('');
    setNodeName('');
    setNodeSubId('');
  };

  // リソース（ノード）の削除
  const handleDeleteNode = (id: string) => {
    setNodes(nodes.filter((n) => n.id !== id));
    // 依存する接続線も削除
    setEdges(edges.filter((e) => e.from !== id && e.to !== id));
  };

  // グループ（サブグラフ）の追加
  const handleAddSubgraph = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sgId.trim() || !sgName.trim()) {
      alert('グループIDとグループ名を入力してください。');
      return;
    }

    const cleanId = sgId.trim().replace(/[^a-zA-Z0-9_]/g, '');
    if (subgraphs.some((s) => s.id === cleanId) || nodes.some((n) => n.id === cleanId)) {
      alert('そのIDは既に使われています。一意のIDを指定してください。');
      return;
    }

    const newSubgraph: AWSSubgraph = {
      id: cleanId,
      name: sgName.trim(),
      type: sgType,
      parentId: sgParentId || undefined,
    };

    setSubgraphs([...subgraphs, newSubgraph]);
    // リセット
    setSgId('');
    setSgName('');
    setSgParentId('');
  };

  // グループ（サブグラフ）の削除
  const handleDeleteSubgraph = (id: string) => {
    setSubgraphs(subgraphs.filter((s) => s.id !== id));
    // 削除されたグループに所属していたノードをルートレベルへ移動
    setNodes(nodes.map((n) => (n.subgraphId === id ? { ...n, subgraphId: undefined } : n)));
    // 削除されたグループを親に持っていたサブグラフをルートレベルへ移動
    setSubgraphs((prev) =>
      prev.map((s) => (s.parentId === id ? { ...s, parentId: undefined } : s))
    );
  };

  // 接続（エッジ）の追加
  const handleAddEdge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edgeFrom || !edgeTo) {
      alert('送信元と送信先のリソースを選択してください。');
      return;
    }
    if (edgeFrom === edgeTo) {
      alert('自身には接続できません。');
      return;
    }

    const newEdge: AWSEdge = {
      id: `edge_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      from: edgeFrom,
      to: edgeTo,
      label: edgeLabel.trim() || undefined,
      style: edgeStyle,
    };

    setEdges([...edges, newEdge]);
    // リセット
    setEdgeLabel('');
  };

  // 接続（エッジ）の削除
  const handleDeleteEdge = (id: string) => {
    setEdges(edges.filter((e) => e.id !== id));
  };

  // Mermaid DSL 生成ロジック
  const generatedCode = useMemo(() => {
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
  }, [nodes, subgraphs, edges, direction]);

  // SVGダウンロード処理
  const handleDownloadSvg = () => {
    const previewDiv = document.querySelector('.mermaid-preview-container svg');
    if (!previewDiv) {
      alert('構成図プレビューがまだ表示されていません。');
      return;
    }

    const svgString = new XMLSerializer().serializeToString(previewDiv);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `aws-architecture-diagram.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const handleCopyCode = () => {
    copy(generatedCode);
  };

  // ID自動作成用（useEffectを廃止し、handleAddNode側とUIプレースホルダー側で処理）

  return (
    <ToolPageLayout
      title="AWS Architecture Diagram Generator"
      description="フォーム操作だけで、境界線（VPCやサブネット）と主要AWSリソース、それらを結ぶネットワーク接続線をきれいに定義し、Mermaid.jsで美しい構成図を自動描画します。"
      icon={Cloud}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 左側：操作ペイン */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="theme-card p-5 md:p-6">
            {/* タブヘッダー */}
            <div className="flex border-b-2 border-border mb-5 overflow-x-auto scrollbar-none gap-2">
              <button
                onClick={() => setActiveTab('nodes')}
                className={`pb-2 text-xs md:text-sm font-extrabold whitespace-nowrap border-b-3 transition-colors ${
                  activeTab === 'nodes'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text/60 hover:text-text'
                }`}
              >
                📦 リソース
              </button>
              <button
                onClick={() => setActiveTab('subgraphs')}
                className={`pb-2 text-xs md:text-sm font-extrabold whitespace-nowrap border-b-3 transition-colors ${
                  activeTab === 'subgraphs'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text/60 hover:text-text'
                }`}
              >
                🛡️ グループ
              </button>
              <button
                onClick={() => setActiveTab('edges')}
                className={`pb-2 text-xs md:text-sm font-extrabold whitespace-nowrap border-b-3 transition-colors ${
                  activeTab === 'edges'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text/60 hover:text-text'
                }`}
              >
                ⚡ 接続線
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`pb-2 text-xs md:text-sm font-extrabold whitespace-nowrap border-b-3 transition-colors ${
                  activeTab === 'templates'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text/60 hover:text-text'
                }`}
              >
                📋 テンプレート
              </button>
            </div>

            {/* 各タブのコンテンツ */}
            {activeTab === 'nodes' && (
              <div className="space-y-6">
                <form onSubmit={handleAddNode} className="space-y-4">
                  <h3 className="text-sm font-extrabold text-text mb-2 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-accent" />
                    <span>リソースの追加</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-text/75 mb-1">
                        サービスタイプ
                      </label>
                      <select
                        value={nodeType}
                        onChange={(e) => {
                          setNodeType(e.target.value);
                          setNodeId(''); // IDを再生成させる
                        }}
                        className="w-full px-2.5 py-1.5 text-xs border-2 border-border rounded-lg bg-card text-text font-bold"
                      >
                        {Object.entries(SERVICE_PRESETS).map(([key, value]) => (
                          <option key={key} value={key}>
                            {key} ({value.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text/75 mb-1">
                        所属グループ
                      </label>
                      <select
                        value={nodeSubId}
                        onChange={(e) => setNodeSubId(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border-2 border-border rounded-lg bg-card text-text font-bold"
                      >
                        <option value="">(グループなし)</option>
                        {subgraphs.map((sg) => (
                          <option key={sg.id} value={sg.id}>
                            {sg.name} ({sg.type})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-text/75 mb-1">
                        リソースID (英数字・一意)
                      </label>
                      <input
                        type="text"
                        placeholder={`自動生成 (例: ${nodeType.toLowerCase()}_1)`}
                        value={nodeId}
                        onChange={(e) => setNodeId(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border-2 border-border rounded-lg bg-card text-text font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text/75 mb-1">表示名</label>
                      <input
                        type="text"
                        placeholder="例: Web Server 01"
                        value={nodeName}
                        onChange={(e) => setNodeName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border-2 border-border rounded-lg bg-card text-text font-bold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full theme-btn py-2 text-xs bg-accent text-white font-bold flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>リソースを追加</span>
                  </button>
                </form>

                {/* リソース一覧 */}
                <div className="border-t border-border pt-4">
                  <h4 className="text-xs font-extrabold text-text/60 mb-2">
                    配置済みのリソース ({nodes.length})
                  </h4>
                  {nodes.length === 0 ? (
                    <p className="text-xs text-text/40 font-bold py-3 text-center">
                      リソースがありません。上のフォームから追加してください。
                    </p>
                  ) : (
                    <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1">
                      {nodes.map((node) => {
                        const preset = SERVICE_PRESETS[node.type];
                        const sg = subgraphs.find((s) => s.id === node.subgraphId);
                        return (
                          <div
                            key={node.id}
                            className="flex items-center justify-between p-2.5 border border-border/60 rounded-xl bg-secondary/30 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              {preset && (
                                <img
                                  src={preset.iconUrl}
                                  alt={node.type}
                                  className="w-6 h-6 object-contain shrink-0"
                                />
                              )}
                              <div>
                                <div className="font-extrabold text-text flex items-center gap-1">
                                  <span>{node.name}</span>
                                  <span className="text-[10px] text-text/40 font-mono font-normal">
                                    ({node.id})
                                  </span>
                                </div>
                                <div className="text-[10px] text-text/60">
                                  {node.type} • {sg ? `${sg.name}内` : 'ルート'}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteNode(node.id)}
                              className="text-text/40 hover:text-red-500 p-1 transition-colors"
                              title="リソースを削除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'subgraphs' && (
              <div className="space-y-6">
                <form onSubmit={handleAddSubgraph} className="space-y-4">
                  <h3 className="text-sm font-extrabold text-text mb-2 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-accent" />
                    <span>グループ（境界線）の追加</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-text/75 mb-1">
                        グループタイプ
                      </label>
                      <select
                        value={sgType}
                        onChange={(e) => setSgType(e.target.value as AWSSubgraph['type'])}
                        className="w-full px-2.5 py-1.5 text-xs border-2 border-border rounded-lg bg-card text-text font-bold"
                      >
                        <option value="VPC">VPC (青実線)</option>
                        <option value="PublicSubnet">Public Subnet (緑破線)</option>
                        <option value="PrivateSubnet">Private Subnet (水色破線)</option>
                        <option value="ECSCluster">ECS Cluster (橙実線)</option>
                        <option value="General">その他グループ (グレー細線)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text/75 mb-1">
                        親グループ (ネスト用)
                      </label>
                      <select
                        value={sgParentId}
                        onChange={(e) => setSgParentId(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border-2 border-border rounded-lg bg-card text-text font-bold"
                      >
                        <option value="">(親なし)</option>
                        {subgraphs.map((sg) => (
                          <option key={sg.id} value={sg.id}>
                            {sg.name} ({sg.type})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-text/75 mb-1">
                        グループID (英数字・一意)
                      </label>
                      <input
                        type="text"
                        placeholder="例: vpc_prod"
                        value={sgId}
                        onChange={(e) => setSgId(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border-2 border-border rounded-lg bg-card text-text font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text/75 mb-1">
                        グループ名
                      </label>
                      <input
                        type="text"
                        placeholder="例: VPC (10.0.0.0/16)"
                        value={sgName}
                        onChange={(e) => setSgName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border-2 border-border rounded-lg bg-card text-text font-bold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full theme-btn py-2 text-xs bg-accent text-white font-bold flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>グループを追加</span>
                  </button>
                </form>

                {/* グループ一覧 */}
                <div className="border-t border-border pt-4">
                  <h4 className="text-xs font-extrabold text-text/60 mb-2">
                    配置済みのグループ ({subgraphs.length})
                  </h4>
                  {subgraphs.length === 0 ? (
                    <p className="text-xs text-text/40 font-bold py-3 text-center">
                      グループがありません。上のフォームから追加してください。
                    </p>
                  ) : (
                    <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1">
                      {subgraphs.map((sg) => {
                        const parent = subgraphs.find((p) => p.id === sg.parentId);
                        return (
                          <div
                            key={sg.id}
                            className="flex items-center justify-between p-2.5 border border-border/60 rounded-xl bg-secondary/30 text-xs"
                          >
                            <div>
                              <div className="font-extrabold text-text flex items-center gap-1">
                                <span>{sg.name}</span>
                                <span className="text-[10px] text-text/40 font-mono font-normal">
                                  ({sg.id})
                                </span>
                              </div>
                              <div className="text-[10px] text-text/60">
                                タイプ: {sg.type} {parent ? `• 親: ${parent.name}` : ''}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteSubgraph(sg.id)}
                              className="text-text/40 hover:text-red-500 p-1 transition-colors"
                              title="グループを削除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'edges' && (
              <div className="space-y-6">
                <form onSubmit={handleAddEdge} className="space-y-4">
                  <h3 className="text-sm font-extrabold text-text mb-2 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-accent" />
                    <span>接続関係の追加</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-text/75 mb-1">
                        送信元リソース (From)
                      </label>
                      <select
                        value={edgeFrom}
                        onChange={(e) => setEdgeFrom(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border-2 border-border rounded-lg bg-card text-text font-bold"
                      >
                        <option value="">(選択してください)</option>
                        {nodes.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.name} ({n.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text/75 mb-1">
                        送信先リソース (To)
                      </label>
                      <select
                        value={edgeTo}
                        onChange={(e) => setEdgeTo(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border-2 border-border rounded-lg bg-card text-text font-bold"
                      >
                        <option value="">(選択してください)</option>
                        {nodes.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.name} ({n.type})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-text/75 mb-1">
                        接続ラベル (任意)
                      </label>
                      <input
                        type="text"
                        placeholder="例: HTTPS / 443"
                        value={edgeLabel}
                        onChange={(e) => setEdgeLabel(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border-2 border-border rounded-lg bg-card text-text font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text/75 mb-1">
                        線のスタイル
                      </label>
                      <select
                        value={edgeStyle}
                        onChange={(e) => setEdgeStyle(e.target.value as AWSEdge['style'])}
                        className="w-full px-2.5 py-1.5 text-xs border-2 border-border rounded-lg bg-card text-text font-bold"
                      >
                        <option value="solid">実線 (──➔)</option>
                        <option value="dashed">破線 (- - ➔)</option>
                        <option value="bold">太線 (━━➔)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full theme-btn py-2 text-xs bg-accent text-white font-bold flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>接続を追加</span>
                  </button>
                </form>

                {/* 接続一覧 */}
                <div className="border-t border-border pt-4">
                  <h4 className="text-xs font-extrabold text-text/60 mb-2">
                    設定済みの接続線 ({edges.length})
                  </h4>
                  {edges.length === 0 ? (
                    <p className="text-xs text-text/40 font-bold py-3 text-center">
                      接続関係がありません。上のフォームから定義してください。
                    </p>
                  ) : (
                    <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1">
                      {edges.map((edge) => {
                        const fromNode = nodes.find((n) => n.id === edge.from);
                        const toNode = nodes.find((n) => n.id === edge.to);
                        return (
                          <div
                            key={edge.id}
                            className="flex items-center justify-between p-2.5 border border-border/60 rounded-xl bg-secondary/30 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-text">
                                {fromNode?.name || edge.from}
                              </span>
                              <span className="text-text/40 text-[10px] font-mono">
                                {edge.style === 'solid'
                                  ? '──➔'
                                  : edge.style === 'dashed'
                                    ? '- - ➔'
                                    : '━━➔'}
                              </span>
                              {edge.label && (
                                <span className="bg-secondary px-1.5 py-0.5 rounded text-[10px] font-bold border border-border">
                                  {edge.label}
                                </span>
                              )}
                              <span className="font-extrabold text-text">
                                {toNode?.name || edge.to}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeleteEdge(edge.id)}
                              className="text-text/40 hover:text-red-500 p-1 transition-colors"
                              title="接続を削除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-text mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-accent" />
                  <span>典型構成テンプレートの適用</span>
                </h3>
                <p className="text-xs text-text/70 mb-4 leading-relaxed font-medium">
                  テンプレートを選択して構成をロードできます。※現在の編集内容はクリアされます。
                </p>

                <div className="space-y-3">
                  {Object.entries(TEMPLATES).map(([key, t]) => (
                    <div
                      key={key}
                      className="border-2 border-border rounded-xl p-4 bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer group"
                      onClick={() => {
                        if (
                          window.confirm(
                            `${t.name}のテンプレートをロードしますか？（現在の編集データは上書きされます）`
                          )
                        ) {
                          loadTemplate(key as keyof typeof TEMPLATES);
                        }
                      }}
                    >
                      <h4 className="text-sm font-extrabold text-text group-hover:text-accent transition-colors flex items-center justify-between">
                        <span>{t.name}</span>
                        <span className="text-xs font-extrabold text-text/40 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                          適用 ➔
                        </span>
                      </h4>
                      <p className="text-[11px] text-text/75 mt-1.5 leading-relaxed font-medium">
                        {t.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* グローバル設定と操作 */}
          <div className="theme-card p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-text border-b border-border pb-1.5 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-accent" />
              <span>図面設定</span>
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text/75">レンダリング方向</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setDirection('TD')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 ${
                    direction === 'TD'
                      ? 'bg-accent border-accent text-white shadow-none'
                      : 'bg-card border-border text-text hover:bg-secondary'
                  }`}
                >
                  縦方向 (TD)
                </button>
                <button
                  onClick={() => setDirection('LR')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 ${
                    direction === 'LR'
                      ? 'bg-accent border-accent text-white shadow-none'
                      : 'bg-card border-border text-text hover:bg-secondary'
                  }`}
                >
                  横方向 (LR)
                </button>
              </div>
            </div>

            <button
              onClick={handleClearAll}
              className="w-full theme-btn py-2 text-xs bg-red-50 hover:bg-red-100 text-red-600 border-red-200 font-bold"
            >
              構成データをすべて初期化
            </button>
          </div>
        </div>

        {/* 右側：プレビュー ＆ コード出力 */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* プレビュー画面 */}
          <div className="theme-card p-5 md:p-6 flex flex-col min-h-[420px]">
            <h3 className="text-sm font-extrabold text-text border-b-2 border-border pb-2.5 flex items-center justify-between mb-4">
              <span className="flex items-center gap-1.5">
                <Network className="w-4 h-4 text-accent" />
                <span>構成図プレビュー</span>
              </span>
              <button
                onClick={handleDownloadSvg}
                className="theme-btn px-2.5 py-1 text-xs bg-secondary hover:bg-border text-text font-bold flex items-center gap-1"
                title="SVG形式でダウンロード"
              >
                <Download className="w-3.5 h-3.5" />
                <span>SVG保存</span>
              </button>
            </h3>

            {/* プレビュー本体 */}
            <div className="flex-1 flex flex-col">
              {nodes.length === 0 && subgraphs.length === 0 ? (
                <div className="flex-1 border-2 border-dashed border-border/40 rounded-xl bg-secondary/10 flex flex-col items-center justify-center text-center p-6 min-h-[300px]">
                  <Cloud className="w-10 h-10 text-text/20 mb-3" />
                  <p className="text-xs font-extrabold text-text/60">構成要素がありません</p>
                  <p className="text-[10px] text-text/40 max-w-[250px] mt-1">
                    左カラムからリソースやグループを追加するか、テンプレートをロードしてください。
                  </p>
                </div>
              ) : (
                <MermaidPreview chartCode={generatedCode} />
              )}
            </div>
          </div>

          {/* 自動生成されたMermaidコード */}
          <div className="theme-card p-5 md:p-6 flex flex-col h-[280px]">
            <h3 className="text-sm font-extrabold text-text border-b-2 border-border pb-2.5 flex items-center justify-between mb-4">
              <span className="flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-accent" />
                <span>生成された Mermaid コード</span>
              </span>
              <button
                onClick={handleCopyCode}
                className="theme-btn p-1.5 bg-secondary text-text flex items-center justify-center"
                title="コードをコピー"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-accent animate-scale-up" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </h3>
            <pre className="flex-1 w-full p-4 border-2 border-border rounded-xl font-mono text-[10px] leading-relaxed bg-slate-950 text-slate-100 overflow-y-auto whitespace-pre">
              {generatedCode}
            </pre>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
