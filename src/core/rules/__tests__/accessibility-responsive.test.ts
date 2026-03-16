import { registerContrastDetectionSuite } from "./accessibility-responsive.contrast.suite";
import { registerFixedElementOverlapSuite } from "./accessibility-responsive.fixed-overlap.suite";
import { registerExcessiveInlineStylesSuite } from "./accessibility-responsive.inline-styles.suite";
import { registerScoringVisibilitySuite } from "./accessibility-responsive.scoring-visibility.suite";

registerContrastDetectionSuite();
registerFixedElementOverlapSuite();
registerExcessiveInlineStylesSuite();
registerScoringVisibilitySuite();