import { getRuleThreshold, type RegisteredRule } from "./types";
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
    checkImageMissingModernFormat,
    checkImageMissingFetchPriority,
    checkExcessThirdPartyScripts
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
        run: (config) => checkTooManyFonts(
            getRuleThreshold(config, RULE_IDS.performance.tooManyFonts) ?? 3
        )
    },
    {
        id: RULE_IDS.performance.tooManyScripts,
        run: (config) => checkTooManyScripts(
            getRuleThreshold(config, RULE_IDS.performance.tooManyScripts) ?? 10
        )
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
        run: (config) => checkMissingCacheHeaders(
            getRuleThreshold(config, RULE_IDS.performance.missingCacheHeaders) ?? 5
        )
    },
    {
        id: RULE_IDS.performance.cssImportUsage,
        run: () => checkCSSImportUsage()
    },
    {
        id: RULE_IDS.performance.imageMissingModernFormat,
        run: (config) => checkImageMissingModernFormat(
            getRuleThreshold(config, RULE_IDS.performance.imageMissingModernFormat) ?? 300
        )
    },
    {
        id: RULE_IDS.performance.imageMissingFetchPriority,
        run: () => checkImageMissingFetchPriority()
    },
    {
        id: RULE_IDS.performance.excessThirdPartyScripts,
        run: (config) => checkExcessThirdPartyScripts(
            getRuleThreshold(config, RULE_IDS.performance.excessThirdPartyScripts) ?? 5
        )
    }
];