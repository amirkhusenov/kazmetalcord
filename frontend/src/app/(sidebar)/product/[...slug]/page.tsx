import { ProductImageGallery } from "@/components/ProductImageGallery";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import contacts from "@/contacts.json";
import { ignoredFields } from "@/lib/const";
import { cn, getImageUrl, translitCyrillicToLatin } from "@/lib/utils";
import { getItemByTranslitTitle } from "@/server/db";
import { DbMetalItem } from "@/types";
import { MessageCircle, Phone } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

interface ProductPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

const PRODUCT_NAME_KEY = "Наименование";
const PRICE_FIELD_HINTS = ["цена", "стоимость", "price", "тенге", "₸", "kzt"];
const TAG_FIELD_PRIORITY = ["Марка", "Марка стали", "Размер", "Диаметр", "Толщина", "Длина", "Ширина", "Сечение", "ГОСТ"];
const TECHNICAL_FIELD_PATTERNS = ["imageurl", "image", "images", "photo", "изображ", "картинк", "фото"];

function isPriceField(field: string): boolean {
  const normalized = field.toLowerCase();
  return PRICE_FIELD_HINTS.some((hint) => normalized.includes(hint));
}

function isTechnicalField(field: string): boolean {
  const normalized = field.toLowerCase().replace(/\s+/g, "");
  return TECHNICAL_FIELD_PATTERNS.some((pattern) => normalized.includes(pattern));
}

function getProductPrice(product: DbMetalItem): string {
  for (const [field, value] of Object.entries(product)) {
    if (ignoredFields.includes(field) || typeof value !== "string" || value.trim().length === 0) {
      continue;
    }

    if (isPriceField(field)) {
      return value.trim();
    }
  }

  return "Цена по запросу";
}

function hasProductPrice(product: DbMetalItem): boolean {
  for (const [field, value] of Object.entries(product)) {
    if (ignoredFields.includes(field) || typeof value !== "string" || value.trim().length === 0) {
      continue;
    }

    if (isPriceField(field)) {
      return true;
    }
  }

  return false;
}

function getProductTags(product: DbMetalItem, max = 4): Array<{ field: string; value: string }> {
  const tags: Array<{ field: string; value: string }> = [];
  const used = new Set<string>();

  for (const field of TAG_FIELD_PRIORITY) {
    const value = product[field];
    if (typeof value === "string" && value.trim().length > 0) {
      tags.push({ field, value: value.trim() });
      used.add(field);
      if (tags.length >= max) {
        return tags;
      }
    }
  }

  for (const [field, value] of Object.entries(product)) {
    if (tags.length >= max) {
      break;
    }

    if (
      used.has(field) ||
      ignoredFields.includes(field) ||
      isPriceField(field) ||
      isTechnicalField(field) ||
      typeof value !== "string" ||
      value.trim().length === 0
    ) {
      continue;
    }

    tags.push({ field, value: value.trim() });
    used.add(field);
  }

  return tags;
}

function parseImagesFromField(value: string): string[] {
  const normalizeImagePath = (image: string) => {
    if (/^https?:\/\//i.test(image) || image.startsWith("/")) {
      return image;
    }

    return `/${image}`;
  };

  return value
    .split(/[\n,;|]/g)
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && /(\.webp|\.jpg|\.jpeg|\.png|^https?:\/\/|^\/)/i.test(item))
    .map(normalizeImagePath);
}

function getProductGalleryImages(product: DbMetalItem): string[] {
  const gallery: string[] = [];
  const pushUnique = (image: string) => {
    if (image && !gallery.includes(image)) {
      gallery.push(image);
    }
  };

  pushUnique(getImageUrl(product.translitCategoryPath));

  for (let i = product.translitCategoryPath.length - 1; i >= 1 && gallery.length < 5; i--) {
    pushUnique(getImageUrl(product.translitCategoryPath.slice(0, i)));
  }

  const imageFields = ["Фото", "Изображение", "Картинка", "photo", "image", "images", "imageUrl"];
  for (const field of imageFields) {
    const value = product[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      continue;
    }

    for (const parsed of parseImagesFromField(value)) {
      pushUnique(parsed);
      if (gallery.length >= 6) {
        break;
      }
    }
  }

  if (gallery.length === 0) {
    pushUnique("/placeholder-product.webp");
  }

  return gallery.slice(0, 6);
}

