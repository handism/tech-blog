'use client';

import { useState } from 'react';
import type { LearningQuiz } from '@/src/types/learning';
import ChapterQuiz from './ChapterQuiz';
import ChapterCompleteButton from './ChapterCompleteButton';

interface Props {
  courseId: string;
  chapterSlug: string;
  quiz?: LearningQuiz;
}

export default function ChapterCompleteSection({ courseId, chapterSlug, quiz }: Props) {
  const [isQuizCorrect, setIsQuizCorrect] = useState(false);

  return (
    <div className="mt-12 pt-8 border-t-2 border-border/10">
      {quiz && <ChapterQuiz quiz={quiz} onCorrect={() => setIsQuizCorrect(true)} />}
      <ChapterCompleteButton
        courseId={courseId}
        chapterSlug={chapterSlug}
        isLocked={!!quiz && !isQuizCorrect}
      />
    </div>
  );
}
