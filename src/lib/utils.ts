// src/lib/utils.ts
import matter from 'gray-matter';
import { z } from 'zod';

/**
 * フロントマターのパースとバリデーションを行う共通ヘルパー。
 */
export function parseFrontmatter<T>(
  raw: string,
  schema: z.ZodType<T>
): { data: T; content: string } {
  const { data, content } = matter(raw);
  const result = schema.safeParse(data);
  if (!result.success) {
    console.warn('Frontmatter parse failed:', result.error.flatten());
    return { data: schema.parse({}), content };
  }
  return { data: result.data, content };
}

/**
 * テキストをURL向けのスラッグに変換する。
 */
function toSlug(value: string): string {
  const normalized = value.normalize('NFKC').trim().toLowerCase();
  const symbolExpanded = normalized
    .replace(/\+/g, ' plus ')
    .replace(/#/g, ' sharp ')
    .replace(/&/g, ' and ');
  const slug = symbolExpanded
    .replace(/\s+/g, '-')
    .replace(/[^\p{Letter}\p{Number}\p{Mark}-]/gu, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');

  if (slug) return slug;

  // 記号のみなどで空文字になるケースは、安定したハッシュ値でフォールバックする。
  return `slug-${hashString(symbolExpanded).toString(36)}`;
}

/**
 * 文字列から安定した32bitハッシュを生成する。
 */
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
}

/**
 * タグ名をURL向けのスラッグに変換する。
 */
export const tagToSlug = toSlug;

/**
 * カテゴリ名をURL向けのスラッグに変換する。
 */
export const categoryToSlug = toSlug;

/**
 * プレーンテキストから読了時間（分）を推定する。
 * CJK文字（日本語等）は約600字/分、英単語は約200語/分で計算する。
 */
export function estimateReadingMinutes(plaintext: string): number {
  if (!plaintext) return 1;
  // ひらがな・カタカナ・漢字・全角文字など
  const cjkCount = (plaintext.match(/[\u3000-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]/g) ?? []).length;
  // 英単語
  const wordCount = (plaintext.match(/[a-zA-Z]+(?:['-][a-zA-Z]+)*/g) ?? []).length;
  return Math.max(1, Math.ceil(cjkCount / 600 + wordCount / 200));
}

/**
 * 日付順に降順でソートする（日付がないものは末尾）。元の配列を変更しないようコピーする。
 */
export function sortByDate<T extends { date?: Date }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.getTime() - a.date.getTime();
  });
}

/**
 * 開発環境以外では下書き（draft: true）を除外する。
 */
export function filterDrafts<T extends { draft?: boolean }>(items: T[]): T[] {
  const isDev = process.env.NODE_ENV !== 'production';
  return isDev ? items : items.filter((item) => !item.draft);
}

/**
 * 現在の環境（開発環境か本番環境か）に応じて、対象のアイテムが表示可能かどうか判定する。
 * 本番環境では下書き（draft: true）のアイテムは表示不可とする。
 */
export function isVisibleInEnv(item: { draft?: boolean }): boolean {
  const isDev = process.env.NODE_ENV !== 'production';
  return isDev || !item.draft;
}

/**
 * 共通のZod日付スキーマ。
 * 文字列またはDate型を受け取り、Dateオブジェクトに変換して検証する。
 */
export const zodDateSchema = z
  .union([z.string(), z.date()])
  .transform((v) => new Date(v))
  .pipe(z.date())
  .optional();

/**
 * 非同期処理を実行し、ENOENT（ファイル・ディレクトリ未存在）エラーが発生した場合は指定したフォールバック値を返し、
 * それ以外のエラーはそのまま再スローするヘルパー。
 */
export async function catchEnoent<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return fallback;
    }
    throw error;
  }
}
