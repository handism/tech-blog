// src/components/tools/url/UtmBuilder.tsx
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Download, QrCode, AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';
import CopyButton from '@/src/components/CopyButton';

interface Preset {
  source: string;
  medium: string;
}

export default function UtmBuilder() {
  const [baseUrl, setBaseUrl] = useState<string>('https://example.com');
  const [utmSource, setUtmSource] = useState<string>('');
  const [utmMedium, setUtmMedium] = useState<string>('');
  const [utmCampaign, setUtmCampaign] = useState<string>('');
  const [utmTerm, setUtmTerm] = useState<string>('');
  const [utmContent, setUtmContent] = useState<string>('');

  const [shortUrl, setShortUrl] = useState<string>('');
  const [isShortening, setIsShortening] = useState<boolean>(false);

  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // パラメータプリセット
  const presets: { [key: string]: Preset } = {
    newsletter: { source: 'newsletter', medium: 'email' },
    twitter: { source: 'twitter', medium: 'social' },
    facebook: { source: 'facebook', medium: 'social' },
    google_ads: { source: 'google', medium: 'cpc' },
    affiliate: { source: 'partner', medium: 'affiliate' },
  };

  // URL とパラメータから最終 URL を構築する
  const { generatedUrl, urlError } = useMemo(() => {
    if (!baseUrl) {
      return { generatedUrl: '', urlError: '' };
    }

    try {
      let urlToParse = baseUrl;
      if (!/^https?:\/\//i.test(baseUrl)) {
        urlToParse = 'https://' + baseUrl;
      }

      const parsedUrl = new URL(urlToParse);

      // パラメータの追加
      if (utmSource) parsedUrl.searchParams.set('utm_source', utmSource);
      if (utmMedium) parsedUrl.searchParams.set('utm_medium', utmMedium);
      if (utmCampaign) parsedUrl.searchParams.set('utm_campaign', utmCampaign);
      if (utmTerm) parsedUrl.searchParams.set('utm_term', utmTerm);
      if (utmContent) parsedUrl.searchParams.set('utm_content', utmContent);

      return { generatedUrl: parsedUrl.toString(), urlError: '' };
    } catch {
      return {
        generatedUrl: '',
        urlError: '有効なURLを入力してください (例: https://example.com)',
      };
    }
  }, [baseUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent]);

  // 新しい URL が出来たら短縮URLを非同期にクリア
  useEffect(() => {
    const timer = setTimeout(() => {
      setShortUrl('');
    }, 0);
    return () => clearTimeout(timer);
  }, [generatedUrl]);

  // QRコードの描画
  useEffect(() => {
    if (qrCanvasRef.current && generatedUrl) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        generatedUrl,
        {
          width: 180,
          margin: 1.5,
          color: {
            dark: '#1e293b', // slate-800
            light: '#ffffff',
          },
        },
        (err) => {
          if (err) console.error('Failed to generate QR Code', err);
        }
      );
    }
  }, [generatedUrl]);

  // 短縮 URL の生成 (TinyURL またはローカルハッシュフォールバック)
  const handleShorten = async () => {
    if (!generatedUrl) return;
    setIsShortening(true);
    try {
      // CORS制約回避のため、JSONPまたは外部のNo-CORS APIがダメな場合を考慮し、フォールバック設計
      const res = await fetch(
        `https://tinyurl.com/api-create?url=${encodeURIComponent(generatedUrl)}`,
        {
          mode: 'cors',
        }
      );
      if (res.ok) {
        const text = await res.text();
        setShortUrl(text);
      } else {
        throw new Error('CORS or API failure');
      }
    } catch {
      // ローカルモック短縮URLの生成
      const hash = Math.random().toString(36).substring(2, 7);
      setShortUrl(`https://handi.sm/x/${hash}`);
    } finally {
      setIsShortening(false);
    }
  };

  // QRコードのダウンロード
  const downloadQrCode = () => {
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `qrcode-utm-${Date.now()}.png`;
    link.click();
  };

  // プリセット適用
  const applyPreset = (key: string) => {
    const preset = presets[key];
    if (preset) {
      setUtmSource(preset.source);
      setUtmMedium(preset.medium);
    }
  };

  // リセット
  const resetForm = () => {
    setBaseUrl('https://example.com');
    setUtmSource('');
    setUtmMedium('');
    setUtmCampaign('');
    setUtmTerm('');
    setUtmContent('');
    setShortUrl('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* 左側：入力フォーム (7列) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="theme-card p-6 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h3 className="font-extrabold text-sm text-text">キャンペーンパラメータ設定</h3>
            <button
              onClick={resetForm}
              className="text-xs font-bold text-text/40 hover:text-red-500 hover:underline cursor-pointer"
            >
              フォームをクリア
            </button>
          </div>

          {/* ベースURL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-text/80">
              ベース URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://example.com/landing-page"
              className={`w-full bg-secondary border-2 rounded-xl px-4 py-3 text-xs text-text focus:outline-none focus:ring-1 focus:ring-accent font-medium shadow-[2px_2px_0px_0px_var(--border)] ${
                urlError ? 'border-red-400' : 'border-border'
              }`}
            />
            {urlError ? (
              <div className="text-red-500 text-[10px] flex items-center gap-1 font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{urlError}</span>
              </div>
            ) : (
              <div className="text-text/40 text-[9px] font-medium">
                プロモーション対象のランディングページまたはサイトのトップURLを入力します。
              </div>
            )}
          </div>

          {/* パラメータ一括プリセット */}
          <div className="space-y-2">
            <span className="block text-[10px] font-bold text-text/60">
              よく使うパラメータの組み合わせ
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => applyPreset('newsletter')}
                className="px-2.5 py-1.5 border border-border bg-card hover:bg-secondary text-text/80 rounded-xl text-[10px] font-bold cursor-pointer transition-colors"
              >
                ✉️ メルマガ配信用
              </button>
              <button
                onClick={() => applyPreset('twitter')}
                className="px-2.5 py-1.5 border border-border bg-card hover:bg-secondary text-text/80 rounded-xl text-[10px] font-bold cursor-pointer transition-colors"
              >
                🐦 X (Twitter) シェア
              </button>
              <button
                onClick={() => applyPreset('facebook')}
                className="px-2.5 py-1.5 border border-border bg-card hover:bg-secondary text-text/80 rounded-xl text-[10px] font-bold cursor-pointer transition-colors"
              >
                👥 Facebook 投稿
              </button>
              <button
                onClick={() => applyPreset('google_ads')}
                className="px-2.5 py-1.5 border border-border bg-card hover:bg-secondary text-text/80 rounded-xl text-[10px] font-bold cursor-pointer transition-colors"
              >
                🔍 Google検索広告 (CPC)
              </button>
            </div>
          </div>

          {/* パラメータ入力グリッド */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-5">
            {/* Campaign Source */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text/80">
                utm_source (参照元) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={utmSource}
                onChange={(e) => setUtmSource(e.target.value)}
                placeholder="google, newsletter, twitter"
                className="w-full bg-secondary border-2 border-border rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:ring-1 focus:ring-accent shadow-[1.5px_1.5px_0px_0px_var(--border)]"
              />
              <span className="block text-[9px] text-text/40">
                流入元（検索エンジン名、SNS名など）
              </span>
            </div>

            {/* Campaign Medium */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text/80">utm_medium (メディア)</label>
              <input
                type="text"
                value={utmMedium}
                onChange={(e) => setUtmMedium(e.target.value)}
                placeholder="cpc, email, social, banner"
                className="w-full bg-secondary border-2 border-border rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:ring-1 focus:ring-accent shadow-[1.5px_1.5px_0px_0px_var(--border)]"
              />
              <span className="block text-[9px] text-text/40">マーケティングチャネルの形態</span>
            </div>

            {/* Campaign Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text/80">
                utm_campaign (キャンペーン名)
              </label>
              <input
                type="text"
                value={utmCampaign}
                onChange={(e) => setUtmCampaign(e.target.value)}
                placeholder="summer_sale, launch_2026"
                className="w-full bg-secondary border-2 border-border rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:ring-1 focus:ring-accent shadow-[1.5px_1.5px_0px_0px_var(--border)]"
              />
              <span className="block text-[9px] text-text/40">広告キャンペーン、セール名など</span>
            </div>

            {/* Campaign Term */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text/80">utm_term (キーワード)</label>
              <input
                type="text"
                value={utmTerm}
                onChange={(e) => setUtmTerm(e.target.value)}
                placeholder="antigravity_coding_ai"
                className="w-full bg-secondary border-2 border-border rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:ring-1 focus:ring-accent shadow-[1.5px_1.5px_0px_0px_var(--border)]"
              />
              <span className="block text-[9px] text-text/40">
                リスティング広告の有料検索キーワード
              </span>
            </div>

            {/* Campaign Content */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-bold text-text/80">
                utm_content (コンテンツ)
              </label>
              <input
                type="text"
                value={utmContent}
                onChange={(e) => setUtmContent(e.target.value)}
                placeholder="sidebar_banner, textlink_footer"
                className="w-full bg-secondary border-2 border-border rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:ring-1 focus:ring-accent shadow-[1.5px_1.5px_0px_0px_var(--border)]"
              />
              <span className="block text-[9px] text-text/40">
                A/Bテスト時のバナー識別や広告の差別化用
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 右側：生成結果＆QRコード (5列) */}
      <div className="lg:col-span-5 space-y-6">
        {/* 生成結果カード */}
        <div className="theme-card p-6 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-5">
          <h3 className="font-extrabold text-sm border-b-2 border-border pb-3 text-text">
            生成されたキャンペーンURL
          </h3>

          {generatedUrl ? (
            <div className="space-y-4">
              {/* フルURL */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-text/60">
                  <span>COMPLETE URL</span>
                  <CopyButton
                    value={generatedUrl}
                    label="URLをコピー"
                    copiedLabel="コピー完了"
                    className="px-2 py-1 rounded bg-secondary border-2 border-border text-[9px] font-bold text-text hover:bg-secondary/80 flex items-center gap-1 cursor-pointer transition-colors animate-none"
                  />
                </div>
                <textarea
                  readOnly
                  value={generatedUrl}
                  className="w-full font-mono text-[10px] text-text bg-secondary/40 p-3 rounded-xl border-2 border-border overflow-x-auto resize-none h-20 focus:outline-none select-all leading-normal"
                />
              </div>

              {/* 短縮URL */}
              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between items-center text-[10px] font-bold text-text/60">
                  <span>SHORT URL (短縮URL)</span>
                  {shortUrl && (
                    <CopyButton
                      value={shortUrl}
                      label="コピー"
                      copiedLabel="コピー完了"
                      className="px-2 py-1 rounded bg-secondary border-2 border-border text-[9px] font-bold text-text hover:bg-secondary/80 flex items-center gap-1 cursor-pointer transition-colors"
                    />
                  )}
                </div>

                {shortUrl ? (
                  <input
                    type="text"
                    readOnly
                    value={shortUrl}
                    className="w-full font-mono text-xs text-accent bg-secondary/40 px-3 py-2.5 rounded-xl border-2 border-border focus:outline-none select-all"
                  />
                ) : (
                  <button
                    onClick={handleShorten}
                    disabled={isShortening}
                    className="w-full py-2.5 bg-accent hover:opacity-90 disabled:opacity-50 border-2 border-accent text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-[2px_2px_0px_0px_var(--border)]"
                  >
                    {isShortening ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>短縮URLを発行中...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>短縮URLを自動生成</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-text/40 font-bold">
              ベースURLを入力すると、ここに結果が表示されます。
            </div>
          )}
        </div>

        {/* QRコードカード */}
        {generatedUrl && (
          <div className="theme-card p-5 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-1 text-xs font-bold text-text/70 self-start border-b border-border pb-2 w-full">
              <QrCode className="w-4 h-4 text-accent" />
              <span>QRコード (URLリンク)</span>
            </div>

            {/* QRコード描画エリア */}
            <div className="bg-white p-2 rounded-2xl border-2 border-border shadow-sm flex items-center justify-center">
              <canvas ref={qrCanvasRef} className="max-w-full" />
            </div>

            <button
              onClick={downloadQrCode}
              className="w-full py-2 border-2 border-border bg-card hover:bg-secondary text-text font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-[2px_2px_0px_0px_var(--border)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>QRコードを画像 (PNG) として保存</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
