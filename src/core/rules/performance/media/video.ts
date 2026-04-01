import type { AuditIssue } from "../../../types";
import { RULE_IDS } from "../../../config/ruleIds";
import { getCssSelector } from "../../../../utils/dom";
import { shouldIgnore } from "../../helpers";

export function checkVideoAutoplayWithoutMuted(): AuditIssue[] {
    const issues: AuditIssue[] = [];

    document.querySelectorAll("video").forEach((video) => {
        if (shouldIgnore(video)) return;
        const isAutoplay = video.hasAttribute("autoplay");
        const isMuted = video.hasAttribute("muted");

        if (isAutoplay && !isMuted) {
            issues.push({
                rule: RULE_IDS.performance.videoAutoplayWithoutMuted,
                message: "Video with autoplay must also have muted attribute to respect browser policies",
                severity: "warning",
                category: "performance",
                element: video as HTMLElement,
                selector: getCssSelector(video)
            });
        }
    });

    return issues;
}