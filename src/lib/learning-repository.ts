// src/lib/learning-repository.ts
import { siteConfig } from '@/src/config/site';
import { catchEnoent } from '@/src/lib/utils';
import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import type { LearningCourseMeta } from '../types/learning';

const learningDir = path.join(/*turbopackIgnore: true*/ process.cwd(), siteConfig.learning.dir);

const CourseMetaJsonSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  emoji: z.string().optional(),
  category: z.string().optional(),
});

export interface LearningSource {
  course: string;
  slug: string;
  raw: string;
}

/**
 * コースIDの一覧（ディレクトリ名）を取得する。
 */
export async function getCourseIds(): Promise<string[]> {
  return catchEnoent(
    (async () => {
      const entries = await fs.readdir(learningDir, { withFileTypes: true });
      return entries
        .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
        .map((entry) => entry.name);
    })(),
    []
  );
}

/**
 * 特定コースのメタデータ (meta.json) を読み込む。
 */
export async function readCourseMeta(courseId: string): Promise<LearningCourseMeta | null> {
  const metaPath = path.resolve(/*turbopackIgnore: true*/ learningDir, courseId, 'meta.json');
  if (!metaPath.startsWith(path.resolve(learningDir))) {
    return null;
  }
  return catchEnoent(
    (async () => {
      const raw = await fs.readFile(metaPath, 'utf-8');
      const parsed = JSON.parse(raw);
      const result = CourseMetaJsonSchema.safeParse(parsed);
      const data = result.success ? result.data : {};
      return {
        id: courseId,
        title: data.title || courseId,
        description: data.description || '',
        emoji: data.emoji || '📖',
        category: data.category || 'fundamentals',
      };
    })(),
    null
  );
}

/**
 * すべてのコースのメタデータを取得する。
 */
export async function readAllCourseMetas(): Promise<LearningCourseMeta[]> {
  const ids = await getCourseIds();
  const metas = await Promise.all(ids.map((id) => readCourseMeta(id)));
  return metas.filter((meta): meta is LearningCourseMeta => meta !== null);
}

/**
 * 指定されたコース内の全Markdownファイルの生データを取得する。
 */
export async function readLearningSourcesByCourse(courseId: string): Promise<LearningSource[]> {
  const courseDir = path.resolve(/*turbopackIgnore: true*/ learningDir, courseId);
  if (!courseDir.startsWith(path.resolve(learningDir))) {
    return [];
  }
  return catchEnoent(
    (async () => {
      const files = await fs.readdir(courseDir, { withFileTypes: true });
      const markdownFiles = files.filter(
        (dirent) => dirent.isFile() && dirent.name.endsWith('.md')
      );
      return Promise.all(
        markdownFiles.map(async (file) => {
          const slug = file.name.replace(/\.md$/, '');
          const fullPath = path.join(/*turbopackIgnore: true*/ courseDir, file.name);
          const raw = await fs.readFile(fullPath, 'utf8');
          return { course: courseId, slug, raw };
        })
      );
    })(),
    []
  );
}

/**
 * 全てのコースから全Markdownファイルの生データを取得する。
 */
export async function readAllLearningSources(): Promise<LearningSource[]> {
  const courseIds = await getCourseIds();
  const sourcesArray = await Promise.all(
    courseIds.map((courseId) => readLearningSourcesByCourse(courseId))
  );
  return sourcesArray.flat();
}

/**
 * 指定されたコースとスラッグのMarkdown生データを取得する。存在しなければnullを返す。
 */
export async function readLearningSource(
  courseId: string,
  slug: string
): Promise<LearningSource | null> {
  const resolvedPath = path.resolve(/*turbopackIgnore: true*/ learningDir, courseId, `${slug}.md`);
  if (!resolvedPath.startsWith(path.resolve(learningDir))) {
    return null;
  }
  return catchEnoent(
    (async () => {
      const raw = await fs.readFile(resolvedPath, 'utf8');
      return { course: courseId, slug, raw };
    })(),
    null
  );
}
