"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

const FALLBACK_IMAGE = "/placeholder-product.webp";

export function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const safeAlt = typeof alt === "string" && alt.trim().length > 0 ? alt : "Изображение товара";

  const preparedImages = useMemo(() => {
    const unique = Array.from(new Set(images.filter((image) => image && image.trim().length > 0)));
    if (unique.length === 0) {
      return [FALLBACK_IMAGE];
    }
    return unique.slice(0, 8);
  }, [images]);

  const [resolvedImages, setResolvedImages] = useState<string[]>(preparedImages);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setResolvedImages(preparedImages);
    setActiveIndex(0);
  }, [preparedImages]);

  const handleImageError = (index: number) => {
    setResolvedImages((prev) => {
      if (prev[index] === FALLBACK_IMAGE) {
        return prev;
      }

      const next = [...prev];
      next[index] = FALLBACK_IMAGE;
      return next;
    });
  };

  const mainImage = resolvedImages[activeIndex] || FALLBACK_IMAGE;

  return (
    <div className="space-y-2.5">
      <div className="relative h-[300px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:h-[360px] lg:h-[390px]">
        <Image
          src={mainImage}
          alt={safeAlt}
          fill
          quality={95}
          sizes="(min-width: 1280px) 42vw, (min-width: 1024px) 48vw, 100vw"
          className="object-cover"
          onError={() => handleImageError(activeIndex)}
        />
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {resolvedImages.map((image, index) => {
          const isActive = activeIndex === index;

          return (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative overflow-hidden rounded-lg border bg-white transition-colors",
                isActive ? "border-blue5" : "border-slate-200 hover:border-slate-300",
              )}
              aria-label={`Открыть изображение ${index + 1}`}
            >
              <div className="relative h-14 sm:h-16">
                <Image
                  src={image}
                  alt={`${safeAlt} - превью ${index + 1}`}
                  fill
                  quality={80}
                  sizes="120px"
                  className="object-cover"
                  onError={() => handleImageError(index)}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
