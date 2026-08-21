import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/extension",
    fullyParallel: false,
    workers: 1,
    retries: process.env.CI ? 1 : 0,
    reporter: "line",
    timeout: 45_000,
    expect: {
        timeout: 15_000
    },
    webServer: {
        command: "pnpm exec http-server . -p 5511 -c-1",
        url: "http://127.0.0.1:5511/tests/fixtures/extension-target.html",
        reuseExistingServer: true,
        timeout: 120_000
    }
});

