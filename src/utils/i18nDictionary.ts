import type { Dictionary } from "./i18nTypes";

function interpolate(template: string, values: Record<string, string | number>): string {
    return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key) => String(values[key] ?? ""));
}

export function buildDictionary(raw: Record<string, string>): Dictionary {
    const get = (key: string): string => raw[key] ?? "";

    return {
        ...(raw as unknown as Omit<Dictionary,
            "filterByCategoryTooltip" |
            "pageIndicator" |
            "languageChanged" |
            "hiddenForMin" |
            "overlayHiddenForMinutes" |
            "issuesFound" |
            "reportPreparedWithScreen" |
            "scoreLine" |
            "noIssueAtIndex" |
            "overlayHidden" |
            "issueDetails" |
            "reportAndMore"
        >),
        filterByCategoryTooltip: (category: string) => interpolate(get("filterByCategoryTooltip"), { category: category.toLowerCase() }),
        pageIndicator: (current: number, total: number) => interpolate(get("pageIndicator"), { current, total }),
        languageChanged: (language: string) => interpolate(get("languageChanged"), { language }),
        hiddenForMin: (minutes: number, until: string) => interpolate(get("hiddenForMin"), { minutes, until }),
        overlayHiddenForMinutes: (minutes: number) => interpolate(get("overlayHiddenForMinutes"), { minutes }),
        issuesFound: (count: number) => interpolate(get("issuesFound"), { count, suffix: count === 1 ? "" : "s" }),
        reportPreparedWithScreen: (screenSize: string, breakpoint: string) => interpolate(get("reportPreparedWithScreen"), { screenSize, breakpoint }),
        scoreLine: (score: number) => interpolate(get("scoreLine"), { score }),
        noIssueAtIndex: (index: number) => interpolate(get("noIssueAtIndex"), { index }),
        overlayHidden: (reason: string) => interpolate(get("overlayHidden"), { reason }),
        issueDetails: (ruleId: string) => interpolate(get("issueDetails"), { ruleId }),
        reportAndMore: (count: number) => interpolate(get("reportAndMore"), { count }),
    };
}