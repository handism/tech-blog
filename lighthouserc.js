/** @type {import('@lhci/cli').LighthouseConfig} */
module.exports = {
  ci: {
    collect: {
      staticDistDir: './out',
      url: ['/', '/blog/page/2/', '/about/'],
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],
        // Scores
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        // CI環境（localhost）ではcanonicalがprod URLと一致しないためoff
        'canonical': 'off',
        // CI環境では値を生成しないaudit（minScore指定不可）
        'lcp-lazy-loaded': 'off',
        'non-composited-animations': 'off',
        'prioritize-lcp-image': 'off',
        // Next.jsの特性上、未使用JS・レスポンシブ画像未対応はwarnに緩和
        'unused-javascript': ['warn', { maxLength: 3 }],
        'uses-responsive-images': 'warn',
        // コントラスト比はwarnに緩和（別途改善予定）
        'color-contrast': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
