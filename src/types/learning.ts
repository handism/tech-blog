// src/types/learning.ts
import type { TocItem } from './post';

export interface LearningQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/**
 * 学習チャプター（講義）のメタ情報。
 */
export interface LearningPostMeta {
  course: string; // コースID (例: "docker")
  slug: string; // チャプターのスラッグ (例: "01-architecture")
  title: string; // チャプターのタイトル
  date?: Date; // 公開・更新日
  order: number; // コース内の並び順 (1, 2, 3...)
  draft?: boolean; // 下書きフラグ
  plaintext?: string; // 検索・要約用テキスト
  quiz?: LearningQuiz; // 確認クイズ
}

/**
 * 学習チャプターの詳細データ（本文HTML付き）。
 */
export interface LearningPost extends LearningPostMeta {
  content: string; // HTML本文
  toc?: TocItem[]; // 目次
}

/**
 * 学習コース自体のメタデータ（meta.json）。
 */
export interface LearningCourseMeta {
  id: string; // コースID (ディレクトリ名)
  title: string; // コースタイトル
  description: string; // コース概要
  emoji: string; // 表示用絵文字
  category: string; // カテゴリ
}

/**
 * 学習コース（チャプター一覧を含む全体データ）。
 */
export interface LearningCourse extends LearningCourseMeta {
  chapters: LearningPostMeta[]; // このコースに属するチャプターの一覧 (order順にソート済み)
}
