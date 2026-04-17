"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    author: "Аслан Б.",
    role: "Руководитель снабжения",
    company: "AlemStroy",
    text: "Закрыли сложную заявку по трубам и метизам за два дня. Менеджер оперативно подобрал аналоги и зафиксировал цену в день запроса.",
  },
  {
    author: "Екатерина Н.",
    role: "Главный инженер проекта",
    company: "Industrial Systems",
    text: "Отгрузка пришла точно по графику. Вся номенклатура совпала, сертификаты и документы были подготовлены заранее без дополнительных запросов.",
  },
  {
    author: "Марат С.",
    role: "Начальник отдела закупок",
    company: "Temir Logistics",
    text: "Удобно, что можно собрать поставку в одном месте: металл, кабель и сопутствующие позиции. Экономим время и не держим лишний резерв на складе.",
  },
  {
    author: "Ольга Р.",
    role: "Руководитель проекта",
    company: "KZ Pipeline Group",
    text: "Получили ответ по расчету в течение 20 минут. Поставщик гибко подстроил график отгрузки под этапы строительно-монтажных работ.",
  },
];

export function TestimonialsSlider() {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const update = () => setActiveIndex(api.selectedScrollSnap());
    update();
    api.on("select", update);
    api.on("reInit", update);

    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  return (
    <div data-reveal="section" data-reviews-slider className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold leading-tight text-blue5 sm:text-3xl lg:text-4xl">Как нас оценивают после поставки</h2>
        <p className="max-w-3xl text-base text-blue5/70">Реальные комментарии от компаний, с которыми мы работаем на постоянной основе.</p>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(150deg,#ffffff_0%,#f6f9ff_58%,#ecf3ff_100%)] p-5 shadow-[0_16px_34px_rgba(2,6,23,0.08)] sm:p-7">
        <Carousel setApi={setApi} opts={{ loop: true, align: "start" }} className="w-full">
          <CarouselContent>
            {testimonials.map((item) => (
              <CarouselItem key={`${item.company}-${item.author}`} className="md:basis-1/2 xl:basis-1/3">
                <article className="js-review-card relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-[0_10px_22px_rgba(2,6,23,0.08)] sm:p-6">
                  <Quote className="absolute right-4 top-4 h-7 w-7 text-blue4/35" />
                  <div className="mb-4 flex items-center gap-1 text-[#d08c00]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700">{item.text}</p>
                  <div className="mt-5 border-t border-slate-200 pt-4">
                    <div className="text-base font-bold text-blue5">{item.author}</div>
                    <div className="text-sm text-slate-600">{item.role}</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue4">{item.company}</div>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => api?.scrollTo(index)}
                aria-label={`Перейти к отзыву ${index + 1}`}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  index === activeIndex ? "w-8 bg-blue4" : "w-2.5 bg-slate-300 hover:bg-slate-400",
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full border-slate-300 text-blue5 hover:bg-slate-100"
              onClick={() => api?.scrollPrev()}
              aria-label="Предыдущий отзыв"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full border-slate-300 text-blue5 hover:bg-slate-100"
              onClick={() => api?.scrollNext()}
              aria-label="Следующий отзыв"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
