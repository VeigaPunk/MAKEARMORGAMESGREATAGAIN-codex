import { test, expect } from '@playwright/test';

test('All eight games work under the model comparison deployment path', async ({ page }) => {
  const prefix = '/magga/codex/';
  // Serve the unchanged production build beneath its actual deployment prefix.
  // The browser still resolves every document, script and image against that URL.
  await page.route('**/magga/codex/**', async route => {
    const url = new URL(route.request().url());
    url.pathname = '/' + url.pathname.slice(prefix.length);
    await route.fulfill({ response: await route.fetch({ url: url.href }) });
  });
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  page.on('response', response => {
    if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
  });
  page.on('request', request => {
    const url = new URL(request.url());
    if (url.origin === 'http://127.0.0.1:4173' && !url.pathname.startsWith(prefix)) {
      failures.push(`Asset escaped the edition directory: ${url.pathname}`);
    }
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(prefix);
  await expect(page.locator('.card')).toHaveCount(8);
  const games = await page.locator('.card').evaluateAll(cards => cards.map(card => card.href));
  for (const game of games) {
    await page.goto(game);
    await expect(page.locator('canvas, #deckselect').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.getByRole('link', { name: 'Return to the arcade' }).click();
    await expect(page).toHaveURL(new RegExp(`${prefix}$`));
    await expect(page.locator('.card')).toHaveCount(8);
  }
  expect(failures).toEqual([]);
});
