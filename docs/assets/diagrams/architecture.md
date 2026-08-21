# Architecture Diagram

This diagram should be generated as `architecture.png` and used in documentation.

**Mermaid code** (can be converted to PNG using tools like mermaid.live or mermaid-cli):

```mermaid
graph TD
    A[Browser Environment] --> B[DOM Analysis]
    A --> C[CSS Computation]
    A --> D[JavaScript APIs]
    
    B --> E[WAH Core Engine]
    C --> E
    D --> E
    
    E --> F[Rules Registry<br/>75+ Audit Rules]
    E --> G[Scoring Engine<br/>5 Scoring Modes]
    
    F --> H[8 Categories]
    H --> H1[Accessibility<br/>26 rules]
    H --> H2[SEO<br/>8 rules]
    H --> H3[Semantic HTML<br/>7 rules]
    H --> H4[Responsive Design<br/>5 rules]
    H --> H5[Security<br/>1 rule]
    H --> H6[Quality<br/>2 rules]
    H --> H7[Performance<br/>10 rules]
    H --> H8[Form Validation<br/>4 rules]
    
    G --> I[AuditResult]
    F --> I
    
    I --> J{Output Mode}
    J -->|Browser| K[Interactive Overlay<br/>Real-time UI]
    J -->|Browser Headless| L[Console Reports<br/>No UI]
    J -->|CLI/Node| M[JSON/HTML/TXT<br/>Reports]
    
    K --> N[Features]
    N --> N1[Drag & Drop]
    N --> N2[Category Filters]
    N --> N3[Issue Focus]
    N --> N4[Hide Controls]
    N --> N5[Settings Panel]
    
    M --> O[Export Formats]
    O --> O1[JSON Report]
    O --> O2[HTML Report]
    O --> O3[TXT Report]

    style A fill:#e1f5ff
    style E fill:#fff3e0
    style F fill:#f3e5f5
    style G fill:#e8f5e9
    style I fill:#fce4ec
    style K fill:#c8e6c9
    style L fill:#c8e6c9
    style M fill:#c8e6c9
```

**How to convert to PNG:**

1. Visit [mermaid.live](https://mermaid.live)
2. Paste the Mermaid code above
3. Right-click diagram → Download as PNG
4. Save as `docs/assets/diagrams/architecture.png`

**Alternative (CLI):**

```bash
pnpm add --global @mermaid-js/mermaid-cli
mmdc -i architecture.mmd -o architecture.png
```
