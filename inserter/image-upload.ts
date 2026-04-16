import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";
import * as path from "path";
import { parsedEnv } from "./parsedEnv";
import { ParsedLeafFolder } from "./types";
import { translitCyrillicToLatin } from "./utils";

cloudinary.config({
    cloud_name: parsedEnv.CLOUDINARY_CLOUD_NAME,
    api_key: parsedEnv.CLOUDINARY_API_KEY,
    api_secret: parsedEnv.CLOUDINARY_API_SECRET,
});

cloudinary.api.ping()
    .then(result => console.log('Cloudinary connection successful:', result))
    .catch(error => console.error('Cloudinary connection failed:', error));

const DATA_FOLDER = path.resolve(__dirname, "dannye");

function findAndParseLeafFolders(dir: string): ParsedLeafFolder[] {
    const result: ParsedLeafFolder[] = [];

    function traverse(currentPath: string, pathSegments: string[]) {
        const items = fs.readdirSync(currentPath, { withFileTypes: true });

        const subDirs = items.filter((item) => item.isDirectory()).map((dir) => path.join(currentPath, dir.name));
        const imageFiles = items.filter((item) => item.isFile() && item.name === "image.webp");

        // console.log(`${currentPath} has ${subDirs.length} subdirectories and ${imageFiles.length} image files`);

        const hasSubDirs = subDirs.length !== 0;
        const hasSingleImageFile = imageFiles.length === 1;

        if (!hasSubDirs && !hasSingleImageFile) {
            throw new Error(`Invalid folder structure in ${currentPath}, expected 1 image file, got ${imageFiles.length}`);
        }

        if (!hasSubDirs && hasSingleImageFile) {
            const imageFile = imageFiles[0];
            const imageName = imageFile.name;
            result.push({ pathSegments: [...pathSegments], files: [], imageName });
        } else {
            subDirs.forEach((subDir) => {
                const subDirName = path.basename(subDir);
                traverse(subDir, [...pathSegments, subDirName]);
            });
        }
    }

    traverse(dir, []);
    return result;
}

const parsingStart = performance.now();
const leafFolders = findAndParseLeafFolders(DATA_FOLDER);
console.log(`Found ${leafFolders.length} leaf folders`);
const parsingEnd = performance.now();
console.log(`Parsing took ${parsingEnd - parsingStart} ms`);

// const foldersSet = new Set<string>(leafFolders.flatMap(folder => folder.pathSegments).flat());
// console.log(`Found ${foldersSet.size} unique folders`);

// const foldersArray = Array.from(leafFolders.flatMap(folder => folder.pathSegments).flat());
// console.log(`Found ${foldersArray.length} folders`);

// if (foldersSet.size !== foldersArray.length) {
//     throw new Error("Duplicate files in leaf folders");
// }

// const leafFoldersTranslit = Array.from(leafFolders.map((folder) => ({
//     ...folder,
//     pathSegments: folder.pathSegments.map((segment) => translitCyrillicToLatin(segment)),
// })));
// console.log(`Translited ${leafFolders.length} leaf folders`);

// const leafFoldersTranslitArray = leafFoldersTranslit.flatMap(folder => folder.pathSegments);
// console.log(`Found ${leafFoldersTranslitArray.length} translited folders`);

// if (leafFoldersTranslitArray.length !== leafFoldersTranslit.length) {
//     throw new Error("Duplicate files in leaf folders");
// }

const leafImagesLinks : Record<string, string> = {};

[leafFolders[0]].forEach(async (folder) => {
    try {
        const imageName = folder.imageName;
        const imagePath = path.join(DATA_FOLDER, folder.pathSegments.join("/"), imageName!);
        const parentFolderName = folder.pathSegments.at(-1);
        const translitedParentFolderName = translitCyrillicToLatin(parentFolderName!);
        const newimageName = `${translitedParentFolderName}.webp`;
        const translitedImagePath = path.join(DATA_FOLDER, folder.pathSegments.join("/"), newimageName);
        fs.copyFileSync(imagePath, translitedImagePath);
        const newImagePath = path.join(DATA_FOLDER, folder.pathSegments.join("/"), newimageName);
        console.log("newImagePath", newImagePath);
        const newImage = await cloudinary.uploader.upload(newImagePath, {
            folder: "kazmetalcord",
        });
        leafImagesLinks[parentFolderName!] = newImage.secure_url;
        console.log("leafImagesLinks", leafImagesLinks);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1)
    }
});
