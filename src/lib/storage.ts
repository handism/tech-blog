/**
 * localStorage の安全なラッパー。
 * SSR 時（window 未定義）やプライベートブラウズ・容量超過等で localStorage が例外を投げる場合でも
 * 呼び出し側が落ちないよう、例外を握りつぶしてフォールバック値を返す。
 */

export function safeReadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const value = window.localStorage.getItem(key);
    if (!value) return fallback;

    return JSON.parse(value) as T;
  } catch (error) {
    console.warn(`Failed to read storage key ${key}:`, error);
    return fallback;
  }
}

export function safeWriteToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to write storage key ${key}:`, error);
  }
}

/**
 * JSON を介さず生の文字列として読み出す（テーマ ID・下書きテキスト等、文字列そのままで保存しているキー用）。
 */
export function safeReadStringFromStorage(key: string): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn(`Failed to read storage key ${key}:`, error);
    return null;
  }
}

/**
 * JSON を介さず生の文字列として書き込む。
 */
export function safeWriteStringToStorage(key: string, value: string): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to write storage key ${key}:`, error);
  }
}

export function safeRemoveFromStorage(key: string): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove storage key ${key}:`, error);
  }
}
