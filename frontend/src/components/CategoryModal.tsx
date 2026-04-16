"use client";

import tree from "@/category-tree.json";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import { translitCyrillicToLatin } from "@/lib/utils";
import { Category } from "@/types";
import { cx } from "class-variance-authority";
import { ChevronDown, ChevronRight, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function CategoryGrid({ category, fullPath, handleOpenChange }: { category: Category; fullPath: string[]; handleOpenChange: (isOpen: boolean) => void  }) {
  const [isOpen, setIsOpen] = useState(false);
  const categories = useGlobalStore((state) => state.categories);

  const onChevronClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const hasSubcategories = Boolean(category.s?.length);

  return (
    <div className="relative">
      <Link
        href={`/category/${fullPath.map((part) => translitCyrillicToLatin(part)).join("/")}`}
        className={cx(
          "block p-4 rounded-lg border-2 border-blue3 hover:border-blue4 transition-colors",
          {
            "bg-blue4/5": categories.includes(category.n),
          },
        )}
        prefetch={false}
        onClick={() => handleOpenChange(false)}
      >
        <div className="flex items-center justify-between">
          <span className={cx("text-blue5", {
            "font-semibold": categories.includes(category.n),
          })}>
            {category.n}
          </span>
          {hasSubcategories && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onChevronClick}
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-blue5" />
              ) : (
                <ChevronRight className="h-4 w-4 text-blue5" />
              )}
            </Button>
          )}
        </div>
      </Link>
      {isOpen && hasSubcategories && category.s && (
        <div className="mt-2 grid grid-cols-1 gap-2 pl-4">
          {category.s.map((sub, index) => (
            <CategoryGrid
              handleOpenChange={handleOpenChange}
              key={index}
              category={sub}
              fullPath={[...fullPath, sub.n]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="custom" className="h-12" id="catalog-button">
          <LayoutGrid />
          Каталог товаров
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Категории товаров</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="grid grid-cols-1 gap-2">
            {tree.map((category, index) => (
              <CategoryGrid
                key={index}
                category={category}
                fullPath={[category.n]}
                handleOpenChange={setIsOpen}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