function getProductDescription(product: DbMetalItem): string {
  const productName = product[PRODUCT_NAME_KEY];
  return `Компания KazMetalCord поставляет ${productName} для строительных, производственных и проектных задач. Работаем с B2B-заявками, формируем коммерческое предложение, согласовываем сроки и сопровождаем поставку документально.`;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const productSlug = (await params).slug.at(0);
  const product = productSlug ? await getItemByTranslitTitle(productSlug) : null;

  if (!product) {
    return {
      title: "Товар не найден | Казахстанский металл",
      description: "Запрошенный товар не найден",
    };
  }

  return {
    title: `${product[PRODUCT_NAME_KEY].substring(0, 60)} | Казахстанский металл`,
    description: `Купить ${product[PRODUCT_NAME_KEY]} в Казахстане с подбором параметров и сопровождением поставки.`,
  };
}

export default async function ProductPage(props: ProductPageProps) {
  const productSlug = (await props.params).slug.at(0);

  if (!productSlug) {
    notFound();
  }

  const product = await getItemByTranslitTitle(productSlug);

  if (!product) {
    notFound();
  }

  const productName = product[PRODUCT_NAME_KEY];
  const price = getProductPrice(product);
  const hasPrice = hasProductPrice(product);
  const tags = getProductTags(product);
  const galleryImages = getProductGalleryImages(product);
  const productSpecs = Object.entries(product)
    .filter(
      ([field, value]) =>
        !ignoredFields.includes(field) &&
        !isPriceField(field) &&
        !isTechnicalField(field) &&
        typeof value === "string" &&
        value.trim().length > 0,
    )
    .slice(0, 12);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <Breadcrumb>
          <BreadcrumbList className="flex-wrap gap-y-1">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/category">Каталог</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {product.categoryPath.map((category, index) => (
              <React.Fragment key={`${category}-${index}`}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/category/${product.categoryPath.slice(0, index + 1).map(translitCyrillicToLatin).join("/")}`}>{category}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            ))}

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[280px] truncate">{productName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-4 grid grid-cols-1 gap-6 xl:grid-cols-[0.96fr_1.04fr]">
          <ProductImageGallery images={galleryImages} alt={productName} />

          <div className="space-y-4 xl:pr-1">
            <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">{productName}</h1>

            <div className="text-xl font-semibold text-blue5 sm:text-2xl">{price}</div>

            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <span key={`${tag.field}-${tag.value}`} className="inline-flex rounded-md border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {tag.field}: {tag.value}
                  </span>
                ))
              ) : (
                <span className="inline-flex rounded-md border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">Характеристики по запросу</span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button className={cn("bg-blue5 text-white hover:bg-blue4", hasPrice && "hidden")} asChild>
                <Link target="_blank" href={contacts.phone.link}>
                  <Phone className="mr-1.5 h-4 w-4" /> Запросить цену
                </Link>
              </Button>
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50" asChild>
                <Link target="_blank" href={contacts.phone.whatsapp}>
                  <MessageCircle className="mr-1.5 h-4 w-4" /> Написать в WhatsApp
                </Link>
              </Button>
            </div>

            <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{getProductDescription(product)}</p>

            {productSpecs.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
                {productSpecs.slice(0, 6).map(([field, value]) => (
                  <div key={field} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{field}</div>
                    <div className={cn("mt-1 text-sm font-medium text-slate-800", String(value).length > 64 && "leading-snug")}>{value}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

    </div>
  );
}
