// src/components/BackupSettings.tsx
'use client';

import React, { useState } from 'react';
import { Download, Upload, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { THEME_STORAGE_KEY, EFFECTS_STORAGE_KEY } from '@/src/config/themes';
import { LAYOUT_STORAGE_KEY } from '@/src/config/layout';

/**
 * 学習進捗や各種カスタム設定のバックアップ（JSONエクスポート）・インポート・リセット機能を提供するコンポーネント。
 */
export function BackupSettings() {
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // リセット用のチェックボックス状態
  const [resetOptions, setResetOptions] = useState({
    progress: true,
    uiSettings: false,
    toolHistory: false,
  });

  // エクスポート処理
  const handleExport = () => {
    try {
      const backupData: Record<string, string | null> = {};
      const keysToExport = [
        'learning-progress',
        THEME_STORAGE_KEY,
        LAYOUT_STORAGE_KEY,
        EFFECTS_STORAGE_KEY,
        'markdown_draft',
        'calc_history',
      ];

      keysToExport.forEach((key) => {
        backupData[key] = localStorage.getItem(key);
      });

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `antigravity-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed:', e);
      alert('データのエクスポートに失敗しました。');
    }
  };

  // インポート処理
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const backupData = JSON.parse(text);

        if (typeof backupData !== 'object' || backupData === null) {
          throw new Error('Invalid JSON format');
        }

        // バリデーションと適用
        Object.entries(backupData).forEach(([key, value]) => {
          if (value !== null && typeof value === 'string') {
            localStorage.setItem(key, value);
          }
        });

        setImportStatus({
          type: 'success',
          message:
            'バックアップデータを正常にインポートしました。反映のためページをリロードしています...',
        });

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        console.error('Import failed:', err);
        setImportStatus({
          type: 'error',
          message: 'インポートに失敗しました。正しいバックアップJSONファイルを選択してください。',
        });
      }
    };
    reader.readAsText(file);
  };

  // リセット処理
  const handleReset = () => {
    const activeOptions = Object.entries(resetOptions)
      .filter(([_, enabled]) => enabled)
      .map(([key]) => key);

    if (activeOptions.length === 0) {
      alert('リセットする項目を選択してください。');
      return;
    }

    const confirmMessage =
      '選択したデータを本当に削除して初期化しますか？\nこの操作は取り消せません。';
    if (!window.confirm(confirmMessage)) return;

    try {
      if (resetOptions.progress) {
        localStorage.removeItem('learning-progress');
      }
      if (resetOptions.uiSettings) {
        localStorage.removeItem(THEME_STORAGE_KEY);
        localStorage.removeItem(LAYOUT_STORAGE_KEY);
        localStorage.removeItem(EFFECTS_STORAGE_KEY);
      }
      if (resetOptions.toolHistory) {
        localStorage.removeItem('markdown_draft');
        localStorage.removeItem('calc_history');
      }

      alert('選択したデータを初期化しました。');
      window.location.reload();
    } catch (e) {
      console.error('Reset failed:', e);
      alert('データのリセット中にエラーが発生しました。');
    }
  };

  return (
    <div className="space-y-6">
      {/* 復元 / 保存パネル */}
      <div className="theme-card p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-base font-bold text-text mb-2 flex items-center gap-2">
            <Download className="w-4 h-4 text-accent" />
            <span>データのエクスポート</span>
          </h3>
          <p className="text-xs text-text opacity-60 mb-4 leading-relaxed">
            学習の進捗状況、カスタムテーマの設定、および一部ツールの履歴データを1つのJSONファイルとしてエクスポートします。
          </p>
          <button
            onClick={handleExport}
            className="theme-btn py-2.5 px-4 text-sm inline-flex items-center gap-2 font-bold hover:scale-[1.01] active:scale-[0.99] transition-transform"
          >
            <Download className="w-4 h-4" />
            <span>バックアップファイルをダウンロード</span>
          </button>
        </div>

        <div>
          <h3 className="text-base font-bold text-text mb-2 flex items-center gap-2">
            <Upload className="w-4 h-4 text-accent" />
            <span>データのインポート</span>
          </h3>
          <p className="text-xs text-text opacity-60 mb-4 leading-relaxed">
            エクスポートしたバックアップJSONファイルから、学習進捗や各種設定データを復元します。
          </p>
          <div className="relative inline-block">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              id="backup-import-file"
              aria-label="バックアップファイルをアップロードして復元する"
            />
            <button className="theme-btn py-2.5 px-4 text-sm inline-flex items-center gap-2 font-bold hover:scale-[1.01] transition-transform">
              <Upload className="w-4 h-4" />
              <span>ファイルを選択してインポート</span>
            </button>
          </div>

          {importStatus && (
            <div
              className={`mt-3 p-3 rounded text-xs flex items-center gap-2 border ${
                importStatus.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
              }`}
            >
              {importStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* データ削除パネル */}
      <div className="theme-card p-6 border-red-500/20 bg-red-500/[0.02]">
        <h3 className="text-base font-bold text-text mb-2 flex items-center gap-2 text-red-600 dark:text-red-400">
          <Trash2 className="w-4 h-4" />
          <span>データのリセット</span>
        </h3>
        <p className="text-xs text-text opacity-60 mb-4 leading-relaxed">
          ブラウザに保存されている各種データを個別にリセットします。リセットされたデータは元に戻せません。
        </p>

        {/* 選択チェックボックス */}
        <div className="space-y-3 mb-5 max-w-xl">
          <label className="flex items-start gap-3 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={resetOptions.progress}
              onChange={(e) => setResetOptions({ ...resetOptions, progress: e.target.checked })}
              className="mt-1 rounded border-border text-accent focus:ring-accent"
            />
            <div>
              <span className="font-semibold text-text">学習の進捗状況</span>
              <span className="block text-xs text-text opacity-50 font-normal">
                学習ガイドの「読了チェック」マークやクイズ結果の履歴
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={resetOptions.uiSettings}
              onChange={(e) => setResetOptions({ ...resetOptions, uiSettings: e.target.checked })}
              className="mt-1 rounded border-border text-accent focus:ring-accent"
            />
            <div>
              <span className="font-semibold text-text">デザインテーマとレイアウト設定</span>
              <span className="block text-xs text-text opacity-50 font-normal">
                現在選択されているデザインテーマ、表示カラム数、エフェクト有効化設定
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={resetOptions.toolHistory}
              onChange={(e) => setResetOptions({ ...resetOptions, toolHistory: e.target.checked })}
              className="mt-1 rounded border-border text-accent focus:ring-accent"
            />
            <div>
              <span className="font-semibold text-text">ツール履歴データ</span>
              <span className="block text-xs text-text opacity-50 font-normal">
                電卓の計算履歴や、マークダウンエディタの下書きテキスト
              </span>
            </div>
          </label>
        </div>

        <button
          onClick={handleReset}
          className="theme-btn border-red-600/30 hover:border-red-600 hover:bg-red-600 hover:text-white py-2.5 px-4 text-sm inline-flex items-center gap-2 font-bold transition-all"
        >
          <Trash2 className="w-4 h-4" />
          <span>選択した項目を削除する</span>
        </button>
      </div>
    </div>
  );
}
