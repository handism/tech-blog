'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import hljs from 'highlight.js/lib/core';

// 必要な言語だけ登録（軽量＆確実）
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import java from 'highlight.js/lib/languages/java';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';

hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('java', java);

// Vue
hljs.registerLanguage('vue', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);

export function CodeHighlight() {
  const pathname = usePathname();

  useEffect(() => {
    hljs.highlightAll();
  }, [pathname]);

  return null;
}
