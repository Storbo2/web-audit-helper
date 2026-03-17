import { describe, expect, it } from "vitest";
import {
    checkIconOnlyButtonMissingAccessibleName,
    checkInvalidControlMissingErrorMessage
} from "../accessibility/controls";
import { ensureCssEscapePolyfill } from "./examples-coverage.testUtils";

ensureCssEscapePolyfill();

describe("ACC-30: icon-only button naming", () => {
    it("flags icon-only button without aria-label or aria-labelledby", () => {
        document.body.innerHTML = `
            <button type="button"><svg aria-hidden="true"></svg></button>
        `;

        const issues = checkIconOnlyButtonMissingAccessibleName();
        expect(issues).toHaveLength(1);
        expect(issues[0]?.rule).toBe("ACC-30");
    });

    it("does not flag icon-only button with aria-label", () => {
        document.body.innerHTML = `
            <button type="button" aria-label="Close dialog"><svg aria-hidden="true"></svg></button>
        `;

        const issues = checkIconOnlyButtonMissingAccessibleName();
        expect(issues).toHaveLength(0);
    });

    it("ignores buttons inside WAH ignored surfaces", () => {
        document.body.innerHTML = `
            <div data-wah-ignore>
                <button type="button"><svg aria-hidden="true"></svg></button>
            </div>
        `;

        const issues = checkIconOnlyButtonMissingAccessibleName();
        expect(issues).toHaveLength(0);
    });
});

describe("ACC-31: invalid control error association", () => {
    it("flags aria-invalid control without aria-describedby or error region", () => {
        document.body.innerHTML = `
            <form>
                <label for="email">Email</label>
                <input id="email" type="email" aria-invalid="true" />
            </form>
        `;

        const issues = checkInvalidControlMissingErrorMessage();
        expect(issues).toHaveLength(1);
        expect(issues[0]?.rule).toBe("ACC-31");
    });

    it("does not flag aria-invalid control with valid aria-describedby target", () => {
        document.body.innerHTML = `
            <form>
                <label for="email">Email</label>
                <input id="email" type="email" aria-invalid="true" aria-describedby="email-error" />
                <p id="email-error">Enter a valid email address.</p>
            </form>
        `;

        const issues = checkInvalidControlMissingErrorMessage();
        expect(issues).toHaveLength(0);
    });

    it("does not flag aria-invalid control when nearby live region has error text", () => {
        document.body.innerHTML = `
            <form>
                <label for="username">Username</label>
                <input id="username" type="text" aria-invalid="true" />
                <div role="alert">Username is required.</div>
            </form>
        `;

        const issues = checkInvalidControlMissingErrorMessage();
        expect(issues).toHaveLength(0);
    });
});