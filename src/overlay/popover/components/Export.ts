import type { AuditResult } from "../../../core/types";
import { buildAuditReport, serializeReportToJSON, serializeReportToTXT, serializeReportToHTML } from "../../../reporters/auditReport";
import { closePop } from "../utils";
import { t } from "../../../utils/i18n";

let previousExportedReport: ReturnType<typeof buildAuditReport> | null = null;

export function renderExportPopover(popBody: HTMLElement, overlay: HTMLElement, results: AuditResult) {
    const dict = t();
    popBody.innerHTML = `
        <div class="wah-popover-content wah-export-content">
            <h3>${dict.exportTitle}</h3>

            <button class="wah-export-btn wah-export-html" type="button" title="${dict.exportHTMLTitle}">
                <span class="label">🖨️ ${dict.exportHTML}</span>
                <span class="desc">${dict.exportHTMLDescription}</span>
            </button>

            <button class="wah-export-btn wah-export-txt" type="button" title="${dict.exportTextTitle}">
                <span class="label">📄 ${dict.exportText}</span>
                <span class="desc">${dict.exportTextDescription}</span>
            </button>

            <button class="wah-export-btn wah-export-json" type="button" title="${dict.exportJSONTitle}">
                <span class="label">📋 ${dict.exportJSON}</span>
                <span class="desc">${dict.exportJSONDescription}</span>
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
    const previousReport = previousExportedReport;

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === "json") {
        content = serializeReportToJSON(report, previousReport ?? undefined);
        filename = buildReportFileName(report, "json");
        mimeType = "application/json";
    } else if (format === "html") {
        content = serializeReportToHTML(report, previousReport ?? undefined);
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

    previousExportedReport = report;

    closePop();
}

function buildReportFileName(
    report: ReturnType<typeof buildAuditReport>,
    format: "json" | "txt" | "html"
): string {
    const date = formatDateForFilename(report.meta.date);
    const score = report.score.overall;
    const mode = report.meta.scoringMode || "normal";
    return `wah-report-${mode}-${date}-score_${score}.${format}`;
}

function formatDateForFilename(iso: string): string {
    const d = new Date(iso);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}_${mm}_${dd}`;
}