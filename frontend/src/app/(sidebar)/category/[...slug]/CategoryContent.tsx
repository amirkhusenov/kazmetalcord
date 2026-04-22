"use client";

import tree from "@/category-tree.json";
import { CategoryCard } from "@/components/CategoryCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

type SeoFaqItem = {
  q: string;
  a: string;
};

type CategorySeoContent = {
  eyebrow: string;
  title: string;
  intro: string;
  characteristicsTitle: string;
  characteristicsIntro: string;
  characteristics: string[];
  productionTitle: string;
  productionText: string;
  classificationTitle: string;
  classification: string[];
  applicationsTitle: string;
  applications: string[];
  faqTitle: string;
  faq: SeoFaqItem[];
};

const STAINLESS_CHARACTERISTICS = [
  "Коррозионная стойкость, включая контакт с химически агрессивными средами и морской водой.",
  "Стабильность при высоких и низких температурах (жаропрочные и жаростойкие марки).",
  "Хорошая свариваемость и пластичность для производственных задач.",
  "Высокая механическая прочность и долговечность в эксплуатации.",
];

const STAINLESS_CLASSIFICATION = [
  "Листовой (плоский): листы, полосы и ленты, поставка в листах или рулонах.",
  "Сортовой: полнотелый прокат разного сечения (круг, квадрат, шестигранник, уголок, швеллер и др.).",
  "Трубный: полые изделия круглого и профильного сечения (квадратного, прямоугольного, овального и др.).",
];

const STAINLESS_APPLICATIONS = [
  "Строительство: прочные и долговечные каркасные конструкции, облицовка и отделка.",
  "Коммунальное хозяйство: трубы, запорная арматура и сопутствующие элементы.",
  "Нефтегазовая и химическая отрасль: трубопроводы и оборудование для агрессивных сред.",
  "Машиностроение и промышленность: детали, метизы, элементы обшивки, оборудование и конвейерные линии.",
  "Пищевая отрасль: емкости для хранения продукции и кухонная посуда (листовой и трубный прокат).",
];

const STAINLESS_FAQ = [
  {
    q: "Какие виды нержавеющего проката существуют?",
    a: "Наиболее востребованы листовой (плиты, полосы), сортовой (круг, квадрат, уголок, швеллер) и трубный (круглые и профильные трубы).",
  },
  {
    q: "Каковы основные свойства и преимущества нержавеющего проката?",
    a: "Ключевые преимущества: высокая коррозионная и химическая стойкость, температурная стабильность, прочность и длительный срок службы.",
  },
  {
    q: "Какие характеристики учитывать при покупке?",
    a: "Важно учитывать геометрию и размеры, марку стали, технологию производства (горячекатаный/холоднокатаный) и требования проекта к качеству поверхности.",
  },
  {
    q: "Как обслуживать нержавеющий прокат для дополнительной защиты от коррозии?",
    a: "Базовая коррозионная стойкость уже высокая. При необходимости применяют дополнительные защитные покрытия и корректный режим эксплуатации.",
  },
  {
    q: "Какие стандарты регулируют качество нержавеющего проката?",
    a: "Основные требования описаны в ГОСТ 5582-75, 2590-88, 5949-75, 4986-79 и профильных нормативных документах на конкретный вид проката.",
  },
];

const DEFAULT_CLASSIFICATION = [
  "Листовой сегмент: позиции для раскроя, производства и строительных задач.",
  "Сортовой сегмент: профили, прутки и другие форматы для проектных поставок.",
  "Трубный и фасонный сегмент: решения для инженерных систем и промышленной инфраструктуры.",
];

const DEFAULT_APPLICATIONS = [
  "Строительство и девелопмент: каркасы, перекрытия, инженерные сети и металлоконструкции.",
  "Производственные предприятия: комплектующие и сырье для серийного выпуска продукции.",
  "Сервисные компании и монтажные подрядчики: закрытие задач по регулярным закупкам.",
  "Инфраструктурные проекты: поставки для объектов с фиксированными сроками и спецификациями.",
];

