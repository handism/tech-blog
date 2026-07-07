// src/components/ThemeEffectManager.tsx
'use client';

import { useThemeDesign } from '@/src/components/ThemeDesignProvider';
import { themeConfig, type ThemeId } from '@/src/config/site';
import { useEffect, useRef, useState } from 'react';

/**
 * デザインテーマに応じた動的なJSエフェクトおよび背景・装飾DOMを管理するコンポーネント。
 */
export default function ThemeEffectManager() {
  const { currentTheme, setTheme } = useThemeDesign();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cliOpen, setCliOpen] = useState(false);
  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState<string[]>([
    'Welcome to Antigravity CLI v1.0.0',
    'Type "help" for a list of available commands.',
  ]);
  const cliInputRef = useRef<HTMLInputElement>(null);

  // 1. スクロール監視 (Minimalの進捗ゲージ、Steampunkの歯車スクロール連動など)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);

      // Steampunk用の歯車回転変数を更新
      if (currentTheme === 'steampunk') {
        const rotation = (scrollTop * 0.15) % 360;
        document.documentElement.style.setProperty('--gear-rotation', `${rotation}deg`);
        document.documentElement.style.setProperty('--gear-rotation-anti', `${-rotation}deg`);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // 初期実行
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentTheme]);

  // 2. Neumorphism用の光源追従シャドウ (マウス追従)
  useEffect(() => {
    if (currentTheme !== 'neumorphism') return;

    const handleMouseMove = (e: MouseEvent) => {
      // 画面全体に対するマウス位置の比率 (-1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      // 影のズレ幅を計算 (最大12px)
      const shadowX = (x * 12).toFixed(1);
      const shadowY = (y * 12).toFixed(1);

      document.documentElement.style.setProperty('--mx', `${shadowX}px`);
      document.documentElement.style.setProperty('--my', `${shadowY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [currentTheme]);

  // 3. 3D Interactive用のカードチルト効果 (JSによる3D Tilt)
  useEffect(() => {
    if (currentTheme !== 'three-d') return;

    const cards = document.querySelectorAll('.theme-card');

    const handleMouseMove = (e: MouseEvent, card: Element) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // マウスのカード内X座標
      const y = e.clientY - rect.top; // マウスのカード内Y座標

      // 中心からのズレを比率にする (-0.5 to 0.5)
      const px = x / rect.width - 0.5;
      const py = y / rect.height - 0.5;

      // 3D回転角を算出 (最大15度)
      const tiltX = (py * -15).toFixed(1);
      const tiltY = (px * 15).toFixed(1);

      // 内側の画像やテキストにもパララックスを効かせるため、カスタムプロパティを更新
      const htmlCard = card as HTMLElement;
      htmlCard.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
      htmlCard.style.setProperty('--parallax-x', `${px * 12}px`);
      htmlCard.style.setProperty('--parallax-y', `${py * 12}px`);
    };

    const handleMouseLeave = (card: Element) => {
      const htmlCard = card as HTMLElement;
      htmlCard.style.transform = '';
      htmlCard.style.setProperty('--parallax-x', '0px');
      htmlCard.style.setProperty('--parallax-y', '0px');
    };

    const listeners: { card: Element; move: EventListener; leave: EventListener }[] = [];

    cards.forEach((card) => {
      const moveListener: EventListener = (e) => handleMouseMove(e as MouseEvent, card);
      const leaveListener: EventListener = () => handleMouseLeave(card);

      card.addEventListener('mousemove', moveListener, { passive: true });
      card.addEventListener('mouseleave', leaveListener);

      listeners.push({ card, move: moveListener, leave: leaveListener });
    });

    return () => {
      listeners.forEach(({ card, move, leave }) => {
        card.removeEventListener('mousemove', move);
        card.removeEventListener('mouseleave', leave);
      });
    };
  }, [currentTheme]);

  // Terminal CLIのキー監視
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' && e.ctrlKey) {
        e.preventDefault();
        setCliOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // CLIオープン時にフォーカス
  useEffect(() => {
    if (cliOpen && cliInputRef.current) {
      cliInputRef.current.focus();
    }
  }, [cliOpen]);

  // CLIコマンド実行
  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const command = cliInput.trim().toLowerCase();
    if (!command) return;

    const newHistory = [...cliHistory, `> ${cliInput}`];

    if (command === 'help') {
      newHistory.push(
        'Available commands:',
        '  theme [theme-id] - Change design theme',
        '  theme list      - List all available themes',
        '  clear           - Clear terminal history',
        '  exit            - Close terminal',
        '  system          - Display system status'
      );
    } else if (command === 'clear') {
      setCliHistory([]);
      setCliInput('');
      return;
    } else if (command === 'exit') {
      setCliOpen(false);
      setCliInput('');
      return;
    } else if (command === 'system') {
      newHistory.push(
        'System: Antigravity Custom Shell v1.0',
        `Current Theme: ${currentTheme}`,
        `Screen Resolution: ${window.innerWidth}x${window.innerHeight}`,
        'Connection: SECURE',
        'Model status: Pair-programming with Developer'
      );
    } else if (command.startsWith('theme ')) {
      const targetTheme = command.split(' ')[1];
      if (targetTheme === 'list') {
        newHistory.push('Available Themes:');
        themeConfig.forEach((t) => {
          newHistory.push(`  - ${t.id} (${t.label})`);
        });
      } else {
        const themeExists = themeConfig.some((t) => t.id === targetTheme);
        if (themeExists) {
          setTheme(targetTheme as ThemeId);
          newHistory.push(`Success: Changed theme to "${targetTheme}"`);
        } else {
          newHistory.push(
            `Error: Theme "${targetTheme}" not found. Type "theme list" to see options.`
          );
        }
      }
    } else {
      newHistory.push(`Command not found: "${command}". Type "help" for options.`);
    }

    setCliHistory(newHistory);
    setCliInput('');
  };

  return (
    <>
      {/* ── 1. Minimal 用の極細スクロール進捗ゲージ ── */}
      {currentTheme === 'minimal' && (
        <div
          className="fixed top-0 left-0 h-[2px] bg-blue-500 z-50 transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      )}

      {/* ── 2. Glassmorphism 用の浮遊Blob背景 ── */}
      {currentTheme === 'glassmorphism' && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-gradient-to-br from-[#0c0f1d] to-[#05060b]">
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-repeat"
            style={{
              backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noiseFilter)"/%3E%3C/svg%3E')`,
            }}
          />
          {/* 浮遊するカラフルなBlob */}
          <div
            className="absolute top-[20%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-25 blur-[120px] animate-pulse"
            style={{ animationDuration: '8s' }}
          />
          <div
            className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-pink-600 to-rose-600 opacity-20 blur-[130px] animate-pulse"
            style={{ animationDuration: '12s' }}
          />
        </div>
      )}

      {/* ── 3. Steampunk 用の動く歯車 ── */}
      {currentTheme === 'steampunk' && (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-10">
          {/* 左上の大歯車 */}
          <svg
            className="absolute top-[-80px] left-[-80px] w-64 h-64 text-[#8b6535] fill-none stroke-current stroke-2"
            style={{ transform: 'rotate(var(--gear-rotation))' }}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="30" />
            <circle cx="50" cy="50" r="10" />
            {Array.from({ length: 12 }).map((_, i) => (
              <path
                key={i}
                d="M 50 10 L 50 20 M 47 10 L 53 10"
                transform={`rotate(${i * 30} 50 50)`}
              />
            ))}
          </svg>
          {/* 右上の小歯車 (噛み合い逆回転) */}
          <svg
            className="absolute top-[100px] left-[130px] w-32 h-32 text-[#a05a0c] fill-none stroke-current stroke-2"
            style={{ transform: 'rotate(var(--gear-rotation-anti))' }}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="30" />
            <circle cx="50" cy="50" r="10" />
            {Array.from({ length: 8 }).map((_, i) => (
              <path
                key={i}
                d="M 50 10 L 50 20 M 47 10 L 53 10"
                transform={`rotate(${i * 45} 50 50)`}
              />
            ))}
          </svg>
          {/* 右下の大歯車 */}
          <svg
            className="absolute bottom-[-100px] right-[-100px] w-80 h-80 text-[#8b6535] fill-none stroke-current stroke-2"
            style={{ transform: 'rotate(var(--gear-rotation))' }}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="35" />
            <circle cx="50" cy="50" r="12" />
            {Array.from({ length: 16 }).map((_, i) => (
              <path
                key={i}
                d="M 50 8 L 50 18 M 46 8 L 54 8"
                transform={`rotate(${i * 22.5} 50 50)`}
              />
            ))}
          </svg>
        </div>
      )}

      {/* ── 4. Synthwave 用の3Dグリッド背景 ── */}
      {currentTheme === 'synthwave' && (
        <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden bg-[#0d0d26]">
          {/* ネオン太陽 */}
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-b from-[#ff007f] to-[#ffaa00] opacity-40 blur-md">
            {/* 太陽の横縞カット */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent,transparent_12px,#0d0d26_12px,#0d0d26_16px)]" />
          </div>
          {/* レーザー光線のような放射線背景 */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(112,0,255,0.15),transparent_70%)]" />
          {/* 3Dグリッド */}
          <div className="absolute bottom-0 left-0 w-full h-[40vh] [perspective:200px] overflow-hidden">
            <div
              className="absolute inset-0 w-full h-[200%] origin-top bg-[linear-gradient(to_bottom,transparent,rgba(255,0,127,0.3))] border-t-2 border-[#ff007f]/30"
              style={{
                backgroundImage: `
                  linear-gradient(to bottom, rgba(255, 0, 127, 0.2) 2px, transparent 2px),
                  linear-gradient(to right, rgba(0, 240, 255, 0.2) 2px, transparent 2px)
                `,
                backgroundSize: '40px 40px',
                transform: 'rotateX(75deg)',
                animation: 'synthwave-grid-scroll 3s linear infinite',
              }}
            />
          </div>
          {/* アニメーション用のインラインCSS */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
              @keyframes synthwave-grid-scroll {
                0% { background-position: 0 0; }
                100% { background-position: 0 40px; }
              }
            `,
            }}
          />
        </div>
      )}

      {/* ── 5. Nordic 用の暖炉のゆらぎ背景 ── */}
      {currentTheme === 'nordic' && (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#edf2f0]">
          <div
            className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-repeat"
            style={{
              backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="nordicNoise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23nordicNoise)"/%3E%3C/svg%3E')`,
            }}
          />
          <div
            className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-[#faebe1] to-[#e4ede7] opacity-60 blur-[100px] animate-pulse"
            style={{ animationDuration: '10s' }}
          />
          <div
            className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-[#e9f2ef] to-[#f4ebe3] opacity-60 blur-[90px] animate-pulse"
            style={{ animationDuration: '14s' }}
          />
        </div>
      )}

      {/* ── 6. Terminal 用のミニCLIコンソール ── */}
      {currentTheme === 'terminal' && (
        <>
          {/* CLIトグルボタン */}
          <button
            onClick={() => setCliOpen(!cliOpen)}
            className="fixed bottom-6 right-6 z-50 font-mono text-xs px-3 py-2 bg-[#050505] border border-[#00ff00] text-[#00ff00] rounded hover:bg-[#00ff00] hover:text-[#000] transition-colors shadow-lg"
            title="Toggle Console (Ctrl + \`)"
          >
            {cliOpen ? '_[CLOSE]' : '>_[CLI]'}
          </button>

          {/* スキャンラインオーバーレイ */}
          <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.12)_50%)] bg-[length:100%_4px] opacity-15" />

          {/* CLIドロップダウンコンソール */}
          {cliOpen && (
            <div className="fixed top-0 left-0 w-full h-[40vh] min-h-[300px] bg-[#050505] border-b-2 border-[#00ff00] text-[#00ff00] font-mono p-4 z-40 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center border-b border-[#00ff00]/30 pb-2 mb-2 text-xs">
                <span>ANTIGRAVITY SYSTEM TERMINAL</span>
                <button onClick={() => setCliOpen(false)} className="hover:text-red-500">
                  [ESC] CLOSE
                </button>
              </div>
              <div className="flex-grow overflow-y-auto text-sm space-y-1 mb-2 scrollbar-thin scrollbar-thumb-[#00ff00]/30">
                {cliHistory.map((line, index) => (
                  <div key={index} className="whitespace-pre-wrap">
                    {line}
                  </div>
                ))}
              </div>
              <form
                onSubmit={handleCliSubmit}
                className="flex items-center text-sm border-t border-[#00ff00]/30 pt-2"
              >
                <span className="mr-2 text-[#00ff00]">$</span>
                <input
                  ref={cliInputRef}
                  type="text"
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  className="flex-grow bg-transparent text-[#00ff00] outline-none border-none p-0 focus:ring-0"
                  placeholder="Type 'help' for commands..."
                />
              </form>
            </div>
          )}
        </>
      )}
    </>
  );
}
