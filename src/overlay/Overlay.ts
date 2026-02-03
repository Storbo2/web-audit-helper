import "./Overlay.css";
import type { AuditResult, WAHConfig } from "../core/types";

export function createOverlay(result: AuditResult, config: WAHConfig) {
    const overlay = document.createElement("div");
    overlay.className = `wah-overlay wah-${config.overlay.position}`;

    overlay.innerHTML = `
    <strong>WAH Report</strong>
    <p>Issues found: ${result.issues.length}</p>
    <p>Score: ${result.score}</p>
    `;

    document.body.appendChild(overlay);
}