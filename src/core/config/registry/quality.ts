import type { RegisteredRule } from "./types";
import { RULE_IDS } from "../ruleIds";
import { checkExcessiveInlineStyles } from "../../rules/quality";

export const qualityRules: RegisteredRule[] = [
    {
        id: RULE_IDS.quality.excessiveInlineStyles,
        run: (config) => checkExcessiveInlineStyles(config.quality?.inlineStylesThreshold)
    }
];
