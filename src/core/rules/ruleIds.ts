export const RULE_IDS = {
    accessibility: {
        htmlMissingLang: "ACC-01",
        imgMissingAlt: "ACC-02",
        linkMissingAccessibleName: "ACC-03",
        buttonMissingAccessibleName: "ACC-04",
        controlMissingIdOrName: "ACC-05",
        labelMissingFor: "ACC-06",
        controlMissingLabel: "ACC-07",
        multipleH1: "ACC-08",
        missingH1: "ACC-09",
        headingOrder: "ACC-10",
        ariaLabelledbyMissingTarget: "ACC-11",
        ariaDescribedbyMissingTarget: "ACC-12",
        positiveTabindex: "ACC-13",
        duplicateIds: "DOM-01",
        textTooSmall: "ACC-22"
    },
    seo: {
        missingTitle: "SEO-01",
        weakOrMissingDescription: "SEO-02",
        missingCharset: "SEO-03",
        missingViewport: "SEO-04"
    },
    custom: {
        vagueLinkText: "WAH-ACC-VAGUE-LINK",
        linkMissingHref: "WAH-LINK-NO-HREF",
        lowSemanticStructure: "WAH-SEM-LOW-STRUCTURE",
        largeFixedWidth: "WAH-RESP-FIXED-WIDTH"
    }
} as const;