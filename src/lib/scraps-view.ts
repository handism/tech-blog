// src/lib/scraps-view.ts
import { getAllScrapMeta } from '@/src/lib/scraps-server';
import { getTagsWithCount, type TagCount } from '@/src/lib/post-taxonomy';
import type { ScrapMeta } from '@/src/types/scrap';
import { cache } from 'react';

type ScrapViewContext = {
  allScraps: ScrapMeta[];
  tagCounts: TagCount[];
};

export const getScrapViewContext = cache(
  async function getScrapViewContext(): Promise<ScrapViewContext> {
    const allScraps = await getAllScrapMeta();
    const tagCounts = getTagsWithCount(allScraps);
    return { allScraps, tagCounts };
  }
);
