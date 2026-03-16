import { t } from "../i18n";

export function logHideMessage(hideReason: string, _logLevel: "full" | "summary" | "none"): void {
    const dict = t();

    console.log(`[WAH] ${dict.overlayHidden(hideReason)}`);
    console.log(`[WAH] ${dict.resetHideHint}`);
}