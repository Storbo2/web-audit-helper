import { describe } from "vitest";
import { registerOverlayUtilsGeneralSuite } from "./utils.general.suite";
import { registerOverlayUtilsViewportSuite } from "./utils.viewport.suite";

describe("Overlay Utils", () => {
    registerOverlayUtilsGeneralSuite();
    registerOverlayUtilsViewportSuite();
});