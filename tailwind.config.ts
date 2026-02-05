import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx,md,mdx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)', // 背景
        card: 'var(--card)', // カードやサイドバー
        text: 'var(--text)', // 文字
        border: 'var(--border)', // 境界線
        accent: 'var(--accent)', // アクセントカラー
      },
    },
  },
  plugins: [typography],
};

export default config;
