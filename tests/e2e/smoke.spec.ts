import { test, expect } from '@playwright/test';

test.describe('WAH Smoke Test', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
    });

    test('loads basic.html and renders overlay', async ({ page }) => {
        const pageErrors: string[] = [];
        page.on('pageerror', (error) => pageErrors.push(error.message));

        await page.goto('/examples/basic.html');
        await page.waitForSelector('#wah-overlay-root', { timeout: 15000 });

        await expect(page.locator('#wah-overlay-root')).toBeVisible();
        await expect(page.locator('.wah-score')).toBeVisible();

        await page.waitForTimeout(500);
        expect(pageErrors).toHaveLength(0);
    });

    test('loads basic2.html and renders score', async ({ page }) => {
        await page.goto('/examples/basic2.html');
        await page.waitForSelector('#wah-overlay-root', { timeout: 15000 });

        const scoreText = await page.locator('.wah-score').textContent();
        expect(scoreText).toBeTruthy();
        expect(scoreText).toContain('Score');
    });

    test('shows issue items when opening overlay panel', async ({ page }) => {
        await page.goto('/examples/basic.html');
        await page.waitForSelector('#wah-overlay-root', { timeout: 15000 });

        const issues = page.locator('#wah-panel .wah-issue-item');
        await expect(issues.first()).toBeVisible();
        expect(await issues.count()).toBeGreaterThan(0);
    });
});