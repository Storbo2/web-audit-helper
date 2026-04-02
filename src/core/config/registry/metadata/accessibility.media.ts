import { RULE_IDS } from "../../ruleIds";
import { defineMetadataOverrides } from "./helpers";

export const accessibilityMediaMetadataOverrides = defineMetadataOverrides([
    [RULE_IDS.accessibility.iframeMissingTitle, {
        defaultSeverity: "warning",
        title: "Iframe missing title",
        fix: "Add a concise and descriptive title attribute to each iframe.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 2.4.1 Bypass Blocks"
    }],
    [RULE_IDS.accessibility.videoMissingControls, {
        defaultSeverity: "warning",
        title: "Video missing controls",
        fix: "Add controls attribute to videos that users need to play or pause manually.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.2 Time-based Media"
    }],
    [RULE_IDS.accessibility.tableMissingCaption, {
        defaultSeverity: "recommendation",
        title: "Table missing caption",
        fix: "Add a caption to summarize the table purpose.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.1 Info and Relationships"
    }],
    [RULE_IDS.accessibility.thMissingScope, {
        defaultSeverity: "recommendation",
        title: "Table header missing scope",
        fix: "Add scope=\"row\" or scope=\"col\" to th elements for clear associations.",
        standardType: "wcag",
        standardLabel: "WCAG 2.1 - 1.3.1 Info and Relationships"
    }],
]);