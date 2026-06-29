'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  BookOpen,
  Eye,
  Edit3,
  Split,
  ChevronRight,
  Printer,
  History,
} from 'lucide-react';
import ToolPageLayout from '@/src/components/ToolPageLayout';
import { useThemeDesign } from '@/src/components/ThemeDesignProvider';

// Unified 関連モジュールをインポート
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import { visit } from 'unist-util-visit';
import type { Root, Code, Text } from 'mdast';
import type { Root as HastRoot, Element } from 'hast';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const DEFAULT_MARKDOWN = `# Markdown Live Editor

本ブログで採用しているテーマ別スタイルを適用した**リアルタイムプレビュー**が可能です。
記事執筆の下書き確認や、ちょっとしたメモの作成にご利用ください。

## 特長

1. **テーマ連動スタイル**: 右側のプレビューエリアには、画面右上（または左上）で選択したテーマ（Steampunk、Terminal、Chalkboardなど）の装飾がそのまま反映されます。
2. **コードブロックのファイル名表示**: 以下のように書くことで、本ブログと同様にファイル名ヘッダーが表示されます。

\`\`\`typescript:hello.ts
const greet = (name: string): string => {
  return \`Hello, \${name}!\`;
};
console.log(greet("Antigravity"));
\`\`\`

3. **Gfm (GitHub Flavored Markdown)**: テーブルやチェックリスト、取り消し線に対応しています。

| 機能 | 対応状況 | 備考 |
| :--- | :---: | :--- |
| テーブル | OK | アライメントも対応 |
| 取り消し線 | ~~対応~~ | 波線で消されます |
| チェックリスト | [x] OK | 動的チェック可能 |

4. **目次 (TOC) の自動生成**: 画面右上の「目次」パネルに、H1〜H4の見出しから階層化された目次が自動抽出されます。

---

## 引用のスタイル

> 人生に必要なものは、勇気と想像力。そして、ほんの少しのお金。
> — *Charlie Chaplin*

---

## PDFエクスポート

「印刷 / PDF」ボタンを押すと、エディタ部分やヘッダーが自動的に隠れ、**プレビューエリアのみが綺麗に配置されたA4印刷用レイアウト**でPDFとして出力・印刷できます。
`;

