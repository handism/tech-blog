'use client';

import { useEffect } from 'react';
import hljs from 'highlight.js';

export function CodeHighlight() {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return null;
}
