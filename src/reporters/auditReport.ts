import type {
    AuditResult,
    AuditReport,
    AuditReportMeta,
    AuditReportScore,
    AuditReportStats,
    AffectedElement,
    CategoryResult,
    RuleResult,
    RuleSummary,
    Severity,
    IssueCategory,
    Grade
} from "../core/types";
import { computeWeightedOverall } from "../core/scoring";
import { CORE_RULES_REGISTRY } from "../core/config/registry";

const CATEGORY_TITLES: Record<IssueCategory, string> = {
    accessibility: "Accessibility",
    semantic: "Semantic HTML",
    seo: "SEO",
    responsive: "Responsive Design",
    security: "Security",
    quality: "Quality",
    maintainability: "Maintainability"
};

const CATEGORY_ORDER: IssueCategory[] = ["accessibility", "semantic", "seo", "responsive", "security", "quality", "maintainability"];

const IMPACT_RANK: Record<RuleResult["impact"], number> = {
    high: 3,
    medium: 2,
    low: 1
};

const ELEMENTS_EXPORT_LIMIT = 20;
const ELEMENTS_TXT_PREVIEW_LIMIT = 3;

const RULE_TITLES: Record<string, string> = {
    "ACC-01": "Missing html lang",
    "ACC-02": "Image missing alt",
    "ACC-03": "Link missing accessible name",
    "ACC-04": "Button missing accessible name",
    "ACC-05": "Control missing id or name",
    "ACC-06": "Label missing for",
    "ACC-07": "Control missing label",
    "ACC-09": "Missing H1",
    "ACC-10": "Heading order jump",
    "ACC-11": "aria-labelledby invalid",
    "ACC-12": "aria-describedby invalid",
    "ACC-13": "Positive tabindex",
    "ACC-14": "Nested interactive",
    "ACC-15": "Iframe missing title",
    "ACC-16": "Video missing controls",
    "ACC-17": "Table missing caption",
    "ACC-18": "TH missing scope",
    "ACC-19": "Vague link text",
    "ACC-20": "Link missing href",
    "ACC-22": "Text too small",
    "ACC-23": "Duplicate IDs",
    "SEO-01": "Missing title",
    "SEO-02": "Weak or missing description",
    "SEO-03": "Missing charset",
    "SEO-05": "Missing canonical",
    "SEO-06": "Robots noindex",
    "SEO-07": "Missing Open Graph",
    "SEO-08": "Missing Twitter Card",
    "SEC-01": "Unsafe target=_blank",
    "SEM-01": "Use strong/em",
    "SEM-02": "Low semantic structure",
    "SEM-03": "Multiple H1",
    "RWD-01": "Large fixed width",
    "RWD-02": "Missing viewport",
    "QLT-01": "Too many inline styles",
    "QLT-02": "Dummy link"
};

const RULE_DESCRIPTIONS: Partial<Record<string, string>> = {
    "ACC-01": "Ensures the <html> element includes a valid lang attribute",
    "ACC-02": "Ensures meaningful images include a non-empty alt attribute",
    "ACC-03": "Ensures links expose an accessible name",
    "ACC-04": "Ensures buttons expose an accessible name",
    "ACC-05": "Ensures form controls provide an id or name",
    "ACC-06": "Ensures labels include a valid for association",
    "ACC-07": "Ensures form controls are properly labeled",
    "ACC-09": "Ensures the page includes a primary H1 heading",
    "ACC-10": "Ensures headings follow a consistent hierarchical order",
    "ACC-11": "Ensures aria-labelledby references existing elements",
    "ACC-12": "Ensures aria-describedby references existing elements",
    "ACC-13": "Ensures tabindex values are not positive",
    "ACC-14": "Ensures interactive elements are not nested",
    "ACC-15": "Ensures iframes include a descriptive title",
    "ACC-16": "Ensures videos provide native controls",
    "ACC-17": "Ensures tables include a caption",
    "ACC-18": "Ensures table header cells include proper scope",
    "ACC-19": "Ensures link text is specific and descriptive",
    "ACC-20": "Ensures anchor elements include an href attribute",
    "ACC-22": "Ensures text size meets minimum readability thresholds",
    "ACC-23": "Ensures DOM ids are unique",
    "SEO-01": "Ensures the page has a valid <title>",
    "SEO-02": "Ensures the page includes a useful meta description",
    "SEO-03": "Ensures a charset meta tag is declared",
    "SEO-05": "Ensures a canonical link is present",
    "SEO-06": "Ensures robots metadata does not unintentionally block indexing",
    "SEO-07": "Ensures Open Graph metadata is present",
    "SEO-08": "Ensures Twitter Card metadata is present",
    "SEC-01": "Ensures target=_blank links include rel=noopener",
    "SEM-01": "Encourages semantic emphasis tags over presentational tags",
    "SEM-02": "Detects weak semantic structure in page layout",
    "SEM-03": "Ensures only one H1 is used for the main page heading",
    "RWD-01": "Detects oversized fixed-width elements that hurt responsiveness",
    "RWD-02": "Ensures a viewport meta tag is configured",
    "QLT-01": "Detects excessive use of inline styles",
    "QLT-02": "Detects links that use dummy href values"
};

