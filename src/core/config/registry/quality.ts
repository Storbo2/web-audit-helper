import { getRuleThreshold, type RegisteredRule } from "./types";
import { RULE_IDS } from "../ruleIds";
import {
    checkExcessiveInlineStyles,
    checkObsoleteElements,
    checkObsoleteAttributes,
    checkSmallTouchTargets
} from "../../rules/quality";

export const qualityRules: RegisteredRule[] = [
    {
        id: RULE_IDS.quality.excessiveInlineStyles,
        run: (config) => checkExcessiveInlineStyles(config.quality?.inlineStylesThreshold)
    },
    {
        id: RULE_IDS.quality.obsoleteElements,
        run: () => checkObsoleteElements()
    },
    {
        id: RULE_IDS.quality.obsoleteAttributes,
        run: () => checkObsoleteAttributes()
    },
    {
        id: RULE_IDS.quality.smallTouchTargets,
        run: (config) => checkSmallTouchTargets(
            getRuleThreshold(config, RULE_IDS.quality.smallTouchTargets)
            ?? config.quality?.minTouchSize
        )
    }
];