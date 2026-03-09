import type { RegisteredRule } from "./types";
import { RULE_IDS } from "../ruleIds";
import {
    checkBoldItalicTags,
    checkFalseLists,
    checkMissingMain,
    checkMissingNav,
    checkMultipleH1,
    checkMultipleMain,
    checkTooManyDivs
} from "../../rules/semantic";

export const semanticRules: RegisteredRule[] = [
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
    }
];