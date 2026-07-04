import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolveSlugOrNotFound } from '../src/lib/slug-resolver';
import { notFound } from 'next/navigation';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

describe('resolveSlugOrNotFound', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const toSlug = (value: string) => value.toLowerCase();

  it('returns the matched candidate when a match is found', () => {
    const candidates = ['Apple', 'Banana', 'Cherry'];

    const result = resolveSlugOrNotFound('banana', candidates, toSlug);

    expect(result).toBe('Banana');
    expect(notFound).not.toHaveBeenCalled();
  });

  it('calls notFound when no match is found', () => {
    const candidates = ['Apple', 'Banana', 'Cherry'];

    const result = resolveSlugOrNotFound('orange', candidates, toSlug);

    expect(notFound).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
