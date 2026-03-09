import type { AuditIssue, WAHConfig } from "../../types";

export interface RegisteredRule {
    id: string;
    run: (config: WAHConfig) => AuditIssue[];
}
