import type { AuditReportMeta } from "../../core/types";
import { getSettings, getActiveFilters, getActiveCategories } from "../../overlay/config/settings";
import { getBreakpointInfo } from "../../utils/breakpoints";
import { WAH_MODE, WAH_VERSION } from "../constants";

export function buildReportMeta(): AuditReportMeta {
    const settings = getSettings();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const breakpointInfo = getBreakpointInfo(width);

    const meta: AuditReportMeta = {
        url: window.location.href,
        date: new Date().toISOString(),
        viewport: {
            width,
            height
        },
        breakpoint: {
            name: breakpointInfo.name,
            label: breakpointInfo.label,
            devices: breakpointInfo.devices
        },
        userAgent: navigator.userAgent,
        version: WAH_VERSION,
        mode: WAH_MODE,
        scoringMode: settings.scoringMode
    };

    if (settings.scoringMode === "custom") {
        const activeFilters = getActiveFilters();
        const activeCategories = getActiveCategories();

        meta.appliedFilters = {
            severities: Array.from(activeFilters),
            categories: Array.from(activeCategories)
        };
    }

    return meta;
}