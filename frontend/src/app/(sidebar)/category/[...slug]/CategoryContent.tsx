"use client";

import tree from "@/category-tree.json";
import { CategoryCard } from "@/components/CategoryCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import contacts from "@/contacts.json";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import { ignoredFields } from "@/lib/const";
import { getSecondLevelCategoryImage } from "@/lib/images";
import { cn, getImageUrl, translitCyrillicToLatin } from "@/lib/utils";
import { getCategoryFieldValues, getItems } from "@/server/db";
import { Category, DbMetalItem } from "@/types";
import { CheckCircle2, Filter, MessageCircle, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const PRODUCT_NAME_KEY = "Наименование";
const ALL_FILTER_VALUE = "__all__";
const PRICE_FIELD_HINTS = ["цена", "стоимость", "price", "тенге", "₸", "kzt"];
const TAG_FIELD_PRIORITY = [
  "Марка",
  "Марка стали",
  "Размер",
  "Диаметр",
  "Толщина",
  "Длина",
  "Ширина",
  "Сечение",
  "ГОСТ",
];

function Loader() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-blue4" />
    </div>
  );
}

function getIsLeafCategory(category: Category): boolean {
  return category.s?.length === 0;
}

function getTopDescription(categoryTitle: string, isLeafLevel: boolean): string {
  if (isLeafLevel) {
    return `В разделе «${categoryTitle}» собраны товарные позиции для закупки под технические требования проекта: можно быстро отфильтровать номенклатуру и отправить запрос на расчет цены и сроков.`;
  }

  return `Категория «${categoryTitle}» объединяет основные направления ассортимента для производственных и строительных задач. Выберите нужный подраздел, чтобы перейти к конкретным позициям и коммерческому расчету.`;
}

function isPriceField(field: string): boolean {
  const normalized = field.toLowerCase();
  return PRICE_FIELD_HINTS.some((hint) => normalized.includes(hint));
}

function getItemPrice(item: DbMetalItem): string | null {
  const entries = Object.entries(item).reduce<Array<[string, string]>>((acc, [key, value]) => {
    if (!ignoredFields.includes(key) && typeof value === "string") {
      acc.push([key, value]);
    }
    return acc;
  }, []);

  const prioritized = entries.find(([field, value]) => isPriceField(field) && value.trim().length > 0);
  if (prioritized) {
    return prioritized[1].trim();
  }

  return null;
}

function getPrimaryTag(item: DbMetalItem, fields: string[]): { field: string; value: string } | null {
  const prioritizedFields = [...TAG_FIELD_PRIORITY, ...fields];
  const used = new Set<string>();

  for (const field of prioritizedFields) {
    if (used.has(field) || isPriceField(field)) {
      continue;
    }
    used.add(field);

    const value = item[field];
    if (typeof value === "string" && value.trim().length > 0) {
      return { field, value: value.trim() };
    }
  }

  for (const [field, value] of Object.entries(item)) {
    if (ignoredFields.includes(field) || isPriceField(field) || typeof value !== "string" || value.trim().length === 0) {
      continue;
    }
    return { field, value: value.trim() };
  }

  return null;
}

