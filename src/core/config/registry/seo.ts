import type { RegisteredRule } from "./types";
import { RULE_IDS } from "../ruleIds";
import {
    checkMissingCanonical,
    checkMissingMetaCharset,
    checkMissingMetaDescription,
    checkMissingOpenGraph,
    checkMissingTitle,
    checkMissingTwitterCard,
    checkMetaRobotsNoindex
} from "../../rules/seo";

export const seoRules: RegisteredRule[] = [
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
    }
];