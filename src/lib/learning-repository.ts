// src/lib/learning-repository.ts
import { siteConfig } from '@/src/config/site';
import fs from 'fs/promises';
import path from 'path';
import type { LearningCourseMeta } from '../types/learning';

const learningDir = path.join(process.cwd(), siteConfig.learning.dir);

export interface LearningSource {
  course: string;
  slug: string;
  raw: string;
}

/**
 * コースIDの一覧（ディレクトリ名）を取得する。
 */
export async function getCourseIds(): Promise<string[]> {
  try {
    const entries = await fs.readdir(learningDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
      .map((entry) => entry.name);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * 特定コースのメタデータ (meta.json) を読み込む。
 */
export async function readCourseMeta(courseId: string): Promise<LearningCourseMeta | null> {
  const metaPath = path.join(learningDir, courseId, 'meta.json');
  try {
    const raw = await fs.readFile(metaPath, 'utf-8');
    const data = JSON.parse(raw);
    return {
      id: courseId,
      title: data.title || courseId,
      description: data.description || '',
      emoji: data.emoji || '📖',
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
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
  const courseDir = path.join(learningDir, courseId);
  try {
    const files = await fs.readdir(courseDir, { withFileTypes: true });
    const markdownFiles = files.filter((dirent) => dirent.isFile() && dirent.name.endsWith('.md'));
    return Promise.all(
      markdownFiles.map(async (file) => {
        const slug = file.name.replace(/\.md$/, '');
        const fullPath = path.join(courseDir, file.name);
        const raw = await fs.readFile(fullPath, 'utf8');
        return { course: courseId, slug, raw };
      })
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
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
  const fullPath = path.join(learningDir, courseId, `${slug}.md`);
  try {
    const raw = await fs.readFile(fullPath, 'utf8');
    return { course: courseId, slug, raw };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}
