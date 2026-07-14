import { test, expect } from '@playwright/test';
import { themeConfig } from '../src/config/themes';

const themes = themeConfig.map((t) => t.id);

test.describe('Visual Regression Test (VRT) for all 36 themes', () => {
  for (const theme of themes) {
    test(`Theme [${theme}] should render correctly on the home page`, async ({ page }) => {
      // 1. トップページにアクセス
      await page.goto('/');

      // 2. ローカルストレージに該当テーマを格納
      await page.evaluate((t) => {
        localStorage.setItem('design-theme', t);
      }, theme);

      // 3. テーマ適用を確実にするためにページを再読み込み
      await page.reload();

      // 4. html要素の data-theme 属性が切り替わるのを待つ
      await page.waitForSelector(`html[data-theme="${theme}"]`);

      // 5. トランジションが完了するまで微小に待つ
      await page.waitForTimeout(500);

      // 6. スクリーンショット撮影＆比較検証
      // ※ 初回実行時は自動で参照画像（ベースライン）が生成されます。
      await expect(page).toHaveScreenshot(`home-page-${theme}.png`, {
        fullPage: true,
      });
    });
  }
});
