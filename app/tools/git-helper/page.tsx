'use client';

import ToolPageLayout from '@/src/components/ToolPageLayout';
import { useState, useMemo } from 'react';
import { Terminal, Search, Copy, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';
import { CATEGORIES, USE_CASES, type GitUseCase } from './constants/use-cases';

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
