/**
 * 헤더 컴포넌트
 * 
 * 사이트의 상단 네비게이션 바를 제공합니다.
 * - 로고/홈 링크
 * - 메인 네비게이션 메뉴
 * - 언어 전환기
 * - 모바일 메뉴 (햄버거 메뉴)
 * 
 * 클라이언트 컴포넌트로, 모바일 메뉴 상태 관리를 위해 필요합니다.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.scss";
import { Locale } from "@/i18n-config";
import type { Dictionary } from "@/types/dictionary";
import LanguageSwitcher from "./LanguageSwitcher";

/**
 * 헤더 컴포넌트
 * 
 * @param lang - 현재 언어 코드
 * @param dictionary - 다국어 딕셔너리 객체
 * @returns 헤더 JSX
 * 
 * @description
 * - 데스크톱과 모바일 모두 지원하는 반응형 헤더
 * - 모바일에서는 햄버거 메뉴로 변환
 * - 접근성 고려 (ARIA 레이블, role 속성)
 */
export default function Header({
  lang,
  dictionary,
}: {
  lang: Locale;
  dictionary: Dictionary;
}) {
  // 모바일 메뉴 열림/닫힘 상태
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /**
   * 모바일 메뉴 토글 함수
   * 메뉴가 열려있으면 닫고, 닫혀있으면 엽니다.
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  /**
   * 모바일 메뉴 닫기 함수
   * 메뉴 항목 클릭 시 메뉴를 닫기 위해 사용됩니다.
   */
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header} role="banner">
      <div className={styles.container}>
        {/* 로고/홈 링크 */}
        <Link 
          href={`/${lang}`} 
          className={styles.logo}
          aria-label={`${dictionary.footer.company.name} - ${lang === "ko" ? "홈으로 이동" : "Go to home"}`}
          onClick={closeMenu}
        >
          {dictionary.footer.company.name}
        </Link>
        {/* 데스크톱 네비게이션 메뉴 */}
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
        {/* 오른쪽 섹션 (언어 전환기 + 햄버거 메뉴) */}
        <div className={styles.rightSection}>
          {/* 언어 전환 컴포넌트 */}
          <LanguageSwitcher currentLang={lang} />
          {/* 모바일 메뉴 토글 버튼 (햄버거 아이콘) */}
          <button
            className={`${styles.menuToggle} ${isMenuOpen ? styles.menuToggleOpen : ""}`}
            onClick={toggleMenu}
            aria-label={lang === "ko" ? "메뉴 열기" : "Open menu"}
            aria-expanded={isMenuOpen} // 접근성: 메뉴 열림 상태 표시
          >
            <span className={styles.menuIcon}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
      {/* 모바일 메뉴 */}
      {/* 모바일 화면에서만 표시되는 네비게이션 메뉴 */}
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
