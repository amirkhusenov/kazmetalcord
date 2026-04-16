"use client";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import tree from "@/category-tree.json";
import { Category } from "@/types";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import { cx } from "class-variance-authority";
import { translitCyrillicToLatin } from "@/lib/utils";
import Link from "next/link";

interface CategoryItemProps {
  category: Category;
  fullPath: string[];
  level?: number;
}

function CategoryItem({ category, fullPath, level = 0 }: CategoryItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const categories = useGlobalStore((state) => state.categories);
  const hasChildren = Boolean(category.s?.length);
  const isInPath = categories.includes(category.n);
  const isCurrent = categories.at(-1) === category.n;

  useEffect(() => {
    if (categories.includes(category.n)) {
      setIsOpen(true);
    }
  }, [categories, category.n]);

  const onChevronClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={cx("space-y-0.5", level > 0 && "ml-3 border-l border-slate-200 pl-2")}>
      <div className={cx("group flex items-center gap-1 rounded-md px-2 py-1.5 transition-colors", isInPath ? "bg-slate-100" : "hover:bg-slate-50")}>
        {hasChildren ? (
          <button
            type="button"
            onClick={onChevronClick}
            aria-label={isOpen ? "Свернуть раздел" : "Развернуть раздел"}
            className="inline-flex h-5 w-5 items-center justify-center rounded text-slate-400 transition-colors hover:text-slate-700"
          >
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="inline-block h-5 w-5" />
        )}
        <Link
          className={cx(
            "line-clamp-1 text-sm transition-colors",
            isCurrent && "font-semibold text-slate-900",
            !isCurrent && isInPath && "font-medium text-slate-800",
            !isInPath && "text-slate-600 group-hover:text-slate-900",
          )}
          href={`/category/${fullPath.map((part) => translitCyrillicToLatin(part)).join("/")}`}
        >
          {category.n}
        </Link>
      </div>
      {isOpen && Array.isArray(category.s) && (
        <div className="space-y-0.5">
          {category.s.map((sub, index) => (
            <CategoryItem key={index} category={sub} fullPath={[...fullPath, sub.n]} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

interface CategorySidebarProps {
  className?: string;
}

export function CategorySidebar({ className }: CategorySidebarProps) {
  return (
    <Card className={cx("w-full rounded-xl border border-slate-200 bg-white p-4 shadow-none", className)}>
      <div className="border-b border-slate-200 pb-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Навигация</p>
        <h2 className="mt-1 text-sm font-semibold text-slate-900">Категории каталога</h2>
      </div>
      <div className="mt-3 max-h-[calc(100vh-180px)] space-y-0.5 overflow-y-auto pr-1">
        {tree.map((category, index) => (
          <CategoryItem key={index} category={category} fullPath={[category.n]} />
        ))}
      </div>
    </Card>
  );
}
