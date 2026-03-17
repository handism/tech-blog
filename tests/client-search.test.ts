// tests/client-search.test.ts
import { describe, expect, it } from 'vitest';
import { createPostSearcher, searchPosts, searchPostsWithMatches } from '@/src/lib/client-search';
import type { PostMeta } from '@/src/types/post';

const makePosts = (): PostMeta[] => [
  {
    slug: 'vue-intro',
    title: 'Vue.js入門',
    date: new Date('2024-01-01'),
    tags: ['Vue', 'Frontend'],
    category: 'Frontend',
    plaintext: 'Vue.jsの基本的な使い方を解説します。コンポーネントやリアクティビティについて。',
  },
  {
    slug: 'react-intro',
    title: 'React入門',
    date: new Date('2024-02-01'),
    tags: ['React', 'Frontend'],
    category: 'Frontend',
    plaintext: 'Reactの基本的な使い方を解説します。Hooksやコンポーネントについて。',
  },
  {
    slug: 'aws-intro',
    title: 'AWS入門',
    date: new Date('2024-03-01'),
    tags: ['AWS', 'Infrastructure'],
    category: 'Infrastructure',
    plaintext: 'AWSの各サービスを解説します。EC2、S3、RDSの基本的な使い方。',
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

describe('searchPosts', () => {
  it('タイトルにマッチする記事を返す', () => {
    const searcher = createPostSearcher(makePosts());
    const results = searchPosts(searcher, 'Vue');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].slug).toBe('vue-intro');
  });

  it('空キーワードで空配列を返す', () => {
    const searcher = createPostSearcher(makePosts());
    expect(searchPosts(searcher, '')).toEqual([]);
    expect(searchPosts(searcher, '   ')).toEqual([]);
  });

  it('マッチしないキーワードで空配列を返す', () => {
    const searcher = createPostSearcher(makePosts());
    const results = searchPosts(searcher, 'xyzxyzxyz存在しないキーワード');
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
      plaintext: 'テスト本文',
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
