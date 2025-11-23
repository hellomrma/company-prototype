/**
 * 언어 전환 컴포넌트
 * 
 * 사용자가 언어를 전환할 수 있는 버튼 그룹을 제공합니다.
 * 현재 언어는 활성화된 상태로 표시됩니다.
 * 
 * 클라이언트 컴포넌트로, Next.js의 useRouter를 사용하여
 * 클라이언트 사이드 네비게이션을 수행합니다.
 */

"use client";

import { usePathname, useRouter } from "next/navigation";
import { i18n, type Locale } from "@/i18n-config";
import styles from "./LanguageSwitcher.module.scss";

/**
 * 언어 전환 컴포넌트
 * 
 * @param currentLang - 현재 선택된 언어 코드
 * @returns 언어 전환 버튼 그룹 JSX
 * 
 * @description
 * - 현재 경로를 유지하면서 언어만 변경합니다
 * - 키보드 접근성 지원 (Enter, Space 키)
 * - 현재 언어는 활성화된 스타일로 표시됩니다
 */
export default function LanguageSwitcher({ currentLang }: { currentLang: Locale }) {
  const router = useRouter(); // Next.js 라우터 (클라이언트 사이드 네비게이션)
  const pathname = usePathname(); // 현재 경로

  /**
   * 언어 전환 함수
   * 
   * @param locale - 전환할 언어 코드
   * 
   * @description
   * - 현재 경로에서 언어 코드를 제거합니다
   * - 새로운 언어 코드를 추가하여 같은 페이지의 다른 언어 버전으로 이동합니다
   * 
   * @example
   * - 현재: /ko/about
   * - 전환: /en/about
   */
  const switchLocale = (locale: Locale) => {
    // 현재 경로에서 언어 코드 제거
    const pathnameWithoutLocale = pathname.replace(`/${currentLang}`, "") || "/";
    // 새로운 언어로 네비게이션
    router.push(`/${locale}${pathnameWithoutLocale}`);
  };

  /**
   * 키보드 이벤트 핸들러
   * 
   * @param e - 키보드 이벤트
   * @param locale - 전환할 언어 코드
   * 
   * @description
   * - Enter 또는 Space 키를 누르면 언어를 전환합니다
   * - 접근성을 위해 키보드 네비게이션을 지원합니다
   */
  const handleKeyDown = (e: React.KeyboardEvent, locale: Locale) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      switchLocale(locale);
    }
  };

  return (
    <nav className={styles.languageSwitcher} aria-label="Language Selection">
      <ul role="list">
        {i18n.locales.map((locale) => (
          <li key={locale} role="listitem">
            <button
              onClick={() => switchLocale(locale)}
              onKeyDown={(e) => handleKeyDown(e, locale)}
              className={`${styles.langButton} ${
                currentLang === locale ? styles.active : ""
              }`}
              aria-label={`Switch to ${locale === "ko" ? "Korean" : "English"}`}
              aria-pressed={currentLang === locale}
              type="button"
            >
              {locale.toUpperCase()}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

