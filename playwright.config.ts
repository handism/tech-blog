import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Visual Regression Testing (VRT).
 */
export default defineConfig({
  testDir: './tests',
  testMatch: 'vrt.test.ts',
  timeout: 120000,
  expect: {
    timeout: 10000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05, // 5%までの色合いの差異やアンチエイリアスの揺れを許容
      animations: 'disabled',
    },
  },
  fullyParallel: false,
  workers: 1, // スクリーンショットの安定性のためにシングルスレッドで実行
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // basePath 配下で配信するため serve ではなく専用スクリプトを使う
    command: 'bun run scripts/serve-out.ts 3000',
    url: 'http://localhost:3000/tech-blog/',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
