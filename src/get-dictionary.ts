/**
 * 다국어 딕셔너리 가져오기 모듈
 * 
 * 이 모듈은 서버 컴포넌트에서만 사용할 수 있습니다 ("server-only").
 * 클라이언트 번들에 포함되지 않도록 보장합니다.
 */

import "server-only";
import type { Locale } from "./i18n-config";
import type { Dictionary } from "./types/dictionary";

// ============================================
// JSON 폴백 방식 (API 실패 시 사용)
// ============================================
/**
 * 다국어 딕셔너리 로더 맵
 * 
 * 각 언어별로 JSON 파일을 동적으로 import하는 함수를 정의합니다.
 * 이렇게 하면 TypeScript의 타입 체크와 자동완성을 활용할 수 있습니다.
 * 
 * 동적 import를 사용하여 코드 스플리팅을 통해 필요한 언어만 로드합니다.
 */
const dictionaries = {
  // 한국어 딕셔너리 로더
  ko: () =>
    import("./dictionaries/ko.json").then(
      (module) => module.default as Dictionary
    ),
  // 영어 딕셔너리 로더
  en: () =>
    import("./dictionaries/en.json").then(
      (module) => module.default as Dictionary
    ),
};

/**
 * JSON 파일에서 다국어 데이터를 가져오는 함수 (폴백용)
 * 
 * @param locale - 언어 코드 (ko, en)
 * @returns 다국어 딕셔너리 객체 (Promise)
 * 
 * @description
 * 지정된 언어의 딕셔너리를 로드합니다.
 * 언어가 지원되지 않는 경우 기본 언어(한국어)를 반환합니다.
 */
const getDictionaryFromJson = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]?.() ?? dictionaries.ko();

/**
 * 다국어 데이터를 가져오는 메인 함수
 * 
 * @param locale - 언어 코드 (ko, en)
 * @returns 다국어 딕셔너리 객체 (Promise)
 * 
 * @description
 * 현재는 JSON 파일에서만 데이터를 가져오지만,
 * 향후 API 연동 시 이 함수에서 API 호출을 먼저 시도하고
 * 실패 시 JSON 폴백을 사용하도록 확장할 수 있습니다.
 * 
 * @example
 * ```typescript
 * const dictionary = await getDictionary("ko");
 * const title = dictionary.home.title;
 * ```
 */
export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return await getDictionaryFromJson(locale);
};
