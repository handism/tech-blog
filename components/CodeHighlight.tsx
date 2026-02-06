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
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python';
import markdown from 'highlight.js/lib/languages/markdown';

hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('java', java);

// Vue
hljs.registerLanguage('vue', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);

hljs.registerLanguage('xml', xml);

// 👇 これが sh 対応の正体
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('zsh', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('yml', yaml);
hljs.registerLanguage('php', php);
hljs.registerLanguage('phtml', php);

hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);

hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('md', markdown);

export function CodeHighlight() {
  const pathname = usePathname();

  useEffect(() => {
    hljs.highlightAll();
  }, [pathname]);

  return null;
}
