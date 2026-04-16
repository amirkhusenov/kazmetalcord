import { translitCyrillicToLatin } from "./utils";

// const categoriesImages: Record<string, string> = {
//   "Черный прокат": "/cherniyprokat.webp",
//   "Цветной прокат": "/cvetnoyprokat.webp",
//   "Чугунный прокат": "/chugunniyprokat.webp",
//   "Нержавеющий прокат": "/nerzhaveushiyprokat.webp",
//   "Спецсталь": "/specstal.webp",
//   "Трубопроводная арматура": "/truboprovodnayaarmatura.webp",
//   "Кабельная продукция": "/kabeli.webp",
//   "Изоляция трубопроводов": "/izolaciatrub.webp",
//   "Метизная продукция": "/metizy.webp",
//   "Полимерные изделия": "/polimery.webp",
//   "Порошки": "/poroshki.webp",
//   "Сварочные материалы": "/svarochniematerialy.webp",
//   "Сплавы": "/splavy.webp",
//   "Композитные материалы": "/kompozity.webp",
//   "Сэндвич-панели": "/sendvich-paneli.webp",
//   "Оборудование": "/oborudovanie.jpg",
//   "Декоративные изделия": "/decorativnieizdelia.webp"
// };

export function getSecondLevelCategoryImage(categoryPath: string[]) {
  return `/category/${categoryPath.map(translitCyrillicToLatin).join("/")}/image.webp`;
}

// export function getCategoryImage(category: string) : string {
//   const normalizedCategory = category.normalize("NFC");
//   return Object.entries(categoriesImages).find(([key]) => key.normalize("NFC") === normalizedCategory)?.[1] || "/oborudovanie.jpg";
// }
