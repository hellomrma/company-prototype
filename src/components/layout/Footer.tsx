import styles from "./Footer.module.css";
import { Locale } from "@/i18n-config";
import type { Dictionary } from "@/types/dictionary";

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
        <div className={styles.column}>
          <h3>{dictionary.footer.company.name}</h3>
          <p>{dictionary.footer.company.description}</p>
        </div>
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
        <div className={styles.column}>
          <h3>{dictionary.footer.contact}</h3>
          <address>
            <ul aria-label="Contact Information">
              <li>
                <a href={`mailto:${dictionary.footer.email}`} aria-label={`Email: ${dictionary.footer.email}`}>
                  {dictionary.footer.email}
                </a>
              </li>
              <li>
                <a href={`tel:${dictionary.footer.phone.replace(/[^\d+]/g, "")}`} aria-label={`Phone: ${dictionary.footer.phone}`}>
                  {dictionary.footer.phone}
                </a>
              </li>
            </ul>
          </address>
        </div>
      </div>
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} {dictionary.footer.copyright}</p>
      </div>
    </footer>
  );
}
