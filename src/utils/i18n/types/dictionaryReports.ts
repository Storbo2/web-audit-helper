export interface DictionaryReports {
    reportTitle: string;
    reportUrl: string;
    reportDate: string;
    reportViewport: string;
    reportBreakpoint: string;
    reportScoringMode: string;
    reportAppliedFilters: string;
    reportOverallScore: string;
    reportCategories: string;
    reportStats: string;
    reportGeneratedBy: string;
    reportTimestamp: string;
    reportUserAgent: string;
    reportStatsCritical: string;
    reportStatsWarning: string;
    reportStatsRecommendation: string;
    reportLegendNeedsFix: string;
    reportLegendImprovement: string;
    reportLegendSuggested: string;
    reportFix: string;
    reportHelp: string;
    reportNoFindings: string;
    reportAndMore: (count: number) => string;
    reportKeySuggestions: string;
    reportTriggeredRules: string;
}