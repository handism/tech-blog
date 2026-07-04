// tests/client-search.test.ts
import { describe, expect, it } from 'vitest';
import { createPostSearcher, searchPostsWithMatches } from '@/src/lib/client-search';
import type { PostMeta } from '@/src/types/post';

const makePosts = (): PostMeta[] => [
  {
    slug: 'vue-intro',
    title: 'Vue.js入門',
    date: new Date('2024-01-01'),
    tags: ['Vue', 'Frontend'],
    category: 'Frontend',
    keywords: 'Vue.js 基本 使い方 解説 コンポーネント リアクティビティ',
    plaintext: 'Vue.jsの基本的な使い方を解説します。コンポーネントやリアクティビティについて。',
    description: 'Vue.jsの基本的な使い方を解説します。コンポーネントやリアクティビティについて。',
    readingMinutes: 1,
  },
  {
    slug: 'react-intro',
    title: 'React入門',
    date: new Date('2024-02-01'),
    tags: ['React', 'Frontend'],
    category: 'Frontend',
    keywords: 'React 基本 使い方 解説 Hooks コンポーネント',
    plaintext: 'Reactの基本的な使い方を解説します。Hooksやコンポーネントについて。',
    description: 'Reactの基本的な使い方を解説します。Hooksやコンポーネントについて。',
    readingMinutes: 1,
  },
  {
    slug: 'aws-intro',
    title: 'AWS入門',
    date: new Date('2024-03-01'),
    tags: ['AWS', 'Infrastructure'],
    category: 'Infrastructure',
    keywords: 'AWS サービス 解説 EC2 S3 RDS 基本 使い方',
    plaintext: 'AWSの各サービスを解説します。EC2、S3、RDSの基本的な使い方。',
    description: 'AWSの各サービスを解説します。EC2、S3、RDSの基本的な使い方。',
    readingMinutes: 1,
  },
];

describe('createPostSearcher', () => {
  it('Fuseインスタンスを返す', () => {
    const searcher = createPostSearcher(makePosts());
    expect(searcher).toBeTruthy();
    expect(typeof searcher.search).toBe('function');
  });

  it('空配列でも動作する', () => {
    const searcher = createPostSearcher([]);
    expect(searcher).toBeTruthy();
  });
});

describe('searchPosts (インライン実装)', () => {
  it('タイトルにマッチする記事を返す', () => {
    const searcher = createPostSearcher(makePosts());
    const results = searcher.search('Vue').map((r) => r.item);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].slug).toBe('vue-intro');
  });

  it('空キーワードで空配列を返す', () => {
    const searcher = createPostSearcher(makePosts());
    const search = (q: string) => (q.trim() === '' ? [] : searcher.search(q).map((r) => r.item));
    expect(search('')).toEqual([]);
    expect(search('   ')).toEqual([]);
  });

  it('マッチしないキーワードで空配列を返す', () => {
    const searcher = createPostSearcher(makePosts());
    const results = searcher.search('xyzxyzxyz存在しないキーワード').map((r) => r.item);
    expect(results).toEqual([]);
  });
});

describe('searchPostsWithMatches', () => {
  it('タイトルマッチ時にtitleIndicesを返す', () => {
    const searcher = createPostSearcher(makePosts());
    const results = searchPostsWithMatches(searcher, 'Vue');
    expect(results.length).toBeGreaterThan(0);
    const top = results[0];
    expect(top.post.slug).toBe('vue-intro');
    expect(top.titleIndices.length).toBeGreaterThan(0);
  });

  it('本文マッチ時にsnippetを返す', () => {
    const searcher = createPostSearcher(makePosts());
    const results = searchPostsWithMatches(searcher, 'コンポーネント');
    expect(results.length).toBeGreaterThan(0);
    const matched = results.find((r) => r.post.slug === 'vue-intro');
    expect(matched).toBeTruthy();
    expect(matched?.snippet).toBeTruthy();
  });

  it('タグにマッチする記事を返す', () => {
    const searcher = createPostSearcher(makePosts());
    const results = searchPostsWithMatches(searcher, 'AWS');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].post.slug).toBe('aws-intro');
  });

  it('結果は最大8件に制限される', () => {
    const manyPosts: PostMeta[] = Array.from({ length: 20 }, (_, i) => ({
      slug: `post-${i}`,
      title: `テスト記事 ${i}`,
      date: new Date('2024-01-01'),
      tags: ['Test'],
      category: 'IT',
      keywords: 'テスト本文',
      plaintext: 'テスト本文',
      description: 'テスト本文',
      readingMinutes: 1,
    }));
    const searcher = createPostSearcher(manyPosts);
    const results = searchPostsWithMatches(searcher, 'テスト');
    expect(results.length).toBeLessThanOrEqual(8);
  });

  it('空キーワードで空配列を返す', () => {
    const searcher = createPostSearcher(makePosts());
    expect(searchPostsWithMatches(searcher, '')).toEqual([]);
  });

  it('タグマッチ時にmatchedTagsを返す', () => {
    const searcher = createPostSearcher(makePosts());
    const results = searchPostsWithMatches(searcher, 'Infrastructure');
    expect(results.length).toBeGreaterThan(0);
    const awsResult = results.find((r) => r.post.slug === 'aws-intro');
    expect(awsResult).toBeTruthy();
    expect(awsResult?.matchedTags.length).toBeGreaterThan(0);
  });

  it('カテゴリマッチ時にcategoryIndicesを返す', () => {
    const searcher = createPostSearcher(makePosts());
    const results = searchPostsWithMatches(searcher, 'Infrastructure');
    const awsResult = results.find((r) => r.post.slug === 'aws-intro');
    expect(awsResult).toBeTruthy();
    // カテゴリ'Infrastructure'がマッチした場合はindicesが設定される
    expect(awsResult?.categoryIndices).toBeDefined();
  });
});
