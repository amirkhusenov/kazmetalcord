import tree from "@/category-tree.json";
import { CategoryCard } from "@/components/CategoryCard";
import { getSecondLevelCategoryImage } from "@/lib/images";
import { translitCyrillicToLatin } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Каталог товаров",
};

export default async function CategoryPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Каталог продукции</p>
        <h1 className="mt-2 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">Основные категории</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Выберите направление поставки, перейдите в нужный раздел и отфильтруйте позиции по техническим параметрам.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tree.map((t) => {
          const imageLink = getSecondLevelCategoryImage([t.n]);
          return (
            <CategoryCard
              name={t.n}
              image={imageLink}
              link={`/category/${[t.n].map(translitCyrillicToLatin).join("/")}`}
              variant="reference"
              className="h-full min-h-[200px]"
              key={t.n}
            />
          );
        })}
      </div>
    </div>
  );
}
