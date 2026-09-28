import { describe, expect, it } from 'vitest';
import { ALL_STORAGE_KEYS, STORAGE_KEY_GROUPS, isKnownStorageKey } from '@/src/config/storage-keys';

describe('storage-keys', () => {
  it('every registered key belongs to exactly one reset group (so backup/reset never miss a key)', () => {
    const grouped = Object.values(STORAGE_KEY_GROUPS).flat();
    expect([...grouped].sort()).toEqual([...ALL_STORAGE_KEYS].sort());
    expect(new Set(grouped).size).toBe(grouped.length);
  });

  it('isKnownStorageKey accepts only registered keys', () => {
    expect(isKnownStorageKey('learning-progress')).toBe(true);
    expect(isKnownStorageKey('__proto__')).toBe(false);
    expect(isKnownStorageKey('arbitrary-key')).toBe(false);
  });
});
