import { getRuleThreshold, type RegisteredRule } from "./types";
import { defineStaticRule, defineThresholdRule } from "./helpers";
import { RULE_IDS } from "../ruleIds";
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
    checkLineHeightTooLow,
    checkClickWithoutKeyboard,
    checkDialogMissingAccessibleName,
    checkModalMissingFocusableElement,
    checkIconOnlyButtonMissingAccessibleName,
    checkInvalidControlMissingErrorMessage
} from "../../rules/accessibility";

export const accessibilityRules: RegisteredRule[] = [
    defineStaticRule(RULE_IDS.accessibility.htmlMissingLang, checkHtmlLangMissing),
    defineThresholdRule(
        RULE_IDS.accessibility.textTooSmall,
        (config) =>
            getRuleThreshold(config, RULE_IDS.accessibility.textTooSmall)
            ?? config.accessibility.minFontSize,
        checkFontSize
    ),
    defineStaticRule(RULE_IDS.accessibility.imgMissingAlt, checkMissingAlt),
    defineStaticRule(RULE_IDS.accessibility.linkMissingAccessibleName, checkLinksWithoutAccessibleName),
    defineStaticRule(RULE_IDS.accessibility.buttonMissingAccessibleName, checkButtonsWithoutAccessibleName),
    defineStaticRule(RULE_IDS.accessibility.controlMissingIdOrName, checkControlsWithoutIdOrName),
    defineStaticRule(RULE_IDS.accessibility.labelMissingFor, checkLabelsWithoutFor),
    defineStaticRule(RULE_IDS.accessibility.controlMissingLabel, checkInputsWithoutLabel),
    defineStaticRule(RULE_IDS.accessibility.missingH1, checkMissingH1),
    defineStaticRule(RULE_IDS.accessibility.headingOrder, checkHeadingOrder),
    defineStaticRule(RULE_IDS.accessibility.ariaLabelledbyMissingTarget, checkAriaLabelledbyTargets),
    defineStaticRule(RULE_IDS.accessibility.ariaDescribedbyMissingTarget, checkAriaDescribedbyTargets),
    defineStaticRule(RULE_IDS.accessibility.positiveTabindex, checkPositiveTabindex),
    defineStaticRule(RULE_IDS.accessibility.nestedInteractive, checkNestedInteractiveElements),
    defineStaticRule(RULE_IDS.accessibility.iframeMissingTitle, checkIframesWithoutTitle),
    defineStaticRule(RULE_IDS.accessibility.videoMissingControls, checkVideosWithoutControls),
    defineStaticRule(RULE_IDS.accessibility.tableMissingCaption, checkTablesWithoutCaption),
    defineStaticRule(RULE_IDS.accessibility.thMissingScope, checkTableHeadersWithoutScope),
    defineStaticRule(RULE_IDS.accessibility.duplicateIds, checkDuplicateIds),
    defineStaticRule(RULE_IDS.accessibility.vagueLinkText, checkVagueLinks),
    defineStaticRule(RULE_IDS.accessibility.linkMissingHref, checkLinksWithoutHref),
    defineStaticRule(RULE_IDS.accessibility.missingSkipLink, checkMissingSkipLink),
    defineThresholdRule(
        RULE_IDS.accessibility.contrastInsufficient,
        (config) =>
            getRuleThreshold(config, RULE_IDS.accessibility.contrastInsufficient)
            ?? config.accessibility.minContrastRatio
            ?? 4.5,
        checkContrastRatio
    ),
    defineThresholdRule(
        RULE_IDS.accessibility.focusNotVisible,
        (config) => getRuleThreshold(config, RULE_IDS.accessibility.focusNotVisible) ?? 100,
        checkFocusNotVisible
    ),
    defineThresholdRule(
        RULE_IDS.accessibility.lineHeightTooLow,
        (config) =>
            getRuleThreshold(config, RULE_IDS.accessibility.lineHeightTooLow)
            ?? config.accessibility.minLineHeight
            ?? 1.4,
        checkLineHeightTooLow
    ),
    defineStaticRule(RULE_IDS.accessibility.clickWithoutKeyboard, checkClickWithoutKeyboard),
    defineStaticRule(RULE_IDS.accessibility.dialogMissingAccessibleName, checkDialogMissingAccessibleName),
    defineStaticRule(RULE_IDS.accessibility.modalMissingFocusableElement, checkModalMissingFocusableElement),
    defineStaticRule(
        RULE_IDS.accessibility.iconOnlyButtonMissingAccessibleName,
        checkIconOnlyButtonMissingAccessibleName
    ),
    defineStaticRule(
        RULE_IDS.accessibility.invalidControlMissingErrorMessage,
        checkInvalidControlMissingErrorMessage
    )
];