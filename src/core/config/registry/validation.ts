import type { EnrichedRegisteredRule } from "./types";

const VALID_CATEGORIES = new Set([
    "accessibility",
    "semantic",
    "seo",
    "responsive",
    "security",
    "quality",
    "performance",
    "form"
]);

const VALID_SEVERITIES = new Set(["critical", "warning", "recommendation"]);

export interface RegistryContractIssue {
    ruleId: string;
    index: number;
    field: "id" | "category" | "defaultSeverity" | "docsSlug";
    message: string;
}

function formatIssue(issue: RegistryContractIssue): string {
    return `rule[${issue.index}](${issue.ruleId}) ${issue.field}: ${issue.message}`;
}

export function formatRegistryContractErrors(issues: RegistryContractIssue[]): string {
    if (issues.length === 0) return "WAH registry contract validation passed";

    const lines = issues.map((issue) => `- ${formatIssue(issue)}`);
    return `WAH registry contract validation failed:\n${lines.join("\n")}`;
}

export function validateRegistryContractsDetailed(registry: EnrichedRegisteredRule[]): RegistryContractIssue[] {
    const issues: RegistryContractIssue[] = [];
    const ids = new Set<string>();

    registry.forEach((rule, index) => {
        const ruleId = rule.id || `unknown@${index}`;

        if (!rule.id || !rule.id.trim()) {
            issues.push({
                ruleId,
                index,
                field: "id",
                message: "id is required"
            });
        } else if (ids.has(rule.id)) {
            issues.push({
                ruleId,
                index,
                field: "id",
                message: `duplicate id \"${rule.id}\"`
            });
        } else {
            ids.add(rule.id);
        }

        if (!VALID_CATEGORIES.has(rule.category)) {
            issues.push({
                ruleId,
                index,
                field: "category",
                message: `invalid category \"${String(rule.category)}\"`
            });
        }

        if (!VALID_SEVERITIES.has(rule.defaultSeverity)) {
            issues.push({
                ruleId,
                index,
                field: "defaultSeverity",
                message: `invalid defaultSeverity \"${String(rule.defaultSeverity)}\"`
            });
        }

        if (!rule.docsSlug || !rule.docsSlug.trim()) {
            issues.push({
                ruleId,
                index,
                field: "docsSlug",
                message: "docsSlug is required"
            });
        }
    });

    return issues;
}

export function validateRegistryContracts(registry: EnrichedRegisteredRule[]): string[] {
    return validateRegistryContractsDetailed(registry).map(formatIssue);
}

export function assertRegistryContracts(registry: EnrichedRegisteredRule[]): void {
    const issues = validateRegistryContractsDetailed(registry);
    if (issues.length === 0) return;

    throw new Error(formatRegistryContractErrors(issues));
}