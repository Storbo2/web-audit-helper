# WAH Audit Flow Diagram

```mermaid
graph LR
    A[Start Audit] --> B[Initialize Config]
    B --> C[Load Rule Registry]
    C --> D[Traverse DOM]
    
    D --> E[Run Rules]
    E --> E1[Accessibility Rules]
    E --> E2[SEO Rules]
    E --> E3[Semantic Rules]
    E --> E4[Responsive Rules]
    E --> E5[Security Rules]
    E --> E6[Performance Rules]
    E --> E7[Quality Rules]
    E --> E8[Form Rules]
    
    E1 --> F[Collect Issues]
    E2 --> F
    E3 --> F
    E4 --> F
    E5 --> F
    E6 --> F
    E7 --> F
    E8 --> F
    
    F --> G[Compute Score]
    G --> H[Calculate Severity<br/>Breakdown]
    H --> I[Build Report]
    
    I --> J{Execution<br/>Context?}
    
    J -->|Browser| K[Mount Overlay]
    K --> L[Display Issues]
    L --> M[User Interactions]
    M --> N[Focus/Hide/Export]
    N --> O[Generate Report]
    
    J -->|Headless| P[Return Result<br/>No UI]
    
    J -->|CLI| Q[Serialize Output]
    Q --> Q1[JSON Format]
    Q --> Q2[HTML Format]
    Q --> Q3[TXT Format]
    Q1 --> R[Save Report]
    Q2 --> R
    Q3 --> R
    
    O --> S[Export Options]
    S --> S1[JSON Export]
    S --> S2[HTML Export]
    S --> S3[TXT Export]
    
    R --> T[End Audit]
    S1 --> T
    S2 --> T
    S3 --> T

    style A fill:#c8e6c9
    style T fill:#c8e6c9
    style J fill:#fff9c4
    style K fill:#bbdefb
    style P fill:#f8bbd0
    style Q fill:#ffe0b2
