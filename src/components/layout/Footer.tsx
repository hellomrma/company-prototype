/**
 * 푸터 컴포넌트
 * 
 * 사이트의 하단 푸터를 제공합니다.
 * - 회사 정보
 * - 빠른 링크
 * - 연락처 정보
 * - 저작권 정보
 */

import styles from "./Footer.module.scss";
import { Locale } from "@/i18n-config";
import type { Dictionary } from "@/types/dictionary";

/**
 * 푸터 컴포넌트
 * 
 * @param lang - 현재 언어 코드
 * @param dictionary - 다국어 딕셔너리 객체
 * @returns 푸터 JSX
 * 
 * @description
 * - 3개의 컬럼으로 구성 (회사 정보, 빠른 링크, 연락처)
 * - 접근성 고려 (ARIA 레이블, semantic HTML)
 * - 연락처는 mailto:와 tel: 링크로 제공
 */
export default function Footer({
  lang,
  dictionary,
}: {
  lang: Locale;
  dictionary: Dictionary;
}) {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        {/* 회사 정보 컬럼 */}
        <div className={styles.column}>
          <h3>{dictionary.footer.company.name}</h3>
          <p>{dictionary.footer.company.description}</p>
        </div>
        {/* 빠른 링크 컬럼 */}
        <div className={styles.column}>
          <h3>{dictionary.footer.quickLinks}</h3>
          <nav aria-label="Footer Navigation">
            <ul>
              <li>
                <a href={`/${lang}`}>{dictionary.nav.home}</a>
              </li>
              <li>
                <a href={`/${lang}/about`}>{dictionary.nav.about}</a>
              </li>
              <li>
                <a href={`/${lang}/services`}>{dictionary.nav.services}</a>
              </li>
              <li>
                <a href={`/${lang}/location`}>{dictionary.nav.location}</a>
              </li>
            </ul>
          </nav>
        </div>
        {/* 연락처 컬럼 */}
        <div className={styles.column}>
          <h3>{dictionary.footer.contact}</h3>
          <address>
            <ul aria-label="Contact Information">
              <li>
                {/* 이메일 링크 (mailto:) */}
                <a href={`mailto:${dictionary.footer.email}`} aria-label={`Email: ${dictionary.footer.email}`}>
                  {dictionary.footer.email}
                </a>
              </li>
              <li>
                {/* 전화번호 링크 (tel:) */}
                {/* 전화번호에서 숫자와 +만 남기고 나머지 제거 */}
                <a href={`tel:${dictionary.footer.phone.replace(/[^\d+]/g, "")}`} aria-label={`Phone: ${dictionary.footer.phone}`}>
                  {dictionary.footer.phone}
                </a>
              </li>
            </ul>
          </address>
        </div>
      </div>
      {/* 저작권 정보 */}
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} {dictionary.footer.copyright}</p>
      </div>
    </footer>
  );
}
