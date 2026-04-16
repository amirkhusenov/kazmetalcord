import { z } from "zod";
import tree from "@/category-tree.json";
import translits from "@/category-translit.json";

const BaseCategorySchema = z.object({
  n: z.string(),
});

export type Category = z.infer<typeof BaseCategorySchema> & {
  s?: Category[];
};

const CategorySchema: z.ZodType<Category> = BaseCategorySchema.extend({
  s: z.lazy(() => CategorySchema.array()).optional(),
});

const CategoryTreeSchema = z.array(CategorySchema);
const parseResult = CategoryTreeSchema.safeParse(tree);

if (!parseResult.success) {
  throw new Error(parseResult.error.errors.join("\n"));
}

const DbMetalItemSchema = z.object({
  "Наименование": z.string(),
  "translitTitle": z.string(),
  categoryPath: z.array(z.string()),
  translitCategoryPath: z.array(z.string()),
}).catchall(z.string());

export const DbMetalItemsSchema = z.array(DbMetalItemSchema);

export type DbMetalItem = z.infer<typeof DbMetalItemSchema>;

const parseTranslitResult = z.record(z.string()).safeParse(translits);

if (!parseTranslitResult.success) {
  throw new Error(parseTranslitResult.error.errors.join("\n"));
}

export const contactFormSchema = z.object({
  name: z.string(),
  phone: z.string(),
  items: z.array(DbMetalItemSchema),
  extraInfo: z.string().refine(val => val === '', {
    message: "This field should be empty",
  }),
});

export const CategoryFieldValuesSchema = z.object({
  categoryPathMerged: z.string(),
  entries: z.record(z.string(), z.array(z.string())),
});
export type CategoryFieldValues = z.infer<typeof CategoryFieldValuesSchema>;