function buildDefaultFaq(categoryTitle: string): SeoFaqItem[] {
  return [
    {
      q: `Как заказать ${categoryTitle.toLowerCase()}?`,
      a: "Отправьте заявку с номенклатурой и объемом. Менеджер подготовит расчет, проверит наличие и согласует условия поставки.",
    },
    {
      q: "Можно ли получить документы для бухгалтерии и тендера?",
      a: "Да, сопровождаем поставки комплектом закрывающих документов и работаем в B2B-формате с проектными заказами.",
    },
    {
      q: "Как быстро можно отгрузить продукцию?",
      a: "Срок зависит от позиции и объема. По складским товарам даем быстрый старт отгрузки, по редким позициям согласуем график отдельно.",
    },
  ];
}

function buildDefaultSeoContent(categoryTitle: string): CategorySeoContent {
  return {
    eyebrow: "Категория",
    title: `${categoryTitle} в Казахстане`,
    intro: `Раздел «${categoryTitle}» сформирован как рабочий B2B-каталог для подбора позиций по параметрам, сравнения номенклатуры и быстрого перехода к заявке. Мы помогаем закрывать задачи снабжения для производства, строительства и сервисных компаний.`,
    characteristicsTitle: "Что важно при подборе",
    characteristicsIntro:
      "При выборе позиции в каталоге учитывайте марку, размеры, требования по стандартам, сроки поставки и формат документов под ваш проект.",
    characteristics: [
      "Работаем с оптовыми и проектными поставками по Казахстану.",
      "Согласовываем условия отгрузки под график вашего объекта или производства.",
      "Помогаем подобрать альтернативные позиции при ограничениях по срокам.",
      "Держим акцент на понятной структуре каталога и быстрых коммуникациях с менеджером.",
    ],
    productionTitle: "Формат поставки",
    productionText:
      "Поставляем продукцию со складских остатков и под заказ. Согласуем логистику, комплект документов и коммерческие условия под задачи отдела закупок.",
    classificationTitle: "Структура раздела",
    classification: DEFAULT_CLASSIFICATION,
    applicationsTitle: "Где применяется",
    applications: DEFAULT_APPLICATIONS,
    faqTitle: "FAQ: Часто задаваемые вопросы",
    faq: buildDefaultFaq(categoryTitle),
  };
}

const STAINLESS_SEO_CONTENT: CategorySeoContent = {
  eyebrow: "Экспертный обзор",
  title: "Нержавеющий прокат в Казахстане",
  intro:
    "Нержавеющий металлопрокат включает широкий перечень продукции из коррозионностойких марок стали. Базово в составе таких сталей содержится не менее 10,5% хрома и не более 1,2% углерода, что обеспечивает стабильные эксплуатационные характеристики в промышленной среде.",
  characteristicsTitle: "Характеристики нержавеющей стали",
  characteristicsIntro:
    "Для изготовления нержавеющего проката применяются марки стали по ГОСТ 5632-2014. Для легирования, помимо хрома, используют никель, марганец, кремний и другие элементы.",
  characteristics: STAINLESS_CHARACTERISTICS,
  productionTitle: "Технологии производства",
  productionText:
    "Чаще всего применяют горячую и холодную прокатку. Горячекатаный прокат обычно экономичнее, а холоднокатаный обеспечивает более высокую точность, прочность и качество поверхности.",
  classificationTitle: "Классификация",
  classification: STAINLESS_CLASSIFICATION,
  applicationsTitle: "Область применения",
  applications: STAINLESS_APPLICATIONS,
  faqTitle: "FAQ: Часто задаваемые вопросы",
  faq: STAINLESS_FAQ,
};

