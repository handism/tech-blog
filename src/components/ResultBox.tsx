import CopyButton from '@/src/components/CopyButton';

interface ResultBoxProps {
  value: string;
  label?: string;
  className?: string;
}

export default function ResultBox({ value, label = '生成結果', className = '' }: ResultBoxProps) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-text/70">{label}</span>
        <CopyButton value={value} label="コピー" copiedLabel="コピーしました" />
      </div>
      <div className="theme-card p-4 bg-secondary font-mono text-sm text-text break-all">
        {value}
      </div>
    </div>
  );
}
