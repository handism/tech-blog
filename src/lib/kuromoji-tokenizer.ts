// src/lib/kuromoji-tokenizer.ts
/**
 * kuromoji.js による日本語形態素解析（ブラウザ専用）。
 * 辞書ファイルは /kuromoji/dict/ から XHR で読み込む。
 */
import type { Tokenizer, IpadicFeatures } from 'kuromoji';

let activeTokenizer: Tokenizer<IpadicFeatures> | null = null;
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
              activeTokenizer = tokenizer;
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
 * 形態素解析が利用できない場合に備えた、文字種ベースの簡易トークナイズ（分かち書き）フォールバック。
 * 漢字・ひらがな・カタカナ・英数字の連続する部分でテキストを分割してスペースで連結する。
 */
function tokenizeFallback(text: string): string {
  // 英数字・記号(+#)、ひらがな、カタカナ、漢字をそれぞれグループにして抽出
  const regex =
    /[A-Za-z0-9+#]+|[\u3005\u3040-\u309f]+|[\u30a0-\u30ff\uff66-\uff9f]+|[\u4e00-\u9faf]+/g;
  const matches = text.match(regex);
  return matches && matches.length > 0 ? matches.join(' ') : text;
}

/**
 * 日本語テキストを形態素解析し、検索用クエリ文字列に変換する。
 * 形態素解析エンジン（kuromoji）がロード済みの場合は内容語を抽出し、基本形に正規化する。
 * まだロードが完了していない、または失敗した場合は、軽量な簡易分かち書きフォールバックで即時応答する。
 */
export async function tokenizeForSearch(text: string): Promise<string> {
  if (!text.trim()) return text;

  // すでにロード済みの場合はそれを使用
  if (activeTokenizer) {
    try {
      const tokens = activeTokenizer.tokenize(text);
      const terms = tokens
        .filter((t) => CONTENT_POS.has(t.pos))
        .map((t) => (t.basic_form && t.basic_form !== '*' ? t.basic_form : t.surface_form));
      return terms.length > 0 ? terms.join(' ') : text;
    } catch {
      return tokenizeFallback(text);
    }
  }

  // まだロードされていない場合は、バックグラウンドでのロードを開始しつつ、
  // 今回のクエリに対しては待たずに簡易分かち書きで即座に応答する（検索の即時応答性を最優先）
  preloadTokenizer();
  return tokenizeFallback(text);
}

/**
 * バックグラウンドで形態素解析エンジンを事前ロードする。
 */
export function preloadTokenizer(): void {
  getTokenizer().catch(() => {});
}
