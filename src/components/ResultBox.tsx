'use client';

import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';
import { Check, Copy } from 'lucide-react';

interface ResultBoxProps {
  value: string;
  label?: string;
  className?: string;
}

export default function ResultBox({ value, label = '生成結果', className = '' }: ResultBoxProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-text/70">{label}</span>
        <button
          onClick={() => copy(value)}
          className="theme-btn px-3 py-1.5 text-xs flex items-center gap-1.5 hover:text-accent transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-accent" />
              <span>コピーしました</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>コピー</span>
            </>
          )}
        </button>
      </div>
      <div className="theme-card p-4 bg-secondary font-mono text-sm text-text break-all">
        {value}
      </div>
    </div>
  );
}
