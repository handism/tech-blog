// tests/posts-server.test.ts
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getAdjacentPosts } from '@/src/lib/posts-server';
import { readAllPostSources } from '@/src/lib/post-repository';

vi.mock('@/src/lib/post-repository', () => ({
  readAllPostSources: vi.fn(),
  readPostSourceBySlug: vi.fn(),
}));

describe('posts-server', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAdjacentPosts', () => {
    it('日付降順（新しい順）のリストにおいて、prevPostは「より古い記事」、nextPostは「より新しい記事」を返すこと', async () => {
      // 日付降順のモック記事ソース
      const mockSources = [
        {
          slug: 'latest-post',
          raw: `---
title: 最新の記事
date: 2026-06-25
category: Dev
tags: []
---
最新の本文`,
        },
        {
          slug: 'middle-post',
          raw: `---
title: 中間の記事
date: 2026-06-24
category: Dev
tags: []
---
中間の本文`,
        },
        {
          slug: 'oldest-post',
          raw: `---
title: 最古の記事
date: 2026-06-23
category: Dev
tags: []
---
最古の本文`,
        },
      ];

      vi.mocked(readAllPostSources).mockResolvedValue(mockSources);

      // 1. 中間の記事「middle-post」での挙動を検証
      const resultMiddle = await getAdjacentPosts('middle-post');
      expect(resultMiddle.prevPost?.slug).toBe('oldest-post'); // 前の記事はより古い記事
      expect(resultMiddle.nextPost?.slug).toBe('latest-post'); // 次の記事はより新しい記事

      // 2. 最新の記事「latest-post」での挙動を検証
      const resultLatest = await getAdjacentPosts('latest-post');
      expect(resultLatest.prevPost?.slug).toBe('middle-post'); // 前の記事は middle-post
      expect(resultLatest.nextPost).toBeNull(); // 次の記事（より新しい記事）は存在しない

      // 3. 最古の記事「oldest-post」での挙動を検証
      const resultOldest = await getAdjacentPosts('oldest-post');
      expect(resultOldest.prevPost).toBeNull(); // 前の記事（より古い記事）は存在しない
      expect(resultOldest.nextPost?.slug).toBe('middle-post'); // 次の記事は middle-post
    });
  });
});
