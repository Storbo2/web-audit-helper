import type { AuditIssue, WAHConfig } from "../types";
import { RULE_IDS } from "./ruleIds";
import {
    checkButtonsWithoutAccessibleName,
    checkControlsWithoutIdOrName,
    checkDuplicateIds,
    checkFontSize,
    checkHtmlLangMissing,
    checkInputsWithoutLabel,
    checkLinksWithoutAccessibleName,
    checkLinksWithoutHref,
    checkMissingAlt,
    checkVagueLinks
} from "./accessibility";
import { checkMultipleH1, checkTooManyDivs } from "./semantic";
import { checkMissingMetaCharset, checkMissingMetaDescription, checkMissingTitle } from "./seo";
import { checkLargeFixedWidths, checkMissingViewportMeta } from "./responsive";

export interface RegisteredRule {
    id: string;
    run: (config: WAHConfig) => AuditIssue[];
}

export const CORE_RULES_REGISTRY: RegisteredRule[] = [
    {
        id: RULE_IDS.accessibility.htmlMissingLang,
        run: () => checkHtmlLangMissing()
    },
    {
        id: RULE_IDS.accessibility.textTooSmall,
        run: (config) => checkFontSize(config.accessibility.minFontSize)
    },
    {
        id: RULE_IDS.accessibility.imgMissingAlt,
        run: () => checkMissingAlt()
    },
    {
        id: RULE_IDS.accessibility.linkMissingAccessibleName,
        run: () => checkLinksWithoutAccessibleName()
    },
    {
        id: RULE_IDS.accessibility.buttonMissingAccessibleName,
        run: () => checkButtonsWithoutAccessibleName()
    },
    {
        id: RULE_IDS.accessibility.controlMissingIdOrName,
        run: () => checkControlsWithoutIdOrName()
    },
    {
        id: RULE_IDS.accessibility.controlMissingLabel,
        run: () => checkInputsWithoutLabel()
    },
    {
        id: RULE_IDS.accessibility.duplicateIds,
        run: () => checkDuplicateIds()
    },
    {
        id: RULE_IDS.custom.vagueLinkText,
        run: () => checkVagueLinks()
    },
    {
        id: RULE_IDS.custom.linkMissingHref,
        run: () => checkLinksWithoutHref()
    },

    {
        id: RULE_IDS.accessibility.multipleH1,
        run: () => checkMultipleH1()
    },
    {
        id: RULE_IDS.custom.lowSemanticStructure,
        run: () => checkTooManyDivs()
    },

    {
        id: RULE_IDS.seo.missingTitle,
        run: () => checkMissingTitle()
    },
    {
        id: RULE_IDS.seo.weakOrMissingDescription,
        run: () => checkMissingMetaDescription()
    },
    {
        id: RULE_IDS.seo.missingCharset,
        run: () => checkMissingMetaCharset()
    },

    {
        id: RULE_IDS.seo.missingViewport,
        run: () => checkMissingViewportMeta()
    },
    {
        id: RULE_IDS.custom.largeFixedWidth,
        run: () => checkLargeFixedWidths()
    }
];
