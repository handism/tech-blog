// components/CodeHighlight.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import hljs from 'highlight.js/lib/core';

// 既存
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';

// 追加分
import java from 'highlight.js/lib/languages/java';
import xml from 'highlight.js/lib/languages/xml'; // Vue 用
import css from 'highlight.js/lib/languages/css'; // Vue 用

// 言語登録
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);

// Java
hljs.registerLanguage('java', java);

// Vue（SFC）
hljs.registerLanguage('vue', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);

export function CodeHighlight() {
  const pathname = usePathname();

  useEffect(() => {
    hljs.highlightAll();
  }, [pathname]); // ページ遷移時も再実行

  return null;
}
