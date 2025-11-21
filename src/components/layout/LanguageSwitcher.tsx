"use client";

import { usePathname, useRouter } from "next/navigation";
import { i18n, type Locale } from "@/i18n-config";
import styles from "./LanguageSwitcher.module.css";

export default function LanguageSwitcher({ currentLang }: { currentLang: Locale }) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (locale: Locale) => {
    // Remove current locale from pathname
    const pathnameWithoutLocale = pathname.replace(`/${currentLang}`, "") || "/";
    // Navigate to new locale
    router.push(`/${locale}${pathnameWithoutLocale}`);
  };

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

