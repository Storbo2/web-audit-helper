import type { RegisteredRule } from "./types";
import { accessibilityRules } from "./accessibility";
import { semanticRules } from "./semantic";
import { seoRules } from "./seo";
import { responsiveRules } from "./responsive";
import { securityRules } from "./security";
import { qualityRules } from "./quality";
import { performanceRules } from "./performance";
import { formRules } from "./form";

export type { RegisteredRule } from "./types";

export const CORE_RULES_REGISTRY: RegisteredRule[] = [
    ...accessibilityRules,
    ...semanticRules,
    ...seoRules,
    ...responsiveRules,
    ...securityRules,
    ...qualityRules,
    ...performanceRules,
    ...formRules
];