import { RULE_IDS } from "../../ruleIds";
import type { RegisteredRuleMetadataOverride } from "../types";

export const seoMetadataOverrides: Record<string, RegisteredRuleMetadataOverride> = {
    [RULE_IDS.seo.missingTitle]: {
        defaultSeverity: "critical",
        title: "Missing page title",
        fix: "Add a descriptive title element inside head.",
        docsSlug: "SEO-01",
        standardType: "html-spec",
        standardLabel: "HTML spec - title element"
    },
    [RULE_IDS.seo.weakOrMissingDescription]: {
        defaultSeverity: "warning",
        title: "Meta description missing or weak",
        fix: "Provide a concise meta description that summarizes the page intent.",
        docsSlug: "SEO-02",
        standardType: "heuristic",
        standardLabel: "Search snippet best practice"
    },
    [RULE_IDS.seo.missingCharset]: {
        defaultSeverity: "warning",
        title: "Meta charset missing",
        fix: "Add <meta charset=\"UTF-8\"> near the top of head.",
        docsSlug: "SEO-03",
        standardType: "html-spec",
        standardLabel: "HTML spec - character encoding"
    },
    [RULE_IDS.seo.missingCanonical]: {
        defaultSeverity: "recommendation",
        title: "Canonical link missing",
        fix: "Add a canonical link tag that points to the preferred page URL.",
        docsSlug: "SEO-05",
        standardType: "heuristic",
        standardLabel: "Technical SEO best practice"
    },
    [RULE_IDS.seo.metaRobotsNoindex]: {
        defaultSeverity: "warning",
        title: "Meta robots contains noindex",
        fix: "Remove noindex if the page should be discoverable by search engines.",
        docsSlug: "SEO-06",
        standardType: "heuristic",
        standardLabel: "Indexability best practice"
    },
    [RULE_IDS.seo.missingOpenGraph]: {
        defaultSeverity: "recommendation",
        title: "Open Graph metadata missing",
        fix: "Add core Open Graph tags such as og:title, og:description, and og:image.",
        docsSlug: "SEO-07",
        standardType: "heuristic",
        standardLabel: "Social preview best practice"
    },
    [RULE_IDS.seo.missingTwitterCard]: {
        defaultSeverity: "recommendation",
        title: "Twitter Card metadata missing",
        fix: "Add Twitter Card tags such as twitter:card, twitter:title, and twitter:description.",
        docsSlug: "SEO-08",
        standardType: "heuristic",
        standardLabel: "Social preview best practice"
    },
};