'use client';

import ToolPageLayout from '@/src/components/ToolPageLayout';
import { Code } from 'lucide-react';
import { useState } from 'react';
import ResultBox from '@/src/components/ResultBox';

const generateUuid = () => {
  if (typeof crypto?.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join('-');
};

export default function UuidGenerator() {
  const [output, setOutput] = useState('');

  const handleGenerate = () => {
    setOutput(generateUuid());
  };

  return (
    <ToolPageLayout
      title="UUID Generator"
      description="ボタンを押すだけで UUID v4 を生成できます。"
      icon={Code}
    >
      <div className="space-y-6">
        <p className="text-text/80 font-medium">ボタンを押すだけで UUID v4 を生成できます。</p>

        <button onClick={handleGenerate} className="theme-btn px-5 py-3 font-bold text-sm">
          生成
        </button>

        {output && <ResultBox value={output} />}
      </div>
    </ToolPageLayout>
  );
}
