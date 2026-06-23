'use client';

import { useLearningProgress } from '@/src/hooks/useLearningProgress';
import { useEffect, useState } from 'react';

interface Props {
  courseId: string;
  totalChapters: number;
}

export default function CourseProgressBadge({ courseId, totalChapters }: Props) {
  const { getCourseProgress, isLoaded } = useLearningProgress();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || !isLoaded) {
    return (
      <div className="mt-4 h-6 w-24 bg-secondary animate-pulse rounded-md border border-border/10" />
    );
  }

  const { completedCount, percent } = getCourseProgress(courseId, totalChapters);

  if (completedCount === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-border/10">
      <div className="flex justify-between items-center text-xs font-black text-text/60 mb-1.5">
        <span>進捗状況</span>
        <span>
          {completedCount} / {totalChapters} 章 ({percent}%)
        </span>
      </div>
      <div className="w-full bg-secondary h-2.5 rounded-full border border-border overflow-hidden">
        <div
          className="bg-accent h-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
