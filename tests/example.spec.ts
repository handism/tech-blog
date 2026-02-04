// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('ホームページが表示される', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle("Handism's Tech Blog");
});
