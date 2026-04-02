import type { RegisteredRule } from "./types";
import { RULE_IDS } from "../ruleIds";
import { checkDummyLinks, checkMixedContent, checkTargetBlankWithoutNoopener } from "../../rules/security";

export const securityRules: RegisteredRule[] = [
    {
        id: RULE_IDS.security.targetBlankWithoutNoopener,
        run: () => checkTargetBlankWithoutNoopener()
    },
    {
        id: RULE_IDS.security.mixedContent,
        run: () => checkMixedContent()
    },
    {
        id: RULE_IDS.quality.dummyLink,
        run: () => checkDummyLinks()
    }
];