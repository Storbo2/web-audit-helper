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
                'scripts/',
                'tests/',
                'examples/',
                '**/*.d.ts',
                'tsup.config.ts',
                'vitest.config.mjs',
                'playwright.config.ts'
            ],
            thresholds: {
                branches: 80,
                functions: 80,
                lines: 80,
                statements: 80
            }
        }
    }
});