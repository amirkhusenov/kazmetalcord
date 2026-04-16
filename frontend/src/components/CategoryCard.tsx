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
          ? "group relative block h-full min-h-[200px] overflow-hidden border border-slate-200 bg-[#f2f4f7] p-4 transition-colors duration-300 hover:bg-white sm:p-5"
          : "relative block h-32 overflow-hidden rounded-lg border border-slate-300 bg-slate-100 px-2 py-6 text-center text-lg font-bold text-slate-900 transition-colors duration-300 hover:bg-white",
        className,
      )}
    >
      {isReference ? (
        <>
          <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_18%_14%,rgba(15,23,42,0.08)_0%,transparent_45%)]" />
          <div className="absolute inset-x-0 top-0 z-10 h-[52%] bg-gradient-to-b from-white/95 via-white/80 to-transparent" />
          <div className="relative z-20 flex h-full flex-col">
            <div className="max-w-[78%] space-y-2">
              <span className="line-clamp-2 block text-[21px] font-bold leading-[1.05] tracking-[-0.01em] text-blue5 sm:text-[24px]">
                {name}
              </span>
              {subtitle ? (
                <span className="line-clamp-2 block text-xs font-semibold leading-snug text-slate-700 sm:text-[13px]">
                  {subtitle}
                </span>
              ) : null}
            </div>
          </div>

          <Image
            src={image}
            alt={name}
            fill
            quality={100}
            sizes={imageSizes || "(min-width: 1536px) 24vw, (min-width: 1280px) 30vw, (min-width: 1024px) 38vw, (min-width: 640px) 48vw, 100vw"}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[70%] w-full object-cover object-center grayscale-[0.9] contrast-[1.1] transition-transform duration-300 group-hover:scale-[1.03]"
          />

          <span className="absolute bottom-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white/90 text-blue5 transition-all duration-300 group-hover:translate-x-0.5 group-hover:border-blue4 group-hover:text-blue4">
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
