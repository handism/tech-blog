// src/components/BackupSettings.tsx
'use client';

import React, { useState } from 'react';
import { Download, Upload, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import {
  ALL_STORAGE_KEYS,
  STORAGE_KEY_GROUPS,
  type StorageKeyGroup,
  isKnownStorageKey,
} from '@/src/config/storage-keys';
import { downloadText } from '@/src/lib/download';
import {
  safeReadStringFromStorage,
  safeRemoveFromStorage,
  safeWriteStringToStorage,
} from '@/src/lib/storage';
import { useNotice } from '@/src/components/NoticeProvider';

/**
 * 学習進捗や各種カスタム設定のバックアップ（JSONエクスポート）・インポート・リセット機能を提供するコンポーネント。
 * 対象キーは `src/config/storage-keys.ts` の登録内容から自動的に決まる。
 */
export function BackupSettings() {
  const { notify, confirm } = useNotice();
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // リセット用のチェックボックス状態
  const [resetOptions, setResetOptions] = useState<Record<StorageKeyGroup, boolean>>({
    progress: true,
    uiSettings: false,
    toolData: false,
  });

  // エクスポート処理
  const handleExport = () => {
    try {
      const backupData: Record<string, string | null> = {};
      ALL_STORAGE_KEYS.forEach((key) => {
        backupData[key] = safeReadStringFromStorage(key);
      });

      downloadText(
        JSON.stringify(backupData, null, 2),
        `antigravity-backup-${new Date().toISOString().slice(0, 10)}.json`,
        'application/json'
      );
    } catch (e) {
      console.error('Export failed:', e);
      notify('データのエクスポートに失敗しました。', 'error');
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
        const backupData: unknown = JSON.parse(text);

        if (typeof backupData !== 'object' || backupData === null || Array.isArray(backupData)) {
          throw new Error('Invalid JSON format');
        }

        // 登録済みのキーのみ復元する（未知のキーを localStorage に書き込まない）
        Object.entries(backupData).forEach(([key, value]) => {
          if (isKnownStorageKey(key) && typeof value === 'string') {
            safeWriteStringToStorage(key, value);
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
  const handleReset = async () => {
    const activeGroups = (Object.keys(resetOptions) as StorageKeyGroup[]).filter(
      (group) => resetOptions[group]
    );

    if (activeGroups.length === 0) {
      notify('リセットする項目を選択してください。', 'error');
      return;
    }

    const confirmed = await confirm(
      '選択したデータを本当に削除して初期化しますか？\nこの操作は取り消せません。',
      { confirmLabel: '削除する', destructive: true }
    );
    if (!confirmed) return;

    activeGroups.forEach((group) => {
      STORAGE_KEY_GROUPS[group].forEach((key) => safeRemoveFromStorage(key));
    });

    notify('選択したデータを初期化しました。ページを再読み込みします...', 'success');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
              checked={resetOptions.toolData}
              onChange={(e) => setResetOptions({ ...resetOptions, toolData: e.target.checked })}
              className="mt-1 rounded border-border text-accent focus:ring-accent"
            />
            <div>
              <span className="font-semibold text-text">ツールのデータ</span>
              <span className="block text-xs text-text opacity-50 font-normal">
                電卓・ポモドーロの履歴や設定、マークダウンエディタの下書き、AWS
                構成図、キーボード配列設定
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
