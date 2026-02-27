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
    checkMissingSkipLink,
    checkNestedInteractiveElements,
    checkPositiveTabindex,
    checkTableHeadersWithoutScope,
    checkTablesWithoutCaption,
    checkVagueLinks,
    checkVideosWithoutControls,
    checkContrastRatio,
    checkFocusNotVisible,
    checkLineHeightTooLow
} from "../rules/accessibility";
import {
    checkBoldItalicTags,
    checkFalseLists,
    checkMissingMain,
    checkMissingNav,
    checkMultipleH1,
    checkMultipleMain,
    checkTooManyDivs
} from "../rules/semantic";
import {
    checkMissingCanonical,
    checkMissingMetaCharset,
    checkMissingMetaDescription,
    checkMissingOpenGraph,
    checkMissingTitle,
    checkMissingTwitterCard,
    checkMetaRobotsNoindex
} from "../rules/seo";
import { checkLargeFixedWidths, checkMissingViewportMeta, checkHorizontalOverflow, checkFixedElementOverlap, checkProblematic100vh } from "../rules/responsive";
import { checkDummyLinks, checkTargetBlankWithoutNoopener } from "../rules/security";
import { checkExcessiveInlineStyles } from "../rules/quality";
import {
    checkImageMissingAsyncDecode,
    checkImageMissingDimensions,
    checkImageMissingLazyLoad,
    checkVideoAutoplayWithoutMuted,
    checkImageMissingSrcset,
    checkTooManyFonts,
    checkTooManyScripts,
    checkScriptWithoutDefer,
    checkRenderBlockingCSS,
    checkMissingCacheHeaders
} from "../rules/performance";
import {
    checkEmailTelWithoutType,
    checkMissingAutocomplete,
    checkRequiredWithoutIndicator,
    checkSubmitButtonOutsideForm
} from "../rules/form";

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
        id: RULE_IDS.accessibility.vagueLinkText,
        run: () => checkVagueLinks()
    },
    {
        id: RULE_IDS.accessibility.linkMissingHref,
        run: () => checkLinksWithoutHref()
    },
    {
        id: RULE_IDS.accessibility.missingSkipLink,
        run: () => checkMissingSkipLink()
    },
    {
        id: RULE_IDS.accessibility.contrastInsufficient,
        run: (config) => checkContrastRatio(config.accessibility.minContrastRatio ?? 4.5)
    },
    {
        id: RULE_IDS.accessibility.focusNotVisible,
        run: () => checkFocusNotVisible()
    },
    {
        id: RULE_IDS.accessibility.lineHeightTooLow,
        run: (config) => checkLineHeightTooLow(config.accessibility.minLineHeight ?? 1.4)
    },

    {
        id: RULE_IDS.semantic.multipleH1,
        run: () => checkMultipleH1()
    },
    {
        id: RULE_IDS.semantic.lowSemanticStructure,
        run: () => checkTooManyDivs()
    },
    {
        id: RULE_IDS.semantic.bItagUsage,
        run: () => checkBoldItalicTags()
    },
    {
        id: RULE_IDS.semantic.missingMain,
        run: () => checkMissingMain()
    },
    {
        id: RULE_IDS.semantic.multipleMain,
        run: () => checkMultipleMain()
    },
    {
        id: RULE_IDS.semantic.missingNav,
        run: () => checkMissingNav()
    },
    {
        id: RULE_IDS.semantic.falseLists,
        run: () => checkFalseLists()
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
        id: RULE_IDS.responsive.missingViewport,
        run: () => checkMissingViewportMeta()
    },
    {
        id: RULE_IDS.responsive.largeFixedWidth,
        run: () => checkLargeFixedWidths()
    },
    {
        id: RULE_IDS.responsive.overflowHorizontal,
        run: () => checkHorizontalOverflow()
    },
    {
        id: RULE_IDS.responsive.fixedElementOverlap,
        run: () => checkFixedElementOverlap()
    },
    {
        id: RULE_IDS.responsive.problematic100vh,
        run: () => checkProblematic100vh()
    },

    {
        id: RULE_IDS.security.targetBlankWithoutNoopener,
        run: () => checkTargetBlankWithoutNoopener()
    },
    {
        id: RULE_IDS.quality.dummyLink,
        run: () => checkDummyLinks()
    },

    {
        id: RULE_IDS.quality.excessiveInlineStyles,
        run: (config) => checkExcessiveInlineStyles(config.quality?.inlineStylesThreshold)
    },

    {
        id: RULE_IDS.performance.imageMissingDimensions,
        run: () => checkImageMissingDimensions()
    },
    {
        id: RULE_IDS.performance.imageMissingLazyLoad,
        run: () => checkImageMissingLazyLoad()
    },
    {
        id: RULE_IDS.performance.imageMissingAsyncDecode,
        run: () => checkImageMissingAsyncDecode()
    },
    {
        id: RULE_IDS.performance.videoAutoplayWithoutMuted,
        run: () => checkVideoAutoplayWithoutMuted()
    },
    {
        id: RULE_IDS.performance.imageMissingSrcset,
        run: () => checkImageMissingSrcset()
    },
    {
        id: RULE_IDS.performance.tooManyFonts,
        run: () => checkTooManyFonts()
    },
    {
        id: RULE_IDS.performance.tooManyScripts,
        run: () => checkTooManyScripts()
    },
    {
        id: RULE_IDS.performance.scriptWithoutDefer,
        run: () => checkScriptWithoutDefer()
    },
    {
        id: RULE_IDS.performance.renderBlockingCSS,
        run: () => checkRenderBlockingCSS()
    },
    {
        id: RULE_IDS.performance.missingCacheHeaders,
        run: () => checkMissingCacheHeaders()
    },

    {
        id: RULE_IDS.form.submitButtonOutsideForm,
        run: () => checkSubmitButtonOutsideForm()
    },
    {
        id: RULE_IDS.form.requiredWithoutIndicator,
        run: () => checkRequiredWithoutIndicator()
    },
    {
        id: RULE_IDS.form.emailTelWithoutType,
        run: () => checkEmailTelWithoutType()
    },
    {
        id: RULE_IDS.form.missingAutocomplete,
        run: () => checkMissingAutocomplete()
    }
];