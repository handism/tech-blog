// src/components/LearningDashboard.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, Sparkles } from 'lucide-react';
import type { LearningCourse } from '@/src/types/learning';
import CourseProgressBadge from './CourseProgressBadge';

const CATEGORIES = [
  { id: 'all', name: 'すべて', emoji: '✨' },
  { id: 'frontend', name: 'フロントエンド', emoji: '💻' },
  { id: 'backend', name: 'バックエンド', emoji: '🗄️' },
  { id: 'infra', name: 'インフラ/DevOps', emoji: '☁️' },
  { id: 'fundamentals', name: '基礎知識/設計', emoji: '🧠' },
] as const;

type CategoryId = (typeof CATEGORIES)[number]['id'];

const categoryMeta = Object.fromEntries(
  CATEGORIES.filter((c) => c.id !== 'all').map((c) => [c.id, { name: c.name, emoji: c.emoji }])
) as Record<Exclude<CategoryId, 'all'>, { name: string; emoji: string }>;

interface LearningDashboardProps {
  courses: LearningCourse[];
}

export default function LearningDashboard({ courses }: LearningDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');

  // 検索とカテゴリでのフィルタリングロジック
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // カテゴリマッチ
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;

      // 検索ワードマッチ
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.chapters.some((chapter) => chapter.title.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [courses, searchQuery, selectedCategory]);

  // カテゴリごとにコースをグルーピング
  const groupedCourses = useMemo(() => {
    const groups = Object.fromEntries(
      CATEGORIES.filter((c) => c.id !== 'all').map((c) => [c.id, [] as LearningCourse[]])
    ) as Record<Exclude<CategoryId, 'all'>, LearningCourse[]>;

    filteredCourses.forEach((course) => {
      const cat = course.category as Exclude<CategoryId, 'all'>;
      if (groups[cat]) {
        groups[cat].push(course);
      }
    });

    return groups;
  }, [filteredCourses]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
      {/* ヒーローヘッダー */}
      <div className="page-header text-center max-w-2xl mx-auto mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-border rounded-lg bg-secondary text-text text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Curriculum</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight mb-4">
          📚 学習ガイド
        </h1>
        <p className="text-text/80 text-sm md:text-base leading-relaxed font-medium">
          エンジニアリングに必要な概念やツールの仕組みを、図解を交えて体系的に学べます。
          ご自身のペースでステップ順に進めていきましょう。
        </p>
      </div>

      {/* コントロールパネル (検索 ＆ フィルタ) */}
      <div className="theme-card p-5 md:p-6 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* 検索入力 */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
          <input
            id="course-search"
            type="text"
            aria-label="コース名、説明、チャプターから検索"
            placeholder="コース名、説明、チャプターから検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-card border-2 border-border text-text placeholder-text/50 rounded-xl focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[3px_3px_0px_0px_var(--border)] dark:focus:shadow-[3px_3px_0px_0px_var(--accent)] transition-all text-sm font-bold"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                document.getElementById('course-search')?.focus();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text/40 hover:text-text transition-colors p-1 focus-visible:ring-2 focus-visible:ring-accent rounded"
              aria-label="検索条件をクリア"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* カテゴリタブ */}
        <div className="flex items-center gap-2 overflow-x-auto md:overflow-x-visible py-2 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap border-2 border-border transition-all flex items-center gap-1.5 cursor-pointer
                  ${
                    isActive
                      ? 'bg-accent text-white translate-x-[2px] translate-y-[2px] shadow-none'
                      : 'bg-card text-text shadow-[2.5px_2.5px_0px_0px_var(--border)] dark:shadow-[2.5px_2.5px_0px_0px_var(--accent)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--border)] dark:hover:shadow-[4px_4px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none'
                  }
                `}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* コースリストグリッド */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 theme-card border-3 border-border rounded-3xl">
          <p className="text-text/75 mb-4 text-sm md:text-base font-bold">
            条件に一致するコースが見つかりませんでした。
          </p>
          <button
            onClick={handleClearFilters}
            className="theme-btn px-5 py-2.5 text-sm font-bold text-text cursor-pointer"
          >
            検索条件をリセットする
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* カテゴリごとのセクション表示（カテゴリが「すべて」の場合） */}
          {selectedCategory === 'all' ? (
            Object.entries(groupedCourses).map(([catKey, items]) => {
              if (items.length === 0) return null;
              const meta = categoryMeta[catKey as Exclude<CategoryId, 'all'>];
              return (
                <div key={catKey} className="space-y-6">
                  <div className="flex items-center gap-2 border-b-3 border-border pb-2">
                    <span className="text-xl md:text-2xl">{meta.emoji}</span>
                    <h2 className="text-lg md:text-xl font-extrabold text-text">{meta.name}</h2>
                    <span className="text-xs border border-border bg-secondary text-text px-2 py-0.5 rounded-md font-bold">
                      {items.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {items.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            // 特定のカテゴリのみが選択されている場合はダイレクトに一覧表示
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface CourseCardProps {
  course: LearningCourse;
}

function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
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
  );
}
