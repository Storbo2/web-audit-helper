export { checkHtmlLangMissing, checkMissingH1, checkMissingSkipLink } from "./document";
export { checkFontSize, checkContrastRatio, checkLineHeightTooLow } from "./text";
export { checkInputsWithoutLabel, checkControlsWithoutIdOrName, checkLabelsWithoutFor } from "./forms";
export { checkHeadingOrder, checkDuplicateIds } from "./structure";
export { checkVagueLinks, checkLinksWithoutHref, checkLinksWithoutAccessibleName } from "./links";
export { checkButtonsWithoutAccessibleName } from "./buttons";
export { checkAriaLabelledbyTargets, checkAriaDescribedbyTargets, checkPositiveTabindex } from "./aria";
export { checkMissingAlt, checkIframesWithoutTitle, checkVideosWithoutControls, checkTablesWithoutCaption, checkTableHeadersWithoutScope } from "./media";
export { checkNestedInteractiveElements, checkFocusNotVisible } from "./interactive";

export { hasAccessibleName, shouldIgnore } from "./helpers";