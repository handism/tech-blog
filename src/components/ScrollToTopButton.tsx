// src/components/ScrollToTopButton.tsx
'use client';

import { ChevronUp } from 'lucide-react';

export default function ScrollToTopButton() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      onClick={scrollToTop}
      className="text-text fixed bottom-6 right-6 z-40 w-12 h-12 bg-card border border-border rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      aria-label="トップへ戻る"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
}
