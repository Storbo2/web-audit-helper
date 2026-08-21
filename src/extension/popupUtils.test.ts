import { getPopupLocale, isAuditableUrl } from "./popupUtils";

describe("Chromium extension popup utilities", () => {
    it("uses Spanish copy for Spanish browser locales", () => {
        expect(getPopupLocale("es-CL")).toBe("es");
        expect(getPopupLocale("en-US")).toBe("en");
    });

    it.each([
        "https://example.com",
        "http://localhost:3000/page",
        "file:///C:/tmp/example.html"
    ])("allows auditable URLs: %s", (url) => {
        expect(isAuditableUrl(url)).toBe(true);
    });

    it.each([
        undefined,
        "chrome://extensions",
        "edge://settings",
        "about:blank",
        "https://chromewebstore.google.com/detail/example/abc",
        "https://chrome.google.com/webstore/detail/example/abc"
    ])("rejects restricted URLs: %s", (url) => {
        expect(isAuditableUrl(url)).toBe(false);
    });
});

