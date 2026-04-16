"use client";

import { useGlobalStore } from "@/hooks/useGlobalStore";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowRight } from "lucide-react";
import React from "react";
import { translitCyrillicToLatin } from "@/lib/utils";
import Link from "next/link";

export function CategoriesBreadcrumb() {
  const categories = useGlobalStore((state) => state.categories);

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="site-container py-3">
        <Breadcrumb>
          <BreadcrumbList className="flex-wrap gap-y-1">
            <BreadcrumbItem>
              <BreadcrumbLink className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900" asChild>
                <Link href={"/category"}>Каталог</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {Array.from({ length: categories.length }).map((_, index) => {
              return (
                <React.Fragment key={index}>
                  <BreadcrumbSeparator>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
                      <Link href={`/category/${categories.slice(0, index + 1).map(translitCyrillicToLatin).join("/")}`}>
                        {categories[index]}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
