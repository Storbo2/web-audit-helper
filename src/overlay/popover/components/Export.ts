import type { AuditResult } from "../../../core/types";
import { buildAuditReport, serializeReportToJSON, serializeReportToTXT, serializeReportToHTML } from "../../../reporters/auditReport";
import { closePop } from "../utils";

export function renderExportPopover(popBody: HTMLElement, overlay: HTMLElement, results: AuditResult) {
    popBody.innerHTML = `
        <div class="wah-popover-content wah-export-content">
            <h3>Export Report</h3>

            <button class="wah-export-btn wah-export-html" type="button">
                <span class="label">🖨️ HTML (Print-friendly)</span>
                <span class="desc">Readable document optimized for printing and sharing</span>
            </button>

            <button class="wah-export-btn wah-export-txt" type="button">
                <span class="label">📄 TXT (Human Review)</span>
                <span class="desc">Readable summary report (ideal for quick inspection and sharing)</span>
            </button>

            <button class="wah-export-btn wah-export-json" type="button">
                <span class="label">📋 JSON (CI / Automation)</span>
                <span class="desc">Machine-readable structured report (ideal for pipelines and diffing builds)</span>
            </button>
        </div>
    `;

    const jsonBtn = popBody.querySelector(".wah-export-json") as HTMLButtonElement | null;
    const txtBtn = popBody.querySelector(".wah-export-txt") as HTMLButtonElement | null;
    const htmlBtn = popBody.querySelector(".wah-export-html") as HTMLButtonElement | null;

    if (jsonBtn) jsonBtn.onclick = () => exportReport(results, "json");
    if (txtBtn) txtBtn.onclick = () => exportReport(results, "txt");
    if (htmlBtn) htmlBtn.onclick = () => exportReport(results, "html");

    const pop = document.getElementById("wah-pop") as HTMLElement | null;
    if (pop) {
        pop.style.setProperty("--wah-border", getComputedStyle(overlay).getPropertyValue("--wah-border") || "#22d3ee");
    }
}

function exportReport(results: AuditResult, format: "json" | "txt" | "html") {
    const report = buildAuditReport(results);

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === "json") {
        content = serializeReportToJSON(report);
        filename = buildReportFileName(report, "json");
        mimeType = "application/json";
    } else if (format === "html") {
        content = serializeReportToHTML(report);
        filename = buildReportFileName(report, "html");
        mimeType = "text/html";
    } else {
        content = serializeReportToTXT(report);
        filename = buildReportFileName(report, "txt");
        mimeType = "text/plain";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    closePop();
}

function buildReportFileName(
    report: ReturnType<typeof buildAuditReport>,
    format: "json" | "txt" | "html"
): string {
    const date = formatDateForFilename(report.meta.date);
    const score = report.score.overall;
    return `wah-report-${date}-score_${score}.${format}`;
}

function formatDateForFilename(iso: string): string {
    const d = new Date(iso);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}_${mm}_${dd}`;
}