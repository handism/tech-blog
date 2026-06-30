'use client';

import { useLearningProgress } from '@/src/hooks/useLearningProgress';
import { useIsClient } from '@/src/hooks/useIsClient';
import { Trophy } from 'lucide-react';

interface Props {
  courseId: string;
  totalChapters: number;
}

export default function RoadmapProgressBar({ courseId, totalChapters }: Props) {
  const { getCourseProgress, isLoaded } = useLearningProgress();
  const mounted = useIsClient();

  if (!mounted || !isLoaded) {
    return (
      <div className="theme-card p-6 border-3 rounded-2xl mb-8 h-20 animate-pulse bg-secondary/50" />
    );
  }

  const { completedCount, percent } = getCourseProgress(courseId, totalChapters);

  return (
    <div className="theme-card p-6 border-3 rounded-2xl mb-8 bg-card relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border-2 border-border shrink-0 transition-colors ${
              percent === 100 ? 'bg-amber-400 text-black' : 'bg-secondary text-text'
            }`}
          >
            <Trophy className={`w-6 h-6 ${percent === 100 && 'animate-bounce'}`} />
          </div>
          <div>
            <h3 className="font-black text-text text-base leading-tight">コース進捗状況</h3>
            <p className="text-xs text-text/50 font-bold mt-0.5">
              {percent === 100
                ? '全章を完了しました！おめでとうございます！🎉'
                : 'コース修了を目指して進めましょう！'}
            </p>
          </div>
        </div>
        <div className="sm:text-right shrink-0">
          <span className="text-2xl font-black text-text">
            {completedCount} <span className="text-sm text-text/50">/ {totalChapters} 章</span>
          </span>
          <span className="ml-3 text-xs font-black px-2.5 py-1 bg-accent text-white border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] dark:shadow-[2px_2px_0px_0px_var(--accent)] rounded-lg">
            {percent}% 完了
          </span>
        </div>
      </div>
      <div className="w-full bg-secondary h-3 rounded-full border-2 border-border overflow-hidden mt-4">
        <div
          className="bg-accent h-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
