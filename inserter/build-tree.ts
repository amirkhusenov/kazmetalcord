import { Category, EnhancedMetalItem } from "./types";
import { enhancedItems } from "./validate";
import * as fs from "fs";
import * as path from "path";
import { translitCyrillicToLatin } from "./utils";

function buildCategoryTree(parsedFolders: EnhancedMetalItem[]): Category[] {
    const root: Category[] = [];

    for (const { categoryPath } of parsedFolders) {
        let currentLevel: Category[] | undefined = root;

        for (const category of categoryPath) {
            let existingCategory: Category | undefined = currentLevel?.find(cat => cat.n === category);

            if (!existingCategory && currentLevel) {
                existingCategory = { n: category, s: [] };
                currentLevel.push(existingCategory);
            }

            currentLevel = existingCategory?.s;
        }
    }

    const categoriesPriority = [
        "Черный прокат",
        "Цветной прокат",
        "Чугунный прокат",
        "Нержавеющий прокат",
        "Спецсталь",
        "Трубопроводная арматура",
        "Кабельная продукция",
        "Изоляция трубопроводов",
        "Метизная продукция",
        "Полимерные изделия",
        "Порошки",
        "Сварочные материалы",
        "Сплавы",
        "Композитные материалы",
        "Сэндвич-панели",
        "Оборудование",
        "Декоративные изделия",
    ];

    const sortedRoot: Category[] = [];

    for (const category of categoriesPriority) {
        const existingCategory = root.find(cat => cat.n.normalize() === category.normalize());
        if (existingCategory) {
            sortedRoot.push(existingCategory);
        } else {
            console.warn(`Category ${category} not found in root`);
        }
    }

    for (const category of root) {
        if (!sortedRoot.includes(category)) {
            console.warn(`Category ${category.n} not found in priority list`);
            sortedRoot.push(category);
        }
    }

    return sortedRoot;
}

function buildCategoryTranslit(parsedFolders: EnhancedMetalItem[]): Record<string, string> {
    const categoriesSet = new Set<string>();
    const categories = parsedFolders.map(item => item.categoryPath);
    categories.forEach(category => {
        category.forEach(cat => {
            categoriesSet.add(cat);
        });
    });

    const categoriesArray = Array.from(categoriesSet);
    return categoriesArray.reduce((acc, category) => {
        acc[translitCyrillicToLatin(category)] = category;
        return acc;
    }, {} as Record<string, string>);
}

function printMostDeepCategory(category: EnhancedMetalItem[]) {
    let maxDepth = -1;
    let maxDepthCategory: EnhancedMetalItem | undefined = undefined;

    for (const item of category) {
        if (item.categoryPath.length > maxDepth) {
            maxDepth = item.categoryPath.length;
            maxDepthCategory = item;
        }
    }

    console.log(`Most deep category: ${maxDepthCategory?.categoryPath.join(" > ")} (${maxDepth} levels)`);
}

// TODO: Consider optimizing nesting keys, not building the whole key again and again
function buildFieldsNamesForCategories(parsedFolders: EnhancedMetalItem[]): Record<string, string[]> {
    const ignoredFields = ["Наименование", "translitTitle", "translitCategoryPath", "categoryPath"];
    const result: Record<string, Set<string>> = {};
    for (const item of parsedFolders) {
        const resultKey = item.translitCategoryPath.join("/");
        if (!result[resultKey]) {
            result[resultKey] = new Set();
        }
        for (const field of Object.keys(item)) {
            if (ignoredFields.includes(field)) {
                continue;
            }
            result[resultKey].add(field);
        }
    }
    return Object.fromEntries(Object.entries(result).map(([key, value]) => [key, Array.from(value)]));
}

printMostDeepCategory(enhancedItems);

const buildStart = performance.now();
const categoryTree = buildCategoryTree(enhancedItems);
const buildEnd = performance.now();
console.log(`Tree built in ${buildEnd - buildStart} ms`);

const categoryTranslit = buildCategoryTranslit(enhancedItems);
fs.writeFileSync(path.join(__dirname, "category-translit.json"), JSON.stringify(categoryTranslit));

fs.writeFileSync(path.join(__dirname, "category-tree.json"), JSON.stringify(categoryTree));

const fieldsNamesForCategories = buildFieldsNamesForCategories(enhancedItems);
fs.writeFileSync(path.join(__dirname, "fields-names-for-categories.json"), JSON.stringify(fieldsNamesForCategories));
