// tests/blog.spec.ts
import { test, expect } from '@playwright/test';

/**
 * 記事詳細ページの表示確認。
 */
test.describe('記事詳細ページ', () => {
  test('記事が表示される', async ({ page }) => {
    await page.goto('/blog/posts/claude-code-introduction');
    await expect(page.locator('article h1')).toBeVisible();
  });

  test('前後の記事リンクが表示される', async ({ page }) => {
    await page.goto('/blog/posts/claude-code-introduction');
    const nav = page.locator('nav').filter({ hasText: /前の記事|次の記事/ });
    await expect(nav).toBeVisible();
  });

  test('OGP メタタグが設定されている', async ({ page }) => {
    await page.goto('/blog/posts/claude-code-introduction');
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
    expect(ogType).toBe('article');
  });
});

/**
 * 検索機能の確認。
 */
test.describe('検索', () => {
  test('検索結果が表示される', async ({ page }) => {
    await page.goto('/');
    await page.fill('#site-search', 'Claude');
    await page.waitForTimeout(300); // debounce 待ち
    await expect(page.locator('#site-search ~ ul li').first()).toBeVisible();
  });

  test('ヒットしない語では「見つからない」メッセージが表示される', async ({ page }) => {
    await page.goto('/');
    await page.fill('#site-search', 'xyzxyzxyz存在しないキーワード');
    await page.waitForTimeout(300);
    await expect(page.locator('text=検索結果が見つかりませんでした')).toBeVisible();
  });
});

/**
 * ページネーションの確認。
 */
test.describe('ページネーション', () => {
  test('2ページ目に遷移できる', async ({ page }) => {
    await page.goto('/');
    const page2Link = page.locator('a[href="/blog/page/2"]');
    const isVisible = await page2Link.isVisible();
    if (isVisible) {
      await page2Link.click();
      await expect(page).toHaveURL(/\/blog\/page\/2/);
    } else {
      test.skip();
    }
  });

  test('/blog/page/1 はトップにリダイレクトされる', async ({ page }) => {
    await page.goto('/blog/page/1');
    await expect(page).toHaveURL('/');
  });
});

/**
 * ダークモードの確認。
 */
test.describe('ダークモード', () => {
  test('テーマを切り替えられる', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const before = await html.getAttribute('class');
    await page.click('button[aria-label*="テーマ"]');
    const after = await html.getAttribute('class');
    expect(after).not.toBe(before);
  });
});
