'use client';

import { useState } from 'react';
import { ToggleLeft, Hash, Cpu, AlertCircle } from 'lucide-react';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

export default function BitwiseConverter() {
  const { copy } = useCopyToClipboard();
  // 32bit 符号なし整数をベース状態として管理
  const [baseVal, setBaseVal] = useState<number>(42);
  const [bitMode, setBitMode] = useState<8 | 16 | 32>(8);

  // 各フィールドの表示用状態
  const [binStr, setBinStr] = useState('101010');
  const [octStr, setOctStr] = useState('52');
  const [decStr, setDecStr] = useState('42');
  const [hexStr, setHexStr] = useState('2a');

  // ビット演算用状態
  const [valA, setValA] = useState<number>(170); // 10101010
  const [valB, setValB] = useState<number>(85); // 01010101

  const [copiedText, setCopiedText] = useState('');

  const syncStrings = (val: number, exclude?: 'bin' | 'oct' | 'dec' | 'hex') => {
    const v = Math.max(0, Math.min(4294967295, val));
    if (exclude !== 'bin') setBinStr(v.toString(2));
    if (exclude !== 'oct') setOctStr(v.toString(8));
    if (exclude !== 'dec') setDecStr(v.toString(10));
    if (exclude !== 'hex') setHexStr(v.toString(16).toLowerCase());
  };

  const updateBaseVal = (val: number, exclude?: 'bin' | 'oct' | 'dec' | 'hex') => {
    const v = Math.max(0, Math.min(4294967295, val));
    setBaseVal(v);
    syncStrings(v, exclude);
  };

  const handleCopy = (text: string) => {
    copy(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  // 進数変換フィールドの変更ハンドラ
  const handleBinChange = (val: string) => {
    const clean = val.replace(/[^01]/g, '');
    setBinStr(clean);
    if (clean === '') {
      updateBaseVal(0, 'bin');
      return;
    }
    const num = parseInt(clean, 2);
    if (!isNaN(num)) updateBaseVal(num, 'bin');
  };

  const handleOctChange = (val: string) => {
    const clean = val.replace(/[^0-7]/g, '');
    setOctStr(clean);
    if (clean === '') {
      updateBaseVal(0, 'oct');
      return;
    }
    const num = parseInt(clean, 8);
    if (!isNaN(num)) updateBaseVal(num, 'oct');
  };

  const handleDecChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    setDecStr(clean);
    if (clean === '') {
      updateBaseVal(0, 'dec');
      return;
    }
    const num = parseInt(clean, 10);
    if (!isNaN(num)) updateBaseVal(num, 'dec');
  };

  const handleHexChange = (val: string) => {
    const clean = val.replace(/[^0-9a-fA-F]/g, '');
    setHexStr(clean);
    if (clean === '') {
      updateBaseVal(0, 'hex');
      return;
    }
    const num = parseInt(clean, 16);
    if (!isNaN(num)) updateBaseVal(num, 'hex');
  };

  // ビットのクリックトグル
  const handleBitToggle = (bitIndex: number) => {
    // bitIndex番目のビットを反転
    const mask = 1 << bitIndex;
    // JSのビット演算は32bit符号あり整数として評価されるため、符号なし整数に戻すための >>> 0
    const nextVal = (baseVal ^ mask) >>> 0;
    updateBaseVal(nextVal);
  };

  // 指定されたビット幅でビット配列を生成 (MSB to LSB)
  const getBits = () => {
    const bits = [];
    for (let i = bitMode - 1; i >= 0; i--) {
      // i番目のビットが1かどうか
      const isOn = ((baseVal >> i) & 1) === 1;
      bits.push({ index: i, isOn });
    }
    return bits;
  };

  // ビット演算の結果計算
  const andResult = (valA & valB) >>> 0;
  const orResult = (valA | valB) >>> 0;
  const xorResult = (valA ^ valB) >>> 0;
  const notAResult = ~valA >>> 0;

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* 左側: 進数変換＆ビット編集 (7列) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* 進数変換入力フォーム */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <h2 className="font-bold text-base md:text-lg mb-2 flex items-center gap-2">
                <Hash className="w-4 h-4 text-accent" /> 進数変換 (Radix Converter)
              </h2>

              <div className="space-y-4">
                {/* 10進数 */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-text/80">10進数 (Decimal)</label>
                    <button
                      onClick={() => handleCopy(decStr)}
                      className="text-[10px] text-accent hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
                    >
                      {copiedText === decStr ? 'コピー完了!' : 'コピー'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={decStr}
                    onChange={(e) => handleDecChange(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                {/* 16進数 */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-text/80">16進数 (Hexadecimal)</label>
                    <button
                      onClick={() => handleCopy(`0x${hexStr}`)}
                      className="text-[10px] text-accent hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
                    >
                      {copiedText === `0x${hexStr}` ? 'コピー完了!' : 'コピー'}
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-text/40 font-bold select-none">
                      0x
                    </span>
                    <input
                      type="text"
                      value={hexStr}
                      onChange={(e) => handleHexChange(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                {/* 2進数 */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-text/80">2進数 (Binary)</label>
                    <button
                      onClick={() => handleCopy(binStr)}
                      className="text-[10px] text-accent hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
                    >
                      {copiedText === binStr ? 'コピー完了!' : 'コピー'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={binStr}
                    onChange={(e) => handleBinChange(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent break-all"
                  />
                </div>

                {/* 8進数 */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-text/80">8進数 (Octal)</label>
                    <button
                      onClick={() => handleCopy(`0o${octStr}`)}
                      className="text-[10px] text-accent hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
                    >
                      {copiedText === `0o${octStr}` ? 'コピー完了!' : 'コピー'}
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-text/40 font-bold select-none">
                      0o
                    </span>
                    <input
                      type="text"
                      value={octStr}
                      onChange={(e) => handleOctChange(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* インタラクティブ・ビットグリッド */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-center pb-2 border-b border-border/60">
                <h2 className="font-bold text-base md:text-lg flex items-center gap-2">
                  <ToggleLeft className="w-4 h-4 text-accent" /> ビットトグルグリッド (Bit Grid)
                </h2>
                <div className="flex items-center bg-secondary/50 p-1 rounded-xl border border-border">
                  {([8, 16, 32] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setBitMode(mode)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        bitMode === mode
                          ? 'bg-accent text-white shadow-sm'
                          : 'text-text/70 hover:text-text'
                      }`}
                    >
                      {mode} bit
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center py-4">
                {getBits().map((bit) => (
                  <button
                    key={bit.index}
                    onClick={() => handleBitToggle(bit.index)}
                    className={`
                      w-11 h-16 rounded-xl border flex flex-col items-center justify-between p-2.5 transition-all cursor-pointer group shadow-sm hover:-translate-y-0.5
                      ${
                        bit.isOn
                          ? 'bg-accent border-accent text-white shadow-md shadow-accent/10'
                          : 'bg-secondary/40 border-border text-text/60 hover:border-accent/40'
                      }
                    `}
                  >
                    <span className="text-[9px] font-bold opacity-60 font-mono select-none">
                      {bit.index}
                    </span>
                    <span className="text-base font-black font-mono leading-none">
                      {bit.isOn ? '1' : '0'}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-start gap-2 text-[10px] text-text/50 bg-secondary/20 p-3 rounded-xl border border-border/40">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>
                  各ビットボックスをクリックすることで、値をトグル反転できます。左端が最上位ビット
                  (MSB)、右端が最下位ビット (LSB) です。
                </span>
              </div>
            </div>
          </div>

          {/* 右側: ビット演算 (5列) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-5">
              <h2 className="font-bold text-base md:text-lg pb-3 border-b border-border/60 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-accent" /> ビット演算 (Bitwise Operations)
              </h2>

              {/* 入力A & 入力B */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text/70 mb-1.5">
                    入力値 A (10進数)
                  </label>
                  <input
                    type="number"
                    value={valA}
                    min="0"
                    max="255"
                    onChange={(e) => setValA(Math.max(0, Math.min(255, Number(e.target.value))))}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <span className="block text-[10px] font-mono text-text/50 mt-1 truncate">
                    BIN: {valA.toString(2).padStart(8, '0')}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text/70 mb-1.5">
                    入力値 B (10進数)
                  </label>
                  <input
                    type="number"
                    value={valB}
                    min="0"
                    max="255"
                    onChange={(e) => setValB(Math.max(0, Math.min(255, Number(e.target.value))))}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <span className="block text-[10px] font-mono text-text/50 mt-1 truncate">
                    BIN: {valB.toString(2).padStart(8, '0')}
                  </span>
                </div>
              </div>

              {/* 演算結果の一覧 */}
              <div className="space-y-3.5 mt-2">
                {[
                  { op: 'AND', symbol: 'A & B', result: andResult },
                  { op: 'OR', symbol: 'A | B', result: orResult },
                  { op: 'XOR', symbol: 'A ^ B', result: xorResult },
                  { op: 'NOT (A)', symbol: '~A', result: notAResult },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-secondary/20 border border-border/80 rounded-2xl p-3.5 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-accent">{item.op}</span>
                      <span className="text-text/50 font-mono">{item.symbol}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/40 font-mono text-xs">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-text/40 font-semibold uppercase">DEC</span>
                        <span className="font-bold">{item.result}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-text/40 font-semibold uppercase">HEX</span>
                        <span className="font-bold">0x{item.result.toString(16)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-text/40 font-semibold uppercase">BIN</span>
                        <span className="font-bold font-mono text-[10px] truncate">
                          {item.result.toString(2).slice(-8).padStart(8, '0')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
