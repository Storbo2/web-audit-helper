import type { Locale } from "../core/types";
import enLocale from "../../locales/en/common.json";
import esLocale from "../../locales/es/common.json";

type LocaleIssuePattern = { regex: string; replacement: string };
type LocalePayload = {
    dictionary: Record<string, string>;
    ruleLabels: Record<string, string>;
    ruleFixes: Record<string, string>;
    issueMessages: {
        exact: Record<string, string>;
        patterns: LocaleIssuePattern[];
    };
};

const LOCALE_STORAGE_KEY = "wah:settings:locale";
const localePayloads: Record<Locale, LocalePayload> = {
    en: enLocale as LocalePayload,
    es: esLocale as LocalePayload,
};

export interface Dictionary {
    overlayTitle: string;
    score: string;
    reRunAudit: string;
    minimize: string;
    clickToViewScore: string;
    clickToFocus: string;
    toolbar: string;
    extraFilters: string;
    advancedSettings: string;
    uiSettings: string;
    exportReport: string;
    toggleCriticalFilter: string;
    toggleWarningFilter: string;
    toggleRecommendationFilter: string;
    critical: string;
    warning: string;
    recommendation: string;
    accessibility: string;
    semantic: string;
    seo: string;
    responsive: string;
    quality: string;
    security: string;
    performance: string;
    form: string;
    filtersByCategory: string;
    filterByCategoryTooltip: (category: string) => string;
    uiSettingsTitle: string;
    opacity: string;
    adjustOverlayOpacity: string;
    accent: string;
    chooseAccentColor: string;
    theme: string;
    themeAuto: string;
    themeAutoDescription: string;
    themeDark: string;
    themeDarkDescription: string;
    themeLight: string;
    themeLightDescription: string;
    restoreDefaultUISettings: string;
    allUISettingsReset: string;
    exportTitle: string;
    exportHTML: string;
    exportHTMLTitle: string;
    exportHTMLDescription: string;
    exportText: string;
    exportTextTitle: string;
    exportTextDescription: string;
    exportJSON: string;
    exportJSONTitle: string;
    exportJSONDescription: string;
    settingsTitle: string;
    previousPage: string;
    nextPage: string;
    pageIndicator: (current: number, total: number) => string;
    scoreByCategory: string;
    noIssuesSelected: string;
    generalSettings: string;
    consoleLog: string;
    fullReport: string;
    fullReportDescription: string;
    reportSummary: string;
    reportSummaryDescription: string;
    noConsoleLogs: string;
    noConsoleLogsDescription: string;
    highlightDuration: string;
    scoringSettings: string;
    scoringMode: string;
    scoringModeStrict: string;
    scoringModeNormal: string;
    scoringModeModerate: string;
    scoringModeSoft: string;
    scoringModeCustom: string;
    scoringModeStrictDesc: string;
    scoringModeNormalDesc: string;
    scoringModeModerateDesc: string;
    scoringModeSoftDesc: string;
    scoringModeCustomDesc: string;
    changesRequireRerun: string;
    clickToRerunAudit: string;
    selectScoringMode: string;
    visibilitySettings: string;
    languageSettings: string;
    selectLanguage: string;
    languageEnglish: string;
    languageSpanish: string;
    languageChanged: (language: string) => string;
    hideOverlay: string;
    hideForDuration: string;
    minutes10: string;
    minutes30: string;
    hour1: string;
    hours3: string;
    day1: string;
    hideUntilRefresh: string;
    hideUntilRefreshTitle: string;
    overlayHiddenUntil: string;
    hiddenForMin: (minutes: number, until: string) => string;
    hideForButton: string;
    hideForConfirmTitle: string;
    selectHideDuration: string;
    showOverlayNow: string;
    overlayWillShowNow: string;
    overlayHiddenForMinutes: (minutes: number) => string;
    overlayHiddenUntilRefresh: string;
    showNow: string;
    resetAllSettings: string;
    resetAllSettingsTitle: string;
    otherOptions: string;
    allSettingsReset: string;
    issuesFound: (count: number) => string;
    webAuditReport: string;
    reportPreparedWithScreen: (screenSize: string, breakpoint: string) => string;
    scoreLine: (score: number) => string;
    noIssuesFound: string;
    useFocusIssueCommand: string;
    noIssueAtIndex: (index: number) => string;
    scoreExcellent: string;
    scoreGood: string;
    scoreWarning: string;
    scoreBad: string;
    overlayHidden: (reason: string) => string;
    resetHideHint: string;
    issueDetails: (ruleId: string) => string;
    messageLabel: string;
    severityLabel: string;
    categoryLabel: string;
    selectorLabel: string;
    elementLabel: string;
    fixLabel: string;
    notAvailable: string;
    tableRule: string;
    tableSeverity: string;
    tableCategory: string;
    tableMessage: string;
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
    ruleNotMapped: string;
}

