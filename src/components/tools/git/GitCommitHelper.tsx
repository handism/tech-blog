// src/components/tools/git/GitCommitHelper.tsx
'use client';

import { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

// コミットタイプの定義
const COMMIT_TYPES = [
  { value: 'feat', label: 'feat (新機能追加)', emoji: '✨' },
  { value: 'fix', label: 'fix (バグ修正)', emoji: '🐛' },
  { value: 'docs', label: 'docs (ドキュメントのみの変更)', emoji: '📝' },
  {
    value: 'style',
    label: 'style (コードの意味に影響を与えない修正 - 空白、フォーマットなど)',
    emoji: '💄',
  },
  {
    value: 'refactor',
    label: 'refactor (コードリファクタリング - 機能追加もバグ修正も行わない変更)',
    emoji: '♻️',
  },
  { value: 'perf', label: 'perf (パフォーマンス向上)', emoji: '⚡' },
  { value: 'test', label: 'test (テストの追加や修正)', emoji: '✅' },
  {
    value: 'chore',
    label: 'chore (ビルドプロセスやツールの変更 - 依存関係アップデートなど)',
    emoji: '🔧',
  },
  { value: 'ci', label: 'ci (CI設定やスクリプトの変更)', emoji: '👷' },
  { value: 'revert', label: 'revert (以前のコミットの取り消し)', emoji: '⏪' },
];

export default function GitCommitHelper() {
  const { copy } = useCopyToClipboard();
  const [type, setType] = useState('feat');
  const [scope, setScope] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [issue, setIssue] = useState('');
  const [branchTopic, setBranchTopic] = useState('');

  const [copiedType, setCopiedType] = useState<'commit' | 'cmd' | 'branch' | null>(null);

  // 文字列をURL/Gitフレンドリーなスラッグに変換する関数
  const sluggify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_ ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // 生成されるブランチ名
  const branchName = useMemo(() => {
    const topic = branchTopic.trim() || summary.trim();
    if (!topic) return '';

    const sluggedTopic = sluggify(topic);
    const scopePart = scope.trim() ? `${sluggify(scope.trim())}-` : '';

    return `${type}/${scopePart}${sluggedTopic}`.substring(0, 50); // 文字数制限
  }, [type, scope, summary, branchTopic]);

  // 生成されるコミットタイトル
  const commitTitle = useMemo(() => {
    const scopePart = scope.trim() ? `(${scope.trim()})` : '';
    const issuePart = issue.trim() ? ` (#${issue.replace('#', '').trim()})` : '';

    return `${type}${scopePart}: ${summary.trim()}${issuePart}`;
  }, [type, scope, summary, issue]);

  // 生成されるコミットメッセージ全体 (Bodyを含む)
  const fullCommitMessage = useMemo(() => {
    if (!summary.trim()) return '';
    if (!body.trim()) return commitTitle;

    return `${commitTitle}\n\n${body.trim()}`;
  }, [commitTitle, summary, body]);

  // 生成されるGitコマンド
  const gitCommands = useMemo(() => {
    const commands: string[] = [];

    if (branchName) {
      commands.push(`git checkout -b ${branchName}`);
    }

    if (summary.trim()) {
      if (body.trim()) {
        const escapedTitle = commitTitle.replace(/'/g, "'\\''");
        const escapedBody = body.trim().replace(/'/g, "'\\''");
        commands.push(`git commit -m '${escapedTitle}' -m '${escapedBody}'`);
      } else {
        const escapedTitle = commitTitle.replace(/'/g, "'\\''");
        commands.push(`git commit -m '${escapedTitle}'`);
      }
    }

    return commands.join('\n');
  }, [branchName, commitTitle, body, summary]);

  const handleCopy = (text: string, label: 'commit' | 'cmd' | 'branch') => {
    if (!text) return;
    copy(text);
    setCopiedType(label);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const resetAll = () => {
    setType('feat');
    setScope('');
    setSummary('');
    setBody('');
    setIssue('');
    setBranchTopic('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-text animate-none">
      {/* 左側：フォーム入力 */}
      <div className="lg:col-span-5 space-y-6">
        <div className="theme-card p-6 space-y-4 border-2 border-border bg-card shadow-[4px_4px_0px_0px_var(--border)]">
          <div className="flex justify-between items-center border-b-2 border-border/20 pb-3">
            <h3 className="font-extrabold text-sm flex items-center gap-1.5">
              <span>📝</span> パラメータ入力
            </h3>
            <button
              onClick={resetAll}
              className="theme-btn px-2.5 py-1 text-xs bg-secondary border-border text-text shadow-[1px_1px_0px_0px_var(--border)] cursor-pointer hover:bg-border/20 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>クリア</span>
            </button>
          </div>

          {/* コミットタイプ */}
          <div className="space-y-1.5">
            <label
              htmlFor="commit-type"
              className="text-xs font-black text-text/60 uppercase tracking-wider block"
            >
              コミットタイプ (Type)
            </label>
            <select
              id="commit-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border-2 border-border p-2.5 rounded-lg bg-card text-xs font-bold focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer shadow-sm"
            >
              {COMMIT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.emoji} {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* スコープ */}
          <div className="space-y-1.5">
            <label
              htmlFor="commit-scope"
              className="text-xs font-black text-text/60 uppercase tracking-wider block"
            >
              スコープ (Scope) <span className="text-text/40 font-medium lowercase">※任意</span>
            </label>
            <input
              id="commit-scope"
              type="text"
              placeholder="例: auth, ui, api, database"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full border-2 border-border p-2 rounded-lg bg-card text-xs font-bold focus:outline-none focus:ring-1 focus:ring-accent shadow-inner"
            />
          </div>

          {/* 要約 */}
          <div className="space-y-1.5">
            <label
              htmlFor="commit-summary"
              className="text-xs font-black text-text/60 uppercase tracking-wider block"
            >
              要約 (Summary) <span className="text-red-500">*</span>
            </label>
            <input
              id="commit-summary"
              type="text"
              placeholder="何を変更したかを簡潔に入力 (例: ログインフォームの追加)"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full border-2 border-border p-2 rounded-lg bg-card text-xs font-bold focus:outline-none focus:ring-1 focus:ring-accent shadow-inner"
              required
            />
          </div>

          {/* 関連チケットID */}
          <div className="space-y-1.5">
            <label
              htmlFor="commit-issue"
              className="text-xs font-black text-text/60 uppercase tracking-wider block"
            >
              チケット/Issue ID <span className="text-text/40 font-medium lowercase">※任意</span>
            </label>
            <input
              id="commit-issue"
              type="text"
              placeholder="例: 123, GH-45"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="w-full border-2 border-border p-2 rounded-lg bg-card text-xs font-bold focus:outline-none focus:ring-1 focus:ring-accent shadow-inner"
            />
          </div>

          {/* ブランチ用トピック */}
          <div className="space-y-1.5">
            <label
              htmlFor="branch-topic"
              className="text-xs font-black text-text/60 uppercase tracking-wider block"
            >
              ブランチ名トピック{' '}
              <span className="text-text/40 font-medium lowercase">
                ※任意 (未入力時は要約を使用)
              </span>
            </label>
            <input
              id="branch-topic"
              type="text"
              placeholder="例: add-login-form"
              value={branchTopic}
              onChange={(e) => setBranchTopic(e.target.value)}
              className="w-full border-2 border-border p-2 rounded-lg bg-card text-xs font-bold focus:outline-none focus:ring-1 focus:ring-accent shadow-inner"
            />
          </div>

          {/* 詳細説明 */}
          <div className="space-y-1.5">
            <label
              htmlFor="commit-body"
              className="text-xs font-black text-text/60 uppercase tracking-wider block"
            >
              詳細説明 (Body) <span className="text-text/40 font-medium lowercase">※任意</span>
            </label>
            <textarea
              id="commit-body"
              placeholder="変更の詳しい理由や背景などを記入"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              className="w-full border-2 border-border p-2 rounded-lg bg-card text-xs font-bold focus:outline-none focus:ring-1 focus:ring-accent resize-none shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* 右側：成果物の表示 */}
      <div className="lg:col-span-7 space-y-6">
        {/* ブランチ名 */}
        <div className="theme-card p-5 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-wider text-text/50">
              🌱 推奨ブランチ名
            </h4>
            {branchName && (
              <button
                onClick={() => handleCopy(branchName, 'branch')}
                className="theme-btn p-1.5 text-[10px] bg-secondary border-border text-text flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_0px_var(--border)]"
              >
                {copiedType === 'branch' ? 'コピー完了' : 'コピー'}
              </button>
            )}
          </div>
          {branchName ? (
            <div className="p-3 bg-secondary text-text font-mono text-xs rounded-lg border border-border break-all shadow-inner select-all leading-normal">
              {branchName}
            </div>
          ) : (
            <div className="p-3 text-text/40 text-xs font-bold bg-secondary/30 border-2 border-dashed border-border/20 rounded-lg text-center shadow-inner">
              要約またはブランチ名トピックを入力すると生成されます
            </div>
          )}
        </div>

        {/* コミットメッセージプレビュー */}
        <div className="theme-card p-5 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-wider text-text/50">
              💬 コミットメッセージ
            </h4>
            {fullCommitMessage && (
              <button
                onClick={() => handleCopy(fullCommitMessage, 'commit')}
                className="theme-btn p-1.5 text-[10px] bg-secondary border-border text-text flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_0px_var(--border)]"
              >
                {copiedType === 'commit' ? 'コピー完了' : 'コピー'}
              </button>
            )}
          </div>
          {fullCommitMessage ? (
            <pre className="p-3 bg-secondary text-text font-mono text-xs rounded-lg border border-border overflow-x-auto whitespace-pre-wrap shadow-inner select-all leading-normal">
              {fullCommitMessage}
            </pre>
          ) : (
            <div className="p-3 text-text/40 text-xs font-bold bg-secondary/30 border-2 border-dashed border-border/20 rounded-lg text-center shadow-inner">
              要約を入力するとコミットメッセージが生成されます
            </div>
          )}
        </div>

        {/* Gitコマンド */}
        <div className="theme-card p-5 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-wider text-text/50">
              🚀 Git コマンド (まとめて実行用)
            </h4>
            {gitCommands && (
              <button
                onClick={() => handleCopy(gitCommands, 'cmd')}
                className="theme-btn p-1.5 text-[10px] bg-secondary border-border text-text flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_0px_var(--border)]"
              >
                {copiedType === 'cmd' ? 'コピー完了' : 'コピー'}
              </button>
            )}
          </div>
          {gitCommands ? (
            <pre className="p-3 bg-slate-950 text-slate-100 font-mono text-xs rounded-lg border border-border overflow-x-auto shadow-inner select-all leading-normal">
              {gitCommands}
            </pre>
          ) : (
            <div className="p-3 text-text/40 text-xs font-bold bg-secondary/30 border-2 border-dashed border-border/20 rounded-lg text-center shadow-inner">
              必要な項目を入力するとコマンドが自動構成されます
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
