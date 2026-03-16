export {
    checkImageMissingDimensions,
    checkImageMissingLazyLoad,
    checkImageMissingAsyncDecode,
    checkVideoAutoplayWithoutMuted,
    checkImageMissingSrcset,
    checkImageMissingModernFormat
} from "./performance/media";

export { checkTooManyFonts, checkTooManyScripts, checkMissingCacheHeaders } from "./performance/counts";

export { checkScriptWithoutDefer, checkRenderBlockingCSS, checkCSSImportUsage } from "./performance/css";