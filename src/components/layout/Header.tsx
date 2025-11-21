"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import { Locale } from "@/i18n-config";
import type { Dictionary } from "@/types/dictionary";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({
  lang,
  dictionary,
}: {
  lang: Locale;
  dictionary: Dictionary;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header} role="banner">
      <div className={styles.container}>
        <Link 
          href={`/${lang}`} 
          className={styles.logo}
          aria-label={`${dictionary.footer.company.name} - ${lang === "ko" ? "홈으로 이동" : "Go to home"}`}
          onClick={closeMenu}
        >
          {dictionary.footer.company.name}
        </Link>
        <nav className={styles.nav} aria-label="Main Navigation">
          <ul>
            <li>
              <Link href={`/${lang}`} onClick={closeMenu}>
                {dictionary.nav.home}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/about`} onClick={closeMenu}>
                {dictionary.nav.about}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/services`} onClick={closeMenu}>
                {dictionary.nav.services}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/careers`} onClick={closeMenu}>
                {dictionary.nav.careers}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/location`} onClick={closeMenu}>
                {dictionary.nav.location}
              </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.rightSection}>
          <LanguageSwitcher currentLang={lang} />
          <button
            className={`${styles.menuToggle} ${isMenuOpen ? styles.menuToggleOpen : ""}`}
            onClick={toggleMenu}
            aria-label={lang === "ko" ? "메뉴 열기" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <span className={styles.menuIcon}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <nav 
        className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavOpen : ""}`}
        aria-label="Mobile Navigation"
      >
        <ul>
          <li>
            <Link href={`/${lang}`} onClick={closeMenu}>
              {dictionary.nav.home}
            </Link>
          </li>
          <li>
            <Link href={`/${lang}/about`} onClick={closeMenu}>
              {dictionary.nav.about}
            </Link>
          </li>
          <li>
            <Link href={`/${lang}/services`} onClick={closeMenu}>
              {dictionary.nav.services}
            </Link>
          </li>
          <li>
            <Link href={`/${lang}/careers`} onClick={closeMenu}>
              {dictionary.nav.careers}
            </Link>
          </li>
          <li>
            <Link href={`/${lang}/location`} onClick={closeMenu}>
              {dictionary.nav.location}
            </Link>
          </li>
        </ul>
      </nav>
      <div 
        className={`${styles.mobileOverlay} ${isMenuOpen ? styles.mobileOverlayOpen : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />
    </header>
  );
}
