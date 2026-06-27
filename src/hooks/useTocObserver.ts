'use client';

import { useEffect, useState } from 'react';
import type { TocItem } from '@/src/types/post';

export function useTocObserver(toc: TocItem[] | undefined) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!toc || toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -70% 0px',
      }
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [toc]);

  return activeId;
}
