'use client';

import { useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '@/src/config/storage-keys';
import {
  safeReadStringFromStorage,
  safeRemoveFromStorage,
  safeWriteToStorage,
} from '@/src/lib/storage';
import { AWSEdge, AWSNode, AWSSubgraph, TEMPLATES } from './aws-diagram-data';
import {
  generateMermaidCode,
  generateNodeId,
  isDiagramIdTaken,
  removeNode,
  removeSubgraph,
  sanitizeDiagramId,
} from './aws-diagram-utils';

export type DiagramDirection = 'TD' | 'LR';
export type TemplateKey = keyof typeof TEMPLATES;

/** 追加系操作の結果。失敗時はユーザー向けエラーメッセージを返す。 */
type MutationResult = { ok: true } | { ok: false; error: string };

const ID_TAKEN_ERROR = 'そのIDは既に使われています。一意のIDを指定してください。';

/**
 * AWS 構成図ジェネレーターの図データ（リソース・グループ・接続線・方向）の状態管理。
 * localStorage への復元・自動保存と、Mermaid コード生成までを担う。
 */
export function useAwsDiagram() {
  const [nodes, setNodes] = useState<AWSNode[]>([]);
  const [subgraphs, setSubgraphs] = useState<AWSSubgraph[]>([]);
  const [edges, setEdges] = useState<AWSEdge[]>([]);
  const [direction, setDirection] = useState<DiagramDirection>('TD');

  const loadTemplate = (key: TemplateKey) => {
    const t = TEMPLATES[key];
    setNodes(t.nodes);
    setSubgraphs(t.subgraphs);
    setEdges(t.edges);
  };

  // LocalStorage からの状態復元（保存データがなければ初回デフォルトのテンプレートを表示）
  useEffect(() => {
    const saved = safeReadStringFromStorage(STORAGE_KEYS.awsDiagramData);
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
        requestAnimationFrame(() => loadTemplate('threeTier'));
      }
    } else {
      requestAnimationFrame(() => loadTemplate('threeTier'));
    }
  }, []);

  // 状態が変化した際の自動保存
  useEffect(() => {
    if (nodes.length === 0 && subgraphs.length === 0 && edges.length === 0) return;
    safeWriteToStorage(STORAGE_KEYS.awsDiagramData, { nodes, subgraphs, edges, direction });
  }, [nodes, subgraphs, edges, direction]);

  const clearAll = () => {
    setNodes([]);
    setSubgraphs([]);
    setEdges([]);
    safeRemoveFromStorage(STORAGE_KEYS.awsDiagramData);
  };

  /**
   * リソースを追加する。ID 未指定ならサービスタイプから自動採番する。
   */
  const addNode = (input: {
    id: string;
    name: string;
    type: string;
    subgraphId: string;
  }): MutationResult => {
    if (!input.name.trim()) return { ok: false, error: '表示名を入力してください。' };

    let id = sanitizeDiagramId(input.id);
    if (!id) {
      id = generateNodeId(input.type, nodes, subgraphs);
    } else if (isDiagramIdTaken(id, nodes, subgraphs)) {
      return { ok: false, error: ID_TAKEN_ERROR };
    }

    setNodes([
      ...nodes,
      {
        id,
        name: input.name.trim(),
        type: input.type,
        subgraphId: input.subgraphId || undefined,
      },
    ]);
    return { ok: true };
  };

  const deleteNode = (id: string) => {
    const next = removeNode(id, nodes, edges);
    setNodes(next.nodes);
    setEdges(next.edges);
  };

  const addSubgraph = (input: {
    id: string;
    name: string;
    type: AWSSubgraph['type'];
    parentId: string;
  }): MutationResult => {
    if (!input.id.trim() || !input.name.trim()) {
      return { ok: false, error: 'グループIDとグループ名を入力してください。' };
    }

    const id = sanitizeDiagramId(input.id);
    if (isDiagramIdTaken(id, nodes, subgraphs)) return { ok: false, error: ID_TAKEN_ERROR };

    setSubgraphs([
      ...subgraphs,
      {
        id,
        name: input.name.trim(),
        type: input.type,
        parentId: input.parentId || undefined,
      },
    ]);
    return { ok: true };
  };

  const deleteSubgraph = (id: string) => {
    const next = removeSubgraph(id, nodes, subgraphs);
    setNodes(next.nodes);
    setSubgraphs(next.subgraphs);
  };

  const addEdge = (input: {
    from: string;
    to: string;
    label: string;
    style: AWSEdge['style'];
  }): MutationResult => {
    if (!input.from || !input.to) {
      return { ok: false, error: '送信元と送信先のリソースを選択してください。' };
    }
    if (input.from === input.to) return { ok: false, error: '自身には接続できません。' };

    setEdges([
      ...edges,
      {
        id: `edge_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        from: input.from,
        to: input.to,
        label: input.label.trim() || undefined,
        style: input.style,
      },
    ]);
    return { ok: true };
  };

  const deleteEdge = (id: string) => {
    setEdges(edges.filter((e) => e.id !== id));
  };

  const generatedCode = useMemo(
    () => generateMermaidCode({ nodes, subgraphs, edges, direction }),
    [nodes, subgraphs, edges, direction]
  );

  return {
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
  };
}