const CATEGORY_PREFIXES: Partial<Record<IssueCategory, string[]>> = {
    accessibility: ["ACC"],
    semantic: ["SEM"],
    seo: ["SEO"],
    responsive: ["RWD"],
    security: ["SEC"],
    quality: ["QLT"]
};

const SEVERITY_RANK: Record<Severity, number> = {
    recommendation: 1,
    warning: 2,
    critical: 3
};

const WAH_VERSION = typeof __WAH_VERSION__ !== "undefined" ? __WAH_VERSION__ : "0.0.0-dev";
const WAH_MODE: "dev" | "ci" = typeof __WAH_MODE__ !== "undefined" && __WAH_MODE__ === "ci" ? "ci" : "dev";

function scoreToGrade(score: number): Grade {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "E";
}

function worstSeverity(severities: Severity[]): Severity {
    let worst: Severity = "recommendation";
    for (const s of severities) {
        if (SEVERITY_RANK[s] > SEVERITY_RANK[worst]) worst = s;
    }
    return worst;
}

function severityToStatus(severity: Severity): "pass" | "warn" | "fail" {
    if (severity === "critical") return "fail";
    if (severity === "warning" || severity === "recommendation") return "warn";
    return "pass";
}

function getImpactLevel(severity: Severity): "low" | "medium" | "high" {
    if (severity === "critical") return "high";
    if (severity === "warning") return "medium";
    if (severity === "recommendation") return "low";
    return "low";
}

