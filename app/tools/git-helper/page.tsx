'use client';

import ToolPageLayout from '@/src/components/ToolPageLayout';
import { useState, useMemo } from 'react';
import { Terminal, Search, Copy, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

interface Param {
  key: string;
  label: string;
  placeholder: string;
  defaultValue: string;
}

interface GitUseCase {
  id: string;
  category: 'commit' | 'branch' | 'undo' | 'remote' | 'history';
  title: string;
  description: string;
  template: string;
  params: Param[];
  warning?: string;
}

const CATEGORIES = [
  { id: 'all', name: 'すべて', emoji: '📂' },
  { id: 'commit', name: 'コミット', emoji: '💾' },
  { id: 'branch', name: 'ブランチ操作', emoji: '🌿' },
  { id: 'undo', name: '取り消し・復旧', emoji: '⚠️' },
  { id: 'remote', name: 'リモート同期', emoji: '☁️' },
  { id: 'history', name: '履歴・ログ', emoji: '📊' },
] as const;

const USE_CASES: GitUseCase[] = [
  {
    id: 'commit-amend-message',
    category: 'commit',
    title: '直前のコミットメッセージを修正する',
    description:
      'まだリモートにプッシュしていない直前のローカルコミットのメッセージを上書き修正します。',
    template: 'git commit --amend -m "[message]"',
    params: [
      {
        key: 'message',
        label: '新しいメッセージ',
        placeholder: 'fix: 軽微なバグの修正',
        defaultValue: 'fix: typo',
      },
    ],
    warning:
      '既にリモートにプッシュされているコミットのメッセージを書き換えると、履歴の競合が発生します。',
  },
  {
    id: 'commit-amend-file',
    category: 'commit',
    title: '変更ファイルを直前のコミットに含める',
    description:
      'コミットし忘れたファイルを、新規のコミットを作らずに直前のコミットへ追加統合します。',
    template: 'git add [file_path]\ngit commit --amend --no-edit',
    params: [
      {
        key: 'file_path',
        label: '追加するファイルパス',
        placeholder: 'src/components/Header.tsx',
        defaultValue: 'src/index.css',
      },
    ],
  },
  {
    id: 'branch-create',
    category: 'branch',
    title: '新しいブランチを作成して切り替える',
    description:
      '現在のブランチから新しい作業用ブランチを作成し、同時にそのブランチにチェックアウトします。',
    template: 'git checkout -b [branch_name]',
    params: [
      {
        key: 'branch_name',
        label: '作成するブランチ名',
        placeholder: 'feature/new-button',
        defaultValue: 'feature/login',
      },
    ],
  },
  {
    id: 'branch-delete-local',
    category: 'branch',
    title: 'ローカルブランチを強制削除する',
    description: 'マージ済みの有無に関わらず、不要になったローカルのブランチを強制的に削除します。',
    template: 'git branch -D [branch_name]',
    params: [
      {
        key: 'branch_name',
        label: '削除するブランチ名',
        placeholder: 'feature/old-test',
        defaultValue: 'feature/abandoned',
      },
    ],
    warning:
      'この操作は元に戻せません。未マージのコミットが含まれている場合、それらもすべて失われます。',
  },
  {
    id: 'branch-rename',
    category: 'branch',
    title: '現在のローカルブランチ名を変更する',
    description: '今チェックアウトしているブランチの名前を、新しい名称に変更します。',
    template: 'git branch -m [new_branch_name]',
    params: [
      {
        key: 'new_branch_name',
        label: '新しいブランチ名',
        placeholder: 'feature/revised-name',
        defaultValue: 'feature/main-update',
      },
    ],
  },
  {
    id: 'undo-revert',
    category: 'undo',
    title: '特定のコミットを打ち消す (Revert)',
    description:
      '過去のコミット履歴を残したまま、そのコミットによる変更を「打ち消すコミット」を新しく作ります。',
    template: 'git revert [commit_hash]',
    params: [
      {
        key: 'commit_hash',
        label: '打ち消したいコミットID',
        placeholder: 'a1b2c3d4',
        defaultValue: 'abc1234',
      },
    ],
  },
  {
    id: 'undo-reset-hard',
    category: 'undo',
    title: '指定したコミットまで完全に戻す (破壊的)',
    description:
      '指定したコミット以降のすべてのコミット履歴と、現在編集中の未コミットの変更をすべて破棄します。',
    template: 'git reset --hard [commit_hash]',
    params: [
      {
        key: 'commit_hash',
        label: '戻したい地点のコミットID',
        placeholder: 'a1b2c3d4',
        defaultValue: 'main',
      },
    ],
    warning:
      'この操作を実行すると、指定したコミットより新しいすべてのコミット情報と作業中の変更データが完全に消去されます。',
  },
  {
    id: 'undo-discard-file',
    category: 'undo',
    title: '特定ファイルの変更を破棄して元に戻す',
    description:
      'まだステージ（git add）していない特定ファイルの作業コピーの変更を完全に破棄して元に戻します。',
    template: 'git checkout -- [file_path]',
    params: [
      {
        key: 'file_path',
        label: '元に戻すファイルパス',
        placeholder: 'src/config/site.ts',
        defaultValue: 'src/lib/helper.ts',
      },
    ],
  },
  {
    id: 'undo-clean',
    category: 'undo',
    title: 'Git管理外のファイルを強制クリーンアップする',
    description:
      'リポジトリ内に新しく作られた、Gitの追跡対象になっていない未追跡ファイルを一括で強制削除します。',
    template: 'git clean -fd',
    params: [],
    warning:
      'この操作を実行すると、.gitignoreに指定されていない不要なファイルやフォルダが即時かつ完全に削除されます。',
  },
  {
    id: 'remote-force-push',
    category: 'remote',
    title: 'リモートブランチへ強制プッシュする',
    description:
      'ローカルリポジトリでコミット書き換え（resetやamend等）を行った後、リモートブランチを強制的に上書きします。',
    template: 'git push origin [branch_name] --force-with-lease',
    params: [
      {
        key: 'branch_name',
        label: 'プッシュ先ブランチ名',
        placeholder: 'feature/main',
        defaultValue: 'feature/login',
      },
    ],
    warning:
      '強制プッシュは他人が共有して作業しているブランチの履歴を壊す危険があります。--force-with-lease の使用を推奨します。',
  },
  {
    id: 'remote-set-url',
    category: 'remote',
    title: 'リモートリポジトリのURLを変更する',
    description:
      'GitHubの移行などでリポジトリの接続先（originなど）のURLが変更になった際の設定を書き換えます。',
    template: 'git remote set-url origin [url]',
    params: [
      {
        key: 'url',
        label: '新しいリモートURL',
        placeholder: 'git@github.com:user/repo.git',
        defaultValue: 'https://github.com/user/repo.git',
      },
    ],
  },
  {
    id: 'history-graph',
    category: 'history',
    title: 'コミット履歴を1行でグラフィカルに表示する',
    description:
      'コンソール上にブランチの分岐・合流を線画（グラフ）で表示し、コミット履歴をわかりやすく1行ずつ表示します。',
    template: 'git log --oneline --graph --all',
    params: [],
  },
  {
    id: 'history-file-log',
    category: 'history',
    title: '特定ファイルの変更履歴コミットを表示する',
    description: '指定したファイルが過去どのコミットで変更されてきたかを抽出して履歴表示します。',
    template: 'git log -p [file_path]',
    params: [
      {
        key: 'file_path',
        label: 'ファイルパス',
        placeholder: 'package.json',
        defaultValue: 'package.json',
      },
    ],
  },
];

export default function GitHelper() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeUseCase, setActiveUseCase] = useState<GitUseCase>(USE_CASES[0]);

  // パラメータ入力値の格納
  const [inputParams, setInputParams] = useState<Record<string, string>>({});
  const { copied, copy } = useCopyToClipboard();

  // カテゴリやユースケースの選択時にパラメータ入力値を初期化
  const selectUseCase = (useCase: GitUseCase) => {
    setActiveUseCase(useCase);
    const initial: Record<string, string> = {};
    useCase.params.forEach((p) => {
      initial[p.key] = p.defaultValue;
    });
    setInputParams(initial);
  };

  // 最初のロード時、またはユースケース変更時にパラメータを初期設定
  useState(() => {
    selectUseCase(USE_CASES[0]);
  });

  const handleParamChange = (key: string, value: string) => {
    setInputParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 検索＆フィルタリング
  const filteredUseCases = useMemo(() => {
    return USE_CASES.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.template.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // 動的コマンドの生成
  const generatedCommand = useMemo(() => {
    let cmd = activeUseCase.template;
    activeUseCase.params.forEach((p) => {
      const val = inputParams[p.key] || p.placeholder;
      cmd = cmd.replace(`[${p.key}]`, val);
    });
    return cmd;
  }, [activeUseCase, inputParams]);

  const handleCopy = () => {
    copy(generatedCommand);
  };

  return (
    <ToolPageLayout
      title="Git Command Helper"
      description="開発中によく直面するGit操作のユースケース（やりたいこと）を選び、パラメータを入力して、最適なコマンドを安全かつ迅速に生成します。"
      icon={Terminal}
    >
      <div className="max-w-6xl mx-auto">
        {/* 検索・コントロールバー */}
        <div className="bg-card border border-border/70 rounded-3xl p-4 md:p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/45" />
            <input
              type="text"
              placeholder="Gitの目的やコマンドで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-secondary border border-border text-text placeholder-text/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer flex items-center gap-1
                  ${
                    selectedCategory === cat.id
                      ? 'bg-accent border-accent text-white shadow-sm'
                      : 'bg-secondary/40 border-border text-text/80 hover:bg-secondary/60'
                  }
                `}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* メイングリッド */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 左側: ユースケース一覧 (5列) */}
          <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-sm max-h-[600px] overflow-y-auto">
            <span className="block text-xs font-bold text-text/50 uppercase tracking-wider mb-3 px-1">
              操作一覧 ({filteredUseCases.length}件)
            </span>
            <div className="space-y-2">
              {filteredUseCases.map((item) => (
                <button
                  key={item.id}
                  onClick={() => selectUseCase(item)}
                  className={`
                    w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1
                    ${
                      activeUseCase.id === item.id
                        ? 'bg-accent/5 border-accent/40 text-accent font-medium shadow-sm'
                        : 'bg-secondary/20 border-border/60 hover:bg-secondary/40 text-text'
                    }
                  `}
                >
                  <span className="text-xs font-bold font-mono tracking-tight text-text/40 mb-0.5">
                    {item.category.toUpperCase()}
                  </span>
                  <h3 className="text-sm font-bold text-text group-hover:text-accent truncate">
                    {item.title}
                  </h3>
                  <p className="text-text/75 text-[11px] leading-normal line-clamp-2 mt-0.5">
                    {item.description}
                  </p>
                </button>
              ))}
              {filteredUseCases.length === 0 && (
                <div className="text-center py-12 text-text/50 text-xs">
                  条件に一致するGitコマンドが見つかりませんでした。
                </div>
              )}
            </div>
          </div>

          {/* 右側: コマンド生成・パラメータ設定 (7列) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* パラメータ調整＆解説 */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-5">
              <div>
                <span className="text-[10px] font-bold text-accent tracking-wider uppercase bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                  {activeUseCase.category.toUpperCase()}
                </span>
                <h2 className="font-extrabold text-lg md:text-xl text-text mt-3 mb-2">
                  {activeUseCase.title}
                </h2>
                <p className="text-text/70 text-xs md:text-sm leading-relaxed">
                  {activeUseCase.description}
                </p>
              </div>

              {/* 注意警告 */}
              {activeUseCase.warning && (
                <div className="flex items-start gap-2.5 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-3.5 rounded-2xl">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="font-semibold leading-relaxed">
                    <strong>注意:</strong> {activeUseCase.warning}
                  </div>
                </div>
              )}

              {/* パラメータ入力欄 */}
              {activeUseCase.params.length > 0 && (
                <div className="space-y-4 pt-2 border-t border-border/60">
                  <h4 className="text-xs font-bold text-text/50 uppercase tracking-wider">
                    パラメータオプション
                  </h4>
                  <div className="space-y-3">
                    {activeUseCase.params.map((p) => (
                      <div key={p.key}>
                        <label className="block text-xs font-bold text-text/80 mb-1.5">
                          {p.label}
                        </label>
                        <input
                          type="text"
                          placeholder={p.placeholder}
                          value={inputParams[p.key] || ''}
                          onChange={(e) => handleParamChange(p.key, e.target.value)}
                          className="w-full bg-secondary border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* コマンド出力ターミナル */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md text-slate-100 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-green-400" />
                  Terminal Output
                </span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>コマンドコピー</span>
                    </>
                  )}
                </button>
              </div>

              <div className="font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-900 overflow-x-auto whitespace-pre leading-relaxed relative">
                <span className="text-green-400 select-none mr-2.5">$</span>
                {generatedCommand}
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold select-none">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>このコマンドはローカルでのみ安全に動作するように作成されています。</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
