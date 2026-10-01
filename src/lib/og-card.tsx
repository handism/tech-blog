// src/lib/og-card.tsx
import { siteConfig } from '@/src/config/site';
import { getOgAvatarDataUri, getOgFontData } from '@/src/lib/og-helpers';
import { ImageResponse } from 'next/og';

/**
 * OGP カードの文字サイズ・配色のプリセット。
 * `large` はブログ記事、`compact` はバッジ数が多い AWS パターン向け（カテゴリバッジも強調する）。
 */
const SIZES = {
  large: {
    sectionGap: '40px',
    titleFontSize: '72px',
    badgeFontSize: '24px',
    badgeColor: '#a1a1aa', // zinc-400
    authorFontSize: '28px',
    authorColor: '#e4e4e7', // zinc-200
    emphasizeCategory: false,
  },
  compact: {
    sectionGap: '30px',
    titleFontSize: '60px',
    badgeFontSize: '22px',
    badgeColor: '#e4e4e7', // zinc-200
    authorFontSize: '26px',
    authorColor: '#a1a1aa', // zinc-400
    emphasizeCategory: true,
  },
} as const;

type OgCardOptions = {
  title: string;
  /** 枠線・背景グラデーション・カテゴリバッジに使うアクセントカラー（`#rrggbb`） */
  accentColor: string;
  /** サイト名の下に表示する補足（例: セクション名）。指定時はサイト名を 2 段組みで表示する */
  subtitle?: string;
  category?: string;
  /** カテゴリの後ろに並べるバッジ（表示用に整形・件数調整済みのもの） */
  badges?: string[];
  size?: keyof typeof SIZES;
};

/**
 * OGP 画像（1200×630）を生成する。フォント・アバターの読み込みも内包する。
 */
export async function createOgImageResponse({
  title,
  accentColor,
  subtitle,
  category,
  badges = [],
  size = 'large',
}: OgCardOptions): Promise<ImageResponse> {
  const s = SIZES[size];
  const [fontData, avatarUrl] = await Promise.all([getOgFontData(), getOgAvatarDataUri()]);

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#09090b', // zinc-950
        backgroundImage: `radial-gradient(circle at 120% 120%, ${accentColor}40 0%, #09090b 70%)`,
        border: `16px solid ${accentColor}`,
        padding: '80px',
        fontFamily: '"Noto Sans JP"',
      }}
    >
      {/* ヘッダー（アバター・サイト名） */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: s.sectionGap,
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
        {subtitle ? (
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
                color: accentColor,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginTop: '4px',
              }}
            >
              {subtitle}
            </span>
          </div>
        ) : (
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
        )}
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
            fontSize: s.titleFontSize,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.3,
            letterSpacing: '-0.03em',
            margin: 0,
          }}
        >
          {title || 'No Title'}
        </h1>
      </div>

      {/* カテゴリ・バッジと著者名 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: s.sectionGap,
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {category && (
            <span
              style={{
                display: 'flex',
                fontSize: s.badgeFontSize,
                ...(s.emphasizeCategory && { fontWeight: 700 }),
                color: accentColor,
                backgroundColor: `${accentColor}20`,
                padding: '8px 24px',
                borderRadius: '9999px',
                ...(s.emphasizeCategory && { border: `1px solid ${accentColor}30` }),
              }}
            >
              {category}
            </span>
          )}
          {badges.map((badge) => (
            <span
              key={badge}
              style={{
                display: 'flex',
                fontSize: s.badgeFontSize,
                color: s.badgeColor,
                backgroundColor: '#27272a', // zinc-800
                padding: '8px 24px',
                borderRadius: '9999px',
              }}
            >
              {badge}
            </span>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: s.authorFontSize,
            color: s.authorColor,
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
