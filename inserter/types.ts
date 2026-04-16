import { z } from 'zod';

export const MetalItemSchema = z.object({
    "Наименование": z.string(),
}).catchall(z.string());

export type MetalItem = z.infer<typeof MetalItemSchema>;

export const EnhancedMetalItemSchema = MetalItemSchema.extend({
    "translitTitle": z.string(),
    categoryPath: z.array(z.string()),
    "translitCategoryPath": z.array(z.string()),
});

export type EnhancedMetalItem = z.infer<typeof EnhancedMetalItemSchema>;

export type ParsedLeafFolder = {
    pathSegments: string[];
    imageName?: string;
    files: { filename: string; content: MetalItem[] }[];
};

export const CategoryFieldValuesSchema = z.object({
    categoryPathMerged: z.string(),
    entries: z.record(z.string(), z.array(z.string())),
});
export type CategoryFieldValues = z.infer<typeof CategoryFieldValuesSchema>;

export interface Category {
    // name
    n: string;
    // subcategories
    s?: Category[];
}
