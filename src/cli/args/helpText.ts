export const HELP_TEXT = `
wah - Web Audit Helper CLI

Usage:
    wah <file.html | http://...> [options]

Options:
    --format, -f      Output format: json | html | txt         (default: json)
    --output, -o      Write report to this file path            (default: stdout)
    --fail-on         Exit code 1 when score is below N  (0-100)
    --locale          Report language: en | es                  (default: en)
    --scoring-mode    Scoring preset: strict|normal|moderate|soft|custom  (default: normal)
    --browser         Use Playwright browser mode: chromium|firefox|webkit
    --wait-for        Wait for this selector before auditing    (Playwright only)
    --compare-with    Baseline report JSON path for run comparison
    --min-score-delta Minimum allowed score delta vs baseline (can be negative)
    --max-critical-increase Maximum allowed critical increase vs baseline
    --max-warning-increase Maximum allowed warning increase vs baseline
    --max-recommendation-increase Maximum allowed recommendation increase vs baseline
    --help, -h        Show this help message

Examples:
    wah index.html
    wah index.html --format html --output report.html --fail-on 80
    wah https://example.com --format json --output audit.json
    wah https://example.com --browser chromium --wait-for #app
    wah index.html --compare-with previous.json --min-score-delta -5 --max-critical-increase 0
`.trim();
