import "server-only";
import type { Locale } from "./i18n-config";
import type { Dictionary } from "./types/dictionary";

// ============================================
// JSON 폴백 방식 (API 실패 시 사용)
// ============================================
// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  ko: () =>
    import("./dictionaries/ko.json").then(
      (module) => module.default as Dictionary
    ),
  en: () =>
    import("./dictionaries/en.json").then(
      (module) => module.default as Dictionary
    ),
};

/**
 * JSON 파일에서 다국어 데이터를 가져오는 함수 (폴백용)
 * @param locale - 언어 코드 (ko, en)
 * @returns 다국어 딕셔너리 객체
 */
const getDictionaryFromJson = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]?.() ?? dictionaries.ko();

/**
 * 다국어 데이터를 가져오는 함수
 * @param locale - 언어 코드 (ko, en)
 * @returns 다국어 딕셔너리 객체
 */
export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return await getDictionaryFromJson(locale);
};
