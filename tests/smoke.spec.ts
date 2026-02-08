// tests/smoke.spec.ts
import { test, expect } from '@playwright/test';
import { siteConfig } from '@/src/config/site';

test('ホームページが表示される', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(siteConfig.name);
});
