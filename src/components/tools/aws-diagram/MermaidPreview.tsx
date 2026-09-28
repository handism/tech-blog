'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { loadMermaid } from '@/src/lib/mermaid-loader';

// 動的Mermaidプレビューコンポーネント
let mermaidInitialized = false;

export default function MermaidPreview({ chartCode }: { chartCode: string }) {
  const [svgHtml, setSvgHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const rawId = useId();
  const uniqueId = useRef(`mermaid-${rawId.replace(/:/g, '')}`);

  useEffect(() => {
    let active = true;
    const renderChart = async () => {
      try {
        if (typeof window === 'undefined') return;

        const mermaidLib = await loadMermaid();
        if (!mermaidInitialized) {
          mermaidLib.initialize({
            startOnLoad: false,
            theme: 'neutral',
            securityLevel: 'sandbox',
            flowchart: {
              useMaxWidth: true,
              htmlLabels: true,
            },
          });
          mermaidInitialized = true;
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
