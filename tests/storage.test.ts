import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { safeReadFromStorage, safeWriteToStorage } from '@/src/lib/storage';

describe('safeReadFromStorage / safeWriteToStorage', () => {
  const storageKey = 'test-storage';

  beforeEach(() => {
    vi.stubGlobal('window', {
      localStorage: {
        getItem: vi.fn(),
        setItem: vi.fn(),
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns fallback when storage is empty', () => {
    const getItem = vi.mocked(window.localStorage.getItem);
    getItem.mockReturnValue(null);

    expect(safeReadFromStorage(storageKey, { ok: false })).toEqual({ ok: false });
  });

  it('parses stored JSON and writes back safely', () => {
    const getItem = vi.mocked(window.localStorage.getItem);
    const setItem = vi.mocked(window.localStorage.setItem);
    getItem.mockReturnValue(JSON.stringify({ ok: true }));

    const value = safeReadFromStorage(storageKey, { ok: false });
    safeWriteToStorage(storageKey, value);

    expect(value).toEqual({ ok: true });
    expect(setItem).toHaveBeenCalledWith(storageKey, JSON.stringify({ ok: true }));
  });
});
