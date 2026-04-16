import * as fs from "fs";
import * as path from "path";
import { translitCyrillicToLatin } from "./utils";

const DATA_FOLDER = path.resolve(__dirname, "Полный");
// const DATA_FOLDER = path.resolve(__dirname, "dannye");

function normalizeString(str: string): string {
    // return str.normalize("NFC");
    return translitCyrillicToLatin(str.normalize("NFC"));
}

function normalizeFileName(filePath: string): string {
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const base = path.basename(filePath, ext);
    const normalizedBase = normalizeString(base);
    const normalizedExt = normalizeString(ext);
    return path.join(dir, normalizedBase + normalizedExt);
}

function isImageFile(filePath: string): boolean {
    console.log(filePath);
    const ext = path.extname(filePath);
    return ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".webp";
}

function normalizeFileContents(filePath: string): void {
    if (isImageFile(filePath)) {
        console.log(`Skipping image file: ${filePath}`);
        return;
    }
    try {
        const content = fs.readFileSync(filePath, "utf-8");
        const normalizedContent = normalizeString(content);
        if (content !== normalizedContent) {
            console.log(`Normalized contents of ${filePath}`);
            fs.writeFileSync(filePath, normalizedContent, "utf-8");
        }
    } catch (error) {
        console.error(`Error normalizing contents of ${filePath}:`, error);
    }
}

function normalizeDirectory(dirPath: string): void {
    try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const currentPath = path.join(dirPath, entry.name);
            const normalizedPath = normalizeFileName(currentPath);

            if (entry.isDirectory()) {
                if (currentPath !== normalizedPath) {
                    fs.renameSync(currentPath, normalizedPath);
                    console.log(`Renamed directory: ${currentPath} -> ${normalizedPath}`);
                }
                normalizeDirectory(normalizedPath);
            } else if (entry.isFile()) {
                // if (currentPath !== normalizedPath) {
                //     fs.renameSync(currentPath, normalizedPath);
                //     console.log(`Renamed file: ${currentPath} -> ${normalizedPath}`);
                // }
                // normalizeFileContents(normalizedPath);
            }
        }
    } catch (error) {
        console.error(`Error processing directory ${dirPath}:`, error);
    }
}

console.log("Starting normalization process...");
normalizeDirectory(DATA_FOLDER);
console.log("Normalization process completed.");


