import { FullLogo } from "@/components/FullLogo";
import contacts from "@/contacts.json";
import { translitCyrillicToLatin } from "@/lib/utils";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Address } from "./geo/Address";

const mainLinks = [
  { href: "/", label: "Главная" },
  { href: "/about", label: "О компании" },
  { href: "/advantages", label: "Преимущества" },
  { href: "/delivery", label: "Доставка" },
  { href: "/contacts", label: "Контакты" },
];

const catalogLinks = [
  "Черный прокат",
  "Цветной прокат",
  "Чугунный прокат",
  "Нержавеющий прокат",
  "Трубопроводная арматура",
  "Кабельная продукция",
  "Метизная продукция",
  "Сварочные материалы",
];

export function Footer() {
  return (
    <footer className="bg-blue5 text-white">
      <div className="site-container py-12">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.15fr_1fr_1fr_1.2fr]">
          <div className="max-w-sm">
            <FullLogo darkMode />
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Комплексные поставки металлопроката, кабельной продукции и промышленного оборудования по Казахстану.
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <h3 className="text-base font-semibold">Контакты</h3>
            <Link href={`mailto:${contacts.email.info}`} className="flex items-start gap-2 text-white/85 transition hover:text-white">
              <Mail className="mt-0.5 h-4 w-4" />
              <span>{contacts.email.info}</span>
            </Link>
            <Link href={contacts.phone.link} className="flex items-start gap-2 text-white/85 transition hover:text-white">
              <Phone className="mt-0.5 h-4 w-4" />
              <span>{contacts.phone.text}</span>
            </Link>
            <div className="flex items-start gap-2 text-white/85">
              <MapPin className="mt-0.5 h-4 w-4" />
              <Address />
            </div>
            <div className="flex items-start gap-2 text-white/85">
              <Clock3 className="mt-0.5 h-4 w-4" />
              <span>Пн-Пт: 09:00-18:00, Сб: 10:00-14:00, Вс: выходной</span>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <h3 className="text-base font-semibold">Основные ссылки</h3>
            <nav className="flex flex-col gap-2">
              {mainLinks.map((item) => (
                <Link key={item.href} href={item.href} className="text-white/85 transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-3 text-sm">
            <h3 className="text-base font-semibold">Категории каталога</h3>
            <nav className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {catalogLinks.map((item) => (
                <Link
                  key={item}
                  href={`/category/${translitCyrillicToLatin(item)}`}
                  prefetch={false}
                  className="text-white/85 transition hover:text-white"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-4 text-sm text-white/70">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2018-{new Date().getFullYear()} KazMetalCord. Все права защищены.</span>
            <Link href="/privacy-policy" className="text-white/85 transition hover:text-white">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
