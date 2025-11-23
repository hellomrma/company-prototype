/**
 * 다국어(i18n) 설정 파일
 * 
 * 이 파일은 애플리케이션에서 지원하는 언어 목록과 기본 언어를 정의합니다.
 * Next.js의 다국어 라우팅과 함께 사용됩니다.
 */

/**
 * 다국어 설정 객체
 * - defaultLocale: 기본 언어 코드 (URL에 언어가 없을 때 사용)
 * - locales: 지원하는 모든 언어 코드 배열
 */
export const i18n = {
  defaultLocale: "ko", // 기본 언어: 한국어
  locales: ["ko", "en"], // 지원 언어: 한국어, 영어
} as const;

/**
 * Locale 타입 정의
 * i18n.locales 배열의 요소 중 하나의 타입을 추출합니다.
 * "ko" | "en" 타입을 가집니다.
 */
export type Locale = (typeof i18n)["locales"][number];
