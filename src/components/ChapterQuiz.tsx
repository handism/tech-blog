'use client';

import { useState } from 'react';
import type { LearningQuiz } from '@/src/types/learning';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight } from 'lucide-react';

interface Props {
  quiz: LearningQuiz;
  onCorrect?: () => void;
}

export default function ChapterQuiz({ quiz, onCorrect }: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
  };

  const handleSubmit = () => {
    if (selectedIdx === null || isAnswered) return;
    const correct = selectedIdx === quiz.correctIndex;
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct && onCorrect) {
      onCorrect();
    }
  };

  const handleReset = () => {
    setSelectedIdx(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  return (
    <div className="theme-card p-6 border-3 rounded-2xl my-12 bg-card relative overflow-hidden transition-all">
      {/* 装飾用の背景ロゴ */}
      <div className="absolute -right-8 -top-8 text-text/5 pointer-events-none">
        <HelpCircle className="w-32 h-32 rotate-12" />
      </div>

      <div className="relative z-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 bg-accent text-white border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] dark:shadow-[2px_2px_0px_0px_var(--accent)] rounded-lg mb-4">
          <HelpCircle className="w-3.5 h-3.5" />
          理解度チェック
        </span>

        <h3 className="text-lg md:text-xl font-black text-text mb-6 leading-snug">
          {quiz.question}
        </h3>

        <div className="space-y-3 mb-6">
          {quiz.options.map((option, idx) => {
            const isSelected = selectedIdx === idx;
            let optionStyles = 'border-2 border-border bg-card text-text hover:bg-secondary';

            if (isSelected) {
              optionStyles = 'border-3 border-border bg-accent/10 text-text font-bold';
            }
            if (isAnswered) {
              if (idx === quiz.correctIndex) {
                optionStyles =
                  'border-3 border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-black';
              } else if (isSelected) {
                optionStyles =
                  'border-3 border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold';
              } else {
                optionStyles = 'border-2 border-border/30 bg-card/50 text-text/40';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswered}
                onClick={() => handleOptionClick(idx)}
                className={`w-full text-left p-4 rounded-xl transition-all flex items-start gap-3 text-sm font-medium ${optionStyles} ${
                  !isAnswered && 'cursor-pointer active:scale-[0.99]'
                }`}
              >
                <span className="flex items-center justify-center shrink-0 w-6 h-6 rounded-full border-2 border-current text-xs font-bold">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{option}</span>
              </button>
            );
          })}
        </div>

        {/* アクションボタン */}
        {!isAnswered ? (
          <button
            type="button"
            disabled={selectedIdx === null}
            onClick={handleSubmit}
            className={`theme-btn w-full py-3.5 px-6 font-extrabold text-sm flex items-center justify-center gap-2 ${
              selectedIdx === null
                ? 'opacity-50 cursor-not-allowed border-dashed'
                : 'hover:scale-[1.01]'
            }`}
          >
            回答を送信する
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="space-y-4">
            {/* 結果表示 */}
            <div
              className={`p-4 border-2 rounded-xl flex items-start gap-3 ${
                isCorrect
                  ? 'border-emerald-500 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300'
                  : 'border-rose-500 bg-rose-500/5 text-rose-800 dark:text-rose-300'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-black text-base mb-1">
                  {isCorrect ? '正解です！🎉' : '残念、不正解です。'}
                </h4>
                <p className="text-sm leading-relaxed font-medium">{quiz.explanation}</p>
              </div>
            </div>

            {/* 不正解だった場合の再挑戦ボタン */}
            {!isCorrect && (
              <button
                type="button"
                onClick={handleReset}
                className="theme-btn w-full py-3.5 px-6 font-extrabold text-sm"
              >
                もう一度挑戦する
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
