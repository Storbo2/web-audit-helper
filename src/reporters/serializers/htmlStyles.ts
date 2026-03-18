export const HTML_REPORT_STYLES = `
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 24px; color: #111827; }
                h1 { margin: 0 0 8px; }
                .meta, .summary { margin-bottom: 16px; }
                .comparison { margin: 16px 0 20px; border: 1px solid #d1d5db; border-radius: 8px; padding: 12px; background: #f9fafb; }
                .comparison h2 { margin: 0 0 8px; font-size: 18px; }
                .comparison p { margin: 6px 0; }
                .meta p, .summary p { margin: 4px 0; }
                .legend { margin: 8px 0 0; color: #374151; font-size: 14px; }
                .legend .legend-fail { color: #dc2626; font-weight: 600; }
                .legend .legend-warn { color: #d97706; font-weight: 600; }
                .category { margin: 24px 0; border-top: 1px solid #e5e7eb; padding-top: 16px; }
                .cat-score { color: #4b5563; font-weight: 500; }
                .cat-summary { color: #374151; margin-bottom: 12px; font-size: 14px; }
                .rule { border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 12px; margin: 10px 0; }
                .status-fail { border-left: 4px solid #dc2626; }
                .status-warn { border-left: 4px solid #d97706; }
                .status-recommendation { border-left: 4px solid #6d6d6d; }
                .rule-header { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; font-size: 14px; }
                .rule-id { color: #374151; font-weight: 600; }
                .rule-title { font-weight: 600; }
                .status { font-size: 12px; padding: 2px 6px; border-radius: 999px; background: #f3f4f6; color: #374151; }
                .message { margin: 8px 0 0; }
                .elements { margin: 8px 0 0 18px; padding: 0; }
                .elements li { margin: 6px 0; }
                code { background: #f3f4f6; padding: 2px 4px; border-radius: 4px; }
                .fix { margin: 6px 0 0; color: #1f2937; }
                .note { color: #4b5563; margin-top: 2px; }
                .omitted { color: #6b7280; font-style: italic; }
                .empty { color: #6b7280; }
                footer { margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 12px; color: #4b5563; font-size: 12px; }
                footer p { margin: 4px 0; }
                @media print { body { margin: 0; } .rule { break-inside: avoid; } }
            `;