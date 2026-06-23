import LearningLayout from '@/src/components/LearningLayout';
import CopyButtonScript from '@/src/components/CopyButtonScript';
import { ImageModal } from '@/src/components/ImageModal';
import MermaidRenderer from '@/src/components/MermaidRenderer';
import ChapterCompleteSection from '@/src/components/ChapterCompleteSection';
import { siteConfig } from '@/src/config/site';
import {
  getAdjacentChapters,
  getCourse,
  getCourseChapters,
  getLearningPost,
  getAllCourses,
} from '@/src/lib/learning-server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ course: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course: courseId, slug } = await params;
  const post = await getLearningPost(courseId, slug);

  if (!post) {
    return {
      title: 'ページが見つかりません',
    };
  }

  const description = post.plaintext?.slice(0, 160);

  return {
    title: `${post.title} | ${siteConfig.name}`,
    description,
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: `${siteConfig.url}/learning/${courseId}/${slug}`,
      siteName: siteConfig.name,
    },
  };
}

export async function generateStaticParams() {
  const courses = await getAllCourses();
  const params: { course: string; slug: string }[] = [];

  for (const course of courses) {
    for (const chapter of course.chapters) {
      params.push({
        course: course.id,
        slug: chapter.slug,
      });
    }
  }

  return params;
}

export default async function ChapterDetailPage({ params }: Props) {
  const { course: courseId, slug } = await params;
  const [post, course, chapters, adjacent] = await Promise.all([
    getLearningPost(courseId, slug),
    getCourse(courseId),
    getCourseChapters(courseId),
    getAdjacentChapters(courseId, slug),
  ]);

  if (!post || !course) notFound();

  const { prevChapter, nextChapter } = adjacent;

  return (
    <LearningLayout course={course} chapters={chapters} currentSlug={slug} toc={post.toc}>
      <article className="prose dark:prose-invert max-w-none">
        {/* チャプター見出し */}
        <div className="mb-8">
          <span className="inline-block text-xs font-black px-2.5 py-1 bg-accent/10 text-accent border border-accent/20 rounded-full mb-3">
            第 {post.order} 章
          </span>
          <h1 className="mt-0 leading-tight">{post.title}</h1>
        </div>

        {/* 講義本文 */}
        <div className="mt-8" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      {/* 理解度確認クイズ ＆ 読了進捗管理 */}
      <ChapterCompleteSection courseId={courseId} chapterSlug={slug} quiz={post.quiz} />

      <ImageModal />
      <MermaidRenderer />

      {/* 前後のチャプターへのナビゲーションリンク */}
      <nav className="mt-12 pt-8 border-t-2 border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 前のステップ */}
          {prevChapter ? (
            <Link
              href={`/learning/${courseId}/${prevChapter.slug}`}
              className="block p-4 theme-card theme-card-hover border-2 rounded-xl"
            >
              <div className="text-xs text-text/50 mb-1 font-bold">← 前のチャプター</div>
              <div className="font-extrabold text-text leading-snug truncate">
                {prevChapter.title}
              </div>
            </Link>
          ) : (
            <Link
              href={`/learning/${courseId}`}
              className="block p-4 theme-card theme-card-hover border-2 rounded-xl"
            >
              <div className="text-xs text-text/50 mb-1 font-bold">← ロードマップ</div>
              <div className="font-extrabold text-text leading-snug">目次に戻る</div>
            </Link>
          )}

          {/* 次のステップ */}
          {nextChapter ? (
            <Link
              href={`/learning/${courseId}/${nextChapter.slug}`}
              className="block p-4 theme-card theme-card-hover border-2 rounded-xl sm:text-right"
            >
              <div className="text-xs text-text/50 mb-1 font-bold">次のチャプター →</div>
              <div className="font-extrabold text-accent leading-snug truncate">
                {nextChapter.title}
              </div>
            </Link>
          ) : (
            <Link
              href="/learning"
              className="block p-4 theme-card theme-card-hover border-2 rounded-xl sm:text-right"
            >
              <div className="text-xs text-text/50 mb-1 font-bold">コース修了！ 🎉</div>
              <div className="font-extrabold text-text leading-snug">学習ガイド一覧へ</div>
            </Link>
          )}
        </div>
      </nav>

      <CopyButtonScript />
    </LearningLayout>
  );
}
