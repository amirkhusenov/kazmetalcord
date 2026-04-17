import { CategoryCard } from "@/components/CategoryCard";
import { ContactForm } from "@/components/ContactForm";
import { HomePageAnimations } from "@/components/HomePageAnimations";
import { TestimonialsSlider } from "@/components/TestimonialsSlider";
import { Button } from "@/components/ui/button";
import tree from "@/category-tree.json";
import { getSecondLevelCategoryImage } from "@/lib/images";
import { cn, translitCyrillicToLatin } from "@/lib/utils";
import { Globe, Headphones, Lock, PackageSearch, ShieldCheck, Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const benefits: { icon: React.ReactNode; title: string; description: string }[] = [
  {
    icon: <PackageSearch color="white" />,
    title: "Широкий ассортимент",
    description: "В каталоге более 1.6 миллиона товара. В связи с чем, можно найти все что связано с металлом",
  },
  {
    icon: <ShieldCheck color="white" />,
    title: "Надежность",
    description: "У нас все необходимые сертификации и подтверждающие документы качества",
  },
  {
    icon: <Globe color="white" />,
    title: "Доступность",
    description: "Закажите свой товар с любой точки СНГ. Быстрая логистика позволит думать что мы рядом",
  },
  {
    icon: <Lock color="white" />,
    title: "Безопасность",
    description: "Мы ценим конфиденциальность и всегда защищаем права своих клиентов",
  },
  {
    icon: <Timer color="white" />,
    title: "Быстрый ответ",
    description: "Получите ответ в течение 15 минут. У вас не возникнет недовольствия из-за времени ожидания",
  },
  {
    icon: <Headphones color="white" />,
    title: "Помощь в консультации",
    description: "Если не можете найти свой товар, позвоните. Поможем решить вашу проблему и подобрать товары",
  },
];

const indicators = [
  { value: 12, suffix: "+", label: "лет на рынке" },
  { value: 5, suffix: "K+", label: "позиций в наличии" },
  { value: 80, suffix: "K+", label: "тонн отгружено" },
  { value: 2, suffix: "K+", label: "км кабеля" },
  { value: 600, suffix: "+", label: "клиентов" },
];

const trustedClientLogos = [
  { name: "BI Operations", src: "/bi_operations.webp" },
  { name: "Asia Ferroalloys", src: "/asia_ferroalloys.webp" },
  { name: "BA Acontractors", src: "/ba_acontractors.webp" },
  { name: "YDD", src: "/YDD_logo_cropped.webp" },
  { name: "SE Equipment", src: "/se_equipment.webp" },
  { name: "RG Gold", src: "/rg_gold.webp" },
];

const trustedClientLogosMarquee = [...trustedClientLogos, ...trustedClientLogos];

const workSteps = [
  {
    step: "01",
    title: "Заявка и консультация",
    description: "Вы оставляете запрос, менеджер уточняет задачу и помогает быстро подобрать решение.",
  },
  {
    step: "02",
    title: "Расчет и согласование",
    description: "Готовим стоимость, сроки и формат поставки, после чего фиксируем условия в заказе.",
  },
  {
    step: "03",
    title: "Комплектация на складе",
    description: "Резервируем позиции, проверяем наличие и комплектуем поставку под ваш объект.",
  },
  {
    step: "04",
    title: "Доставка и сопровождение",
    description: "Организуем отгрузку и сопровождаем заявку до получения материала на объекте.",
  },
];

export default async function Home() {
  return (
    <section className="bg-[#f3f4f6]">
      <HomePageAnimations />
      <div data-hero-image className="relative min-h-[420px] overflow-hidden sm:min-h-[520px] lg:min-h-[760px]">
        <Image
          src="/hero.webp"
          alt="Металлопрокат KazMetalCord"
          fill
          priority
          className="object-cover object-center lg:object-[68%_center]"
        />
        <div className="absolute inset-0 bg-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/82 via-slate-950/62 to-slate-950/12" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-slate-950/22" />

        <div className="site-container relative z-10 flex min-h-[420px] items-center py-10 sm:min-h-[520px] sm:py-12 lg:min-h-[760px] lg:py-16">
          <div className="max-w-3xl">
            <h1 className="text-[2rem] font-black uppercase leading-[0.95] text-white sm:text-5xl lg:text-[72px]">
              <span data-hero-line className="block">Поставки</span>
              <span data-hero-line className="block">металлопроката</span>
              <span data-hero-line className="block">и кабеля</span>
              <span data-hero-line className="block text-blue2">от заявки до</span>
              <span data-hero-line className="block text-blue2">объекта</span>
            </h1>

            <p data-hero-description className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/90 sm:mt-8 sm:text-[17px]">
              От 48 часов. Рассчитаем стоимость за 30 минут - более 5 000 позиций на складе в Алматы.
            </p>

            <div data-hero-actions className="mt-8 grid grid-cols-1 gap-3.5 sm:mt-9 sm:flex sm:flex-wrap">
              <Button asChild className="h-12 rounded-xl bg-blue4 px-6 text-sm font-semibold text-white hover:bg-blue5 sm:h-14 sm:px-9 sm:text-base">
                <Link href="/contacts">Рассчитать стоимость</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl border-white/70 bg-white/10 px-6 text-sm font-semibold text-white hover:bg-white/20 sm:h-14 sm:px-9 sm:text-base"
              >
                <Link href="/category">Смотреть каталог</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="site-container pb-12 pt-12 sm:pt-14 lg:pb-14 lg:pt-16">
        <div className="space-y-12 sm:space-y-14 lg:space-y-16">
          <div data-reveal="section" data-highlight="metrics" className="overflow-hidden">
            <div className="max-w-3xl space-y-3">
              <h2 className="text-2xl font-black uppercase leading-tight text-blue5 sm:text-3xl lg:text-4xl">Надежность и масштаб в цифрах</h2>
              <p className="text-sm leading-relaxed text-blue5/70 sm:text-base">Ключевые показатели, которые отражают темп поставок и стабильность работы.</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-5 sm:gap-4">
              {indicators.map((item, index) => (
                <div
                  key={item.label}
                  className={cn(
                    "px-4 py-5",
                    index === indicators.length - 1 ? "col-span-2 sm:col-span-1" : "",
                  )}
                >
                  <div
                    data-indicator-value={item.value}
                    data-indicator-suffix={item.suffix}
                    className="text-[2.1rem] font-extrabold leading-none tracking-[-0.03em] text-blue4 sm:text-[2.45rem] lg:text-[2.75rem]"
                  >
                    {`${item.value}${item.suffix}`}
                  </div>
                  <div className="mt-3 text-sm font-medium text-blue5/65">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal="section" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold leading-tight text-blue5 sm:text-3xl lg:text-4xl">Каталог товаров</h2>
              <p className="max-w-2xl text-base text-blue5/70">Выберите нужную категорию и перейдите в соответствующий раздел каталога.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {tree.map((t) => {
                const imageLink = getSecondLevelCategoryImage([t.n]);
                return (
                  <CategoryCard
                    key={t.n}
                    name={t.n}
                    image={imageLink}
                    link={`/category/${[t.n].map(translitCyrillicToLatin).join("/")}`}
                    variant="reference"
                    className="js-catalog-card h-full min-h-[208px] sm:min-h-[220px]"
                    imageSizes="(min-width: 1280px) 33vw, (min-width: 1024px) 34vw, (min-width: 640px) 50vw, 100vw"
                  />
                );
              })}
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <p className="max-w-2xl text-sm text-blue5/70 sm:text-base">
                Нужна другая позиция или редкая категория? Перейдите в полный каталог с детальной структурой разделов.
              </p>
              <Button asChild className="h-11 rounded-xl bg-blue4 px-6 text-sm font-semibold text-white hover:bg-blue5 sm:text-base">
                <Link href="/category">Смотреть ещё в каталоге</Link>
              </Button>
            </div>
          </div>

          <div data-reveal="section" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold leading-tight text-blue5 sm:text-3xl lg:text-4xl">Нам доверяют</h2>
              <p className="max-w-3xl text-base text-blue5/70">
                Компании из промышленного, строительного и энергетического секторов выбирают нас за стабильные сроки, прозрачные
                условия и качественную комплектацию поставок.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_14px_30px_rgba(2,6,23,0.08)] sm:p-7">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-20" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-20" />
              <div className="client-logos-marquee flex w-max items-center gap-4 sm:gap-6">
                {trustedClientLogosMarquee.map((client, index) => (
                  <div
                    key={`${client.name}-${index}`}
                    className="js-client-card flex h-[88px] min-w-[172px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_6px_16px_rgba(2,6,23,0.06)] sm:h-[102px] sm:min-w-[220px] sm:px-6"
                  >
                    <Image src={client.src} alt={client.name} width={190} height={76} className="h-10 w-auto object-contain sm:h-14" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <TestimonialsSlider />

          <div data-reveal="section" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold leading-tight text-blue5 sm:text-3xl lg:text-4xl">Подход, за который нас выбирают</h2>
              <p className="max-w-3xl text-base text-blue5/70">
                Работаем на длинной дистанции: скорость ответа, точность комплектации и контроль качества на каждом этапе.
              </p>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_14px_30px_rgba(2,6,23,0.08)] sm:p-7">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {benefits.map((benefit, index) => (
                  <article
                    key={benefit.title}
                    className="js-benefit-card flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_6px_16px_rgba(2,6,23,0.06)] transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue5">{benefit.icon}</div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue4/75">#{index + 1}</div>
                    </div>
                    <h3 className="text-lg font-bold text-blue5">{benefit.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{benefit.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div data-reveal="section" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold leading-tight text-blue5 sm:text-3xl lg:text-4xl">Маршрут поставки по шагам</h2>
              <p className="max-w-3xl text-base text-blue5/70">От первого звонка до отгрузки: процесс выстроен как прозрачный трек с понятными контрольными точками.</p>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(155deg,#ffffff_0%,#f7fafc_58%,#edf3ff_100%)] p-5 shadow-[0_16px_34px_rgba(2,6,23,0.08)] sm:p-7">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(30,83,173,0.12)_0%,transparent_42%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_92%_88%,rgba(3,4,94,0.1)_0%,transparent_46%)]" />

              <div className="relative space-y-5">
                {workSteps.map((item, index) => (
                  <div key={item.step} className="relative grid grid-cols-[auto_1fr] gap-3 sm:gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-6">
                    <div className="relative col-start-1 row-start-1 flex h-full flex-col items-center md:col-start-2">
                      {index !== workSteps.length - 1 ? (
                        <span className="absolute bottom-[-22px] top-10 w-px bg-gradient-to-b from-blue4/65 to-blue4/5" />
                      ) : null}
                      <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-blue5 text-sm font-black text-white shadow-[0_6px_16px_rgba(3,4,94,0.28)]">
                        {item.step}
                      </span>
                    </div>

                    <article
                      className={cn(
                        "js-step-card relative col-start-2 row-start-1 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-[0_8px_20px_rgba(2,6,23,0.07)] transition-transform duration-300 hover:-translate-y-0.5 sm:p-5",
                        index % 2 === 0 ? "md:col-start-1 md:text-right" : "md:col-start-3",
                      )}
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-[0.17em] text-blue4/75">Этап {item.step}</div>
                      <h3 className="mt-2 text-lg font-bold text-blue5 sm:text-xl">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                    </article>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div data-reveal="section" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold leading-tight text-blue5 sm:text-3xl lg:text-4xl">Условия доставки</h2>
              <p className="max-w-3xl text-base text-blue5/70">
                Подача логистики в формате понятного маршрута: от планирования до контроля получения груза.
              </p>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_14px_30px_rgba(2,6,23,0.08)] sm:p-7">
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-blue4/30 bg-white px-3 py-1 text-xs font-semibold text-blue5">Казахстан</span>
                    <span className="inline-flex items-center rounded-full border border-blue4/30 bg-white px-3 py-1 text-xs font-semibold text-blue5">СНГ</span>
                    <span className="inline-flex items-center rounded-full border border-blue4/30 bg-white px-3 py-1 text-xs font-semibold text-blue5">24/7</span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
                    Осуществляем круглосуточную доставку по Казахстану и странам СНГ (по предварительной договоренности). В наличии
                    собственный автотранспорт, возможно сотрудничество с любой транспортной компанией.
                  </p>
                </article>

                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue4/75">Этап 01</div>
                    <div className="mt-1 text-sm font-semibold text-blue5">Планирование маршрута</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue4/75">Этап 02</div>
                    <div className="mt-1 text-sm font-semibold text-blue5">Расчёт сроков и стоимости</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue4/75">Этап 03</div>
                    <div className="mt-1 text-sm font-semibold text-blue5">Сопровождение до получения</div>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                Расчет сроков и стоимости доставки зависит от объема партии, удаленности объекта и необходимости дополнительных услуг.
                Менеджеры сопровождают заявку до момента получения груза на объекте.
              </p>
            </div>
          </div>

          <div data-reveal="section" className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_30px_rgba(2,6,23,0.08)]">
            <div className="grid gap-8 p-5 sm:p-6 md:p-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
              <div className="space-y-5">
                <h2 className="text-2xl font-black uppercase leading-tight text-blue5 sm:text-3xl lg:text-4xl">Рассчитаем стоимость за 30 минут</h2>
                <p className="max-w-xl text-base leading-relaxed text-blue5/75">
                  Оставьте заявку - менеджер свяжется с вами и пришлёт коммерческое предложение.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm font-medium text-blue5">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#ca8b08]/40 bg-[#ca8b08]/10 text-[#ca8b08]">✓</span>
                    Ответ до 30 минут в рабочее время
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-blue5">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#ca8b08]/40 bg-[#ca8b08]/10 text-[#ca8b08]">✓</span>
                    Работаем с ТОО, ИП, тендерами
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-blue5">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#ca8b08]/40 bg-[#ca8b08]/10 text-[#ca8b08]">✓</span>
                    НДС 12%, все закрывающие документы
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-blue5">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#ca8b08]/40 bg-[#ca8b08]/10 text-[#ca8b08]">✓</span>
                    Пн-Сб 09:00-18:00 - заявки 24/7
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
                <h3 className="text-xl font-bold text-blue5">Свяжитесь с нами</h3>
                <p className="mt-2 text-sm text-slate-600">Оставьте заявку через форму.</p>
                <ContactForm showQuickActions={false} className="mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
