import type { AuditIssue, WAHConfig } from "../types";
import { RULE_IDS } from "./ruleIds";
import {
    checkAriaDescribedbyTargets,
    checkAriaLabelledbyTargets,
    checkButtonsWithoutAccessibleName,
    checkControlsWithoutIdOrName,
    checkDuplicateIds,
    checkFontSize,
    checkHeadingOrder,
    checkHtmlLangMissing,
    checkIframesWithoutTitle,
    checkInputsWithoutLabel,
    checkLabelsWithoutFor,
    checkLinksWithoutAccessibleName,
    checkLinksWithoutHref,
    checkMissingAlt,
    checkMissingH1,
    checkNestedInteractiveElements,
    checkPositiveTabindex,
    checkTableHeadersWithoutScope,
    checkTablesWithoutCaption,
    checkVagueLinks,
    checkVideosWithoutControls
} from "./accessibility";
import { checkBoldItalicTags, checkMultipleH1, checkTooManyDivs } from "./semantic";
import {
    checkMissingCanonical,
    checkMissingMetaCharset,
    checkMissingMetaDescription,
    checkMissingOpenGraph,
    checkMissingTitle,
    checkMissingTwitterCard,
    checkMetaRobotsNoindex
} from "./seo";
import { checkLargeFixedWidths, checkMissingViewportMeta } from "./responsive";
import { checkDummyLinks, checkTargetBlankWithoutNoopener } from "./security";
import { checkExcessiveInlineStyles } from "./quality";

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
        id: RULE_IDS.accessibility.labelMissingFor,
        run: () => checkLabelsWithoutFor()
    },
    {
        id: RULE_IDS.accessibility.controlMissingLabel,
        run: () => checkInputsWithoutLabel()
    },
    {
        id: RULE_IDS.accessibility.missingH1,
        run: () => checkMissingH1()
    },
    {
        id: RULE_IDS.accessibility.headingOrder,
        run: () => checkHeadingOrder()
    },
    {
        id: RULE_IDS.accessibility.ariaLabelledbyMissingTarget,
        run: () => checkAriaLabelledbyTargets()
    },
    {
        id: RULE_IDS.accessibility.ariaDescribedbyMissingTarget,
        run: () => checkAriaDescribedbyTargets()
    },
    {
        id: RULE_IDS.accessibility.positiveTabindex,
        run: () => checkPositiveTabindex()
    },
    {
        id: RULE_IDS.accessibility.nestedInteractive,
        run: () => checkNestedInteractiveElements()
    },
    {
        id: RULE_IDS.accessibility.iframeMissingTitle,
        run: () => checkIframesWithoutTitle()
    },
    {
        id: RULE_IDS.accessibility.videoMissingControls,
        run: () => checkVideosWithoutControls()
    },
    {
        id: RULE_IDS.accessibility.tableMissingCaption,
        run: () => checkTablesWithoutCaption()
    },
    {
        id: RULE_IDS.accessibility.thMissingScope,
        run: () => checkTableHeadersWithoutScope()
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
        id: RULE_IDS.semantic.bItagUsage,
        run: () => checkBoldItalicTags()
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
        id: RULE_IDS.seo.missingCanonical,
        run: () => checkMissingCanonical()
    },
    {
        id: RULE_IDS.seo.metaRobotsNoindex,
        run: () => checkMetaRobotsNoindex()
    },
    {
        id: RULE_IDS.seo.missingOpenGraph,
        run: () => checkMissingOpenGraph()
    },
    {
        id: RULE_IDS.seo.missingTwitterCard,
        run: () => checkMissingTwitterCard()
    },

    {
        id: RULE_IDS.seo.missingViewport,
        run: () => checkMissingViewportMeta()
    },
    {
        id: RULE_IDS.custom.largeFixedWidth,
        run: () => checkLargeFixedWidths()
    },

    {
        id: RULE_IDS.security.targetBlankWithoutNoopener,
        run: () => checkTargetBlankWithoutNoopener()
    },
    {
        id: RULE_IDS.security.dummyLink,
        run: () => checkDummyLinks()
    },

    {
        id: RULE_IDS.quality.excessiveInlineStyles,
        run: (config) => checkExcessiveInlineStyles(config.quality?.inlineStylesThreshold)
    }
];