"use client";
import translits from "@/category-translit.json";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect } from "react";

const assertedTranslits = translits as Record<string, string | undefined>;

export function CategoryPathManager(): React.ReactNode {
  const { slug } = useParams();
  const pathname = usePathname();
  const setCategories = useGlobalStore((state) => state.setCategories);
  const increaseVisits = useGlobalStore((state) => state.increaseVisits);

  useEffect(() => {
    increaseVisits();
  }, [increaseVisits]);

  useEffect(() => {
    if (pathname.startsWith("/category")) {
      const paths = typeof slug === "string" ? [slug] : (slug || []);

      const decodedPaths = paths.map((path) => {
        const decodedPath = decodeURIComponent(path);
        return assertedTranslits[decodedPath] || null;
      });

      if (decodedPaths.some((path) => path === null)) {
        console.error("Some paths are not found in translits");
        return;
      }

      setCategories(decodedPaths as string[]);
    }
  }, [slug, pathname, setCategories]);

  return null;
}
