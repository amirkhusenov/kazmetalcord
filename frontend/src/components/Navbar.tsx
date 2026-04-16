"use client";

import tree from "@/category-tree.json";
import { ContactFormDialog } from "@/components/ContactFormDialog";
import { FullLogo } from "@/components/FullLogo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import contacts from "@/contacts.json";
import { cn, translitCyrillicToLatin } from "@/lib/utils";
import {
  Bolt,
  Cable,
  ChevronDown,
  ChevronRight,
  CircuitBoard,
  Construction,
  Factory,
  FlaskConical,
  Mail,
  Menu,
  Nut,
  Package,
  PaintBucket,
  Phone,
  Shield,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/about", label: "О компании" },
  { href: "/delivery", label: "Доставка" },
  { href: "/delivery#payment", label: "Оплата" },
  { href: "/contacts", label: "Контакты" },
];

type CatalogNode = {
  n: string;
  s?: CatalogNode[];
};

const catalogTree = tree as CatalogNode[];

const catalogOrder = [
  "Кабельная продукция",
  "Черный прокат",
  "Трубопроводная арматура",
  "Изоляция трубопроводов",
  "Метизная продукция",
  "Полимерные изделия",
  "Порошки",
  "Сварочные материалы",
  "Оборудование",
];

const categoryIcons: Record<string, LucideIcon> = {
  "Кабельная продукция": Cable,
  "Черный прокат": Construction,
  "Трубопроводная арматура": Factory,
  "Изоляция трубопроводов": Shield,
  "Метизная продукция": Nut,
  "Полимерные изделия": PaintBucket,
  Порошки: FlaskConical,
  "Сварочные материалы": Bolt,
  Оборудование: CircuitBoard,
};

const sortedCatalog = (() => {
  const map = new Map(catalogTree.map((item) => [item.n, item] as const));
  const ordered = catalogOrder.map((name) => map.get(name)).filter(Boolean) as CatalogNode[];
  const fallback = ordered.length > 0 ? ordered : catalogTree.slice(0, 9);
  return fallback.filter((item) => (item.s?.length || 0) > 0);
})();

function getCategoryHref(parts: string[]) {
  return `/category/${parts.filter(Boolean).map((part) => translitCyrillicToLatin(part)).join("/")}`;
}

