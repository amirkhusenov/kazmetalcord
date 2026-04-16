import * as fs from "fs";
import * as path from "path";
import { CategoryFieldValues, EnhancedMetalItem, EnhancedMetalItemSchema, MetalItem, MetalItemSchema, ParsedLeafFolder } from "./types";
import { ignoredFields, translitCyrillicToLatin } from "./utils";

const DATA_FOLDER = path.resolve(__dirname, "data");

function containsLatinLetters(text: string): boolean {
    return /[a-zA-Z]/.test(text);
}

function findAndParseLeafFolders(dir: string): ParsedLeafFolder[] {
    const result: ParsedLeafFolder[] = [];

    function traverse(currentPath: string, pathSegments: string[]) {
        const items = fs.readdirSync(currentPath, { withFileTypes: true });

        const subDirs = items.filter((item) => item.isDirectory()).map((dir) => path.join(currentPath, dir.name));
        const jsonFiles = items.filter((item) => item.isFile() && item.name.endsWith(".json"));

        const hasJsonFiles = jsonFiles.length > 0;
        const hasSubDirs = subDirs.length === 0;

        if (hasJsonFiles !== hasSubDirs) {
            throw new Error(`Invalid folder structure in ${currentPath}`);
        }

        if (hasJsonFiles) {
            const parsedFiles = jsonFiles.map((file) => {
                const filePath = path.join(currentPath, file.name);
                const trimmedFilename = file.name.trim();
                const content = parseJsonFile(filePath);
                return { filename: trimmedFilename, content };
            });

            result.push({ pathSegments: [...pathSegments], files: parsedFiles });
        } else {
            subDirs.forEach((subDir) => {
                const subDirName = path.basename(subDir).trim();
                traverse(subDir, [...pathSegments, subDirName]);
            });
        }
    }

    traverse(dir, []);
    return result;
}

function parseJsonFile(filePath: string): MetalItem[] {
    const rawData = fs.readFileSync(filePath, { encoding: "utf8" });
    if (!rawData) {
        return [];
    }
    const parsedData = JSON.parse(rawData);
    if (!Array.isArray(parsedData)) {
        throw new Error(`Invalid JSON data in file ${filePath}`);
    }
    for (const item of parsedData) {
        MetalItemSchema.parse(item);
    }
    return parsedData;
}

const parsingStart = performance.now();
const leafFolders = findAndParseLeafFolders(DATA_FOLDER);
const parsingEnd = performance.now();
console.log(`Parsing took ${parsingEnd - parsingStart} ms`);

function enhanceItems(folders: ParsedLeafFolder[]): EnhancedMetalItem[] {
    const enhancedItems: EnhancedMetalItem[] = [];

    for (const folder of folders) {
        for (const file of folder.files) {
            for (const item of file.content) {
                const enhancedItem = EnhancedMetalItemSchema.parse({
                    ...item,
                    translitTitle: translitCyrillicToLatin(item["Наименование"], { hasSuffix: true }),
                    categoryPath: folder.pathSegments,
                    translitCategoryPath: folder.pathSegments.map((segment) => translitCyrillicToLatin(segment)),
                });
                enhancedItems.push(enhancedItem);
            }
        }
    }

    return enhancedItems;
}

const enhancedStart = performance.now();
export const enhancedItems = enhanceItems(leafFolders);
const enhancedEnd = performance.now();
console.log(`Enhancing took ${enhancedEnd - enhancedStart} ms`);

console.log(`Total items: ${enhancedItems.length}`);

function buildCategoryFieldValues(enhancedItems: EnhancedMetalItem[]): CategoryFieldValues[] {
    const result: Record<string, Record<string, Set<string>>> = {};

    for (const item of enhancedItems) {
        const categoryPath = item.categoryPath.map((segment) => translitCyrillicToLatin(segment)).join("_");
        if (!result[categoryPath]) {
            result[categoryPath] = {};
        }
        for (const [key, value] of Object.entries(item)) {
            if (ignoredFields.includes(key)) {
                continue;
            }
            if (!result[categoryPath][key]) {
                result[categoryPath][key] = new Set();
            }
            if (typeof value !== "string") {
                throw new Error(`Invalid value type: ${value} for key: ${key} in category: ${categoryPath}`);
            }

            result[categoryPath][key].add(value);
        }
    }

    return Object.entries(result).map(([categoryPath, entries]) => ({
        categoryPathMerged: categoryPath,
        entries: Object.fromEntries(Object.entries(entries).map(([key, value]) => [key, Array.from(value)])),
    }));
}

const start1 = performance.now();
export const categoryFieldValues = buildCategoryFieldValues(enhancedItems);
const end1 = performance.now();
console.log(`Building category field values took ${end1 - start1} ms`);
