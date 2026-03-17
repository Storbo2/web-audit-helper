import { getRuleThreshold, type RegisteredRule } from "./types";
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
    {
        id: RULE_IDS.accessibility.htmlMissingLang,
        run: () => checkHtmlLangMissing()
    },
    {
        id: RULE_IDS.accessibility.textTooSmall,
        run: (config) => checkFontSize(
            getRuleThreshold(config, RULE_IDS.accessibility.textTooSmall)
            ?? config.accessibility.minFontSize
        )
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
        run: (config) => checkContrastRatio(
            getRuleThreshold(config, RULE_IDS.accessibility.contrastInsufficient)
            ?? config.accessibility.minContrastRatio
            ?? 4.5
        )
    },
    {
        id: RULE_IDS.accessibility.focusNotVisible,
        run: (config) => checkFocusNotVisible(
            getRuleThreshold(config, RULE_IDS.accessibility.focusNotVisible) ?? 100
        )
    },
    {
        id: RULE_IDS.accessibility.lineHeightTooLow,
        run: (config) => checkLineHeightTooLow(
            getRuleThreshold(config, RULE_IDS.accessibility.lineHeightTooLow)
            ?? config.accessibility.minLineHeight
            ?? 1.4
        )
    },
    {
        id: RULE_IDS.accessibility.clickWithoutKeyboard,
        run: () => checkClickWithoutKeyboard()
    },
    {
        id: RULE_IDS.accessibility.dialogMissingAccessibleName,
        run: () => checkDialogMissingAccessibleName()
    },
    {
        id: RULE_IDS.accessibility.modalMissingFocusableElement,
        run: () => checkModalMissingFocusableElement()
    },
    {
        id: RULE_IDS.accessibility.iconOnlyButtonMissingAccessibleName,
        run: () => checkIconOnlyButtonMissingAccessibleName()
    },
    {
        id: RULE_IDS.accessibility.invalidControlMissingErrorMessage,
        run: () => checkInvalidControlMissingErrorMessage()
    }
];