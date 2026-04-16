import { Collection, MongoClient } from "mongodb";
import { CategoryFieldValues, EnhancedMetalItem } from "./types";
import { parsedEnv } from "./parsedEnv";

const DATABASE_NAME = "metal_db";
const COLLECTION_NAME = "metal_collection";
const COLLECTION_NAME_CATEGORY_FIELD_VALUES = "category_field_values";
const BATCH_SIZE = 10000;

const client = new MongoClient(parsedEnv.MONGODB_URI, { maxPoolSize: 10 });

async function connectToDatabase(): Promise<{
    metalCollection: Collection<EnhancedMetalItem>;
    categoryFieldValuesCollection: Collection<CategoryFieldValues>;
}> {
    const connectionStart = performance.now();
    await client.connect();
    const connectionEnd = performance.now();
    console.log(`Connected to MongoDB in ${connectionEnd - connectionStart} ms`);
    return {
        metalCollection: client.db(DATABASE_NAME).collection(COLLECTION_NAME),
        categoryFieldValuesCollection: client.db(DATABASE_NAME).collection(COLLECTION_NAME_CATEGORY_FIELD_VALUES),
    }
}

export async function insertJsonFiles(metal: EnhancedMetalItem[]) {
    if (!metal || metal.length === 0) {
        console.log("No data provided for insertion.");
        return;
    }

    const { metalCollection: collection } = await connectToDatabase();

    const dropStart = performance.now();
    await collection.drop();
    const dropEnd = performance.now();
    console.log(`Dropped collection in ${dropEnd - dropStart} ms`);

    console.log(`Starting bulk insertion of ${metal.length} documents...`);

    const insertionStart = performance.now();
    for (let i = 0; i < metal.length; i += BATCH_SIZE) {
        const batch = metal.slice(i, i + BATCH_SIZE);

        try {
            await collection.insertMany(batch, { ordered: false });
            console.log(`Inserted batch ${i / BATCH_SIZE + 1} (${batch.length} items)`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Batch insert failed at index ${i}: ${errorMessage}`);
        }
    }
    const insertionEnd = performance.now();
    console.log(`Insertion took ${insertionEnd - insertionStart} ms`);

    const indexStart = performance.now();
    await collection.createIndex({ "Наименование": 1 });
    await collection.createIndex({ categoryPath: 1 });
    await collection.createIndex({ "translitTitle": 1 });
    const indexEnd = performance.now();
    console.log(`Created indexes in ${indexEnd - indexStart} ms`);

    await client.close();

    console.log("Finished inserting all JSON objects.");
}

export async function insertCategoryFieldValues(categoryFieldValues: CategoryFieldValues[]) {
    if (!categoryFieldValues || categoryFieldValues.length === 0) {
        console.log("No data provided for insertion.");
        return;
    }

    const { categoryFieldValuesCollection } = await connectToDatabase();

    const dropStart = performance.now();
    await categoryFieldValuesCollection.drop();
    const dropEnd = performance.now();
    console.log(`Dropped collection in ${dropEnd - dropStart} ms`);

    console.log(`Starting bulk insertion of ${categoryFieldValues.length} documents...`);

    const insertionStart = performance.now();
    for (let i = 0; i < categoryFieldValues.length; i += BATCH_SIZE) {
        const batch = categoryFieldValues.slice(i, i + BATCH_SIZE);

        try {
            await categoryFieldValuesCollection.insertMany(batch, { ordered: false });
            console.log(`Inserted batch ${i / BATCH_SIZE + 1} (${batch.length} items)`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Batch insert failed at index ${i}: ${errorMessage}`);
        }
    }
    const insertionEnd = performance.now();
    console.log(`Insertion took ${insertionEnd - insertionStart} ms`);

    const indexStart = performance.now();
    await categoryFieldValuesCollection.createIndex({ categoryPathMerged: 1 });
    const indexEnd = performance.now();
    console.log(`Created indexes in ${indexEnd - indexStart} ms`);

    await client.close();

    console.log("Finished inserting all JSON objects.");
}
