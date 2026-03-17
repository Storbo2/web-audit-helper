import { describe, expect, it } from "vitest";
import { checkConflictingCanonical, checkInvalidHreflang, checkMissingCanonical } from "../seo";

describe("SEO-05/SEO-09 boundary", () => {
    it("does not flag SEO-05 when canonical exists but href is empty", () => {
        document.head.innerHTML = `<link rel="canonical" href="" />`;

        const seo05 = checkMissingCanonical();
        const seo09 = checkConflictingCanonical();

        expect(seo05).toHaveLength(0);
        expect(seo09).toHaveLength(1);
        expect(seo09[0]?.rule).toBe("SEO-09");
    });
});

describe("SEO-09: canonical conflict checks", () => {
    it("flags when multiple canonical tags are present", () => {
        document.head.innerHTML = `
            <link rel="canonical" href="https://example.com/a" />
            <link rel="canonical" href="https://example.com/b" />
        `;

        const issues = checkConflictingCanonical();
        expect(issues).toHaveLength(1);
        expect(issues[0]?.rule).toBe("SEO-09");
    });

    it("flags when canonical href is empty", () => {
        document.head.innerHTML = `<link rel="canonical" href="" />`;

        const issues = checkConflictingCanonical();
        expect(issues).toHaveLength(1);
        expect(issues[0]?.rule).toBe("SEO-09");
    });

    it("does not flag a single valid canonical", () => {
        document.head.innerHTML = `<link rel="canonical" href="https://example.com/" />`;

        const issues = checkConflictingCanonical();
        expect(issues).toHaveLength(0);
    });
});

describe("SEO-10: hreflang validity checks", () => {
    it("flags hreflang link without href", () => {
        document.head.innerHTML = `
            <link rel="alternate" hreflang="en" href="" />
            <link rel="alternate" hreflang="x-default" href="https://example.com/" />
        `;

        const issues = checkInvalidHreflang();
        expect(issues.some(i => i.rule === "SEO-10")).toBe(true);
    });

    it("flags invalid hreflang code", () => {
        document.head.innerHTML = `
            <link rel="alternate" hreflang="english-us" href="https://example.com/en" />
            <link rel="alternate" hreflang="x-default" href="https://example.com/" />
        `;

        const issues = checkInvalidHreflang();
        expect(issues.some(i => (i.message || "").includes("invalid"))).toBe(true);
    });

    it("flags missing x-default when alternates are present", () => {
        document.head.innerHTML = `
            <link rel="alternate" hreflang="en" href="https://example.com/en" />
            <link rel="alternate" hreflang="es" href="https://example.com/es" />
        `;

        const issues = checkInvalidHreflang();
        expect(issues.some(i => (i.message || "").includes("x-default"))).toBe(true);
    });

    it("does not flag valid hreflang set with x-default", () => {
        document.head.innerHTML = `
            <link rel="alternate" hreflang="en" href="https://example.com/en" />
            <link rel="alternate" hreflang="es" href="https://example.com/es" />
            <link rel="alternate" hreflang="x-default" href="https://example.com/" />
        `;

        const issues = checkInvalidHreflang();
        expect(issues).toHaveLength(0);
    });
});