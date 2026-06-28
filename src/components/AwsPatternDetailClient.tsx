// src/components/AwsPatternDetailClient.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Download,
  ArrowLeft,
  Terminal,
  ZoomIn,
  X,
  Cpu,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import Link from 'next/link';
import type { AwsPattern } from '@/src/types/aws-gallery';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';
import { getServiceBadgeStyle } from '@/src/lib/aws-gallery-helpers';

type Props = {
  pattern: AwsPattern;
};

export default function AwsPatternDetailClient({ pattern }: Props) {
  const { copied: copiedCode, copy: copyCode } = useCopyToClipboard();
  const { copied: copiedCmd, copy: copyCmd } = useCopyToClipboard();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isCodeMaximized, setIsCodeMaximized] = useState(false);

  const deployCmd = `aws cloudformation deploy \\
  --template-file ${pattern.templateFile} \\
  --stack-name ${pattern.slug}-stack \\
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM`;

  // ライトボックスやコード最大化が開いているときにスクロールをロックする
  useEffect(() => {
    if (isLightboxOpen || isCodeMaximized) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen, isCodeMaximized]);

  // Escキーでライトボックスやコード最大化を閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
        setIsCodeMaximized(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="space-y-6">
      {/* 戻るリンク */}
      <div>
        <Link
          href="/aws-patterns"
          className="inline-flex items-center gap-1.5 text-sm font-black text-accent hover:underline group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          一覧に戻る
        </Link>
      </div>

      {/* 2カラムレイアウト */}
      <div className="grid gap-6 lg:grid-cols-12 items-start w-full">
        {/* 左カラム (メタデータ、構成図、コマンド) */}
        <div className="lg:col-span-5 space-y-6 min-w-0 w-full">
          {/* 基本情報カード */}
          <div className="theme-card p-6 border-2 border-border rounded-2xl shadow-[4px_4px_0px_0px_var(--border)] dark:shadow-[4px_4px_0px_0px_var(--accent)] space-y-4">
            <span className="inline-block text-xs font-black px-2.5 py-0.5 bg-secondary text-text border-2 border-border rounded-md">
              {pattern.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-text leading-tight break-words">
              {pattern.title}
            </h1>
            <p className="text-sm text-text/70 leading-relaxed font-medium">
              {pattern.description}
            </p>

            <div className="pt-4 border-t border-border/10">
              <h2 className="text-xs font-black text-text/50 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5" />
                構成要素 (AWS Services):
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {pattern.awsServices.map((srv) => (
                  <span
                    key={srv}
                    className={`text-xs font-bold px-2.5 py-1 border rounded-lg transition-colors ${getServiceBadgeStyle(srv)}`}
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>

            {/* 構築されるリソース一覧 */}
            {pattern.resources && pattern.resources.length > 0 && (
              <div className="pt-4 border-t border-border/10">
                <h2 className="text-xs font-black text-text/50 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <span className="flex h-2 w-2 rounded-full bg-accent" />
                  構築される主要リソース ({pattern.resources.length}種):
                </h2>
                <div className="grid gap-2 sm:grid-cols-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                  {pattern.resources.map((res) => {
                    const displayName = res.type.replace('AWS::', '').replace(/::/g, ' ');
                    return (
                      <div
                        key={res.type}
                        className="flex items-center justify-between text-xs p-2 bg-secondary border border-border/10 rounded-lg hover:border-border/30 transition-colors"
                        title={res.type}
                      >
                        <span className="font-bold text-text truncate max-w-[130px] sm:max-w-none">
                          {displayName}
                        </span>
                        <span className="px-2 py-0.5 bg-accent/10 text-accent font-black border border-accent/20 rounded-md">
                          {res.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* アーキテクチャ図カード */}
          {pattern.diagramFile && (
            <div className="theme-card p-6 border-2 border-border rounded-2xl shadow-[4px_4px_0px_0px_var(--border)] dark:shadow-[4px_4px_0px_0px_var(--accent)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-black text-text flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-accent" />
                  アーキテクチャ図 (Architecture Diagram)
                </h3>
                <span className="text-[10px] font-bold text-text/50">クリックで拡大表示</span>
              </div>

              {/* 画像コンテナ */}
              <div
                onClick={() => setIsLightboxOpen(true)}
                className="relative border-2 border-border rounded-xl overflow-hidden bg-white/90 dark:bg-neutral-900/90 p-4 cursor-zoom-in hover:border-accent group transition-colors flex items-center justify-center min-h-[220px]"
              >
                <img
                  src={`/aws-patterns/${pattern.diagramFile}`}
                  alt={`${pattern.title} アーキテクチャ図`}
                  className="max-w-full max-h-[300px] object-contain transition-transform duration-300 group-hover:scale-102"
                />
                <div className="absolute right-3 bottom-3 p-2 bg-card border-2 border-border rounded-lg shadow-[2px_2px_0px_0px_var(--border)] opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="h-4 w-4 text-text" />
                </div>
              </div>
            </div>
          )}

          {/* デプロイ手順カード */}
          <div className="theme-card p-6 border-2 border-border rounded-2xl shadow-[4px_4px_0px_0px_var(--border)] dark:shadow-[4px_4px_0px_0px_var(--accent)] space-y-4">
            <h3 className="text-sm font-black text-text flex items-center gap-2">
              <Terminal className="h-4 w-4 text-accent" />
              AWS CLI でのデプロイ例
            </h3>
            <p className="text-xs text-text/70 font-medium">
              AWS
              CLIを使用してCloudFormationスタックをデプロイする場合は、以下のコマンドを実行します。
            </p>
            <div className="relative">
              <pre className="bg-neutral-900 dark:bg-neutral-950 text-neutral-100 text-xs p-4 rounded-xl font-mono overflow-x-auto border-2 border-border/20 whitespace-pre leading-relaxed select-all">
                {deployCmd}
              </pre>
              <button
                onClick={() => copyCmd(deployCmd)}
                className="absolute right-3.5 top-3.5 p-2 bg-neutral-800 text-neutral-300 hover:text-white rounded-lg transition-colors border border-neutral-700/50"
                title="コマンドをコピー"
              >
                {copiedCmd ? (
                  <Check className="h-3.5 w-3.5 text-accent" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 右カラム (YAMLコードプレビュー・Shiki事前レンダリングHTML) */}
        <div className="lg:col-span-7 min-w-0 w-full">
          <div className="theme-card border-2 border-border rounded-2xl shadow-[4px_4px_0px_0px_var(--border)] dark:shadow-[4px_4px_0px_0px_var(--accent)] overflow-hidden flex flex-col max-h-[500px] lg:max-h-[820px] min-w-0 w-full">
            {/* コントロールヘッダー */}
            <div className="px-6 py-4 bg-secondary border-b-2 border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 shrink-0">
                <span className="flex h-3 w-3 rounded-full bg-red-500" />
                <span className="flex h-3 w-3 rounded-full bg-yellow-500" />
                <span className="flex h-3 w-3 rounded-full bg-green-500" />
                <span className="text-xs font-black text-text/60 ml-2 font-mono truncate max-w-[150px] md:max-w-none">
                  {pattern.templateFile}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {/* コピーボタン */}
                <button
                  onClick={() => copyCode(pattern.yamlCode)}
                  className="px-3 py-1.5 text-xs font-black border-2 border-border rounded-lg bg-card text-text hover:bg-secondary transition-all active:translate-y-0 active:shadow-none flex items-center gap-1.5 shadow-[2px_2px_0px_0px_var(--border)]"
                >
                  {copiedCode ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-accent" />
                      <span>コピー完了</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-accent" />
                      <span>コピー</span>
                    </>
                  )}
                </button>

                {/* ダウンロードリンク */}
                <a
                  href={`/aws-patterns/${pattern.templateFile}`}
                  download={pattern.templateFile}
                  className="px-3 py-1.5 text-xs font-black border-2 border-border rounded-lg bg-accent text-white dark:text-neutral-900 hover:opacity-95 transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_0px_var(--border)] dark:shadow-[2px_2px_0px_0px_var(--accent)]"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>DL</span>
                </a>

                {/* 最大化ボタン */}
                <button
                  onClick={() => setIsCodeMaximized(true)}
                  className="p-1.5 border-2 border-border rounded-lg bg-card text-text hover:bg-secondary transition-all shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center shrink-0"
                  title="全画面表示"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* コードスクロールプレビュー (Shikiによる出力) */}
            <div className="p-4 overflow-auto font-mono text-sm leading-relaxed bg-[#0d1117] text-[#c9d1d9] flex-1 scrollbar-thin">
              <div
                className="aws-code-preview prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: pattern.htmlCode }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ライトボックスモーダル (画像拡大) */}
      {isLightboxOpen && pattern.diagramFile && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-100 bg-black/90 flex items-center justify-center p-4 md:p-8 cursor-zoom-out animate-fade-in"
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors border border-white/10 z-110"
            aria-label="閉じる"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative max-w-full max-h-full flex items-center justify-center">
            <img
              src={`/aws-patterns/${pattern.diagramFile}`}
              alt={`${pattern.title} アーキテクチャ図（拡大）`}
              className="max-w-[95vw] max-h-[90vh] object-contain select-none bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()} // 画像クリックでは閉じない
            />
          </div>
        </div>
      )}

      {/* コード全画面表示モーダル */}
      {isCodeMaximized && (
        <div className="fixed inset-0 z-100 bg-[#0d1117] flex flex-col p-4 md:p-8 animate-fade-in">
          {/* ヘッダー部分 */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-red-500" />
              <span className="flex h-3 w-3 rounded-full bg-yellow-500" />
              <span className="flex h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm font-black text-neutral-300 ml-2 font-mono">
                {pattern.templateFile}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {/* コピーボタン */}
              <button
                onClick={() => copyCode(pattern.yamlCode)}
                className="px-3.5 py-1.5 text-xs font-black border border-neutral-700 rounded-lg bg-neutral-800 text-neutral-200 hover:bg-neutral-700 transition-colors flex items-center gap-1.5"
              >
                {copiedCode ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-accent" />
                    <span>コピー完了</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>コピー</span>
                  </>
                )}
              </button>

              {/* 閉じるボタン */}
              <button
                onClick={() => setIsCodeMaximized(false)}
                className="p-1.5 bg-neutral-800 text-neutral-300 hover:text-white rounded-lg transition-colors border border-neutral-700"
                title="閉じる"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* コードブロック */}
          <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed text-[#c9d1d9] scrollbar-thin">
            <div
              className="aws-code-preview prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: pattern.htmlCode }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
