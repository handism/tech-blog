// src/lib/mermaid-loader.ts
import type Mermaid from 'mermaid';

let mermaidModule: typeof Mermaid | null = null;

/**
 * mermaid モジュールを動的 import し、以降の呼び出しではキャッシュを返す。
 * `initialize()` の呼び出しタイミング・設定は呼び出し側の責務とする。
 */
export async function loadMermaid(): Promise<typeof Mermaid> {
  if (!mermaidModule) {
    mermaidModule = (await import('mermaid')).default;
  }
  return mermaidModule;
}
