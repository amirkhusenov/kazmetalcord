"use server";

import { getMissingEnvVars } from "@/lib/parsedEnv";
import { lokiService } from "@/lib/loggingService";
import { connectToDatabase } from "@/server/connection";
import { CategoryFieldValues, CategoryFieldValuesSchema, DbMetalItem, DbMetalItemsSchema } from "@/types";
import { type Filter } from "mongodb";
import { cache } from "react";
import { z } from "zod";

const COLLECTION_NAME = "metal_collection";
const COLLECTION_NAME_CATEGORY_FIELD_VALUES = "category_field_values";
const PAGE_SIZE = 30;
const NAME_FIELD = "Наименование";
const MOCK_ITEMS: DbMetalItem[] = [
  {
    [NAME_FIELD]: "Тестовый лист A36 (демо)",
    translitTitle: "testovyy_list_a36_demo",
    categoryPath: ["Черный прокат", "Листовой прокат", "Низколегированный лист"],
    translitCategoryPath: ["Chyernyyj_prokat", "Listovoy_prokat", "Nizkolyegirovannyy_list"],
    Цена: "от 245 000 ₸ / т",
    Марка: "A36 / Ст3",
    Размер: "6x1500x6000 мм",
    ГОСТ: "ГОСТ 19903-2015",
    Наличие: "В наличии",
    Описание: "Тестовый товар для проверки карточки товара.",
  } as DbMetalItem,
];

interface IQuery {
  categories?: string[];
  name?: string;
  translitTitle?: string;
  page?: number;
  fields?: Record<string, string>;
  search?: string;
}

// Extending the return type to include totalItems for pagination
const ItemsWithPaginationSchema = z.object({
  items: DbMetalItemsSchema,
  totalItems: z.number(),
  totalPages: z.number(),
});

type ItemsWithPagination = z.infer<typeof ItemsWithPaginationSchema>;

function isMongoConfigured(): boolean {
  return getMissingEnvVars(["MONGODB_URI"]).length === 0;
}

function getItemsFromMock(query: IQuery): ItemsWithPagination {
  const { categories, name, translitTitle, fields = {}, page = 1, search } = query;
  let filtered = [...MOCK_ITEMS];

  if (categories && categories.length > 0) {
    filtered = filtered.filter((item) => categories.every((category) => item.categoryPath.includes(category)));
  }

  if (name) {
    const normalizedName = name.toLowerCase();
    filtered = filtered.filter((item) => item[NAME_FIELD].toLowerCase().startsWith(normalizedName));
  }

  if (search) {
    const normalizedSearch = search.toLowerCase();
    filtered = filtered.filter((item) => item[NAME_FIELD].toLowerCase().includes(normalizedSearch));
  }

  if (translitTitle) {
    const normalizedTranslitTitle = translitTitle.toLowerCase();
    filtered = filtered.filter((item) => item.translitTitle.toLowerCase().startsWith(normalizedTranslitTitle));
  }

  if (fields && Object.keys(fields).length > 0) {
    filtered = filtered.filter((item) =>
      Object.entries(fields).every(([key, value]) => {
        return item[key] === value;
      }),
    );
  }

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const safePage = Math.max(1, page);
  const skip = (safePage - 1) * PAGE_SIZE;
  const items = filtered.slice(skip, skip + PAGE_SIZE);

  return ItemsWithPaginationSchema.parse({
    items,
    totalItems,
    totalPages,
  });
}

function getFieldValuesFromMock(translitCategoryPath: string): CategoryFieldValues | null {
  const matched = MOCK_ITEMS.filter((item) => item.translitCategoryPath.join("_") === translitCategoryPath);

  if (matched.length === 0) {
    return null;
  }

  const entries: Record<string, string[]> = {};
  for (const item of matched) {
    for (const [key, value] of Object.entries(item)) {
      if (typeof value !== "string" || value.trim().length === 0 || key === NAME_FIELD || key === "translitTitle") {
        continue;
      }

      if (!entries[key]) {
        entries[key] = [];
      }

      if (!entries[key].includes(value)) {
        entries[key].push(value);
      }
    }
  }

  for (const key in entries) {
    entries[key].sort((a, b) => a.localeCompare(b));
  }

  return CategoryFieldValuesSchema.parse({
    categoryPathMerged: translitCategoryPath,
    entries,
  });
}

