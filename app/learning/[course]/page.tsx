import { getCourse, getAllCourses } from '@/src/lib/learning-server';
import { siteConfig } from '@/src/config/site';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import RoadmapProgressBar from '@/src/components/RoadmapProgressBar';
import ChapterProgressCheck from '@/src/components/ChapterProgressCheck';

type Props = {
  params: Promise<{ course: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course: courseId } = await params;
  const course = await getCourse(courseId);

  if (!course) {
    return {
      title: 'コースが見つかりません',
    };
  }

  return {
    title: `${course.emoji} ${course.title} | ${siteConfig.name}`,
    description: course.description,
    openGraph: {
      title: `${course.title} | ${siteConfig.name}`,
      description: course.description,
      url: `${siteConfig.url}/learning/${courseId}`,
    },
  };
}

export async function generateStaticParams() {
  const courses = await getAllCourses();
  return courses.map((course) => ({
    course: course.id,
  }));
}

export default async function CourseRoadmapPage({ params }: Props) {
  const { course: courseId } = await params;
  const course = await getCourse(courseId);

  if (!course) notFound();

  const firstChapterSlug = course.chapters.length > 0 ? course.chapters[0].slug : null;

  return (
    <div className="mx-auto max-w-3xl px-4 pt-8 pb-24">
      {/* 戻るリンク */}
      <div className="mb-6">
        <Link
          href="/learning"
          className="inline-flex items-center gap-1 text-sm font-extrabold text-text/60 hover:text-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          学習ガイド一覧へ戻る
        </Link>
      </div>

      {/* コースヘッダー */}
      <div className="theme-card p-6 border-3 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex gap-4 items-start">
          <span className="text-5xl leading-none p-3 bg-secondary rounded-2xl border-2 border-border shrink-0">
            {course.emoji}
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-text mb-2 leading-tight">
              {course.title}
            </h1>
            <p className="text-sm text-text/70 leading-relaxed font-medium">{course.description}</p>
          </div>
        </div>
        {firstChapterSlug && (
          <Link
            href={`/learning/${course.id}/${firstChapterSlug}`}
            className="theme-btn py-3.5 px-6 text-sm font-extrabold shrink-0 text-center whitespace-nowrap"
          >
            学習をスタートする
          </Link>
        )}
      </div>

      {/* 進捗プログレスバーの追加 */}
      <RoadmapProgressBar courseId={course.id} totalChapters={course.chapters.length} />

      {/* ロードマップ・タイムライン */}
      <div className="theme-card p-6 border-3 rounded-2xl">
        <h2 className="text-xl font-black text-text mb-6 pb-3 border-b-2 border-border flex items-center gap-2">
          🗺️ ロードマップ
        </h2>

        {course.chapters.length === 0 ? (
          <p className="text-text/50 font-bold text-center py-8">
            現在、このコースのチャプターを準備中です。
          </p>
        ) : (
          <div className="relative pl-6 border-l-3 border-dashed border-border ml-3 space-y-6">
            {course.chapters.map((chapter) => (
              <div key={chapter.slug} className="relative">
                {/* タイムラインの丸ポチ */}
                <div className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full bg-card border-3 border-border flex items-center justify-center text-xs font-black text-text shadow-[2px_2px_0px_0px_var(--border)] dark:shadow-[2px_2px_0px_0px_var(--accent)]">
                  <ChapterProgressCheck
                    courseId={course.id}
                    chapterSlug={chapter.slug}
                    order={chapter.order}
                  />
                </div>

                {/* チャプターリンクカード */}
                <Link
                  href={`/learning/${course.id}/${chapter.slug}`}
                  className="group block p-4 theme-card theme-card-hover border-2 rounded-xl transition-all duration-200"
                >
                  <div className="flex justify-between items-center gap-4">
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-text group-hover:text-accent transition-colors leading-snug truncate">
                        {chapter.title}
                      </h3>
                      {chapter.plaintext && (
                        <p className="text-xs text-text/50 font-medium line-clamp-2 mt-1 leading-relaxed">
                          {chapter.plaintext}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-text/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
