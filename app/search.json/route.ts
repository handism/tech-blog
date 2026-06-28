// app/search.json/route.ts
import { getAllPostMeta } from '@/src/lib/posts-server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

/**
 * 検索用インデックス（全記事のメタデータ）を JSON で提供する。
 * SSG 時には /search.json という静的ファイルとして出力される。
 */
export async function GET() {
  const allPosts = await getAllPostMeta();
  // plaintext は容量が大きいため、クライアントサイド検索インデックスからは完全に除外する
  const serializedPosts = allPosts.map(({ plaintext, ...rest }) => rest);
  return NextResponse.json(serializedPosts);
}