export default function MarkdownEditorTool() {
  const { currentTheme } = useThemeDesign();
  const [markdown, setMarkdown] = useState<string>('');
  const [html, setHtml] = useState<string>('');
  const [toc, setToc] = useState<TocItem[]>([]);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [showTocPanel, setShowTocPanel] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedType, setCopiedType] = useState<string>('');
  const [isParsing, setIsParsing] = useState<boolean>(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isSyncingScrollRef = useRef<boolean>(false);

  // ローカルストレージからロード
  useEffect(() => {
    const saved = localStorage.getItem('markdown_draft');
    setMarkdown(saved !== null ? saved : DEFAULT_MARKDOWN);
  }, []);

  // マークダウンの変更があったらパースを実行する (Debounce)
  useEffect(() => {
    if (markdown === '') {
      setHtml('');
      setToc([]);
      return;
    }

    setIsParsing(true);
    const timer = setTimeout(() => {
      parseMarkdown(markdown);
    }, 250); // 250ms debounce

    // 自動保存
    localStorage.setItem('markdown_draft', markdown);

    return () => clearTimeout(timer);
  }, [markdown]);

  // Unified による Markdown パース
  const parseMarkdown = async (rawText: string) => {
    try {
      // 1. コードブロックのファイル名指定をメタに変換する Remark プラグイン
      const remarkExtractCodeFilename = () => {
        return (tree: Root) => {
          visit(tree, 'code', (node: Code) => {
            if (node.lang?.includes(':')) {
              const colonIdx = node.lang.indexOf(':');
              const filename = node.lang.slice(colonIdx + 1);
              node.lang = node.lang.slice(0, colonIdx) || null;
              node.meta = node.meta
                ? `${node.meta} filename="${filename}"`
                : `filename="${filename}"`;
            }
          });
        };
      };

      // 2. コードブロックの pre/code タグに data-attributes を付与する Rehype プラグイン
      const rehypeCodeMeta = () => {
        return (tree: HastRoot) => {
          visit(tree, 'element', (node: Element) => {
            if (node.tagName === 'pre') {
              const codeNode = node.children?.find(
                (c): c is Element => c.type === 'element' && c.tagName === 'code'
              );
              if (codeNode) {
                // 言語クラスの抽出
                const className = (codeNode.properties?.className as string[]) || [];
                const langClass = className.find((c: string) => c.startsWith('language-'));
                if (langClass) {
                  const lang = langClass.replace('language-', '');
                  node.properties = node.properties || {};
                  node.properties['data-language'] = lang;
                }
                // meta情報の filename を data-filename に変換する
                const meta = (codeNode.data as { meta?: string })?.meta || '';
                const filenameMatch = meta.match(/filename="([^"]+)"/);
                if (filenameMatch) {
                  node.properties = node.properties || {};
                  node.properties['data-filename'] = filenameMatch[1];
                }
              }
            }
          });
        };
      };

      // 3. 見出しから TOC (目次) を抽出する Rehype プラグイン
      const tempToc: TocItem[] = [];
      const rehypeExtractToc = () => {
        return (tree: HastRoot) => {
          visit(tree, 'element', (node: Element) => {
            if (['h1', 'h2', 'h3', 'h4'].includes(node.tagName)) {
              const id = (node.properties?.id as string) || '';
              let text = '';
              visit(node, 'text', (t: Text) => {
                text += t.value;
              });
              const level = parseInt(node.tagName.replace('h', ''));
              tempToc.push({ id, text, level });
            }
          });
        };
      };

      const processor = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkExtractCodeFilename)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeSlug)
        .use(rehypeCodeMeta)
        .use(rehypeExtractToc)
        .use(rehypeStringify, { allowDangerousHtml: true });

      const result = await processor.process(rawText);
      setHtml(String(result));
      setToc(tempToc);
    } catch (e) {
      console.error('Unified processing failed', e);
    } finally {
      setIsParsing(false);
    }
  };

  // スクロール同期
  const handleScroll = (source: 'editor' | 'preview') => {
    if (viewMode !== 'split') return;
    if (isSyncingScrollRef.current) {
      isSyncingScrollRef.current = false;
      return;
    }

    const editor = editorRef.current;
    const preview = previewRef.current;
    if (!editor || !preview) return;

    isSyncingScrollRef.current = true;

    if (source === 'editor') {
      const scrollRatio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
      preview.scrollTop = scrollRatio * (preview.scrollHeight - preview.clientHeight);
    } else {
      const scrollRatio = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
      editor.scrollTop = scrollRatio * (editor.scrollHeight - editor.clientHeight);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setCopiedType(type);
    setTimeout(() => {
      setCopied(false);
      setCopiedType('');
    }, 2000);
  };

  const downloadMarkdownFile = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `document-${Date.now()}.md`;
    link.click();
  };

  // 印刷/PDF化の実行
  const triggerPrint = () => {
    window.print();
  };

  // TOCアンカーリンクへのスムーズスクロール
  const scrollToHeading = (id: string) => {
    const preview = previewRef.current;
    if (!preview) return;
    const heading = preview.querySelector(`#${id}`);
    if (heading) {
      heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <ToolPageLayout
      title="Markdown Live Editor"
      description="Gfm対応のMarkdownエディタです。ブログと同じレンダリングエンジンを使用しているため、選択中のデザインテーマ別の見出し・引用・コードブロック装飾がそのままプレビューにリアルタイム反映されます。"
      icon={FileText}
    >
      {/* 印刷用CSSの動的挿入 (PDF印刷時にプレビューのみを出力) */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-preview-area, #print-preview-area * {
            visibility: visible;
          }
          #print-preview-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
            box-shadow: none;
            border: none;
          }
          /* 不要な余白やスクロールバーを削除 */
          html, body {
            height: auto;
            background: white !important;
            color: black !important;
          }
        }
      `}</style>

      {/* エディタコントロールバー */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-secondary/30 border-2 border-border rounded-2xl p-3 mb-6">
        {/* 表示モード切り替え */}
        <div className="flex p-0.5 bg-card/60 border border-border rounded-xl self-start">
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'split'
                ? 'bg-accent text-white shadow-sm'
                : 'text-text/70 hover:text-text'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>2分割</span>
          </button>
          <button
            onClick={() => setViewMode('edit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'edit'
                ? 'bg-accent text-white shadow-sm'
                : 'text-text/70 hover:text-text'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>エディタのみ</span>
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-accent text-white shadow-sm'
                : 'text-text/70 hover:text-text'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>プレビューのみ</span>
          </button>
        </div>

        {/* 各種書き出し・設定アクション */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowTocPanel(!showTocPanel)}
            className={`px-3 py-1.5 rounded-xl border border-border text-xs font-bold transition-all cursor-pointer ${
              showTocPanel
                ? 'bg-accent/15 border-accent text-accent'
                : 'bg-card hover:bg-secondary text-text/80'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 inline mr-1" />
            <span>目次パネル</span>
          </button>
          <button
            onClick={triggerPrint}
            className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-text/80 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
            title="プレビュー内容をA4でPDF化・印刷"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>印刷 / PDF</span>
          </button>
          <button
            onClick={downloadMarkdownFile}
            className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-text/80 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
            title="Markdownファイルとして保存"
          >
            <Download className="w-3.5 h-3.5" />
            <span>MD保存</span>
          </button>
          <button
            onClick={() => handleCopy(markdown, 'md')}
            className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-text/80 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            {copied && copiedType === 'md' ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-500" />
                <span className="text-green-500">コピー完了</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>MDコピー</span>
              </>
            )}
          </button>
          <button
            onClick={() => handleCopy(html, 'html')}
            className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-text/80 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            {copied && copiedType === 'html' ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-500" />
                <span className="text-green-500">コピー完了</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>HTMLコピー</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* メインレイアウトグリッド */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 左側＆右側エディタプレビューエリア (12列 または 目次付きで9列) */}
        <div
          className={`${showTocPanel ? 'lg:col-span-9' : 'lg:col-span-12'} grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch min-h-[500px]`}
        >
          {/* エディタエリア */}
          {(viewMode === 'split' || viewMode === 'edit') && (
            <div
              className={`flex flex-col border-2 border-border rounded-3xl overflow-hidden bg-card shadow-[3px_3px_0px_0px_var(--border)] dark:shadow-[3px_3px_0px_0px_var(--accent)] ${viewMode === 'edit' ? 'col-span-2' : ''}`}
            >
              <div className="bg-secondary/20 px-4 py-2 border-b border-border flex justify-between items-center text-xs font-bold text-text/50">
                <span>MARKDOWN EDITOR</span>
                <span>{markdown.length} 文字</span>
              </div>
              <textarea
                ref={editorRef}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                onScroll={() => handleScroll('editor')}
                className="flex-1 w-full p-5 bg-transparent text-text border-none resize-none font-mono text-sm leading-relaxed focus:outline-none focus:ring-0 min-h-[450px]"
                placeholder="Markdownをここに入力してください..."
              />
            </div>
          )}

          {/* プレビューエリア */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div
              id="print-preview-area"
              className={`flex flex-col border-2 border-border rounded-3xl overflow-hidden bg-card shadow-[3px_3px_0px_0px_var(--border)] dark:shadow-[3px_3px_0px_0px_var(--accent)] ${
                viewMode === 'preview' ? 'col-span-2' : ''
              }`}
            >
              <div className="bg-secondary/20 px-4 py-2 border-b border-border flex justify-between items-center text-xs font-bold text-text/50 shrink-0 select-none">
                <span>LIVE PREVIEW</span>
                <span className="flex items-center gap-1.5">
                  {isParsing && (
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
                  )}
                  <span>THEME: {currentTheme.toUpperCase()}</span>
                </span>
              </div>

              {/* スクロール可能なプレビュー本文 */}
              <div
                ref={previewRef}
                onScroll={() => handleScroll('preview')}
                className="flex-1 overflow-y-auto p-6 md:p-8 min-h-[450px]"
              >
                {/* ブログと同じテーマスタイルのために data-theme={currentTheme} を適用 */}
                <article
                  data-theme={currentTheme}
                  className="prose prose-stone dark:prose-invert max-w-none break-words leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      html ||
                      '<p class="text-text/30 font-bold text-center py-12">ここにリアルタイムプレビューが表示されます</p>',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 右側：目次（TOC）パネル (3列) */}
        {showTocPanel && (
          <div className="lg:col-span-3">
            <div className="theme-card p-5 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] dark:shadow-[4px_4px_0px_0px_var(--accent)] h-full min-h-[250px] flex flex-col">
              <h3 className="font-extrabold text-sm border-b-2 border-border pb-3 mb-4 text-text flex items-center gap-1.5">
                <History className="w-4 h-4 text-accent shrink-0" />
                <span>ドキュメント目次</span>
              </h3>

              <div className="flex-1 overflow-y-auto max-h-[450px] space-y-2 pr-1 text-xs">
                {toc.length === 0 ? (
                  <div className="h-full flex items-center justify-center py-12 text-center text-text/40 font-bold">
                    見出しがありません。
                  </div>
                ) : (
                  toc.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToHeading(item.id)}
                      className="w-full text-left font-bold text-text/70 hover:text-accent flex items-start gap-1 transition-colors py-1 hover:underline cursor-pointer"
                      style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                    >
                      <ChevronRight className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                      <span className="truncate">{item.text}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
