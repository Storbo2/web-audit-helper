import type { RegisteredRule } from "./types";
import { RULE_IDS } from "../ruleIds";
import {
    checkImageMissingAsyncDecode,
    checkImageMissingDimensions,
    checkImageMissingLazyLoad,
    checkVideoAutoplayWithoutMuted,
    checkImageMissingSrcset,
    checkTooManyFonts,
    checkTooManyScripts,
    checkScriptWithoutDefer,
    checkRenderBlockingCSS,
    checkMissingCacheHeaders,
    checkCSSImportUsage,
    checkImageMissingModernFormat
} from "../../rules/performance";

export const performanceRules: RegisteredRule[] = [
    {
        id: RULE_IDS.performance.imageMissingDimensions,
        run: () => checkImageMissingDimensions()
    },
    {
        id: RULE_IDS.performance.imageMissingLazyLoad,
        run: () => checkImageMissingLazyLoad()
    },
    {
        id: RULE_IDS.performance.imageMissingAsyncDecode,
        run: () => checkImageMissingAsyncDecode()
    },
    {
        id: RULE_IDS.performance.videoAutoplayWithoutMuted,
        run: () => checkVideoAutoplayWithoutMuted()
    },
    {
        id: RULE_IDS.performance.imageMissingSrcset,
        run: () => checkImageMissingSrcset()
    },
    {
        id: RULE_IDS.performance.tooManyFonts,
        run: () => checkTooManyFonts()
    },
    {
        id: RULE_IDS.performance.tooManyScripts,
        run: () => checkTooManyScripts()
    },
    {
        id: RULE_IDS.performance.scriptWithoutDefer,
        run: () => checkScriptWithoutDefer()
    },
    {
        id: RULE_IDS.performance.renderBlockingCSS,
        run: () => checkRenderBlockingCSS()
    },
    {
        id: RULE_IDS.performance.missingCacheHeaders,
        run: () => checkMissingCacheHeaders()
    },
    {
        id: RULE_IDS.performance.cssImportUsage,
        run: () => checkCSSImportUsage()
    },
    {
        id: RULE_IDS.performance.imageMissingModernFormat,
        run: () => checkImageMissingModernFormat()
    }
];