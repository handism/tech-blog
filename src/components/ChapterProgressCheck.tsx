'use client';

import { useLearningProgress } from '@/src/hooks/useLearningProgress';
import { useIsClient } from '@/src/hooks/useIsClient';
import { Check } from 'lucide-react';

interface Props {
  courseId: string;
  chapterSlug: string;
  order: number;
}

export default function ChapterProgressCheck({ courseId, chapterSlug, order }: Props) {
  const { isCompleted, isLoaded } = useLearningProgress();
  const mounted = useIsClient();

  if (!mounted || !isLoaded) {
    return <>{order}</>;
  }

  const completed = isCompleted(courseId, chapterSlug);

  if (completed) {
    return (
      <span className="flex items-center justify-center w-full h-full bg-emerald-500 text-white rounded-full transition-all duration-300">
        <Check className="w-3.5 h-3.5 stroke-[4]" />
      </span>
    );
  }

  return <>{order}</>;
}
