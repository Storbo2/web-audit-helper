export {
    checkImageMissingDimensions,
    checkImageMissingLazyLoad,
    checkImageMissingAsyncDecode,
    checkVideoAutoplayWithoutMuted,
    checkImageMissingSrcset,
    checkImageMissingModernFormat,
    checkImageMissingFetchPriority
} from "./performance/media";

export { checkTooManyFonts, checkTooManyScripts, checkMissingCacheHeaders, checkExcessThirdPartyScripts } from "./performance/counts";

export { checkScriptWithoutDefer, checkRenderBlockingCSS, checkCSSImportUsage } from "./performance/css";