// src/components/tools/git/GitHelper.tsx
'use client';

import { useState, useMemo, useRef } from 'react';
import { Terminal, Search, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';
import { CATEGORIES, USE_CASES, type GitUseCase } from './GitUseCases';

export default function GitHelper() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeUseCase, setActiveUseCase] = useState<GitUseCase>(USE_CASES[0]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // パラメータ入力値の格納
  const [inputParams, setInputParams] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    USE_CASES[0].params.forEach((p) => {
      initial[p.key] = p.defaultValue;
    });
    return initial;
  });
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

  // 定型コマンドパラメータの置換
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
    <div className="max-w-6xl mx-auto text-text animate-none">
      {/* 検索・コントロールバー */}
      <div className="bg-card border-2 border-border rounded-3xl p-4 md:p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_0px_var(--border)]">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/45" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Gitの目的やコマンドで検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-2.5 bg-secondary/35 border-2 border-border text-text placeholder-text/40 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-sm font-bold shadow-inner"
          />
          {searchQuery && (
            <button
              aria-label="検索条件をクリア"
              onClick={() => {
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text/40 hover:text-text cursor-pointer transition-colors p-1 focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap border-2 border-border transition-all flex items-center gap-1 cursor-pointer
                  ${
                    isActive
                      ? 'bg-accent text-white translate-x-[1px] translate-y-[1px] shadow-none'
                      : 'bg-card text-text shadow-[2.5px_2.5px_0px_0px_var(--border)] dark:shadow-[2.5px_2.5px_0px_0px_var(--accent)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--border)] dark:hover:shadow-[4px_4px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none'
                  }
                `}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* メイングリッド */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 左側: ユースケース一覧 (5列) */}
        <div className="lg:col-span-5 bg-card border-2 border-border rounded-3xl p-5 shadow-[4px_4px_0px_0px_var(--border)] max-h-[600px] overflow-y-auto">
          <span className="block text-xs font-black text-text/50 uppercase tracking-wider mb-3 px-1">
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
                      ? 'bg-accent/10 border-accent/40 text-accent font-medium shadow-sm'
                      : 'bg-secondary/20 border-border/60 hover:bg-secondary/40 text-text'
                  }
                `}
              >
                <span className="text-[9px] font-black font-mono tracking-wider text-text/40 mb-0.5">
                  {item.category.toUpperCase()}
                </span>
                <h3 className="text-xs font-black text-text group-hover:text-accent truncate">
                  {item.title}
                </h3>
                <p className="text-text/75 text-[10px] leading-normal line-clamp-2 mt-0.5 font-bold">
                  {item.description}
                </p>
              </button>
            ))}
            {filteredUseCases.length === 0 && (
              <div className="text-center py-12 text-text/50 text-xs font-bold">
                条件に一致するGitコマンドが見つかりませんでした。
              </div>
            )}
          </div>
        </div>

        {/* 右側: コマンド生成・パラメータ設定 (7列) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* パラメータ調整＆解説 */}
          <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-[4px_4px_0px_0px_var(--border)] flex flex-col gap-5">
            <div>
              <span className="text-[9px] font-black text-accent tracking-wider uppercase bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                {activeUseCase.category.toUpperCase()}
              </span>
              <h2 className="font-extrabold text-base md:text-lg text-text mt-3 mb-2">
                {activeUseCase.title}
              </h2>
              <p className="text-text/70 text-xs md:text-sm leading-relaxed font-bold">
                {activeUseCase.description}
              </p>
            </div>

            {/* 注意警告 */}
            {activeUseCase.warning && (
              <div className="flex items-start gap-2.5 text-xs bg-amber-500/10 border-2 border-amber-500 text-amber-600 dark:text-amber-400 p-3.5 rounded-2xl font-bold shadow-sm">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>注意:</strong> {activeUseCase.warning}
                </div>
              </div>
            )}

            {/* パラメータ入力欄 */}
            {activeUseCase.params.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-border/20">
                <h4 className="text-xs font-black text-text/50 uppercase tracking-wider">
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
                        className="w-full bg-secondary/30 border-2 border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent font-bold shadow-inner"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* コマンド出力ターミナル */}
          <div className="bg-slate-900 border-2 border-border rounded-3xl p-6 shadow-[4px_4px_0px_0px_var(--border)] text-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-green-400" />
                Terminal Output
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                {copied ? 'コピー完了' : 'コマンドコピー'}
              </button>
            </div>

            <div className="font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-900 overflow-x-auto whitespace-pre leading-relaxed relative shadow-inner select-all">
              <span className="text-green-400 select-none mr-2.5">$</span>
              {generatedCommand}
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-[9px] text-slate-500 font-bold select-none">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>このコマンドはローカルでのみ安全に動作するように作成されています。</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
