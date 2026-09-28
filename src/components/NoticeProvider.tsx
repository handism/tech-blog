// src/components/NoticeProvider.tsx
'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export type NoticeVariant = 'info' | 'success' | 'error';

export interface ConfirmOptions {
  confirmLabel?: string;
  cancelLabel?: string;
  /** 削除・リセット等の破壊的操作なら true（確定ボタンを警告色にする） */
  destructive?: boolean;
}

interface NoticeContextValue {
  /** トースト通知を表示する（window.alert の代替） */
  notify: (message: string, variant?: NoticeVariant) => void;
  /** 確認ダイアログを表示し、確定なら true を返す（window.confirm の代替） */
  confirm: (message: string, options?: ConfirmOptions) => Promise<boolean>;
}

interface Toast {
  id: number;
  message: string;
  variant: NoticeVariant;
}

interface PendingConfirm {
  message: string;
  options: ConfirmOptions;
  resolve: (result: boolean) => void;
}

const TOAST_DURATION_MS = 4000;

/**
 * プロバイダ外（テスト・単体描画など）で呼ばれた場合はブラウザ標準ダイアログへフォールバックする。
 */
const fallbackNotice: NoticeContextValue = {
  notify: (message) => window.alert(message),
  confirm: async (message) => window.confirm(message),
};

const NoticeContext = createContext<NoticeContextValue>(fallbackNotice);

const TOAST_STYLES: Record<NoticeVariant, { icon: typeof Info; className: string }> = {
  info: { icon: Info, className: 'text-accent' },
  success: { icon: CheckCircle2, className: 'text-emerald-600 dark:text-emerald-400' },
  error: { icon: AlertTriangle, className: 'text-red-600 dark:text-red-400' },
};

/**
 * テーマに馴染むトースト通知と確認ダイアログを提供する。
 * ブロッキングな window.alert / window.confirm の代わりに `useNotice()` 経由で使う。
 */
export function NoticeProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nextIdRef = useRef(0);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, variant: NoticeVariant = 'info') => {
      const id = nextIdRef.current++;
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => dismissToast(id), TOAST_DURATION_MS);
    },
    [dismissToast]
  );

  const confirm = useCallback((message: string, options: ConfirmOptions = {}) => {
    return new Promise<boolean>((resolve) => {
      setPending((prev) => {
        // 確認待ちの最中に新しい確認が来た場合、前のものはキャンセル扱いにする
        prev?.resolve(false);
        return { message, options, resolve };
      });
    });
  }, []);

  const settle = useCallback(
    (result: boolean) => {
      pending?.resolve(result);
      setPending(null);
    },
    [pending]
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (pending && !dialog.open) dialog.showModal();
    if (!pending && dialog.open) dialog.close();
  }, [pending]);

  const value = useMemo(() => ({ notify, confirm }), [notify, confirm]);

  return (
    <NoticeContext.Provider value={value}>
      {children}

      <div
        className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)] pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const { icon: Icon, className } = TOAST_STYLES[toast.variant];
          return (
            <div
              key={toast.id}
              role={toast.variant === 'error' ? 'alert' : 'status'}
              className="theme-card pointer-events-auto flex items-start gap-3 p-3 text-sm text-text shadow-lg"
            >
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${className}`} aria-hidden="true" />
              <p className="flex-1 whitespace-pre-line leading-relaxed">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                aria-label="通知を閉じる"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      <dialog
        ref={dialogRef}
        onCancel={(e) => {
          // Esc キー: ネイティブの close に任せず、Promise を解決してから閉じる
          e.preventDefault();
          settle(false);
        }}
        className="theme-card m-auto p-0 max-w-md w-[calc(100%-2rem)] text-text backdrop:bg-black/50"
      >
        {pending && (
          <div className="p-6 space-y-5">
            <p className="text-sm whitespace-pre-line leading-relaxed">{pending.message}</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => settle(false)}
                className="theme-btn py-2 px-4 text-sm font-bold"
                autoFocus
              >
                {pending.options.cancelLabel ?? 'キャンセル'}
              </button>
              <button
                type="button"
                onClick={() => settle(true)}
                className={`theme-btn py-2 px-4 text-sm font-bold ${
                  pending.options.destructive
                    ? 'border-red-600/30 hover:border-red-600 hover:bg-red-600 hover:text-white'
                    : ''
                }`}
              >
                {pending.options.confirmLabel ?? 'OK'}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </NoticeContext.Provider>
  );
}

export function useNotice(): NoticeContextValue {
  return useContext(NoticeContext);
}
