import type { AuditIssue } from './types';
import {
    computeCategoryScores,
    computeWeightedOverall,
    filterIssuesForScoring,
    getAdjustedMultipliers,
    getScoringMultipliers,
} from './scoring';
import {
    setActiveCategories,
    setActiveFilters,
    setScoringMode,
    resetSettings,
} from '../overlay/config/settings';

function issue(rule: string, severity: 'critical' | 'warning' | 'recommendation', category?: AuditIssue['category']): AuditIssue {
    return {
        rule,
        severity,
        message: `${rule}-${severity}`,
        category,
    };
}

describe('core scoring', () => {
    beforeEach(() => {
        localStorage.clear();
        resetSettings();
    });

    it('returns scoring multipliers per mode', () => {
        expect(getScoringMultipliers('strict')).toEqual({ critical: 25, warning: 10, recommendation: 5 });
        expect(getScoringMultipliers('moderate')).toEqual({ critical: 20, warning: 8, recommendation: 0 });
        expect(getScoringMultipliers('soft')).toEqual({ critical: 20, warning: 0, recommendation: 0 });
        expect(getScoringMultipliers('normal')).toEqual({ critical: 20, warning: 8, recommendation: 4 });
        expect(getScoringMultipliers('custom')).toEqual({ critical: 20, warning: 8, recommendation: 4 });
    });

    it('adjusts custom multipliers by number of active categories', () => {
        setActiveCategories(new Set(['seo']));
        expect(getAdjustedMultipliers('custom')).toEqual({ critical: 5, warning: 2, recommendation: 1 });

        setActiveCategories(new Set(['seo', 'performance']));
        expect(getAdjustedMultipliers('custom')).toEqual({ critical: 10, warning: 4, recommendation: 2 });

        setActiveCategories(new Set(['seo', 'performance', 'quality']));
        expect(getAdjustedMultipliers('custom')).toEqual({ critical: 15, warning: 6, recommendation: 3 });

        setActiveCategories(new Set(['seo', 'performance', 'quality', 'security', 'form']));
        expect(getAdjustedMultipliers('custom')).toEqual({ critical: 20, warning: 8, recommendation: 4 });
    });

    it('does not adjust non-custom mode', () => {
        setActiveCategories(new Set(['seo']));
        expect(getAdjustedMultipliers('strict')).toEqual({ critical: 25, warning: 10, recommendation: 5 });
    });

    it('filters issues in custom mode by active filters and categories', () => {
        setScoringMode('custom');
        setActiveFilters(new Set(['critical']));
        setActiveCategories(new Set(['seo']));

        const issues = [
            issue('SEO-1', 'critical', 'seo'),
            issue('SEO-2', 'warning', 'seo'),
            issue('ACC-1', 'critical', 'accessibility'),
            issue('ACC-2', 'warning', 'accessibility'),
            issue('DEF-1', 'critical'),
        ];

        expect(filterIssuesForScoring(issues)).toEqual([issue('SEO-1', 'critical', 'seo')]);
    });

    it('returns all issues in non-custom mode', () => {
        setScoringMode('normal');
        const issues = [issue('A', 'critical', 'seo'), issue('B', 'warning', 'accessibility')];
        expect(filterIssuesForScoring(issues)).toEqual(issues);
    });

    it('computes per-category score using worst severity per rule', () => {
        const issues = [
            issue('SEO-1', 'warning', 'seo'),
            issue('SEO-1', 'critical', 'seo'),
            issue('SEO-2', 'recommendation', 'seo'),
            issue('ACC-1', 'warning', 'accessibility'),
        ];

        const scores = computeCategoryScores(issues, { critical: 20, warning: 8, recommendation: 4 });

        expect(scores.seo).toBe(76);
        expect(scores.accessibility).toBe(92);
    });

    it('computes weighted overall and handles empty categories', () => {
        const overall = computeWeightedOverall({ seo: 80, accessibility: 90 });
        expect(overall).toBe(Math.round((80 * 0.2 + 90 * 0.25) / (0.2 + 0.25)));

        expect(computeWeightedOverall({})).toBe(100);
    });
});