const CAST_IRON_SEO_CONTENT: CategorySeoContent = {
  eyebrow: "Категория",
  title: "Чугунный прокат в Казахстане",
  intro:
    "Компания KazMetalCord поставляет чугунный прокат по Казахстану с отгрузкой со склада в Алматы и других филиалов. Раздел собран как рабочий каталог для B2B-закупок: можно быстро выбрать нужные позиции, уточнить актуальную стоимость и получить сопровождение менеджера.",
  characteristicsTitle: "Преимущества раздела",
  characteristicsIntro:
    "Структура каталога помогает быстро перейти от категории к конкретным позициям и отправить запрос на расчет без лишних шагов.",
  characteristics: [
    "Поставка по регионам Казахстана с согласованием логистики под проект.",
    "Актуализация наличия и стоимости по запросу менеджеру.",
    "Сопровождение по документам для корпоративных закупок.",
    "Поддержка по подбору аналогов и уточнению технических параметров.",
  ],
  productionTitle: "Условия поставки",
  productionText:
    "Для заказа доступны позиции со склада и под согласованный график поставки. Менеджер помогает собрать заявку, подтвердить условия отгрузки и сформировать коммерческое предложение.",
  classificationTitle: "Основные группы продукции",
  classification: [
    "Чугунные трубы, фитинги и элементы инженерных систем.",
    "Чугунная арматура, задвижки и запорные компоненты.",
    "Литые чугунные изделия для промышленного и коммунального применения.",
  ],
  applicationsTitle: "Сферы применения",
  applications: [
    "Городская и промышленная инфраструктура.",
    "Системы водоснабжения, канализации и тепловых сетей.",
    "Производственные площадки и объекты капитального строительства.",
  ],
  faqTitle: "FAQ: Часто задаваемые вопросы",
  faq: [
    {
      q: "Есть ли доставка чугунного проката по Казахстану?",
      a: "Да, организуем доставку в нужный регион и согласуем формат отгрузки под график объекта.",
    },
    {
      q: "Можно ли уточнить актуальную цену перед заказом?",
      a: "Да, стоимость подтверждается менеджером по заявке с учетом номенклатуры, объема и сроков поставки.",
    },
    {
      q: "Предоставляете ли документы для B2B-закупок?",
      a: "Да, поставки сопровождаются необходимыми закрывающими и сопроводительными документами.",
    },
  ],
};

const CATEGORY_SEO_BY_SLUG: Record<string, CategorySeoContent> = {
  chugunnyyj_prokat: CAST_IRON_SEO_CONTENT,
  nyerzhavyeyushchij_prokat: STAINLESS_SEO_CONTENT,
};

function resolveCategorySeoContent(categoryPath: string[]): CategorySeoContent {
  const categoryTitle = categoryPath.at(-1) || "Каталог";
  const rootCategoryTitle = categoryPath.at(0) || categoryTitle;
  const categorySlug = translitCyrillicToLatin(categoryTitle).toLowerCase();
  const rootSlug = translitCyrillicToLatin(rootCategoryTitle).toLowerCase();
  return CATEGORY_SEO_BY_SLUG[categorySlug] || CATEGORY_SEO_BY_SLUG[rootSlug] || buildDefaultSeoContent(categoryTitle);
}

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
    return `В разделе «${categoryTitle}» собраны товарные позиции с основными параметрами для подбора.`;
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
              <div key={field} className="space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{field}</p>
                <Select
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
              </div>
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
  const categorySeoContent = resolveCategorySeoContent(categories);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Каталог продукции</p>
          <h1 className="mt-2 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">{categoryTitle}</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{topDescription}</p>
        </div>
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
                  const productSlug = item.translitTitle?.trim() || translitCyrillicToLatin(name);
                  const productLink = `/product/${encodeURIComponent(productSlug)}`;
                  const productImage = getImageUrl(item.translitCategoryPath);
                  const price = getItemPrice(item);
                  const hasPrice = Boolean(price);
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
                          <Button size="sm" className={cn("h-8 bg-blue5 px-3 text-xs font-semibold text-white hover:bg-blue4", hasPrice && "hidden")} asChild>
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

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue4/75">{categorySeoContent.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">{categorySeoContent.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">{categorySeoContent.intro}</p>

            <h3 className="mt-6 text-base font-semibold text-slate-900 sm:text-lg">{categorySeoContent.characteristicsTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-base">{categorySeoContent.characteristicsIntro}</p>
            <ul className="mt-3 grid gap-2 text-sm text-slate-700">
              {categorySeoContent.characteristics.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 p-5 sm:p-6 lg:border-l lg:border-t-0">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-900">{categorySeoContent.productionTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{categorySeoContent.productionText}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-base font-semibold text-slate-900">{categorySeoContent.classificationTitle}</h3>
              <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-slate-700">
                {categorySeoContent.classification.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-base font-semibold text-slate-900">{categorySeoContent.applicationsTitle}</h3>
              <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-slate-700">
                {categorySeoContent.applications.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-white px-4 sm:px-5">
            <h3 className="pt-4 text-base font-semibold text-slate-900">{categorySeoContent.faqTitle}</h3>
            <Accordion type="single" collapsible className="pb-1">
              {categorySeoContent.faq.map((item, index) => (
                <AccordionItem key={item.q} value={`faq-${index}`} className="border-slate-200">
                  <AccordionTrigger className="py-3 text-sm text-slate-900 hover:no-underline">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-slate-600">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

    </div>
  );
}
