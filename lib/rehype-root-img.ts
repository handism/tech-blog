import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';
import type { Plugin } from 'unified';

export const rehypeRootImg: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'img') return;

      const src = node.properties?.src;

      if (typeof src !== 'string') return;

      // すでに絶対パス or 外部URLは無視
      if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')) {
        return;
      }

      // 相対パス → ルート直下
      node.properties.src = `/images/${src}`;
    });
  };
};
