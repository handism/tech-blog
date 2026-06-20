// src/lib/learning-server.ts
import { createLearningMeta, parseLearningSource } from '@/src/lib/learning-parser';
import {
  readAllCourseMetas,
  readCourseMeta,
  readLearningSourcesByCourse,
  readLearningSource,
} from '@/src/lib/learning-repository';
import { renderPostMarkdown } from '@/src/lib/post-renderer';
import type { LearningCourse, LearningPost, LearningPostMeta } from '@/src/types/learning';
import { filterDrafts } from '@/src/lib/utils';
import { cache } from 'react';

/**
 * コースIDとスラッグからソースを読み込み、メタ情報と本文を返す内部ヘルパー。
 */
const _loadAndParseMeta = cache(async function _loadAndParseMeta(
  courseId: string,
  slug: string
): Promise<{ meta: LearningPostMeta; content: string } | null> {
  const source = await readLearningSource(courseId, slug);
  if (!source) return null;
  const { data, content } = parseLearningSource(source.raw);
  return { meta: createLearningMeta(courseId, slug, data, content), content };
});

/**
 * 特定のコースに属するチャプターメタ情報の一覧を取得する（order昇順ソート済み）。
 */
export const getCourseChapters = cache(async function getCourseChapters(
  courseId: string
): Promise<LearningPostMeta[]> {
  const sources = await readLearningSourcesByCourse(courseId);
  const chapters = sources.map(({ slug, raw }) => {
    const { data, content } = parseLearningSource(raw);
    return createLearningMeta(courseId, slug, data, content);
  });

  const filtered = filterDrafts(chapters);
  // order の昇順でソート
  return filtered.sort((a, b) => a.order - b.order);
});

/**
 * 全てのコース情報（チャプター一覧付き）を取得する。
 */
export const getAllCourses = cache(async function getAllCourses(): Promise<LearningCourse[]> {
  const courseMetas = await readAllCourseMetas();

  const courses = await Promise.all(
    courseMetas.map(async (meta) => {
      const chapters = await getCourseChapters(meta.id);
      return {
        ...meta,
        chapters,
      };
    })
  );

  // コース自体の並び順はタイトル順
  return courses.sort((a, b) => a.title.localeCompare(b.title, 'ja'));
});

/**
 * 特定のコース情報を取得する。
 */
export const getCourse = cache(async function getCourse(
  courseId: string
): Promise<LearningCourse | null> {
  const meta = await readCourseMeta(courseId);
  if (!meta) return null;

  const chapters = await getCourseChapters(courseId);
  return {
    ...meta,
    chapters,
  };
});

/**
 * 単一の学習チャプターを取得する。
 */
export async function getLearningPost(
  courseId: string,
  slug: string
): Promise<LearningPost | null> {
  const parsed = await _loadAndParseMeta(courseId, slug);
  if (!parsed) return null;

  // 本番ビルド時は draft: true の記事へのアクセスを拒否する
  const isDev = process.env.NODE_ENV !== 'production';
  if (!isDev && parsed.meta.draft) return null;

  const { html: htmlContent, toc } = await renderPostMarkdown(parsed.content);

  return {
    ...parsed.meta,
    content: htmlContent,
    toc,
  };
}

/**
 * 指定されたチャプターの前後のチャプターを取得する。
 */
export const getAdjacentChapters = cache(async function getAdjacentChapters(
  courseId: string,
  slug: string
): Promise<{ prevChapter: LearningPostMeta | null; nextChapter: LearningPostMeta | null }> {
  const chapters = await getCourseChapters(courseId);
  const slugToIndex = new Map(chapters.map((c, i) => [c.slug, i]));
  const currentIndex = slugToIndex.get(slug) ?? -1;
  return {
    prevChapter: currentIndex > 0 ? chapters[currentIndex - 1] : null,
    nextChapter: currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null,
  };
});
