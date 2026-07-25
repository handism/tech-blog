// src/components/LearningCourseIcon.tsx
import { createElement } from 'react';
import { resolveLearningIcon } from '@/src/config/learning-icons';

interface LearningCourseIconProps {
  /** meta.json の `icon` に指定されたアイコン名 */
  name: string;
  className?: string;
}

/**
 * コースのアイコン名を Lucide アイコンとして描画する。
 * 呼び出し側でアイコンコンポーネントを変数に束ねずに済むよう createElement で生成している。
 */
export default function LearningCourseIcon({ name, className }: LearningCourseIconProps) {
  return createElement(resolveLearningIcon(name), { className });
}