export const getCategoryFieldValues = cache(async (translitCategoryPath: string): Promise<CategoryFieldValues | null> => {
  if (!isMongoConfigured()) {
    return getFieldValuesFromMock(translitCategoryPath);
  }

  const { db } = await connectToDatabase();

  const valuesStart = Date.now();
  const values = await db.collection<CategoryFieldValues>(COLLECTION_NAME_CATEGORY_FIELD_VALUES).find({ categoryPathMerged: translitCategoryPath }).toArray();
  const valuesEnd = Date.now();
  lokiService.sendLog("getCategoryFieldValues", {
    duration: valuesEnd - valuesStart,
    length: values.length,
    translitCategoryPath,
  });

  if (values.length === 0) {
    console.error(`No values found for category ${translitCategoryPath}`);
    return null;
  }

  const parsed = CategoryFieldValuesSchema.parse(values[0]);

  for (const key in parsed.entries) {
    parsed.entries[key].sort((a, b) => {
      const isANumber = !isNaN(Number(a));
      const isBNumber = !isNaN(Number(b));

      if (isANumber && isBNumber) {
        return Number(a) - Number(b);
      }

      return a.localeCompare(b);
    });
  }

  return parsed;
});

export const getLatest3Items = cache(async (categories: string[]): Promise<DbMetalItem[]> => {
  if (!isMongoConfigured()) {
    return MOCK_ITEMS.filter((item) => categories.every((category) => item.categoryPath.includes(category))).slice(0, 3);
  }

  const { db } = await connectToDatabase();

  const itemsStart = Date.now();
  const items = await db.collection<DbMetalItem>(COLLECTION_NAME).find({ categoryPath: { $all: categories } }).sort({ _id: -1 }).limit(3).toArray();
  const itemsEnd = Date.now();
  lokiService.sendLog("getLatest3Items", {
    duration: itemsEnd - itemsStart,
    length: items.length,
    categories,
  });

  return items;
});

export const getItems = cache(async (query: IQuery): Promise<ItemsWithPagination> => {
  const demoItemRequested = Boolean(
    query.translitTitle &&
      MOCK_ITEMS.some((item) => item.translitTitle.toLowerCase().startsWith(query.translitTitle?.toLowerCase() || "")),
  );

  if (demoItemRequested || !isMongoConfigured()) {
    return getItemsFromMock(query);
  }

  const { db } = await connectToDatabase();

  const { categories, name, translitTitle, fields = {}, page = 1, search } = query;

  const filter: Filter<DbMetalItem> = {};

  if (categories && categories.length > 0) {
    filter.categoryPath = { $all: categories };
  }

  if (name) {
    filter["Наименование"] = { $regex: `^${name}`, $options: "i" };
  }

  if (search) {
    filter["Наименование"] = { $regex: search, $options: "i" };
  }

  if (translitTitle) {
    filter.translitTitle = { $regex: `^${translitTitle}` };
  }

  if (fields) {
    Object.entries(fields).forEach(([key, value]) => {
      filter[key] = value;
    });
  }

  const skip = (page - 1) * PAGE_SIZE;

  // First get the total count for pagination
  const totalItemsStart = Date.now();
  const totalItems = await db.collection<DbMetalItem>(COLLECTION_NAME).countDocuments(filter);
  const totalItemsEnd = Date.now();
  lokiService.sendLog("getItems", {
    duration: totalItemsEnd - totalItemsStart,
    length: totalItems,
    ...filter,
    skip,
    limit: PAGE_SIZE,
  });
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  // Then get the items for the current page
  const itemsStart = Date.now();
  const items = await db
    .collection<DbMetalItem>(COLLECTION_NAME)
    .find(filter, { projection: { _id: 0 } })
    .skip(skip)
    .limit(PAGE_SIZE)
    .toArray();
  const itemsEnd = Date.now();
  lokiService.sendLog("getItems", {
    duration: itemsEnd - itemsStart,
    length: items.length,
  });

  return ItemsWithPaginationSchema.parse({
    items: items,
    totalItems,
    totalPages,
  });
});
