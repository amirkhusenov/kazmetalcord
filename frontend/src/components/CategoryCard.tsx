import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  name: string;
  image: string;
  link: string;
  className?: string;
  variant?: "default" | "reference";
  subtitle?: string;
  imageSizes?: string;
}

export function CategoryCard({
  name,
  image,
  link,
  className,
  variant = "default",
  subtitle,
  imageSizes,
}: CategoryCardProps) {
  const isReference = variant === "reference";

  return (
    <Link
      href={link}
      prefetch={false}
      className={cn(
        isReference
          ? "group relative block h-full min-h-[200px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
          : "relative block h-32 overflow-hidden rounded-lg border border-slate-300 bg-slate-100 px-2 py-6 text-center text-lg font-bold text-slate-900 transition-colors duration-300 hover:bg-white",
        className,
      )}
    >
      {isReference ? (
        <>
          <Image
            src={image}
            alt={name}
            fill
            quality={100}
            sizes={imageSizes || "(min-width: 1536px) 24vw, (min-width: 1280px) 30vw, (min-width: 1024px) 38vw, (min-width: 640px) 48vw, 100vw"}
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 z-10 bg-[#020617]/55 transition-opacity duration-300 group-hover:opacity-0" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#020617]/88 via-[#020617]/62 to-[#020617]/40 transition-opacity duration-300 group-hover:opacity-0" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-white/84 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-white/92 via-white/74 to-white/52 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-5">
            <div className="max-w-[calc(100%-3.25rem)] space-y-1.5 rounded-lg bg-slate-950/58 px-3 py-2">
              <span className="line-clamp-2 block text-[20px] font-bold leading-[1.08] tracking-[-0.01em] text-white sm:text-[22px]">
                {name}
              </span>
              {subtitle ? (
                <span className="line-clamp-2 block text-xs font-semibold leading-snug text-white/85 sm:text-[13px]">
                  {subtitle}
                </span>
              ) : null}
            </div>
          </div>

          <span className="absolute bottom-3 right-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/95 text-blue5 shadow-sm transition-all duration-300 group-hover:translate-x-0.5 group-hover:border-blue5 group-hover:bg-blue5 group-hover:text-white">
            <ArrowRight className="h-5 w-5" />
          </span>
        </>
      ) : (
        <>
          <Image src={image} alt={name} fill quality={90} sizes={imageSizes || "100vw"} className="absolute inset-0 z-0 h-full w-full object-cover opacity-55" />
          <span className="relative z-10 flex h-full items-center justify-center">{name}</span>
        </>
      )}
    </Link>
  );
}
