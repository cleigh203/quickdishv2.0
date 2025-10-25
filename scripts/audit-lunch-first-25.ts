import { auditFirstNLunch, toJson } from "../src/utils/recipeAudit";

const records = auditFirstNLunch(25);
console.log(toJson(records));



