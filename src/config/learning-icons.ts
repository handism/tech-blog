// src/config/learning-icons.ts
import {
  Atom,
  BookOpen,
  Building2,
  Cloud,
  Container,
  Database,
  FileType2,
  FlaskConical,
  Github,
  GitBranch,
  Globe,
  Palette,
  Plug,
  Rocket,
  ShieldCheck,
  Terminal,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * `learning/<course>/meta.json` の `icon` に指定できるアイコン名。
 * meta.json は JSON のためコンポーネントを直接持てず、ここで名前 → アイコンを解決する。
 * （全アイコンを動的 import すると tree-shaking が効かないため、使うものだけを明示的に登録する）
 */
const learningIcons: Record<string, LucideIcon> = {
  atom: Atom,
  book: BookOpen,
  building: Building2,
  cloud: Cloud,
  container: Container,
  database: Database,
  'file-type': FileType2,
  flask: FlaskConical,
  'git-branch': GitBranch,
  github: Github,
  globe: Globe,
  palette: Palette,
  plug: Plug,
  rocket: Rocket,
  shield: ShieldCheck,
  terminal: Terminal,
  zap: Zap,
};

/** 未登録・未指定の場合のフォールバックアイコン。 */
export const DEFAULT_LEARNING_ICON = 'book';

/**
 * アイコン名から Lucide アイコンコンポーネントを解決する。
 */
export function resolveLearningIcon(name: string): LucideIcon {
  return learningIcons[name] ?? BookOpen;
}
