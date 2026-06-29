import { getAllCourses } from '@/src/lib/learning-server';
import { siteConfig } from '@/src/config/site';
import type { Metadata } from 'next';
import Link from 'next/link';
import CourseProgressBadge from '@/src/components/CourseProgressBadge';

export const metadata: Metadata = {
  title: `学習ガイド | ${siteConfig.name}`,
  description:
    'DockerやGitHubなど、エンジニアリングに必要な様々な仕組みを体系的かつ図解で分かりやすく学ぶ学習コンテンツ一覧。',
  alternates: {
    canonical: '/learning',
  },
};

export default async function LearningPage() {
  const courses = await getAllCourses();

  return (
    <div className="mx-auto max-w-4xl px-4 pt-12 pb-24">
      {/* ヒーローセクション */}
      <div className="page-header text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black text-text mb-4">📚 学習ガイド</h1>
        <p className="text-text/70 font-medium max-w-xl mx-auto leading-relaxed">
          エンジニアリングに必要な概念やツールの仕組みを、図解を交えて体系的に学べます。
          ご自身のペースでステップ順に進めていきましょう。
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="theme-card p-12 text-center border-3 border-border rounded-3xl shadow-[5px_5px_0px_0px_var(--border)] dark:shadow-[5px_5px_0px_0px_var(--accent)]">
          <p className="text-text/50 font-bold">現在、準備中の学習コースがあります。お楽しみに！</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/learning/${course.id}`}
              className="group theme-card theme-card-hover p-6 border-3 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl p-2 bg-secondary rounded-2xl border-2 border-border group-hover:scale-110 transition-transform duration-200">
                    {course.emoji}
                  </span>
                  <span className="text-xs font-black px-2.5 py-1 bg-accent text-white border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] dark:shadow-[2px_2px_0px_0px_var(--accent)] rounded-lg">
                    全 {course.chapters.length} 章
                  </span>
                </div>
                <h2 className="text-xl font-black text-text mb-2 group-hover:text-accent transition-colors leading-tight">
                  {course.title}
                </h2>
                <p className="text-sm text-text/70 leading-relaxed font-medium line-clamp-3">
                  {course.description}
                </p>
                <CourseProgressBadge courseId={course.id} totalChapters={course.chapters.length} />
              </div>
              <div className="mt-6 flex items-center text-sm font-black text-accent group-hover:translate-x-0.5 transition-transform duration-200">
                学習を始める
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 ml-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
