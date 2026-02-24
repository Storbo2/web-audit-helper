import type {
    AuditResult,
    AuditReport,
    AuditReportMeta,
    AuditReportScore,
    AuditReportStats,
    CategoryResult,
    RuleResult,
    Severity,
    IssueCategory,
    Grade
} from "../core/types";

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
    if (severity === "warning") return "warn";
    return "pass";
}

function getImpactLevel(severity: Severity): "low" | "medium" | "high" {
    if (severity === "critical") return "high";
    if (severity === "warning") return "medium";
    return "low";
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

function buildReportScore(score: number): AuditReportScore {
    return {
        overall: score,
        grade: scoreToGrade(score)
    };
}

function buildReportStatsFromCategories(categories: CategoryResult[]): AuditReportStats {
    let passed = 0;
    let warnings = 0;
    let failed = 0;

    for (const cat of categories) {
        for (const rule of cat.rules) {
            if (rule.status === "fail") failed++;
            else if (rule.status === "warn") warnings++;
            else passed++;
        }
    }

    return {
        passed,
        warnings,
        failed,
        totalRules: passed + warnings + failed
    };
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
            const ws = worstSeverity(ruleIssues.map(i => i.severity));
            const status = severityToStatus(ws);
            const impact = getImpactLevel(ws);
            const firstIssue = ruleIssues[0];

            const elements = ruleIssues
                .filter(i => i.selector)
                .map(i => ({
                    selector: i.selector || "",
                    note: i.message
                }));

            const rule: RuleResult = {
                id: ruleId,
                title: ruleId,
                description: firstIssue.message,
                status,
                impact,
                message: firstIssue.message,
                ...(elements.length ? { elements } : {})
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
            rules
        });
    }

    return categories;
}

export function buildAuditReport(result: AuditResult): AuditReport {
    const categories = buildCategories(result);

    return {
        meta: buildReportMeta(),
        score: buildReportScore(result.score),
        categories,
        stats: buildReportStatsFromCategories(categories)
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
    lines.push("");

    lines.push("Stats:");
    lines.push(`  ✔ Passed: ${report.stats.passed}`);
    lines.push(`  ⚠ Warnings: ${report.stats.warnings}`);
    lines.push(`  ✖ Failed: ${report.stats.failed}`);
    lines.push("");

    for (const cat of report.categories) {
        lines.push(`${cat.title} (${cat.score}/100)`);
        lines.push("-".repeat(40));

        for (const rule of cat.rules) {
            const icon = rule.status === "pass" ? "✔" : rule.status === "warn" ? "⚠" : "✖";
            lines.push(`${icon} ${rule.title} [${rule.impact.toUpperCase()}]`);
            lines.push(`   ${rule.message}`);

            if (rule.elements && rule.elements.length > 0) {
                for (const elem of rule.elements.slice(0, 3)) {
                    lines.push(`   → ${elem.selector}`);
                    if (elem.note) {
                        lines.push(`     ${elem.note}`);
                    }
                }
                if (rule.elements.length > 3) {
                    lines.push(`   ... and ${rule.elements.length - 3} more`);
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
