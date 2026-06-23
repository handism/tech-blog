'use client';

import { useLearningProgress } from '@/src/hooks/useLearningProgress';
import { CheckCircle2, Lock, Sparkles } from 'lucide-react';

interface Props {
  courseId: string;
  chapterSlug: string;
  isLocked?: boolean;
}

export default function ChapterCompleteButton({ courseId, chapterSlug, isLocked = false }: Props) {
  const { isCompleted, toggleComplete, isLoaded } = useLearningProgress();

  if (!isLoaded) {
    return (
      <div className="h-12 w-full bg-secondary animate-pulse rounded-xl border-2 border-border/20" />
    );
  }

  const completed = isCompleted(courseId, chapterSlug);

  const handleClick = () => {
    if (isLocked && !completed) return;
    toggleComplete(courseId, chapterSlug);
  };

  return (
    <div className="my-8">
      {completed ? (
        <button
          type="button"
          onClick={handleClick}
          className="w-full flex items-center justify-center gap-2 p-4 bg-emerald-500 text-white font-extrabold rounded-xl border-3 border-border shadow-[4px_4px_0px_0px_var(--border)] dark:shadow-[4px_4px_0px_0px_var(--accent)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_var(--border)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_0px_var(--border)] transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5" />
          この章は読了済みです！ 🎉（クリックで未完了に戻す）
        </button>
      ) : (
        <button
          type="button"
          disabled={isLocked}
          onClick={handleClick}
          className={`w-full flex items-center justify-center gap-2 p-4 font-extrabold rounded-xl border-3 border-border shadow-[4px_4px_0px_0px_var(--border)] dark:shadow-[4px_4px_0px_0px_var(--accent)] transition-all ${
            isLocked
              ? 'bg-secondary text-text/30 cursor-not-allowed opacity-60 border-dashed shadow-none dark:shadow-none'
              : 'bg-accent text-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_var(--border)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_0px_var(--border)] cursor-pointer'
          }`}
        >
          {isLocked ? (
            <>
              <Lock className="w-5 h-5" />
              クイズに正解すると読了マークを付けられます
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 animate-pulse" />
              この章を読了する
            </>
          )}
        </button>
      )}
    </div>
  );
}
