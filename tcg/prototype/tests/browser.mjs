import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const evidence = fileURLToPath(new URL('./evidence/', import.meta.url));
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined), headless: true, args: ['--no-sandbox'] });
try {
  for (const mobile of [false, true]) {
    const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 }, isMobile: mobile, hasTouch: mobile });
    const page = await context.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
    const click = async locator => mobile ? locator.tap() : locator.click();
    await page.goto((process.env.TCG_URL || 'http://127.0.0.1:8080/tcg/prototype/') + '?debug');
    await page.screenshot({ path: `${evidence}${mobile ? 'mobile' : 'desktop'}-decks.png`, fullPage: true });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await click(page.locator('[data-deck=bruiser]'));
    await click(page.locator('#mullconfirm'));
    let turns = 0, iterations = 0, attacks = 0, cards = 0;
    while (await page.evaluate(() => window.__clashbound.state.winner === null)) {
      assert.ok(iterations++ < 400);
      if (await page.locator('#clashprompt').isVisible()) { await click(page.locator('#decline')); continue; }
      if (await page.evaluate(() => window.__clashbound.aiBusy)) { await page.waitForTimeout(80); continue; }
      const targets = page.locator('.minion.targetable');
      if (await targets.count()) { await click(targets.first()); continue; }
      if (await page.locator('#oppbar.targetable').count()) { await click(page.locator('#oppbar')); attacks++; continue; }
      const selectable = page.locator('#hand .card:not(:disabled)');
      if (await selectable.count()) { await click(selectable.first()); cards++; continue; }
      const ready = page.locator('#myboard .canatk');
      if (await ready.count()) { await click(ready.first()); continue; }
      if (await page.locator('#power').isEnabled()) { await click(page.locator('#power')); continue; }
      if (turns === 3 && !mobile && process.env.WRITE_COVERS) await page.locator('#app').screenshot({ path: 'arcade/covers/clashbound.png' });
      if (turns === 3) await page.screenshot({ path: `${evidence}${mobile ? 'mobile' : 'desktop'}-match.png`, fullPage: true });
      await click(page.locator('#endturn')); turns++;
    }
    assert.ok(cards > 0); assert.ok(turns > 0);
    await page.screenshot({ path: `${evidence}${mobile ? 'mobile' : 'desktop'}-result.png`, fullPage: true });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    console.log(`${mobile ? 'Touch mobile' : 'Desktop'} match: ${turns} turns, ${cards} cards, result ${await page.locator('#result').textContent()}`);
    await click(page.locator('#newgame')); assert.equal(await page.locator('#deckselect').isVisible(), true);
    await click(page.locator('[data-deck=trickster]')); await click(page.locator('#mullconfirm')); await click(page.locator('#endturn'));
    await click(page.locator('#newgame')); await page.waitForTimeout(600); assert.equal(await page.locator('#deckselect').isVisible(), true);
    await click(page.locator('[data-deck=bulwark]')); assert.equal(await page.evaluate(() => window.__clashbound.state.turn), 0);
    assert.deepEqual(errors, []); await context.close();
  }
} finally { await browser.close(); }
