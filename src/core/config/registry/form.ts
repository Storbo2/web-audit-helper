import type { RegisteredRule } from "./types";
import { RULE_IDS } from "../ruleIds";
import {
    checkEmailTelWithoutType,
    checkMissingAutocomplete,
    checkRequiredWithoutIndicator,
    checkSubmitButtonOutsideForm
} from "../../rules/form";

export const formRules: RegisteredRule[] = [
    {
        id: RULE_IDS.form.submitButtonOutsideForm,
        run: () => checkSubmitButtonOutsideForm()
    },
    {
        id: RULE_IDS.form.requiredWithoutIndicator,
        run: () => checkRequiredWithoutIndicator()
    },
    {
        id: RULE_IDS.form.emailTelWithoutType,
        run: () => checkEmailTelWithoutType()
    },
    {
        id: RULE_IDS.form.missingAutocomplete,
        run: () => checkMissingAutocomplete()
    }
];