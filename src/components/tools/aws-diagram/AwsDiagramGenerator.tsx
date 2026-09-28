'use client';

import { useState } from 'react';
import { useNotice } from '@/src/components/NoticeProvider';
import { downloadText } from '@/src/lib/download';
import {
  ArrowRight,
  BookOpen,
  Clipboard,
  Cloud,
  Download,
  FileCode,
  Layers,
  Network,
  Package,
  Plus,
  Shield,
  Trash2,
  Zap,
} from 'lucide-react';
import CopyButton from '@/src/components/CopyButton';

import { SERVICE_PRESETS, AWSSubgraph, AWSEdge, TEMPLATES } from './aws-diagram-data';
import MermaidPreview from './MermaidPreview';
import { useAwsDiagram, type TemplateKey } from './useAwsDiagram';

type EditorTab = 'nodes' | 'subgraphs' | 'edges' | 'templates';

const EDITOR_TABS: { id: EditorTab; label: string; icon: typeof Package }[] = [
  { id: 'nodes', label: 'リソース', icon: Package },
  { id: 'subgraphs', label: 'グループ', icon: Shield },
  { id: 'edges', label: '接続線', icon: Zap },
  { id: 'templates', label: 'テンプレート', icon: Clipboard },
];

export default function AwsDiagramGenerator() {
  const { notify, confirm } = useNotice();
  const [activeTab, setActiveTab] = useState<EditorTab>('nodes');

  const {
    nodes,
    subgraphs,
    edges,
    direction,
    setDirection,
    generatedCode,
    loadTemplate,
    clearAll,
    addNode,
    deleteNode,
    addSubgraph,
    deleteSubgraph,
    addEdge,
    deleteEdge,
  } = useAwsDiagram();

  // 入力フォーム用状態
  // 1. ノード追加用
  const [nodeId, setNodeId] = useState('');
  const [nodeName, setNodeName] = useState('');
  const [nodeType, setNodeType] = useState('EC2');
  const [nodeSubId, setNodeSubId] = useState('');

  // 2. サブグラフ追加用
  const [sgId, setSgId] = useState('');
  const [sgName, setSgName] = useState('');
  const [sgType, setSgType] = useState<AWSSubgraph['type']>('VPC');
  const [sgParentId, setSgParentId] = useState('');

  // 3. 接続追加用
  const [edgeFrom, setEdgeFrom] = useState('');
  const [edgeTo, setEdgeTo] = useState('');
  const [edgeLabel, setEdgeLabel] = useState('');
  const [edgeStyle, setEdgeStyle] = useState<AWSEdge['style']>('solid');

  // 全リセット処理
  const handleClearAll = async () => {
    if (await confirm('現在の構成図を全てクリアしますか？', { destructive: true })) {
      clearAll();
    }
  };

  // リソース（ノード）の追加
  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    const result = addNode({ id: nodeId, name: nodeName, type: nodeType, subgraphId: nodeSubId });
    if (!result.ok) {
      notify(result.error, 'error');
      return;
    }
    setNodeId('');
    setNodeName('');
    setNodeSubId('');
  };

  // グループ（サブグラフ）の追加
  const handleAddSubgraph = (e: React.FormEvent) => {
    e.preventDefault();
    const result = addSubgraph({ id: sgId, name: sgName, type: sgType, parentId: sgParentId });
    if (!result.ok) {
      notify(result.error, 'error');
      return;
    }
    setSgId('');
    setSgName('');
    setSgParentId('');
  };

  // 接続（エッジ）の追加
  const handleAddEdge = (e: React.FormEvent) => {
    e.preventDefault();
    const result = addEdge({ from: edgeFrom, to: edgeTo, label: edgeLabel, style: edgeStyle });
    if (!result.ok) {
      notify(result.error, 'error');
      return;
    }
    setEdgeLabel('');
  };

  // SVGダウンロード処理
  const handleDownloadSvg = () => {
    const previewSvg = document.querySelector('.mermaid-preview-container svg');
    if (!previewSvg) {
      notify('構成図プレビューがまだ表示されていません。', 'error');
      return;
    }

    const svgString = new XMLSerializer().serializeToString(previewSvg);
    downloadText(svgString, 'aws-architecture-diagram.svg', 'image/svg+xml;charset=utf-8');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* 左側：操作ペイン */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="theme-card p-5 md:p-6">
          {/* タブヘッダー */}
          <div className="flex border-b-2 border-border mb-5 overflow-x-auto scrollbar-none gap-2">
            {EDITOR_TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`pb-2 text-xs md:text-sm font-extrabold whitespace-nowrap border-b-3 transition-colors ${
                  activeTab === id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text/60 hover:text-text'
                }`}
              >
                <Icon className="w-4 h-4 inline-block align-[-0.15em] mr-1" /> {label}
              </button>
            ))}
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
                            onClick={() => deleteNode(node.id)}
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
                    <label className="block text-xs font-bold text-text/75 mb-1">グループ名</label>
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
                            onClick={() => deleteSubgraph(sg.id)}
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
                      <option value="solid">実線 (──→)</option>
                      <option value="dashed">破線 (- - →)</option>
                      <option value="bold">太線 (━━→)</option>
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
                                ? '──→'
                                : edge.style === 'dashed'
                                  ? '- - →'
                                  : '━━→'}
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
                            onClick={() => deleteEdge(edge.id)}
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
                    onClick={async () => {
                      if (
                        await confirm(
                          `${t.name}のテンプレートをロードしますか？（現在の編集データは上書きされます）`
                        )
                      ) {
                        loadTemplate(key as TemplateKey);
                      }
                    }}
                  >
                    <h4 className="text-sm font-extrabold text-text group-hover:text-accent transition-colors flex items-center justify-between">
                      <span>{t.name}</span>
                      <span className="text-xs font-extrabold text-text/40 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        適用
                        <ArrowRight className="w-3 h-3" />
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
            <CopyButton
              value={generatedCode}
              label=""
              copiedLabel=""
              className="theme-btn p-1.5 bg-secondary text-text flex items-center justify-center"
              title="コードをコピー"
            />
          </h3>
          <pre className="flex-1 w-full p-4 border-2 border-border rounded-xl font-mono text-[10px] leading-relaxed bg-slate-950 text-slate-100 overflow-y-auto whitespace-pre">
            {generatedCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
