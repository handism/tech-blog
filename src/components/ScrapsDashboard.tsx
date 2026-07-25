// src/components/ScrapsDashboard.tsx
'use client';

import { useMemo, useState } from 'react';
import { NotebookPen, Sparkles, Tag } from 'lucide-react';
import DashboardFilterBar, {
  type DashboardFilterOption,
} from '@/src/components/dashboard/DashboardFilterBar';
import DashboardHero from '@/src/components/dashboard/DashboardHero';
import DashboardShell from '@/src/components/dashboard/DashboardShell';
import { DashboardEmptyState } from '@/src/components/dashboard/DashboardSection';
import ScrapCardList from '@/src/components/ScrapCardList';
import CopyButtonScript from '@/src/components/CopyButtonScript';
import { ImageModal } from '@/src/components/ImageModal';
import MermaidRenderer from '@/src/components/MermaidRenderer';
import type { TagCount } from '@/src/lib/post-taxonomy';
import type { Scrap } from '@/src/types/scrap';

const ALL_TAGS = '__all__';

type ScrapsDashboardProps = {
  scraps: Scrap[];
  tagCounts: TagCount[];
};

export default function ScrapsDashboard({ scraps, tagCounts }: ScrapsDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>(ALL_TAGS);

  // タグフィルタの選択肢（件数の多い順。Tools / Learning のカテゴリタブと同じ見た目）
  const tagOptions = useMemo<DashboardFilterOption[]>(
    () => [
      { id: ALL_TAGS, name: 'すべて', icon: Sparkles },
      ...tagCounts.map((tagCount) => ({
        id: tagCount.tag,
        name: `${tagCount.tag} (${tagCount.count})`,
        icon: Tag,
      })),
    ],
    [tagCounts]
  );

  const filteredScraps = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return scraps.filter((scrap) => {
      const matchesTag = selectedTag === ALL_TAGS || scrap.tags.includes(selectedTag);
      const matchesSearch =
        !query ||
        scrap.title.toLowerCase().includes(query) ||
        scrap.description.toLowerCase().includes(query) ||
        scrap.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesTag && matchesSearch;
    });
  }, [scraps, searchQuery, selectedTag]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTag(ALL_TAGS);
  };

  return (
    <DashboardShell>
      <DashboardHero
        badge="Notes"
        title="Scraps"
        titleIcon={NotebookPen}
        description="日々の気づきやエラー解決ログを短く残すメモ帳です。記事にするほどではない小さな学びを積み上げています。"
      />

      <DashboardFilterBar
        searchId="scrap-search"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="キーワードやタグから検索..."
        searchLabel="スクラップをキーワードやタグから検索"
        options={tagOptions}
        selectedId={selectedTag}
        onSelect={setSelectedTag}
      />

      {filteredScraps.length === 0 && scraps.length > 0 ? (
        <DashboardEmptyState
          message="条件に一致するスクラップが見つかりませんでした。"
          onReset={handleClearFilters}
        />
      ) : (
        <ScrapCardList scraps={filteredScraps} />
      )}

      <ImageModal />
      <CopyButtonScript />
      <MermaidRenderer />
    </DashboardShell>
  );
}
