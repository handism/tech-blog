export interface SpecialCharDef {
  regex: RegExp;
  testRegex: RegExp;
  name: string;
  className: string;
  charName: string;
  hex: string;
  description: string;
}

export const SPECIAL_CHARS: SpecialCharDef[] = [
  {
    regex: /\u3000/g,
    testRegex: /\u3000/,
    name: '全角スペース',
    className:
      'bg-yellow-100 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-800',
    charName: 'IDEOGRAPHIC SPACE',
    hex: 'U+3000',
    description:
      '日本語入力時に意図せず混入し、プログラムの構文エラー原因になりやすい全角空白です。',
  },
  {
    regex: /\u200b/g,
    testRegex: /\u200b/,
    name: 'ゼロ幅スペース (ZWSP)',
    className:
      'bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-400 border border-red-300 dark:border-red-800',
    charName: 'ZERO WIDTH SPACE',
    hex: 'U+200B',
    description:
      '幅を持たない不可視のスペースです。文字列の折り返し位置の指定などに使われますが、コードに混入すると見えないバグになります。',
  },
  {
    regex: /\u200c/g,
    testRegex: /\u200c/,
    name: 'ゼロ幅非結合子 (ZWNJ)',
    className:
      'bg-orange-100 dark:bg-orange-950/40 text-orange-800 dark:text-orange-400 border border-orange-300 dark:border-orange-800',
    charName: 'ZERO WIDTH NON-JOINER',
    hex: 'U+200C',
    description: '文字同士の自動的な合字（リガチャ）を防ぐための不可視文字です。',
  },
  {
    regex: /\u200d/g,
    testRegex: /\u200d/,
    name: 'ゼロ幅結合子 (ZWJ)',
    className:
      'bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-400 border border-purple-300 dark:border-purple-800',
    charName: 'ZERO WIDTH JOINER',
    hex: 'U+200D',
    description:
      '絵文字の合成（家族の絵文字やシークエンス）や特定言語の結合に使用される不可視の結合文字です。',
  },
  {
    regex: /\ufeff/g,
    testRegex: /\ufeff/,
    name: 'BOM (バイト順マーク)',
    className:
      'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border border-blue-300 dark:border-blue-800',
    charName: 'BYTE ORDER MARK',
    hex: 'U+FEFF',
    description:
      'ファイルの先頭にエンコーディング識別として付与されることがありますが、ソースコードやJSONの先頭にあるとパースエラーの原因になります。',
  },
  {
    regex: /\u00a0/g,
    testRegex: /\u00a0/,
    name: 'NBSP (改行なしスペース)',
    className:
      'bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-400 border border-green-300 dark:border-green-800',
    charName: 'NO-BREAK SPACE',
    hex: 'U+00A0',
    description:
      '自動的な改行を防ぐスペースです。HTMLエンティティの &nbsp; と同じですが、通常の半角スペースと見分けがつかないため混同されます。',
  },
  {
    regex: /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,
    testRegex: /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/,
    name: '制御文字',
    className:
      'bg-pink-100 dark:bg-pink-950/40 text-pink-800 dark:text-pink-400 border border-pink-300 dark:border-pink-800',
    charName: 'CONTROL CHARACTER',
    hex: 'U+0000-U+001F / U+007F',
    description:
      'ヌル文字やバックスペースなどの非表示制御コードです。テキストエディタの誤操作やシステム間の転送で誤入することがあります。',
  },
];
