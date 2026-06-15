// src/lib/kuromoji-tokenizer.ts
/**
 * kuromoji.js による日本語形態素解析（ブラウザ専用）。
 * 辞書ファイルは /kuromoji/dict/ から XHR で読み込む。
 */
import type { Tokenizer, IpadicFeatures } from 'kuromoji';

let tokenizerPromise: Promise<Tokenizer<IpadicFeatures>> | null = null;

function getTokenizer(): Promise<Tokenizer<IpadicFeatures>> {
  if (!tokenizerPromise) {
    tokenizerPromise = import('kuromoji').then(
      (kuromoji) =>
        new Promise<Tokenizer<IpadicFeatures>>((resolve, reject) => {
          kuromoji.builder({ dicPath: '/kuromoji/dict' }).build((err, tokenizer) => {
            if (err) {
              tokenizerPromise = null;
              reject(err);
            } else {
              resolve(tokenizer);
            }
          });
        })
    );
  }
  return tokenizerPromise;
}

// 検索に有効な品詞
const CONTENT_POS = new Set(['名詞', '動詞', '形容詞', '副詞']);

/**
 * 日本語テキストを形態素解析し、検索用クエリ文字列に変換する。
 * 内容語（名詞・動詞・形容詞・副詞）を抽出し、動詞・形容詞は基本形に正規化する。
 * 解析に失敗した場合は元のテキストをそのまま返す。
 */
export async function tokenizeForSearch(text: string): Promise<string> {
  if (!text.trim()) return text;

  try {
    const tokenizer = await getTokenizer();
    const tokens = tokenizer.tokenize(text);
    const terms = tokens
      .filter((t) => CONTENT_POS.has(t.pos))
      .map((t) => (t.basic_form && t.basic_form !== '*' ? t.basic_form : t.surface_form));
    return terms.length > 0 ? terms.join(' ') : text;
  } catch {
    return text;
  }
}

/**
 * バックグラウンドで形態素解析エンジンを事前ロードする。
 */
export function preloadTokenizer(): void {
  getTokenizer().catch(() => {});
}
