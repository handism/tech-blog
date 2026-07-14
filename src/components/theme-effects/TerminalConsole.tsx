// src/components/theme-effects/TerminalConsole.tsx
'use client';

import { useThemeDesign } from '@/src/components/ThemeDesignProvider';
import { themeConfig, type ThemeId } from '@/src/config/themes';
import { useEffect, useRef, useState } from 'react';

/**
 * Terminal テーマ用のミニCLIコンソール（Ctrl + ` で開閉するイースターエッグ）。
 */
export default function TerminalConsole({ isDark }: { isDark: boolean }) {
  const { currentTheme, setTheme } = useThemeDesign();
  const [cliOpen, setCliOpen] = useState(false);
  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState<string[]>([
    'Welcome to Antigravity CLI v1.0.0',
    'Type "help" for a list of available commands.',
  ]);
  const cliInputRef = useRef<HTMLInputElement>(null);

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
      {/* CLIトグルボタン */}
      <button
        onClick={() => setCliOpen(!cliOpen)}
        className={`fixed bottom-6 left-6 z-50 font-mono text-xs px-3 py-2 rounded transition-colors shadow-lg border ${
          isDark
            ? 'bg-[#050505] border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00] hover:text-[#000]'
            : 'bg-[#f2e9d3] border-[#7c4f00] text-[#7c4f00] hover:bg-[#7c4f00] hover:text-[#fbf5e6]'
        }`}
        title="Toggle Console (Ctrl + `)"
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
  );
}
