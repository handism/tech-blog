// src/components/LearningDashboard.tsx
'use client';

import LearningCourseIcon from '@/src/components/LearningCourseIcon';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Brain, Cloud, Database, GraduationCap, Monitor, Sparkles } from 'lucide-react';
import DashboardFilterBar, {
  type DashboardFilterOption,
} from '@/src/components/dashboard/DashboardFilterBar';
import DashboardHero from '@/src/components/dashboard/DashboardHero';
import DashboardShell from '@/src/components/dashboard/DashboardShell';
import {
  DashboardEmptyState,
  DashboardSectionHeading,
} from '@/src/components/dashboard/DashboardSection';
import type { LearningCourse } from '@/src/types/learning';
import CourseProgressBadge from './CourseProgressBadge';

const CATEGORIES = [
  { id: 'all', name: 'すべて', icon: Sparkles },
  { id: 'frontend', name: 'フロントエンド', icon: Monitor },
  { id: 'backend', name: 'バックエンド', icon: Database },
  { id: 'infra', name: 'インフラ/DevOps', icon: Cloud },
  { id: 'fundamentals', name: '基礎知識/設計', icon: Brain },
] as const satisfies readonly DashboardFilterOption[];

type CategoryId = (typeof CATEGORIES)[number]['id'];

const categoryMeta = Object.fromEntries(
  CATEGORIES.filter((c) => c.id !== 'all').map((c) => [c.id, { name: c.name, icon: c.icon }])
) as Record<
  Exclude<CategoryId, 'all'>,
  { name: string; icon: (typeof CATEGORIES)[number]['icon'] }
>;

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
    <DashboardShell>
      <DashboardHero
        badge="Curriculum"
        title="学習ガイド"
        titleIcon={GraduationCap}
        description="エンジニアリングに必要な概念やツールの仕組みを、図解を交えて体系的に学べます。ご自身のペースでステップ順に進めていきましょう。"
      />

      <DashboardFilterBar
        searchId="course-search"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="コース名、説明、チャプターから検索..."
        searchLabel="コース名、説明、チャプターから検索"
        options={CATEGORIES}
        selectedId={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* コースリストグリッド */}
      {filteredCourses.length === 0 ? (
        <DashboardEmptyState
          message="条件に一致するコースが見つかりませんでした。"
          onReset={handleClearFilters}
        />
      ) : (
        <div className="space-y-12">
          {/* カテゴリごとのセクション表示（カテゴリが「すべて」の場合） */}
          {selectedCategory === 'all' ? (
            Object.entries(groupedCourses).map(([catKey, items]) => {
              if (items.length === 0) return null;
              const meta = categoryMeta[catKey as Exclude<CategoryId, 'all'>];
              return (
                <div key={catKey} className="space-y-6">
                  <DashboardSectionHeading icon={meta.icon} name={meta.name} count={items.length} />
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
    </DashboardShell>
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
          <span className="inline-flex items-center justify-center p-3 bg-secondary text-accent rounded-2xl border-2 border-border group-hover:scale-110 transition-transform duration-200">
            <LearningCourseIcon name={course.icon} className="w-8 h-8" />
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
      <div className="mt-6 flex items-center gap-1 text-sm font-black text-accent group-hover:translate-x-0.5 transition-transform duration-200">
        学習を始める
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
