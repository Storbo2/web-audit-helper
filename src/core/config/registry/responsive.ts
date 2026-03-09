import type { RegisteredRule } from "./types";
import { RULE_IDS } from "../ruleIds";
import { checkLargeFixedWidths, checkMissingViewportMeta, checkHorizontalOverflow, checkFixedElementOverlap, checkProblematic100vh } from "../../rules/responsive";

export const responsiveRules: RegisteredRule[] = [
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
        run: (config) => checkFixedElementOverlap(config.scoringMode === "strict")
    },
    {
        id: RULE_IDS.responsive.problematic100vh,
        run: () => checkProblematic100vh()
    }
];