const dictionaries: Record<Locale, Dictionary> = {
    en: buildDictionary(localePayloads.en.dictionary),
    es: buildDictionary(localePayloads.es.dictionary),
};

const issuePatternCache: Record<Locale, Array<{ re: RegExp; replacement: string }>> = {
    en: (localePayloads.en.issueMessages?.patterns || []).map((p) => ({ re: new RegExp(p.regex), replacement: p.replacement })),
    es: (localePayloads.es.issueMessages?.patterns || []).map((p) => ({ re: new RegExp(p.regex), replacement: p.replacement })),
};

let currentLocale: Locale = "en";

function interpolate(template: string, values: Record<string, string | number>): string {
    return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key) => String(values[key] ?? ""));
}

function buildDictionary(raw: Record<string, string>): Dictionary {
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

function isLocale(value: string | null | undefined): value is Locale {
    return value === "en" || value === "es";
}

function loadStoredLocale(): Locale | null {
    if (typeof localStorage === "undefined") return null;
    const value = localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(value) ? value : null;
}

function persistLocale(locale: Locale): void {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export function clearStoredLocale(): void {
    if (typeof localStorage === "undefined") return;
    localStorage.removeItem(LOCALE_STORAGE_KEY);
}

export function getSupportedLocales(): Locale[] {
    return ["en", "es"];
}

export function setLocale(locale: Locale, persist = true): void {
    currentLocale = locale;
    if (persist) persistLocale(locale);
}

export function getLocale(): Locale {
    return currentLocale;
}

export function detectBrowserLocale(): Locale {
    if (typeof navigator === "undefined") return "en";
    const lang = navigator.language || "en";
    return lang.toLowerCase().startsWith("es") ? "es" : "en";
}

export function t(): Dictionary {
    return dictionaries[currentLocale];
}

export function translateRuleLabel(ruleId: string, fallback?: string): string {
    const label = localePayloads[currentLocale].ruleLabels[ruleId];
    return label || fallback || `${t().ruleNotMapped} (${ruleId})`;
}

export function translateRuleFix(ruleId: string, fallback?: string): string | undefined {
    if (!fallback) return undefined;
    return localePayloads[currentLocale].ruleFixes[ruleId] || fallback;
}

export function translateIssueMessage(_ruleId: string, message: string): string {
    const exact = localePayloads[currentLocale].issueMessages?.exact?.[message];
    if (exact) return exact;

    for (const pattern of issuePatternCache[currentLocale]) {
        if (pattern.re.test(message)) return message.replace(pattern.re, pattern.replacement);
    }

    return message;
}

export function translateSeverity(severity: string): string {
    if (severity === "critical") return t().critical;
    if (severity === "warning") return t().warning;
    if (severity === "recommendation") return t().recommendation;
    return severity;
}

export function translateCategory(category?: string): string {
    if (!category) return t().notAvailable;
    const dict = t();
    if (category === "accessibility") return dict.accessibility;
    if (category === "semantic") return dict.semantic;
    if (category === "seo") return dict.seo;
    if (category === "responsive") return dict.responsive;
    if (category === "security") return dict.security;
    if (category === "quality") return dict.quality;
    if (category === "performance") return dict.performance;
    if (category === "form") return dict.form;
    return category;
}

export function initI18n(locale?: Locale): void {
    if (locale) {
        setLocale(locale);
        return;
    }

    const stored = loadStoredLocale();
    if (stored) {
        setLocale(stored, false);
        return;
    }

    setLocale(detectBrowserLocale(), false);
}