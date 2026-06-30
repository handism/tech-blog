'use client';

import ToolPageLayout from '@/src/components/ToolPageLayout';
import { useState, useMemo } from 'react';
import { Binary, Clipboard, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

export default function CidrCalculatorPage() {
  const { copy } = useCopyToClipboard();
  const [ipAddress, setIpAddress] = useState('192.168.1.1');
  const [prefix, setPrefix] = useState<number>(24);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const ipToLong = (ip: string): number => {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
  };

  const longToIp = (long: number): string => {
    return [(long >>> 24) & 255, (long >>> 16) & 255, (long >>> 8) & 255, long & 255].join('.');
  };

  // 32文字のバイナリをオクテット境界（8ビットずつ）に分割して、ネット部・ホスト部のオブジェクト配列を返す
  const splitBinary = (long: number, netLength: number) => {
    const rawBin = long.toString(2).padStart(32, '0');
    const result: { net: string; host: string }[] = [];

    for (let i = 0; i < 4; i++) {
      const startIdx = i * 8;
      const endIdx = startIdx + 8;
      const octetBin = rawBin.slice(startIdx, endIdx);

      // このオクテットにおけるネットワーク部とホスト部の長さを計算
      const octetNetLength = Math.max(0, Math.min(8, netLength - startIdx));

      result.push({
        net: octetBin.slice(0, octetNetLength),
        host: octetBin.slice(octetNetLength),
      });
    }

    return result;
  };

  const validateIp = (ip: string): boolean => {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    return parts.every((part) => {
      const num = parseInt(part, 10);
      return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
    });
  };

  // すべての計算結果をuseMemoで一括算出（Derived State）
  const calculationResult = useMemo(() => {
    if (!validateIp(ipAddress)) {
      return {
        error: '無効なIPアドレス形式です（例: 192.168.1.1）',
        cidrNotation: '',
        subnetMask: '',
        wildcardMask: '',
        networkAddress: '',
        broadcastAddress: '',
        ipRange: '',
        maxHosts: 0,
        ipBinary: [],
        maskBinary: [],
      };
    }

    try {
      const ipLong = ipToLong(ipAddress);

      // マスク計算
      const maskLong = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
      const wildcardLong = ~maskLong >>> 0;

      // ネットワーク＆ブロードキャスト
      const networkLong = (ipLong & maskLong) >>> 0;
      const broadcastLong = (networkLong | wildcardLong) >>> 0;

      let range = '';
      let hosts = 0;

      // IPレンジとホスト数計算
      if (prefix === 32) {
        range = longToIp(ipLong);
        hosts = 1;
      } else if (prefix === 31) {
        range = `${longToIp(networkLong)} 〜 ${longToIp(broadcastLong)}`;
        hosts = 2;
      } else {
        const firstIp = (networkLong + 1) >>> 0;
        const lastIp = (broadcastLong - 1) >>> 0;
        range = `${longToIp(firstIp)} 〜 ${longToIp(lastIp)}`;
        hosts = broadcastLong - networkLong - 1;
      }

      return {
        error: '',
        cidrNotation: `${longToIp(networkLong)}/${prefix}`,
        subnetMask: longToIp(maskLong),
        wildcardMask: longToIp(wildcardLong),
        networkAddress: longToIp(networkLong),
        broadcastAddress: longToIp(broadcastLong),
        ipRange: range,
        maxHosts: hosts,
        ipBinary: splitBinary(ipLong, prefix),
        maskBinary: splitBinary(maskLong, prefix),
      };
    } catch (e) {
      console.error(e);
      return {
        error: '計算中にエラーが発生しました。',
        cidrNotation: '',
        subnetMask: '',
        wildcardMask: '',
        networkAddress: '',
        broadcastAddress: '',
        ipRange: '',
        maxHosts: 0,
        ipBinary: [],
        maskBinary: [],
      };
    }
  }, [ipAddress, prefix]);

  const {
    error,
    cidrNotation,
    subnetMask,
    wildcardMask,
    networkAddress,
    broadcastAddress,
    ipRange,
    maxHosts,
    ipBinary,
    maskBinary,
  } = calculationResult;

  const handleCopy = (text: string, key: string) => {
    copy(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <ToolPageLayout
      title="IP Subnet & CIDR Calculator"
      description="IPアドレスとサブネットマスクの入力から、ネットワークレンジやホスト可能数を即座に割り出します。"
      icon={Binary}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左カラム: 入力パラメータ */}
        <div className="lg:col-span-5 space-y-6">
          <div className="theme-card p-5 md:p-6 space-y-5">
            <h2 className="text-base font-bold text-text border-b-2 border-border pb-2">
              ⚙️ ネットワークパラメーター
            </h2>

            {/* IPアドレス入力 */}
            <div className="space-y-1.5">
              <label htmlFor="ip-input" className="block text-xs font-extrabold text-text/75">
                IP アドレス (IPv4)
              </label>
              <input
                id="ip-input"
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="192.168.1.1"
                className="w-full px-4 py-3 border-2 border-border rounded-xl font-mono text-base font-bold bg-card text-text focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[2px_2px_0px_0px_var(--border)] dark:focus:shadow-[2px_2px_0px_0px_var(--accent)] transition-all"
              />
              {error && <p className="text-xs font-bold text-red-500 mt-1">{error}</p>}
            </div>

            {/* サブネットプレフィックス選択 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-extrabold text-text/75">
                  サブネットプレフィックス (CIDR)
                </label>
                <span className="text-sm font-extrabold text-accent bg-secondary border border-border px-2.5 py-0.5 rounded-lg">
                  /{prefix}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={32}
                value={prefix}
                onChange={(e) => setPrefix(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent border border-border mt-3"
              />
              <div className="flex justify-between text-[10px] font-bold text-text/40 px-1 mt-1">
                <span>/0</span>
                <span>/8</span>
                <span>/16</span>
                <span>/24</span>
                <span>/32</span>
              </div>
            </div>
          </div>

          {/* バイナリ可視化パネル */}
          {!error && (
            <div className="theme-card p-5 md:p-6 space-y-4">
              <h3 className="text-sm font-bold text-text border-b border-border pb-1.5 flex items-center gap-1.5">
                <span>🔢 バイナリ表現 (2進数)</span>
              </h3>
              <div className="space-y-4">
                {/* IPバイナリ */}
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-text/50">IPアドレス</span>
                  <div className="flex justify-between font-mono text-[11px] sm:text-xs">
                    {ipBinary.map((octet, idx) => (
                      <span key={idx} className="flex gap-0.5">
                        <span className="text-accent font-extrabold">{octet.net}</span>
                        <span className="text-text/60 font-semibold">{octet.host}</span>
                        {idx < 3 && <span className="text-text/30 font-bold">.</span>}
                      </span>
                    ))}
                  </div>
                </div>

                {/* マスクバイナリ */}
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-text/50">サブネットマスク</span>
                  <div className="flex justify-between font-mono text-[11px] sm:text-xs">
                    {maskBinary.map((octet, idx) => (
                      <span key={idx} className="flex gap-0.5">
                        <span className="text-accent font-extrabold">{octet.net}</span>
                        <span className="text-text/60 font-semibold">{octet.host}</span>
                        {idx < 3 && <span className="text-text/30 font-bold">.</span>}
                      </span>
                    ))}
                  </div>
                </div>

                {/*凡例 */}
                <div className="flex gap-4 text-[10px] font-bold border-t border-border/20 pt-2 justify-center">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-accent rounded" /> ネットワーク部 ({prefix}bit)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-text/60 rounded" /> ホスト部 ({32 - prefix}bit)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 右カラム: 計算結果 */}
        <div className="lg:col-span-7">
          <div className="theme-card p-5 md:p-6 space-y-4 h-full">
            <h2 className="text-base font-bold text-text border-b-2 border-border pb-2">
              📊 算出された結果
            </h2>

            {!error ? (
              <div className="divide-y divide-border/20">
                {[
                  { label: 'CIDR 表記', val: cidrNotation, key: 'cidr' },
                  { label: 'サブネットマスク', val: subnetMask, key: 'mask' },
                  { label: 'ワイルドカードマスク', val: wildcardMask, key: 'wildcard' },
                  { label: 'ネットワークアドレス', val: networkAddress, key: 'net' },
                  { label: 'ブロードキャストアドレス', val: broadcastAddress, key: 'broad' },
                  { label: 'ホストIPアドレス範囲', val: ipRange, key: 'range' },
                  {
                    label: '最大ホスト可能数',
                    val: maxHosts.toLocaleString() + ' 台',
                    key: 'hosts',
                    raw: maxHosts.toString(),
                  },
                ].map((item) => (
                  <div key={item.key} className="flex justify-between items-center py-3">
                    <div className="min-w-0 pr-4">
                      <span className="text-xs font-bold text-text/60 block">{item.label}</span>
                      <span className="text-sm sm:text-base font-extrabold text-text font-mono truncate block mt-0.5">
                        {item.val}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(item.raw || item.val, item.key)}
                      className="theme-btn p-1.5 bg-secondary text-text shrink-0"
                      title="コピー"
                    >
                      {copiedKey === item.key ? (
                        <Check className="w-4 h-4 text-accent" />
                      ) : (
                        <Clipboard className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full py-16 flex items-center justify-center text-text/30 font-bold">
                正しいIPアドレスを入力してください。
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
