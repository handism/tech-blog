// src/config/storage-keys.ts

/**
 * サイト全体で使用する localStorage キーの一覧（正）。
 * 新しく localStorage を使う機能を追加する際は必ずここへ登録し、`STORAGE_KEY_GROUPS` にも振り分けること。
 * 設定画面のバックアップ（エクスポート／インポート）・リセット対象はこの定義から自動生成される。
 */
export const STORAGE_KEYS = {
  learningProgress: 'learning-progress',
  theme: 'design-theme',
  layout: 'layout-mode',
  effects: 'effects-enabled',
  markdownDraft: 'markdown_draft',
  calcHistory: 'calc_history',
  pomodoroWorkTime: 'pomodoro_work_time',
  pomodoroBreakTime: 'pomodoro_break_time',
  pomodoroHistory: 'pomodoro_history',
  awsDiagramData: 'handism_aws_diagram_data',
  keyboardLayout: 'keyboard-layout',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * 設定画面のリセット単位ごとのキーのグループ。
 */
export const STORAGE_KEY_GROUPS = {
  progress: [STORAGE_KEYS.learningProgress],
  uiSettings: [STORAGE_KEYS.theme, STORAGE_KEYS.layout, STORAGE_KEYS.effects],
  toolData: [
    STORAGE_KEYS.markdownDraft,
    STORAGE_KEYS.calcHistory,
    STORAGE_KEYS.pomodoroWorkTime,
    STORAGE_KEYS.pomodoroBreakTime,
    STORAGE_KEYS.pomodoroHistory,
    STORAGE_KEYS.awsDiagramData,
    STORAGE_KEYS.keyboardLayout,
  ],
} as const satisfies Record<string, readonly StorageKey[]>;

export type StorageKeyGroup = keyof typeof STORAGE_KEY_GROUPS;

export const ALL_STORAGE_KEYS: readonly StorageKey[] = Object.values(STORAGE_KEYS);

export function isKnownStorageKey(key: string): key is StorageKey {
  return (ALL_STORAGE_KEYS as readonly string[]).includes(key);
}
