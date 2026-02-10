// tests/smoke.spec.ts
import { siteConfig } from '@/src/config/site';
import { test, expect } from '@playwright/test';

/**
 * トップページの表示確認。
 */
test('ホームページが表示される', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(siteConfig.name);
});
