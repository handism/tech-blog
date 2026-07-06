import { siteConfig } from '@/src/config/site';
import { getAllAwsPatternMetas, getAwsPatternBySlug } from '@/src/lib/aws-gallery-server';
import { getOgFontData, getOgAvatarDataUri } from '@/src/lib/og-helpers';
import { ImageResponse } from 'next/og';

/**
 * ビルド時にすべてのAWSパターンのOGPルートを事前生成する
 */
export async function generateStaticParams() {
  const patterns = await getAllAwsPatternMetas();
  return patterns.map((p) => ({
    slug: p.slug,
  }));
}

/**
 * AWSパターンごとの動的OGP画像を生成するルートハンドラ。
 */
export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const pattern = await getAwsPatternBySlug(params.slug);

  if (!pattern) {
    return new Response('Not Found', { status: 404 });
  }

  const [fontData, avatarUrl] = await Promise.all([getOgFontData(), getOgAvatarDataUri()]);

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#09090b', // zinc-950
        backgroundImage: 'radial-gradient(circle at 120% 120%, #3b82f640 0%, #09090b 70%)',
        border: '16px solid #3b82f6', // blue-500 border
        padding: '80px',
        fontFamily: '"Noto Sans JP"',
      }}
    >
      {/* 著者・ヘッダー情報 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '30px',
          gap: '16px',
        }}
      >
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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            {siteConfig.name}
          </span>
          <span
            style={{
              fontSize: '18px',
              fontWeight: 500,
              color: '#3b82f6',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginTop: '4px',
            }}
          >
            AWS Architecture Gallery
          </span>
        </div>
      </div>

      {/* タイトル */}
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
            fontSize: '60px',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.3,
            letterSpacing: '-0.03em',
            margin: 0,
          }}
        >
          {pattern.title || 'No Title'}
        </h1>
      </div>

      {/* タグとカテゴリ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '30px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {pattern.category && (
            <span
              style={{
                display: 'flex',
                fontSize: '22px',
                fontWeight: 700,
                color: '#3b82f6',
                backgroundColor: '#3b82f620',
                padding: '8px 24px',
                borderRadius: '9999px',
                border: '1px solid #3b82f630',
              }}
            >
              {pattern.category}
            </span>
          )}
          {pattern.awsServices?.slice(0, 4).map((srv) => (
            <span
              key={srv}
              style={{
                display: 'flex',
                fontSize: '22px',
                color: '#e4e4e7',
                backgroundColor: '#27272a',
                padding: '8px 24px',
                borderRadius: '9999px',
              }}
            >
              {srv}
            </span>
          ))}
        </div>

        {/* 著者名 */}
        <div
          style={{
            display: 'flex',
            fontSize: '26px',
            color: '#a1a1aa',
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
