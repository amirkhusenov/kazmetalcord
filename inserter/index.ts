import { categoryFieldValues, enhancedItems } from "./validate";
import { insertCategoryFieldValues, insertJsonFiles } from "./mongo";

(async function main() {
    await insertJsonFiles(enhancedItems);
    await insertCategoryFieldValues(categoryFieldValues);
})();
