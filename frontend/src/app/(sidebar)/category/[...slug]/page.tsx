import { Metadata } from "next";
import CategoryContent from "./CategoryContent";
import translits from "@/category-translit.json";

const assertedTranslits = translits as Record<string, string | undefined>;

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const slug = (await params).slug.at(0);
  const categoryName = assertedTranslits[slug || ""] || "Каталог";

  const canonicalUrl = `https://kazmetalcord.kz/category/${(await params).slug.join("/")}`;

  return {
    title: `${categoryName} | Казахстанский металл`,
    description: `Каталог товаров категории ${categoryName} на сайте Казахстанский металл`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default function CategoryPage() {
  return <CategoryContent />;
}
