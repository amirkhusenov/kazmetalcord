import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import contacts from "@/contacts.json";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function translitCyrillicToLatin(input: string): string {
  const cyrillicToLatinMap: Record<string, string | undefined> = {
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'Ye', 'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z',
    'И': 'I', 'Й': 'J', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R',
    'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
    'Ъ': '', 'Ы': 'Yy', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'ye', 'ё': 'yo', 'ж': 'zh', 'з': 'z',
    'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
    'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ъ': '', 'ы': 'yy', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'й': 'j',
  };

  const result = input
    .normalize("NFC")
    .replace(/\./g, '_')  // Replace dots with underscores
    .replace(/\s+/g, '_')  // Replace spaces with underscores
    .replace(/[^a-zA-Zа-яА-Я0-9_]/g, '')  // Remove all non-alphanumeric characters except underscores
    .split('')
    .map(char => {
      const latinChar = cyrillicToLatinMap[char];
      if (typeof latinChar === 'string') {
        return latinChar;
      }
      return char;
    })
    .join('');

  return result;
}

export const KZCityList = [
  "Семей",
  "Алматы",
  "Конаев",
  "Кокшетау",
  "Актобе",
  "Астана",
  "Атырау",
  "Орал",
  "Актау",
  "Павлодар",
  "Караганды",
  "Костанай",
  "Кызылорда",
  "Усть-Каменогорск",
  "Шымкент",
  "Петропавл",
  "Туркестан",
  "Жезказган",
  "Тараз",
  "Талдыкорган",
] as const;

export type KZCity = typeof KZCityList[number];

const fallbackCity: KZCity = "Алматы";

export function getCityFromGeo(geo: string | undefined): KZCity {
  if (KZCityList.includes(geo as KZCity)) {
    return geo as KZCity;
  }
  return fallbackCity;
}

export function getImageUrl(translitCategoryPath: string[]) {
  return `/dannye/${translitCategoryPath.join("/")}/image.webp`;
}

export function getAddressFromCity(city: string): string {
  return contacts.address[city as keyof typeof contacts.address] || contacts.address["Алматы"];
}
