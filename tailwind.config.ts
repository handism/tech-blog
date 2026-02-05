import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import tailwindHighlightjs from 'tailwind-highlightjs';

const config: Config = {
  // darkMode: 'class' はCSS側で扱うので削除OK（任意で残してもいい）
  content: ['./app/**/*.{js,ts,jsx,tsx,md,mdx}', './components/**/*.{js,ts,jsx,tsx}'],
  plugins: [
    typography,
    tailwindHighlightjs({
      theme: 'github-dark',
    }),
  ],
};

export default config;
