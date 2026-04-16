import { EnhancedMetalItem } from "./types";
import { enhancedItems } from "./validate";

console.log("enhancedItems.length", enhancedItems.length);

const ignoredFields = ["Наименование", "translitTitle", "translitCategoryPath", "categoryPath"];

function mostCategories() {
    const categories = enhancedItems.map((item) => item.categoryPath);
    const categoryCounts = categories.reduce((acc, category) => {
        const categoryString = category.join(" > ");
        acc[categoryString] = (acc[categoryString] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
    return sortedCategories.slice(0, 5);
}

function mostDeepCategory() {
    const mapCount = new Map<string, number>();
    for (const item of enhancedItems) {
        const count = item.categoryPath.length;
        mapCount.set(item.categoryPath.join(" > "), count);
    }
    const sortedCategories = Array.from(mapCount.entries()).sort((a, b) => b[1] - a[1]);
    return sortedCategories.slice(0, 5);
}

function count() {
    const categorySet = new Set<string>();
    for (const item of enhancedItems) {
        categorySet.add(item.categoryPath.join(" > "));
    }
    return {
        count: categorySet.size,
        average: enhancedItems.length / categorySet.size,
    }
}

function mostFieldValues() {
    const fields: Record<string, Set<unknown>> = {};
    for (const item of enhancedItems) {
        for (const [key, value] of Object.entries(item)) {
            if (ignoredFields.includes(key)) {
                continue;
            }
            const mergedKey = `${item.categoryPath.join(" > ")}:${key}`;
            fields[mergedKey] = (fields[mergedKey] || new Set()).add(value);
        }
    }
    return Object
        .entries(fields)
        .sort((a, b) => b[1].size - a[1].size)
        .slice(0, 5)
        .map(([key, value]) => ({
            key,
            count: value.size,
        }));
}

const start1 = performance.now();
const mostCategoriesResult = mostCategories();
const end1 = performance.now();
console.log(`-----Most categories-----`);
console.log(mostCategoriesResult);
console.log(`Time taken: ${end1 - start1} milliseconds`);

const start2 = performance.now();
const mostDeepCategoryResult = mostDeepCategory();
const end2 = performance.now();
console.log(`-----Most deep category-----`);
console.log(mostDeepCategoryResult);
console.log(`Time taken: ${end2 - start2} milliseconds`);

const start3 = performance.now();
const averageCategoryCountResult = count();
const end3 = performance.now();
console.log(`-----Average category count-----`);
console.log(averageCategoryCountResult);
console.log(`Time taken: ${end3 - start3} milliseconds`);

const start4 = performance.now();
const mostFieldValuesResult = mostFieldValues();
const end4 = performance.now();
console.log(`-----Most field values-----`);
console.log(mostFieldValuesResult);
console.log(`Time taken: ${end4 - start4} milliseconds`);
