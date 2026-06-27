// src/lib/markdown-utils.ts

/**
 * マークダウン本文をプレーンテキストに変換する。
 * コードブロック・画像・テーブル・HTML タグなどを除去し、本文のみ残す。
 */
export function markdownToPlaintext(markdown: string): string {
  return (
    markdown
      // フェンスコードブロック（``` または ~~~）
      .replace(/`{3}[\s\S]*?`{3}/g, '')
      .replace(/~{3}[\s\S]*?~{3}/g, '')
      // 見出し記号
      .replace(/^#{1,6}\s+/gm, '')
      // 画像（alt テキストも除去）
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      // リンク（テキストは残す）
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      // インラインコード（記号のみ除去しテキストは残す）
      .replace(/`([^`\n]+)`/g, '$1')
      // 太字・斜体（テキストは残す）
      .replace(/\*\*([^*\n]+)\*\*/g, '$1')
      .replace(/__([^_\n]+)__/g, '$1')
      .replace(/\*([^*\n]+)\*/g, '$1')
      .replace(/_([^_\n]+)_/g, '$1')
      // 取り消し線（テキストは残す）
      .replace(/~~([^~\n]+)~~/g, '$1')
      // 引用マーカー
      .replace(/^>\s*/gm, '')
      // 水平線
      .replace(/^[-*_]{3,}\s*$/gm, '')
      // テーブル区切り行（|---|---|）
      .replace(/^[\s|:-]+\|[\s|:-]+$/gm, '')
      // テーブルのパイプをスペースに
      .replace(/\|/g, ' ')
      // HTML タグ
      .replace(/<[^>]+>/g, '')
      // 余白整理
      .replace(/\s+/g, ' ')
      .trim()
  );
}
