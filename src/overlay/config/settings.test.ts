import {
    DEFAULT_SETTINGS,
    getActiveCategories,
    getActiveFilters,
    getAppliedScoringMode,
    getLastSettingsPage,
    getSettings,
    resetSettings,
    setActiveCategories,
    setActiveFilters,
    setAppliedScoringMode,
    setHighlightMs,
    setLastSettingsPage,
    setLogLevel,
    setScoringMode,
    setConsoleOutput,
} from './settings';

describe('overlay config settings', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('returns defaults when localStorage is empty', () => {
        expect(getSettings()).toEqual(DEFAULT_SETTINGS);
        expect(getAppliedScoringMode()).toBe('normal');
        expect(getLastSettingsPage()).toBe(0);
        expect([...getActiveFilters()]).toEqual(['critical']);
        expect(getActiveCategories().size).toBe(8);
    });

    it('persists and reads valid settings values', () => {
        setLogLevel('summary');
        setHighlightMs(1200);
        setScoringMode('strict');
        setAppliedScoringMode('custom');
        setLastSettingsPage(2);
        setActiveFilters(new Set(['warning', 'recommendation']));
        setActiveCategories(new Set(['seo', 'performance']));

        expect(getSettings()).toEqual({
            logLevel: 'summary',
            highlightMs: 1200,
            scoringMode: 'strict',
            consoleOutput: 'standard',
        });
        expect(getAppliedScoringMode()).toBe('custom');
        expect(getLastSettingsPage()).toBe(2);
        expect([...getActiveFilters()].sort()).toEqual(['recommendation', 'warning']);
        expect([...getActiveCategories()].sort()).toEqual(['performance', 'seo']);
    });

    it('falls back on invalid primitive values', () => {
        localStorage.setItem('wah:settings:loglvl', 'bad');
        localStorage.setItem('wah:settings:highlightMs', '-5');
        localStorage.setItem('wah:settings:scoringMode', 'bad');
        localStorage.setItem('wah:settings:appliedScoringMode', 'bad');
        localStorage.setItem('wah:settings:page', '99');

        const settings = getSettings();

        expect(settings.logLevel).toBe(DEFAULT_SETTINGS.logLevel);
        expect(settings.highlightMs).toBe(DEFAULT_SETTINGS.highlightMs);
        expect(settings.scoringMode).toBe(DEFAULT_SETTINGS.scoringMode);
        expect(getAppliedScoringMode()).toBe(DEFAULT_SETTINGS.scoringMode);
        expect(getLastSettingsPage()).toBe(0);
    });

    it('handles invalid JSON in filters/categories', () => {
        localStorage.setItem('wah:settings:activeFilters', '{not-json');
        localStorage.setItem('wah:settings:activeCategories', '{not-json');

        expect([...getActiveFilters()]).toEqual(['critical']);
        expect(getActiveCategories().size).toBe(8);
    });

    it('filters out invalid values in filters/categories arrays', () => {
        localStorage.setItem('wah:settings:activeFilters', JSON.stringify(['critical', 'x', 'warning']));
        localStorage.setItem('wah:settings:activeCategories', JSON.stringify(['seo', 'x', 'form']));

        expect([...getActiveFilters()].sort()).toEqual(['critical', 'warning']);
        expect([...getActiveCategories()].sort()).toEqual(['form', 'seo']);
    });

    it('does not save highlightMs when value is not positive', () => {
        setHighlightMs(0);
        setHighlightMs(-10);

        expect(localStorage.getItem('wah:settings:highlightMs')).toBeNull();
    });

    it('resetSettings clears all keys', () => {
        setLogLevel('none');
        setHighlightMs(500);
        setScoringMode('soft');
        setAppliedScoringMode('moderate');
        setLastSettingsPage(1);
        setActiveFilters(new Set(['critical']));
        setActiveCategories(new Set(['accessibility']));

        resetSettings();

        expect(localStorage.getItem('wah:settings:loglvl')).toBeNull();
        expect(localStorage.getItem('wah:settings:highlightMs')).toBeNull();
        expect(localStorage.getItem('wah:settings:scoringMode')).toBeNull();
        expect(localStorage.getItem('wah:settings:appliedScoringMode')).toBeNull();
        expect(localStorage.getItem('wah:settings:page')).toBeNull();
        expect(localStorage.getItem('wah:settings:activeFilters')).toBeNull();
        expect(localStorage.getItem('wah:settings:activeCategories')).toBeNull();
        expect(localStorage.getItem('wah:settings:consoleOutput')).toBeNull();
    });

    it('loads consoleOutput with default value', () => {
        const settings = getSettings();
        expect(settings.consoleOutput).toBe('standard');
    });

    it('persists and reads consoleOutput value', () => {
        setConsoleOutput('detailed');
        expect(getSettings().consoleOutput).toBe('detailed');

        setConsoleOutput('debug');
        expect(getSettings().consoleOutput).toBe('debug');
    });

    it('includes consoleOutput in getSettings', () => {
        setConsoleOutput('minimal');
        const settings = getSettings();
        expect(settings.consoleOutput).toBe('minimal');
    });

    it('handles invalid consoleOutput value gracefully', () => {
        localStorage.setItem('wah:settings:consoleOutput', 'invalid');
        const settings = getSettings();
        expect(settings.consoleOutput).toBe('standard');
    });

    it('persists all valid consoleOutput levels', () => {
        const levels = ['none', 'minimal', 'standard', 'detailed', 'debug'] as const;
        for (const level of levels) {
            setConsoleOutput(level);
            expect(getSettings().consoleOutput).toBe(level);
        }
    });
});