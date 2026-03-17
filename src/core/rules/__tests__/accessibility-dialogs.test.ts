import { describe, expect, it } from "vitest";
import {
    checkDialogMissingAccessibleName,
    checkModalMissingFocusableElement
} from "../accessibility/dialogs";

describe("ACC-28: dialog accessible naming", () => {
    it("flags dialog without aria-label and aria-labelledby", () => {
        document.body.innerHTML = `
            <div role="dialog">
                <p>Dialog content</p>
            </div>
        `;

        const issues = checkDialogMissingAccessibleName();
        expect(issues).toHaveLength(1);
        expect(issues[0]?.rule).toBe("ACC-28");
    });

    it("does not flag dialog with valid aria-labelledby", () => {
        document.body.innerHTML = `
            <h2 id="dlg-title">User preferences</h2>
            <div role="dialog" aria-labelledby="dlg-title">
                <p>Dialog content</p>
            </div>
        `;

        const issues = checkDialogMissingAccessibleName();
        expect(issues).toHaveLength(0);
    });
});

describe("ACC-29: modal focusable content", () => {
    it("flags aria-modal dialog without focusable descendants", () => {
        document.body.innerHTML = `
            <div role="dialog" aria-modal="true" aria-label="Read only modal">
                <p>No interactive controls</p>
            </div>
        `;

        const issues = checkModalMissingFocusableElement();
        expect(issues).toHaveLength(1);
        expect(issues[0]?.rule).toBe("ACC-29");
    });

    it("does not flag aria-modal dialog when a focusable control exists", () => {
        document.body.innerHTML = `
            <div role="dialog" aria-modal="true" aria-label="Confirmation">
                <button type="button">Confirm</button>
            </div>
        `;

        const issues = checkModalMissingFocusableElement();
        expect(issues).toHaveLength(0);
    });
});