export default function CategoryContent() {
  const categories = useGlobalStore((state) => state.categories);

  const [items, setItems] = useState<DbMetalItem[] | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState<Record<string, string[]>>({});
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page") || "1");
  const categoryKey = categories.join("||");

  const foundCategories: Category[] = useMemo(() => {
    return categories.reduce((acc, cur) => {
      if (!acc) {
        return [];
      }

      const found = acc.find((a) => a.n.normalize("NFC") === cur.normalize("NFC"));
      if (found) {
        return found.s || [];
      }
      return [];
    }, tree as Category[]);
  }, [categories]);

  const allFields: string[] = useMemo(() => {
    const fieldSet = new Set<string>();

    items?.forEach((item) => {
      Object.keys(item).forEach((key) => {
        fieldSet.add(key);
      });
    });

    for (const field of ignoredFields) {
      fieldSet.delete(field);
    }

    return Array.from(fieldSet);
  }, [items]);

  useEffect(() => {
    setSelectedFilters((prev) => (Object.keys(prev).length > 0 ? {} : prev));
    setFields((prev) => (Object.keys(prev).length > 0 ? {} : prev));
    setItems((prev) => (prev ? null : prev));
    setTotalPages((prev) => (prev !== 1 ? 1 : prev));
    setTotalItems((prev) => (prev !== 0 ? 0 : prev));
  }, [categoryKey]);

  useEffect(() => {
    if (foundCategories.length !== 0) {
      return;
    }

    const fetchFieldValues = async () => {
      const translitCategoryPath = categories.map(translitCyrillicToLatin).join("_");
      const fieldValues = await getCategoryFieldValues(translitCategoryPath);
      if (fieldValues) {
        setFields(fieldValues.entries);
      }
    };

    void fetchFieldValues();
  }, [categories, foundCategories.length]);

  useEffect(() => {
    if (foundCategories.length !== 0) {
      setItems((prev) => (prev ? null : prev));
      setTotalItems((prev) => (prev !== 0 ? 0 : prev));
      setIsLoading((prev) => (prev ? false : prev));
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const fetchItems = async () => {
      try {
        const filteredFields = Object.keys(selectedFilters).reduce((acc, key) => {
          if (selectedFilters[key]) {
            acc[key] = selectedFilters[key];
          }
          return acc;
        }, {} as Record<string, string>);

        const response = await getItems({
          categories,
          page,
          fields: filteredFields,
        });

        if (!isMounted) {
          return;
        }

        setItems(response.items);
        setTotalPages(response.totalPages);
        setTotalItems(response.totalItems);
        setIsLoading((prev) => (prev ? false : prev));
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching items:", error);
          setIsLoading((prev) => (prev ? false : prev));
        }
      }
    };

    void fetchItems();

    return () => {
      isMounted = false;
    };
  }, [categories, foundCategories.length, page, selectedFilters]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (field: string, value: string) => {
    setSelectedFilters((prev) => {
      if (!value || value === ALL_FILTER_VALUE) {
        if (!(field in prev)) {
          return prev;
        }

        const next = { ...prev };
        delete next[field];
        return next;
      }

      if (prev[field] === value) {
        return prev;
      }

      const next = { ...prev, [field]: value };
      return next;
    });

    if (page !== 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  const clearAllFilters = () => {
    setSelectedFilters((prev) => (Object.keys(prev).length > 0 ? {} : prev));
    if (page !== 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  const activeFiltersCount = Object.keys(selectedFilters).length;

  const renderPagination = () => {
    if (totalPages <= 1) {
      return null;
    }

    const pageItems = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pageItems.push(
        <PaginationItem key="first">
          <PaginationLink
            isActive={page === 1}
            onClick={() => handlePageChange(1)}
            className={page === 1 ? "border-blue5 bg-blue5 text-white hover:bg-blue5" : ""}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );

      if (startPage > 2) {
        pageItems.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis className="text-slate-500" />
          </PaginationItem>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageItems.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={page === i}
            onClick={() => handlePageChange(i)}
            className={page === i ? "border-blue5 bg-blue5 text-white hover:bg-blue5" : ""}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageItems.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis className="text-slate-500" />
          </PaginationItem>,
        );
      }

      pageItems.push(
        <PaginationItem key="last">
          <PaginationLink
            isActive={page === totalPages}
            onClick={() => handlePageChange(totalPages)}
            className={page === totalPages ? "border-blue5 bg-blue5 text-white hover:bg-blue5" : ""}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return (
      <Pagination className="my-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => page > 1 && handlePageChange(page - 1)}
              className={cn(page <= 1 ? "pointer-events-none opacity-40" : "", "text-slate-600 hover:text-slate-900")}
            />
          </PaginationItem>
          {pageItems}
          <PaginationItem>
            <PaginationNext
              onClick={() => page < totalPages && handlePageChange(page + 1)}
              className={cn(page >= totalPages ? "pointer-events-none opacity-40" : "", "text-slate-600 hover:text-slate-900")}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const renderFilters = () => {
    if (!fields || Object.keys(fields).length === 0) {
      return null;
    }

    return (
      <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4.5 w-4.5 text-slate-500" />
          <h2 className="text-base font-semibold text-slate-900">Параметры подбора</h2>
          {activeFiltersCount > 0 ? (
            <Button variant="outline" size="sm" onClick={clearAllFilters} className="ml-auto border-slate-300 text-slate-700 hover:bg-white">
              Сбросить фильтры
            </Button>
          ) : null}
        </div>

        {activeFiltersCount > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([field, value]) => (
              <Badge key={field} variant="secondary" className="border border-slate-300 bg-white text-slate-700">
                {field}: {value}
                <button onClick={() => handleFilterChange(field, ALL_FILTER_VALUE)} className="ml-1.5 text-slate-500 transition-colors hover:text-red-600">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Object.entries(fields)
            .filter(([key]) => key !== "_id")
            .map(([field, values]) => (
              <Select
                key={field}
                value={selectedFilters[field] && values.includes(selectedFilters[field]) ? selectedFilters[field] : ALL_FILTER_VALUE}
                onValueChange={(value) => handleFilterChange(field, value)}
              >
                <SelectTrigger className="w-full border-slate-300 bg-white text-slate-700 focus:ring-blue5">
                  <SelectValue placeholder={field} />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[220px]">
                    <SelectItem value={ALL_FILTER_VALUE}>Все</SelectItem>
                    {values.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            ))}
        </div>
      </section>
    );
  };

  if (!categories.length) {
    return <Loader />;
  }

  const isLeafLevel = foundCategories.length === 0;
  const categoryTitle = categories.at(-1) || "Каталог";
  const topDescription = getTopDescription(categoryTitle, isLeafLevel);

  const heroPoints = [
    "Понятная структура разделов и вложенных категорий",
    "Фильтры включаются только на этапе просмотра товаров",
    "Быстрый переход к заявке и консультации менеджера",
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Каталог продукции</p>
          <h1 className="mt-2 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">{categoryTitle}</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{topDescription}</p>
        </div>

        <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-3">
          {heroPoints.map((point) => (
            <li key={point} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue5" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {isLeafLevel ? renderFilters() : null}

      {isLeafLevel ? (
        isLoading ? (
          <Loader />
        ) : items && items.length > 0 ? (
          <>
            <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="text-sm font-medium text-slate-700">
                  Найдено позиций: <span className="font-semibold text-slate-900">{totalItems}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  {activeFiltersCount > 0 ? <span>Активных фильтров: {activeFiltersCount}</span> : null}
                  <span>
                    Страница {page} из {Math.max(totalPages, 1)}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item, index) => {
                  const name = item[PRODUCT_NAME_KEY];
                  const productLink = `/product/${translitCyrillicToLatin(name)}`;
                  const productImage = getImageUrl(item.translitCategoryPath);
                  const price = getItemPrice(item);
                  const tag = getPrimaryTag(item, allFields);

                  return (
                    <article key={`${name}-${index}`} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <Link href={productLink} prefetch={false} className="relative block h-44 border-b border-slate-200 bg-slate-100">
                        <Image
                          src={productImage}
                          alt={name}
                          fill
                          quality={90}
                          sizes="(min-width: 1280px) 30vw, (min-width: 640px) 48vw, 100vw"
                          className="object-cover object-center"
                        />
                      </Link>

                      <div className="space-y-3 p-4">
                        <Link href={productLink} prefetch={false} className="line-clamp-2 text-base font-semibold leading-snug text-slate-900 hover:text-blue5">
                          {name}
                        </Link>

                        <div className="text-sm font-semibold text-slate-900">{price || "Цена по запросу"}</div>

                        <Badge variant="secondary" className="w-fit border border-slate-300 bg-slate-50 text-slate-700">
                          {tag ? `${tag.field}: ${tag.value}` : "Характеристики по запросу"}
                        </Badge>

                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" className="h-8 bg-blue5 px-3 text-xs font-semibold text-white hover:bg-blue4" asChild>
                            <Link target="_blank" href={contacts.phone.link}>
                              <Phone className="mr-1.5 h-3.5 w-3.5" /> Запросить цену
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 border-slate-300 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50" asChild>
                            <Link href={productLink} prefetch={false}>
                              Открыть товар
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
            {renderPagination()}
          </>
        ) : (
          <section className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-slate-900">По выбранным параметрам ничего не найдено</h2>
            <p className="mt-2 text-sm text-slate-600">Сбросьте часть фильтров или оставьте заявку менеджеру для ручного подбора.</p>
            <Button size="sm" className="mt-4 bg-blue5 text-white hover:bg-blue4" asChild>
              <Link target="_blank" href={contacts.phone.link}>
                <Phone className="mr-1.5 h-3.5 w-3.5" /> Связаться с менеджером
              </Link>
            </Button>
          </section>
        )
      ) : (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Подкатегории</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {foundCategories.map((category) => {
              const rootCategory = categories.at(0);
              const previewImage =
                categories.length === 1
                  ? getSecondLevelCategoryImage([...categories, category.n])
                  : getSecondLevelCategoryImage([rootCategory || ""]);

              const leafImage = getIsLeafCategory(category)
                ? getImageUrl([...categories, category.n].map(translitCyrillicToLatin))
                : null;

              return (
                <CategoryCard
                  key={category.n}
                  name={category.n}
                  image={leafImage || previewImage}
                  variant="reference"
                  className="h-full min-h-[200px]"
                  link={`/category/${[...categories, category.n].map(translitCyrillicToLatin).join("/")}`}
                />
              );
            })}
          </div>
        </section>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Нужна помощь с подбором?</h2>
            <p className="mt-1 text-sm text-slate-600">Отправьте задачу менеджеру и получите подборку позиций под ваш проект.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="bg-blue5 text-white hover:bg-blue4" asChild>
              <Link target="_blank" href={contacts.phone.link}>
                <Phone className="mr-1.5 h-4 w-4" /> Оставить запрос
              </Link>
            </Button>
            <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50" asChild>
              <Link target="_blank" href={contacts.phone.whatsapp}>
                <MessageCircle className="mr-1.5 h-4 w-4" /> Написать в WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