function toSentenceCase(text: string): string {
    const trimmed = text.trim();
    if (!trimmed) return trimmed;
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function getRuleTitle(ruleId: string, fallbackMessage: string): string {
    return RULE_TITLES[ruleId] || toSentenceCase(fallbackMessage);
}

function getRuleDescription(ruleId: string, title: string): string {
    return RULE_DESCRIPTIONS[ruleId] || `Checks ${title.toLowerCase()}`;
}

function getRulePrefix(ruleId: string): string {
    const [prefix] = ruleId.split("-");
    return prefix || "";
}

function validateRuleCategoryPrefix(category: IssueCategory, ruleId: string): void {
    if (WAH_MODE !== "dev") return;
    const allowedPrefixes = CATEGORY_PREFIXES[category];
    if (!allowedPrefixes || allowedPrefixes.length === 0) return;
    const prefix = getRulePrefix(ruleId);
    if (!allowedPrefixes.includes(prefix)) {
        console.warn(`[WAH] Rule/category prefix mismatch: category="${category}" id="${ruleId}"`);
    }
}

function sortByImpactDesc(rules: RuleResult[]): RuleResult[] {
    return [...rules].sort((a, b) => IMPACT_RANK[b.impact] - IMPACT_RANK[a.impact]);
}

function buildReportMeta(): AuditReportMeta {
    return {
        url: window.location.href,
        date: new Date().toISOString(),
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        userAgent: navigator.userAgent,
        version: WAH_VERSION,
        mode: WAH_MODE
    };
}

function buildReportScore(categories: CategoryResult[]): AuditReportScore {
    const byCategory: Partial<Record<IssueCategory, number>> = {};
    for (const category of categories) {
        byCategory[category.id] = category.score;
    }

    const overall = computeWeightedOverall(byCategory);

    return {
        overall,
        grade: scoreToGrade(overall),
        byCategory
    };
}

function buildReportStatsFromCategories(categories: CategoryResult[]): AuditReportStats {
    let warnings = 0;
    let failed = 0;

    for (const cat of categories) {
        for (const rule of cat.rules) {
            if (rule.status === "fail") failed++;
            else if (rule.status === "warn") warnings++;
        }
    }

    const totalRulesTriggered = warnings + failed;

    return {
        warnings,
        failed,
        totalRules: totalRulesTriggered,
        totalRulesTriggered,
        totalRulesAvailable: CORE_RULES_REGISTRY.length
    };
}

function calculateRuleSummary(rules: RuleResult[]): RuleSummary {
    let pass = 0;
    let warn = 0;
    let fail = 0;

    for (const rule of rules) {
        if (rule.status === "fail") fail++;
        else if (rule.status === "warn") warn++;
        else pass++;
    }

    return { pass, warn, fail };
}

function buildCategories(result: AuditResult): CategoryResult[] {
    const categorized = new Map<IssueCategory, typeof result.issues>();

    for (const issue of result.issues) {
        const cat = issue.category || "accessibility";
        if (!categorized.has(cat)) {
            categorized.set(cat, []);
        }
        categorized.get(cat)!.push(issue);
    }

    const categories: CategoryResult[] = [];

    for (const catId of CATEGORY_ORDER) {
        const issues = categorized.get(catId) || [];
        if (issues.length === 0) continue;

        const ruleMap = new Map<string, typeof issues>();
        for (const issue of issues) {
            const ruleId = issue.rule;
            if (!ruleMap.has(ruleId)) {
                ruleMap.set(ruleId, []);
            }
            ruleMap.get(ruleId)!.push(issue);
        }

        const rules: RuleResult[] = [];
        for (const [ruleId, ruleIssues] of ruleMap) {
            validateRuleCategoryPrefix(catId, ruleId);

            const ws = worstSeverity(ruleIssues.map(i => i.severity));
            const status = severityToStatus(ws);
            const impact = getImpactLevel(ws);
            const firstIssue = ruleIssues[0];
            const title = getRuleTitle(ruleId, firstIssue.message);

            const elementMap = new Map<string, AffectedElement>();
            for (const issue of ruleIssues) {
                if (issue.selector) {
                    const key = issue.selector;
                    if (!elementMap.has(key)) {
                        elementMap.set(key, {
                            selector: issue.selector,
                            note: issue.message
                        });
                    }
                }
            }

            const allElements = Array.from(elementMap.values());
            const elements = allElements.slice(0, ELEMENTS_EXPORT_LIMIT);
            const elementsOmitted = Math.max(0, allElements.length - elements.length);

            const rule: RuleResult = {
                id: ruleId,
                title,
                description: getRuleDescription(ruleId, title),
                status,
                impact,
                message: toSentenceCase(firstIssue.message),
                ...(elements.length ? { elements } : {}),
                ...(elementsOmitted > 0 ? { elementsOmitted } : {})
            };

            rules.push(rule);
        }

        const failRules = rules.filter(r => r.status === "fail").length;
        const warnRules = rules.filter(r => r.status === "warn").length;
        const categoryScore = Math.max(0, 100 - failRules * 20 - warnRules * 8);

        categories.push({
            id: catId,
            title: CATEGORY_TITLES[catId],
            score: categoryScore,
            rules,
            summary: calculateRuleSummary(rules)
        });
    }

    return categories;
}

export function buildAuditReport(result: AuditResult): AuditReport {
    const categories = buildCategories(result);
    const stats = buildReportStatsFromCategories(categories);
    const score = buildReportScore(categories);

    return {
        meta: buildReportMeta(),
        score,
        categories,
        stats
    };
}

function formatDateISOToDDMMYYYY(iso: string): string {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
}

export function serializeReportToJSON(report: AuditReport): string {
    return JSON.stringify(report, null, 2);
}

export function serializeReportToTXT(report: AuditReport): string {
    const lines: string[] = [];

    lines.push("=".repeat(60));
    lines.push("WAH Report — Web Audit Helper");
    lines.push("=".repeat(60));
    lines.push("");

    lines.push(`URL: ${report.meta.url || "N/A"}`);
    lines.push(`Date: ${formatDateISOToDDMMYYYY(report.meta.date)}`);
    lines.push(`Viewport: ${report.meta.viewport.width}×${report.meta.viewport.height}`);
    lines.push("");

    lines.push(`Overall Score: ${report.score.overall} (Grade ${report.score.grade})`);
    const categorySummaryParts: string[] = [];
    if (typeof report.score.byCategory.accessibility === "number") categorySummaryParts.push(`ACC ${report.score.byCategory.accessibility}`);
    if (typeof report.score.byCategory.seo === "number") categorySummaryParts.push(`SEO ${report.score.byCategory.seo}`);
    if (typeof report.score.byCategory.semantic === "number") categorySummaryParts.push(`SEM ${report.score.byCategory.semantic}`);
    if (typeof report.score.byCategory.responsive === "number") categorySummaryParts.push(`RWD ${report.score.byCategory.responsive}`);
    if (typeof report.score.byCategory.security === "number") categorySummaryParts.push(`SEC ${report.score.byCategory.security}`);
    if (typeof report.score.byCategory.quality === "number") categorySummaryParts.push(`QLT ${report.score.byCategory.quality}`);

    if (categorySummaryParts.length > 0) {
        lines.push(`Categories: ${categorySummaryParts.join(" | ")}`);
    }
    lines.push("");

    lines.push("Stats:");
    lines.push(`  ⚠ Warnings: ${report.stats.warnings}`);
    lines.push(`  ✖ Failed: ${report.stats.failed}`);
    lines.push("");

    for (const cat of report.categories) {
        const failRules = cat.rules.filter(r => r.status === "fail").length;
        const warnRules = cat.rules.filter(r => r.status === "warn").length;

        lines.push(`${cat.title} (${cat.score}/100) — ${failRules} fail, ${warnRules} warn`);
        lines.push("-".repeat(60));

        const sortedRules = [
            ...sortByImpactDesc(cat.rules.filter(r => r.status === "fail")),
            ...sortByImpactDesc(cat.rules.filter(r => r.status === "warn"))
        ];

        let currentStatus: "fail" | "warn" | null = null;
        for (const rule of sortedRules) {
            if (rule.status !== "fail" && rule.status !== "warn") {
                continue;
            }

            if (rule.status !== currentStatus) {
                if (currentStatus !== null) lines.push("");
                if (rule.status === "fail") {
                    lines.push("FAILED:");
                } else if (rule.status === "warn") {
                    lines.push("WARNINGS:");
                }
                currentStatus = rule.status;
            }

            const icon = rule.status === "warn" ? "⚠" : "✖";
            lines.push(`${icon} [${rule.id}] ${rule.title} [${rule.impact.toUpperCase()}]`);
            lines.push(`   ${rule.message}`);

            if (rule.elements && rule.elements.length > 0) {
                for (const elem of rule.elements.slice(0, ELEMENTS_TXT_PREVIEW_LIMIT)) {
                    lines.push(`   → ${elem.selector}`);
                    if (elem.note) {
                        lines.push(`     ${toSentenceCase(elem.note)}`);
                    }
                }
                const hiddenFromPreview = Math.max(0, rule.elements.length - ELEMENTS_TXT_PREVIEW_LIMIT);
                const totalOmitted = hiddenFromPreview + (rule.elementsOmitted || 0);
                if (totalOmitted > 0) {
                    lines.push(`   ... and ${totalOmitted} more`);
                }
            }

            if (rule.help) {
                lines.push(`   Help: ${rule.help}`);
            }

            lines.push("");
        }
    }

    if (report.highlights && report.highlights.length > 0) {
        lines.push("Key Suggestions:");
        lines.push("-".repeat(40));
        for (const highlight of report.highlights) {
            lines.push(`• ${highlight}`);
        }
        lines.push("");
    }

    lines.push("=".repeat(60));

    return lines.join("\n");
}