'use client';

import { useState } from 'react';
import { useIsClient } from './useIsClient';
import { safeReadFromStorage, safeWriteToStorage } from '@/src/lib/storage';
import { STORAGE_KEYS } from '@/src/config/storage-keys';

type ProgressData = Record<string, Record<string, boolean>>;

export function useLearningProgress() {
  const [progress, setProgress] = useState<ProgressData>(() =>
    safeReadFromStorage<ProgressData>(STORAGE_KEYS.learningProgress, {})
  );
  const isLoaded = useIsClient();

  const toggleComplete = (courseId: string, chapterSlug: string) => {
    const currentCourseProgress = progress[courseId] || {};
    const isCurrentlyComplete = !!currentCourseProgress[chapterSlug];

    const nextProgress = {
      ...progress,
      [courseId]: {
        ...currentCourseProgress,
        [chapterSlug]: !isCurrentlyComplete,
      },
    };

    setProgress(nextProgress);
    safeWriteToStorage(STORAGE_KEYS.learningProgress, nextProgress);
  };

  const isCompleted = (courseId: string, chapterSlug: string) => {
    return !!progress[courseId]?.[chapterSlug];
  };

  const getCourseProgress = (courseId: string, totalChapters: number) => {
    if (!isLoaded || totalChapters === 0) {
      return { completedCount: 0, percent: 0 };
    }
    const courseProgress = progress[courseId] || {};
    const completedCount = Object.values(courseProgress).filter(Boolean).length;
    // 総チャプター数を超えないように調整
    const safeCompletedCount = Math.min(completedCount, totalChapters);
    const percent = Math.round((safeCompletedCount / totalChapters) * 100);
    return { completedCount: safeCompletedCount, percent };
  };

  return {
    progress,
    isLoaded,
    isCompleted,
    toggleComplete,
    getCourseProgress,
  };
}
