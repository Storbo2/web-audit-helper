import type { RegisteredRuleMetadataOverride } from "../types";
import { accessibilityContentMetadataOverrides } from "./accessibility.content";
import { accessibilityControlsMetadataOverrides } from "./accessibility.controls";
import { accessibilityMediaMetadataOverrides } from "./accessibility.media";
import { accessibilityStructureMetadataOverrides } from "./accessibility.structure";
import { accessibilityVisualMetadataOverrides } from "./accessibility.visual";

export const accessibilityMetadataOverrides: Record<string, RegisteredRuleMetadataOverride> = {
    ...accessibilityContentMetadataOverrides,
    ...accessibilityControlsMetadataOverrides,
    ...accessibilityStructureMetadataOverrides,
    ...accessibilityMediaMetadataOverrides,
    ...accessibilityVisualMetadataOverrides,
};