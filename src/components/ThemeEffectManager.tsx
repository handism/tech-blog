// src/components/ThemeEffectManager.tsx
'use client';

import { useThemeDesign } from '@/src/components/ThemeDesignProvider';
import { themeConfig, type ThemeId } from '@/src/config/site';
import { useIsClient } from '@/src/hooks/useIsClient';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

/**
 * デザインテーマに応じた動的なJSエフェクトおよび背景・装飾DOMを管理するコンポーネント。
 */
export default function ThemeEffectManager() {
  const { currentTheme, setTheme } = useThemeDesign();
  const { resolvedTheme } = useTheme();
  const mounted = useIsClient();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cliOpen, setCliOpen] = useState(false);
  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState<string[]>([
    'Welcome to Antigravity CLI v1.0.0',
    'Type "help" for a list of available commands.',
  ]);
  const cliInputRef = useRef<HTMLInputElement>(null);

  const isDark = mounted && resolvedTheme === 'dark';

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

    let activeCard: HTMLElement | null = null;

    const resetCardStyle = (card: HTMLElement) => {
      card.style.transform = '';
      card.style.setProperty('--parallax-x', '0px');
      card.style.setProperty('--parallax-y', '0px');
    };

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const card = target.closest('.theme-card') as HTMLElement | null;

      // ホバーするカードが変わった場合の処理
      if (card !== activeCard) {
        if (activeCard) {
          resetCardStyle(activeCard);
        }
        activeCard = card;
      }

      if (!card) return;

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
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.setProperty('--parallax-x', `${px * 12}px`);
      card.style.setProperty('--parallax-y', `${py * 12}px`);
    };

    const handleMouseLeave = () => {
      if (activeCard) {
        resetCardStyle(activeCard);
        activeCard = null;
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleMouseLeave);

      if (activeCard) {
        resetCardStyle(activeCard);
      }
      // 念のため、現在存在するすべての .theme-card をリセット
      document.querySelectorAll('.theme-card').forEach((c) => {
        resetCardStyle(c as HTMLElement);
      });
    };
  }, [currentTheme]);

  // Terminal CLIのキー監視
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' && e.ctrlKey) {
        e.preventDefault();
        setCliOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setCliOpen(false);
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
        <div
          className={`fixed inset-0 overflow-hidden pointer-events-none z-[-1] ${isDark ? 'bg-gradient-to-br from-[#0c0f1d] to-[#05060b]' : 'bg-gradient-to-br from-[#e2e8f0] to-[#f8fafc]'}`}
        >
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
        <div
          className={`fixed inset-0 pointer-events-none z-[-2] overflow-hidden ${isDark ? 'bg-[#0d0d26]' : 'bg-gradient-to-br from-[#fdf2f8] to-[#fae8ff]'}`}
        >
          {/* ネオン太陽 */}
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-b from-[#ff007f] to-[#ffaa00] opacity-40 blur-md">
            {/* 太陽の横縞カット */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 12px, ${isDark ? '#0d0d26' : '#fae8ff'} 12px, ${isDark ? '#0d0d26' : '#fae8ff'} 16px)`,
              }}
            />
          </div>
          {/* レーザー光線のような放射線背景 */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(112,0,255,0.15),transparent_70%)]" />
          {/* 3Dグリッド */}
          <div className="absolute bottom-0 left-0 w-full h-[40vh] [perspective:200px] overflow-hidden">
            <div
              className="absolute inset-0 w-full h-[200%] origin-top border-t-2 border-[#ff007f]/30"
              style={{
                backgroundImage: isDark
                  ? `
                  linear-gradient(to bottom, rgba(255, 0, 127, 0.2) 2px, transparent 2px),
                  linear-gradient(to right, rgba(0, 240, 255, 0.2) 2px, transparent 2px),
                  linear-gradient(to bottom, transparent, rgba(255, 0, 127, 0.3))
                `
                  : `
                  linear-gradient(to bottom, rgba(255, 0, 127, 0.1) 2px, transparent 2px),
                  linear-gradient(to right, rgba(14, 165, 233, 0.1) 2px, transparent 2px),
                  linear-gradient(to bottom, transparent, rgba(255, 0, 127, 0.15))
                `,
                backgroundSize: '40px 40px, 40px 40px, 100% 100%',
                backgroundPosition: '0 0, 0 0, 0 0',
                transform: 'rotateX(75deg)',
                animation: 'synthwave-grid-scroll 3s linear infinite',
              }}
            />
          </div>
        </div>
      )}

      {/* ── 5. Nordic 用の暖炉のゆらぎ背景 ── */}
      {currentTheme === 'nordic' && (
        <div
          className={`fixed inset-0 pointer-events-none z-[-1] overflow-hidden ${isDark ? 'bg-[#0f0a08]' : 'bg-[#edf2f0]'}`}
        >
          <div
            className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-repeat"
            style={{
              backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="nordicNoise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23nordicNoise)"/%3E%3C/svg%3E')`,
            }}
          />
          {/* 左下の炎 / 暖色（ダークモード） or セージグリーン（ライトモード） */}
          <div
            className={`absolute bottom-[-15%] left-[-15%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-tr ${
              isDark ? 'from-[#3a1a05] via-[#240b02] to-[#120501]' : 'from-[#faebe1] to-[#e4ede7]'
            } blur-[120px] fireplace-flame-1`}
          />
          {/* 右上の炎 / 暖色（ダークモード） or セージグリーン（ライトモード） */}
          <div
            className={`absolute top-[-15%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-bl ${
              isDark ? 'from-[#2e0f02] via-[#1a0801] to-[#0f0400]' : 'from-[#e9f2ef] to-[#f4ebe3]'
            } blur-[100px] fireplace-flame-2`}
          />
        </div>
      )}

      {/* ── 6. Terminal 用のミニCLIコンソール ── */}
      {currentTheme === 'terminal' && (
        <>
          {/* CLIトグルボタン */}
          <button
            onClick={() => setCliOpen(!cliOpen)}
            className={`fixed bottom-6 left-6 z-50 font-mono text-xs px-3 py-2 rounded transition-colors shadow-lg border ${
              isDark
                ? 'bg-[#050505] border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00] hover:text-[#000]'
                : 'bg-[#f2e9d3] border-[#7c4f00] text-[#7c4f00] hover:bg-[#7c4f00] hover:text-[#fbf5e6]'
            }`}
            title="Toggle Console (Ctrl + \`)"
          >
            {cliOpen ? '_[CLOSE]' : '>_[CLI]'}
          </button>

          {/* スキャンラインオーバーレイ */}
          <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.12)_50%)] bg-[length:100%_4px] opacity-15" />

          {/* CLIスライドアップコンソール */}
          {cliOpen && (
            <div
              className={`fixed bottom-0 left-0 w-full h-[40vh] min-h-[300px] border-t-2 font-mono p-4 z-[60] flex flex-col shadow-2xl ${
                isDark
                  ? 'bg-[#050505] border-[#00ff00] text-[#00ff00]'
                  : 'bg-[#fbf5e6] border-[#7c4f00] text-[#7c4f00]'
              }`}
            >
              <div
                className={`flex justify-between items-center border-b pb-2 mb-2 text-xs ${
                  isDark ? 'border-[#00ff00]/30' : 'border-[#7c4f00]/30'
                }`}
              >
                <span>ANTIGRAVITY SYSTEM TERMINAL</span>
                <button
                  onClick={() => setCliOpen(false)}
                  className={isDark ? 'hover:text-red-500' : 'hover:text-[#c67c00]'}
                >
                  [ESC] CLOSE
                </button>
              </div>
              <div
                className={`flex-grow overflow-y-auto text-sm space-y-1 mb-2 scrollbar-thin ${
                  isDark ? 'scrollbar-thumb-[#00ff00]/30' : 'scrollbar-thumb-[#7c4f00]/30'
                }`}
              >
                {cliHistory.map((line, index) => (
                  <div key={index} className="whitespace-pre-wrap">
                    {line}
                  </div>
                ))}
              </div>
              <form
                onSubmit={handleCliSubmit}
                className={`flex items-center text-sm border-t pt-2 ${
                  isDark ? 'border-[#00ff00]/30' : 'border-[#7c4f00]/30'
                }`}
              >
                <span className={`mr-2 ${isDark ? 'text-[#00ff00]' : 'text-[#c67c00]'}`}>$</span>
                <input
                  ref={cliInputRef}
                  type="text"
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  className={`flex-grow bg-transparent outline-none border-none p-0 focus:ring-0 ${
                    isDark ? 'text-[#00ff00]' : 'text-[#7c4f00]'
                  }`}
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
