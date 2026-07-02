// src/lib/kuromoji-tokenizer.ts
/**
 * 簡易分かち書きによる日本語トークナイズ（検索キーワード抽出用）。
 * ※ クライアント側（ブラウザ）とサーバー側（ビルド時）で同一の軽量トークナイズを使用します。
 */

/**
 * 形態素解析が利用できない場合に備えた、文字種ベース of 簡易トークナイズ（分かち書き）フォールバック。
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
 * 日本語テキストを分かち書きし、検索用クエリ文字列に変換する。
 * 検索精度の一貫性を保つため、ビルド時（サーバー）と検索実行時（クライアント）の双方で
 * 同一の軽量な分かち書きロジック（tokenizeFallback）を使用します。
 */
export async function tokenizeForSearch(text: string, _waitLoad = false): Promise<string> {
  if (!text.trim()) return text;
  return tokenizeFallback(text);
}
