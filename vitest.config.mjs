import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: [],
        include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
        testTimeout: 10000,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            exclude: [
                'node_modules/',
                'dist/',
                '**/*.test.ts',
                '**/*.spec.ts',
                '**/*.suite.ts',
                '**/*.testUtils.ts',
                '**/*.mockSetup.ts',
                '**/__tests__/**',
                'scripts/',
                'tests/',
                'examples/',
                '**/*.d.ts',
                'tsup.config.ts',
                'vitest.config.mjs',
                'playwright.config.ts'
            ],
            thresholds: {
                branches: 67,
                functions: 77,
                lines: 73,
                statements: 71
            }
        }
    }
});
