import type { IssueCategory, RuleResult, Severity } from "../core/types";

export const CATEGORY_TITLES: Record<IssueCategory, string> = {
    accessibility: "Accessibility",
    semantic: "Semantic HTML",
    seo: "SEO",
    responsive: "Responsive Design",
    security: "Security",
    quality: "Quality",
    maintainability: "Maintainability"
};

export const CATEGORY_ORDER: IssueCategory[] = ["accessibility", "semantic", "seo", "responsive", "security", "quality", "maintainability"];

export const IMPACT_RANK: Record<RuleResult["impact"], number> = {
    high: 3,
    medium: 2,
    low: 1
};

export const ELEMENTS_EXPORT_LIMIT = 20;
export const ELEMENTS_TXT_PREVIEW_LIMIT = 3;

export const RULE_TITLES: Record<string, string> = {
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

export const RULE_DESCRIPTIONS: Partial<Record<string, string>> = {
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

export const CATEGORY_PREFIXES: Partial<Record<IssueCategory, string[]>> = {
    accessibility: ["ACC"],
    semantic: ["SEM"],
    seo: ["SEO"],
    responsive: ["RWD"],
    security: ["SEC"],
    quality: ["QLT"]
};

export const SEVERITY_RANK: Record<Severity, number> = {
    recommendation: 1,
    warning: 2,
    critical: 3
};

export const WAH_VERSION = typeof __WAH_VERSION__ !== "undefined" ? __WAH_VERSION__ : "0.0.0-dev";
export const WAH_MODE: "dev" | "ci" = typeof __WAH_MODE__ !== "undefined" && __WAH_MODE__ === "ci" ? "ci" : "dev";