import { test, expect } from '@playwright/test';

async function openOverlay(page: any) {
    await page.goto('/examples/basic.html');
    await page.waitForSelector('#wah-overlay-root', { timeout: 15000 });
    await expect(page.locator('#wah-overlay-root')).toBeVisible();
}

async function openPopover(page: any, mode: 'filters' | 'settings' | 'export') {
    await page.click(`.wah-tool[data-pop="${mode}"]`);
    await page.waitForSelector('#wah-pop.is-open', { timeout: 5000 });
    await expect(page.locator('#wah-pop')).toHaveAttribute('data-mode', mode);
}

test.describe('WAH Audit Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
        await openOverlay(page);
    });

    test('opens and closes popover', async ({ page }) => {
        await openPopover(page, 'filters');
        await expect(page.locator('#wah-pop')).toBeVisible();

        await page.click('h1');
        await page.waitForSelector('#wah-pop[hidden]', { timeout: 5000 });
    });

    test('applies severity chip filter', async ({ page }) => {
        const initialIssues = await page.locator('#wah-panel .wah-issue-item').count();
        expect(initialIssues).toBeGreaterThan(0);

        await page.click('.wah-chip[data-filter="critical"]');
        await expect(page.locator('#wah-panel .wah-empty')).toBeVisible();
    });

    test('navigates settings pages', async ({ page }) => {
        await openPopover(page, 'settings');

        const popBody = page.locator('#wah-pop-body');
        await expect(popBody).toHaveAttribute('data-settings-page', '1');

        await page.click('#wah-pop [data-nav="next"]');
        await expect(popBody).toHaveAttribute('data-settings-page', '2');
    });

    test('exports html report', async ({ page }) => {
        await openPopover(page, 'export');

        const downloadPromise = page.waitForEvent('download', { timeout: 5000 });
        await page.click('#wah-pop .wah-export-html');

        const download = await downloadPromise;
        expect(download.suggestedFilename()).toMatch(/\.html$/i);
    });

    test('re-runs audit on locale change', async ({ page }) => {
        await openPopover(page, 'settings');
        await page.click('#wah-pop [data-nav="next"]');

        const localeSelect = page.locator('#wah-pop select[data-s="locale"]');
        await expect(localeSelect).toBeVisible();

        const currentLocale = await localeSelect.inputValue();
        await localeSelect.selectOption(currentLocale === 'en' ? 'es' : 'en');

        await page.waitForSelector('#wah-overlay-root', { timeout: 10000 });
        await expect(page.locator('.wah-score')).toBeVisible();
    });
});