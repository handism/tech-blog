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
