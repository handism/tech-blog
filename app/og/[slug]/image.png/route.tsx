import { siteConfig } from '@/src/config/site';
import { getAllPostMeta, getPostMetaBySlug } from '@/src/lib/posts-server';
import fs from 'fs';
import { ImageResponse } from 'next/og';
import path from 'path';

/**
 * ビルド時にすべての記事のOGPルートを事前生成する
 */
export async function generateStaticParams() {
  const posts = await getAllPostMeta();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

let fontDataCache: ArrayBuffer | null = null;

function getFontData() {
  if (!fontDataCache) {
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'NotoSansCJKjp-Bold.otf');
    try {
      // readFileSyncでバッファとして読み込み、ArrayBufferに変換
      const buffer = fs.readFileSync(fontPath);
      fontDataCache = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    } catch (e) {
      console.error('Failed to load font. Did you run `npm run dev` or download scripts?', e);
      throw e;
    }
  }
  return fontDataCache;
}

/**
 * 記事ごとの動的OGP画像を生成するルートハンドラ。
 */
export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await getPostMetaBySlug(params.slug);

  if (!post) {
    return new Response('Not Found', { status: 404 });
  }

  const fontData = getFontData();
  const avatarUrl = `${siteConfig.github}.png`;

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#09090b', // zinc-950
        backgroundImage: 'radial-gradient(circle at 120% 120%, #10b98140 0%, #09090b 70%)',
        border: '16px solid #10b981', // emerald-500 border
        padding: '80px',
        fontFamily: '"Noto Sans JP"',
      }}
    >
      {/* ブログ・ヘッダー情報 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '40px',
          gap: '16px',
        }}
      >
        {}
        <img
          src={avatarUrl}
          alt="avatar"
          width={64}
          height={64}
          style={{
            display: 'flex',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
        <span
          style={{
            display: 'flex',
            fontSize: '32px',
            fontWeight: 700,
            color: '#d4d4d8', // zinc-300
            letterSpacing: '-0.02em',
          }}
        >
          {siteConfig.name}
        </span>
      </div>

      {/* 記事タイトル */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            display: 'flex',
            fontSize: '72px',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.3,
            letterSpacing: '-0.03em',
            margin: 0,
          }}
        >
          {post.title || 'No Title'}
        </h1>
      </div>

      {/* タグとカテゴリ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '40px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {post.category && (
            <span
              style={{
                display: 'flex',
                fontSize: '24px',
                color: '#10b981',
                backgroundColor: '#10b98120',
                padding: '8px 24px',
                borderRadius: '9999px',
              }}
            >
              {post.category}
            </span>
          )}
          {post.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                display: 'flex',
                fontSize: '24px',
                color: '#a1a1aa', // zinc-400
                backgroundColor: '#27272a', // zinc-800
                padding: '8px 24px',
                borderRadius: '9999px',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 著者名 */}
        <div
          style={{
            display: 'flex',
            fontSize: '28px',
            color: '#e4e4e7', // zinc-200
            fontWeight: 700,
          }}
        >
          @ {siteConfig.author}
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Sans JP',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
