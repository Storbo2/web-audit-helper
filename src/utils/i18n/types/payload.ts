export type LocaleIssuePattern = { regex: string; replacement: string };

export type LocalePayload = {
    dictionary: Record<string, string>;
    ruleLabels: Record<string, string>;
    ruleFixes: Record<string, string>;
    issueMessages: {
        exact: Record<string, string>;
        patterns: LocaleIssuePattern[];
    };
};