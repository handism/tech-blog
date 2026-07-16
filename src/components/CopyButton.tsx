// src/components/CopyButton.tsx
'use client';

import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';
import { Check, Copy, type LucideIcon } from 'lucide-react';

type CopyButtonProps = {
  /** クリップボードにコピーする値 */
  value: string;
  /** 通常時のラベル。空文字を渡すとアイコンのみ表示になる */
  label?: string;
  /** コピー後のラベル */
  copiedLabel?: string;
  className?: string;
  /** アイコンを表示するかどうか（テキストのみのボタン用） */
  showIcon?: boolean;
  icon?: LucideIcon;
  copiedIcon?: LucideIcon;
  iconClassName?: string;
  copiedIconClassName?: string;
  copiedLabelClassName?: string;
  disabled?: boolean;
  title?: string;
};

const DEFAULT_CLASSNAME =
  'theme-btn px-3 py-1.5 text-xs flex items-center gap-1.5 hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded';

/**
 * コピー実行と「コピー完了」表示切り替えを内包した汎用コピーボタン。
 * 見た目は className 系 props で個別に調整できる。
 */
export default function CopyButton({
  value,
  label = 'コピー',
  copiedLabel = 'コピーしました',
  className = DEFAULT_CLASSNAME,
  showIcon = true,
  icon: Icon = Copy,
  copiedIcon: CopiedIcon = Check,
  iconClassName = 'w-3.5 h-3.5',
  copiedIconClassName = 'w-3.5 h-3.5 text-accent',
  copiedLabelClassName,
  disabled = false,
  title,
}: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      type="button"
      onClick={() => copy(value)}
      disabled={disabled}
      title={title}
      className={className}
      aria-label={!label ? (copied ? copiedLabel || 'コピーしました' : 'コピー') : undefined}
    >
      {copied ? (
        <>
          {showIcon && <CopiedIcon className={copiedIconClassName} />}
          {copiedLabel && <span className={copiedLabelClassName}>{copiedLabel}</span>}
        </>
      ) : (
        <>
          {showIcon && <Icon className={iconClassName} />}
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
}
