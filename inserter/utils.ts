interface TranslitOptions {
    hasSuffix?: boolean;
}

export const ignoredFields = ["Наименование", "translitTitle", "translitCategoryPath", "categoryPath"];

export function translitCyrillicToLatin(input: string, options?: TranslitOptions): string {
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

    let result = input
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

    return result + (options?.hasSuffix ? '_' + getRandomSuffix() : '');
}

function getRandomSuffix(length: number = 5): string {
    const characters = "0123456789";
    let suffix = "";
    for (let i = 0; i < length; i++) {
        suffix += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return suffix;
}

export function normalizeJson(input: any): any {
    if (Array.isArray(input)) {
      return input.map(normalizeJson);
    }
  
    if (input !== null && typeof input === 'object') {
      const normalizedObj: Record<string, any> = {};
      for (const [key, value] of Object.entries(input)) {
        const normalizedKey = normalizeString(key);
        normalizedObj[normalizedKey] = normalizeJson(value);
      }
      return normalizedObj;
    }
  
    if (typeof input === 'string') {
      return normalizeString(input);
    }
  
    return input;
  }
  
  function normalizeString(str: string): string {
    return str.trim().toLowerCase();
  }

const examples: string[] = ["Черный прокат"];

examples.forEach((example) => {
    console.log(translitCyrillicToLatin(example));
    console.log(example.normalize("NFC").replace(/[^a-zA-Zа-яА-Я0-9_]/g, ''));
});