export function Navbar() {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState("");

  const phoneText = contacts.phone.text.replace(/[()-]/g, "").replace(/\s+/g, " ");

  return (
    <>
      <header className="bg-[#eef1f5]/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-[#eef1f5]/90">
        <div className="w-full">
          <div className="hidden lg:block">
            <div className="flex h-[56px] items-center overflow-hidden bg-white shadow-[0_4px_14px_rgba(2,6,23,0.08)]">
              <button
                type="button"
                onClick={() => setIsCatalogOpen(true)}
                className="flex h-full w-14 shrink-0 items-center justify-center bg-[#0d1528] text-white transition hover:bg-[#111d35]"
                aria-label="Открыть каталог"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex min-w-0 flex-1 items-center justify-between px-4 xl:px-5">
                <div className="flex min-w-0 items-center gap-4 xl:gap-6">
                  <Link href="/" className="shrink-0">
                    <Image src="/KazMetalCord.svg" width={170} height={16} alt="KAZMETALCORD" priority />
                  </Link>
                  <div className="hidden text-[10px] font-medium leading-tight text-slate-500 xl:block">
                    <div>Металлопрокат и кабель</div>
                    <div>для промышленности</div>
                  </div>
                </div>

                <nav className="mx-5 flex items-center gap-6 text-[12.5px] font-semibold text-slate-600 xl:mx-8 xl:gap-8">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className="whitespace-nowrap transition-colors hover:text-blue5">
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="flex items-center gap-4 xl:gap-6">
                  <div className="space-y-1 text-[12px]">
                    <Link href={contacts.phone.link} className="flex items-center gap-1.5 font-semibold leading-none text-slate-700 transition-colors hover:text-blue5">
                      <Phone className="h-3.5 w-3.5 text-slate-500" />
                      {phoneText}
                    </Link>
                    <Link href={`mailto:${contacts.email.info}`} className="flex items-center gap-1.5 leading-none text-slate-600 transition-colors hover:text-blue5">
                      <Mail className="h-3.5 w-3.5 text-slate-500" />
                      {contacts.email.info}
                    </Link>
                  </div>
                  <Button
                    className="h-8 rounded-md bg-[#1e53ad] px-6 text-[12.5px] font-semibold text-white hover:bg-[#184796]"
                    onClick={() => setIsRequestDialogOpen(true)}
                  >
                    Оставить запрос
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="ml-auto flex h-[62px] items-center gap-2 px-3 lg:hidden">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl border-slate-300 text-blue5"
              onClick={() => setIsCatalogOpen(true)}
              aria-label="Открыть каталог"
            >
              <Package className="h-5 w-5" />
            </Button>

            <FullLogo className="flex shrink-0" />

            <div className="ml-auto flex items-center gap-2">

              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-300 text-blue5" aria-label="Открыть меню">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[92vw] !max-w-[420px] overflow-hidden border-l border-slate-200 p-0 [&>button]:hidden"
                >
                  <div className="flex h-full flex-col bg-white">
                    <div className="flex h-[76px] items-center justify-between border-b border-slate-200 px-4">
                      <FullLogo className="flex" />
                      <SheetClose asChild>
                        <button
                          type="button"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-500 transition hover:text-blue5"
                          aria-label="Закрыть меню"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </SheetClose>
                    </div>

                    <div className="flex flex-1 flex-col overflow-y-auto">
                      <div className="px-4 py-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Навигация</p>
                        <nav className="mt-2 flex flex-col gap-1">
                          {navItems.map((item) => (
                            <SheetClose asChild key={item.href}>
                              <Link href={item.href} className="rounded-lg px-3 py-2 text-base font-medium text-blue5/85 hover:bg-slate-100">
                                {item.label}
                              </Link>
                            </SheetClose>
                          ))}
                        </nav>
                      </div>

                      <div className="border-y border-slate-200 bg-[#f7f7f5]">
                        <div className="border-b border-slate-200 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Каталог
                        </div>

                        <div>
                          {sortedCatalog.map((category) => {
                            const isExpanded = category.n === expandedCategory;
                            const Icon = categoryIcons[category.n] || Package;
                            const secondLevel = (category.s || []).slice(0, 8);

                            return (
                              <div key={category.n} className="border-b border-slate-200 last:border-b-0">
                                <button
                                  type="button"
                                  onClick={() => setExpandedCategory((prev) => (prev === category.n ? "" : category.n))}
                                  className={cn(
                                    "flex w-full items-center gap-3 px-4 py-3.5 text-left transition",
                                    isExpanded ? "border-l-2 border-l-blue4 bg-blue4/5" : "hover:bg-white/70",
                                  )}
                                >
                                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-blue5">
                                    <Icon className="h-4.5 w-4.5" />
                                  </span>
                                  <span className="flex-1 text-[15px] font-medium leading-tight text-blue5">{category.n}</span>
                                  {isExpanded ? <ChevronDown className="h-4 w-4 text-blue4" /> : <ChevronRight className="h-4 w-4 text-blue5/60" />}
                                </button>

                                {isExpanded ? (
                                  <div className="border-t border-slate-200 bg-[#f5f5f1]">
                                    {secondLevel.map((subCategory) => (
                                      <SheetClose asChild key={subCategory.n}>
                                        <Link
                                          href={getCategoryHref([category.n, subCategory.n])}
                                          className="flex items-center gap-2 border-b border-slate-200 px-6 py-2.5 text-sm text-blue5/80 transition hover:bg-white/60 hover:text-blue4"
                                        >
                                          <span className="text-slate-400">•</span>
                                          <span className="line-clamp-1">{subCategory.n}</span>
                                        </Link>
                                      </SheetClose>
                                    ))}
                                    <div className="px-6 py-3">
                                      <SheetClose asChild>
                                        <Link
                                          href={getCategoryHref([category.n])}
                                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue4 transition hover:text-blue5"
                                        >
                                          Смотреть всю категорию
                                          <ChevronRight className="h-4 w-4" />
                                        </Link>
                                      </SheetClose>
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2 px-4 py-5">
                        <Link href={contacts.phone.link} className="flex items-center gap-2 text-base font-semibold text-blue5">
                          <Phone className="h-4 w-4" />
                          {phoneText}
                        </Link>
                        <Link href={`mailto:${contacts.email.info}`} className="flex items-center gap-2 text-sm text-blue5/70">
                          <Mail className="h-4 w-4" />
                          {contacts.email.info}
                        </Link>

                        <Button
                          className="mt-5 h-11 w-full rounded-xl bg-[#ca8b08] text-base font-semibold text-white hover:bg-[#b87d07]"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsRequestDialogOpen(true);
                          }}
                        >
                          Оставить запрос
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <Sheet open={isCatalogOpen} onOpenChange={setIsCatalogOpen}>
        <SheetContent
          side="left"
          className="h-full w-[95vw] !max-w-[95vw] sm:!max-w-[420px] overflow-hidden gap-0 border-r border-slate-200 p-0 [&>button]:hidden"
        >
          <div className="flex h-full flex-col bg-white">
            <div className="flex h-[82px] items-center justify-between border-b border-slate-200 px-4 sm:px-6">
              <div className="text-2xl font-black uppercase tracking-[0.03em] text-blue5">Каталог</div>

              <SheetClose asChild>
                <button
                  type="button"
                  aria-label="Закрыть каталог"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-300 bg-white text-blue5 transition hover:border-blue5"
                >
                  <X className="h-5 w-5" />
                </button>
              </SheetClose>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-[#f7f7f5]">
              <div className="border-b border-slate-200 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Продукция</div>

              <div>
                {sortedCatalog.map((category) => {
                  const isExpanded = category.n === expandedCategory;
                  const Icon = categoryIcons[category.n] || Package;
                  const secondLevel = (category.s || []).slice(0, 8);

                  return (
                    <div key={category.n} className="border-b border-slate-200">
                      <button
                        type="button"
                        onClick={() => setExpandedCategory((prev) => (prev === category.n ? "" : category.n))}
                        className={cn(
                          "flex w-full items-center gap-3 px-4 py-4 text-left transition",
                          isExpanded ? "border-l-2 border-l-blue4 bg-blue4/5" : "hover:bg-white/70",
                        )}
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-blue5">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="flex-1 text-base font-medium text-blue5">{category.n}</span>
                        {isExpanded ? <ChevronDown className="h-4 w-4 text-blue4" /> : <ChevronRight className="h-4 w-4 text-blue5/60" />}
                      </button>

                      {isExpanded ? (
                        <div className="border-t border-slate-200 bg-[#f5f5f1]">
                          {secondLevel.map((subCategory) => (
                            <Link
                              key={subCategory.n}
                              href={getCategoryHref([category.n, subCategory.n])}
                              onClick={() => setIsCatalogOpen(false)}
                              className="flex items-center gap-2 border-b border-slate-200 px-6 py-2.5 text-sm text-blue5/80 transition hover:bg-white/60 hover:text-blue4"
                            >
                              <span className="text-slate-400">•</span>
                              <span className="line-clamp-1">{subCategory.n}</span>
                            </Link>
                          ))}
                          <div className="px-6 py-3">
                            <Link
                              href={getCategoryHref([category.n])}
                              onClick={() => setIsCatalogOpen(false)}
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue4 transition hover:text-blue5"
                            >
                              Смотреть всю категорию
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <ContactFormDialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen} />
    </>
  );
}
