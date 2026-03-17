import { RULE_IDS } from "../../ruleIds";
import type { RegisteredRuleMetadataOverride } from "../types";

export const performanceMetadataOverrides: Record<string, RegisteredRuleMetadataOverride> = {
    [RULE_IDS.performance.imageMissingDimensions]: {
        defaultSeverity: "warning",
        title: "Image missing width/height",
        fix: "Set explicit width and height attributes on images to reduce layout shifts.",
        docsSlug: "IMG-01",
        standardType: "web-dev",
        standardLabel: "Core Web Vitals - CLS"
    },
    [RULE_IDS.performance.imageMissingLazyLoad]: {
        defaultSeverity: "recommendation",
        title: "Image missing lazy loading",
        fix: "Add loading=\"lazy\" for images that are not immediately visible.",
        docsSlug: "IMG-02",
        standardType: "web-dev",
        standardLabel: "Web performance best practice"
    },
    [RULE_IDS.performance.imageMissingAsyncDecode]: {
        defaultSeverity: "recommendation",
        title: "Image missing async decoding",
        fix: "Add decoding=\"async\" to non-critical images.",
        docsSlug: "IMG-03",
        standardType: "web-dev",
        standardLabel: "Rendering performance best practice"
    },
    [RULE_IDS.performance.videoAutoplayWithoutMuted]: {
        defaultSeverity: "warning",
        title: "Autoplay video without muted",
        fix: "Add muted to autoplay videos to match browser autoplay policies and improve UX.",
        docsSlug: "MEDIA-01",
        standardType: "heuristic",
        standardLabel: "Media UX best practice"
    },
    [RULE_IDS.performance.imageMissingSrcset]: {
        defaultSeverity: "recommendation",
        title: "Responsive image sources missing",
        fix: "Provide srcset and sizes so browsers can choose optimal image variants.",
        docsSlug: "PERF-01",
        standardType: "web-dev",
        standardLabel: "Responsive images best practice"
    },
    [RULE_IDS.performance.tooManyFonts]: {
        defaultSeverity: "recommendation",
        title: "Too many fonts or font weights",
        fix: "Reduce font families and weights to lower transfer size and render cost.",
        docsSlug: "PERF-02",
        standardType: "web-dev",
        standardLabel: "Font performance best practice"
    },
    [RULE_IDS.performance.tooManyScripts]: {
        defaultSeverity: "recommendation",
        title: "Too many script resources",
        fix: "Bundle, defer, or remove unnecessary scripts.",
        docsSlug: "PERF-03",
        standardType: "web-dev",
        standardLabel: "JavaScript performance best practice"
    },
    [RULE_IDS.performance.scriptWithoutDefer]: {
        defaultSeverity: "warning",
        title: "Head script without defer/async",
        fix: "Add defer or async to non-critical scripts in head.",
        docsSlug: "PERF-04",
        standardType: "web-dev",
        standardLabel: "Render-blocking script best practice"
    },
    [RULE_IDS.performance.renderBlockingCSS]: {
        defaultSeverity: "recommendation",
        title: "Potential render-blocking CSS",
        fix: "Inline critical CSS and defer non-critical stylesheets when possible.",
        docsSlug: "PERF-05",
        standardType: "web-dev",
        standardLabel: "Critical rendering path best practice"
    },
    [RULE_IDS.performance.missingCacheHeaders]: {
        defaultSeverity: "recommendation",
        title: "Cache strategy not detectable",
        fix: "Configure explicit caching policy for static assets (for example, Cache-Control).",
        docsSlug: "PERF-06",
        standardType: "web-dev",
        standardLabel: "Caching best practice"
    },
    [RULE_IDS.performance.cssImportUsage]: {
        defaultSeverity: "recommendation",
        title: "CSS @import usage detected",
        fix: "Prefer link tags or build-time bundling instead of @import in runtime CSS.",
        docsSlug: "PERF-07",
        standardType: "web-dev",
        standardLabel: "CSS loading best practice"
    },
    [RULE_IDS.performance.imageMissingModernFormat]: {
        defaultSeverity: "warning",
        title: "Image without modern format alternative",
        fix: "Provide WebP/AVIF alternatives with picture/source for large visual assets.",
        docsSlug: "PERF-08",
        standardType: "web-dev",
        standardLabel: "Image optimization best practice"
    },
    [RULE_IDS.performance.imageMissingFetchPriority]: {
        defaultSeverity: "recommendation",
        title: "Above-the-fold image without fetch priority",
        fix: "Add fetchpriority=\"high\" to above-the-fold images to improve Largest Contentful Paint (LCP).",
        docsSlug: "PERF-09",
        standardType: "web-dev",
        standardLabel: "Core Web Vitals - LCP"
    },
    [RULE_IDS.performance.excessThirdPartyScripts]: {
        defaultSeverity: "recommendation",
        title: "Excess third-party scripts from same domain",
        fix: "Consolidate scripts from the same third-party domain to reduce network requests.",
        docsSlug: "PERF-10",
        standardType: "web-dev",
        standardLabel: "Third-party script best practice"
    },
};