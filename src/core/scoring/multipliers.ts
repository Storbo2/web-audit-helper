import type { ScoringMode } from "../types";
import { getActiveCategories } from "../../overlay/config/settings";
import type { ScoringMultipliers } from "./types";

export function getScoringMultipliers(mode: ScoringMode): ScoringMultipliers {
    switch (mode) {
        case "strict":
            return { critical: 25, warning: 10, recommendation: 5 };
        case "moderate":
            return { critical: 20, warning: 8, recommendation: 0 };
        case "soft":
            return { critical: 20, warning: 0, recommendation: 0 };
        case "normal":
        case "custom":
        default:
            return { critical: 20, warning: 8, recommendation: 4 };
    }
}

export function getAdjustedMultipliers(mode: ScoringMode): ScoringMultipliers {
    const base = getScoringMultipliers(mode);

    if (mode !== "custom") return base;

    const activeCategories = getActiveCategories();
    const categoryCount = activeCategories.size;

    let categoryFactor = 1.0;
    if (categoryCount === 1) categoryFactor = 0.25;
    else if (categoryCount === 2) categoryFactor = 0.5;
    else if (categoryCount <= 4) categoryFactor = 0.75;

    return {
        critical: Math.round(base.critical * categoryFactor),
        warning: Math.round(base.warning * categoryFactor),
        recommendation: Math.round(base.recommendation * categoryFactor)
    };
}