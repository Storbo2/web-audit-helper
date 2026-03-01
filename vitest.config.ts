import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: [],
        include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/**/*.d.ts',
                '**/*.test.ts'
            ]
        },
        testTimeout: 10000
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    }
});