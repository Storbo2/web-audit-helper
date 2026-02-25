export const RULE_IDS = {
    accessibility: {
        htmlMissingLang: "ACC-01",
        imgMissingAlt: "ACC-02",
        linkMissingAccessibleName: "ACC-03",
        buttonMissingAccessibleName: "ACC-04",
        controlMissingIdOrName: "ACC-05",
        labelMissingFor: "ACC-06",
        controlMissingLabel: "ACC-07",
        missingH1: "ACC-09",
        headingOrder: "ACC-10",
        ariaLabelledbyMissingTarget: "ACC-11",
        ariaDescribedbyMissingTarget: "ACC-12",
        positiveTabindex: "ACC-13",
        nestedInteractive: "ACC-14",
        iframeMissingTitle: "ACC-15",
        videoMissingControls: "ACC-16",
        tableMissingCaption: "ACC-17",
        thMissingScope: "ACC-18",
        vagueLinkText: "ACC-19",
        linkMissingHref: "ACC-20",
        textTooSmall: "ACC-22",
        duplicateIds: "ACC-23"
    },
    seo: {
        missingTitle: "SEO-01",
        weakOrMissingDescription: "SEO-02",
        missingCharset: "SEO-03",
        missingCanonical: "SEO-05",
        metaRobotsNoindex: "SEO-06",
        missingOpenGraph: "SEO-07",
        missingTwitterCard: "SEO-08"
    },
    security: {
        targetBlankWithoutNoopener: "SEC-01"
    },
    semantic: {
        bItagUsage: "SEM-01",
        lowSemanticStructure: "SEM-02",
        multipleH1: "SEM-03"
    },
    quality: {
        excessiveInlineStyles: "QLT-01",
        dummyLink: "QLT-02"
    },
    responsive: {
        largeFixedWidth: "RWD-01",
        missingViewport: "RWD-02"
    }
} as const;