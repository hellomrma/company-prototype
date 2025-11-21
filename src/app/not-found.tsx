import Link from "next/link";
import { headers } from "next/headers";
import { getDictionary } from "@/get-dictionary";
import { i18n, type Locale } from "@/i18n-config";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import styles from "./not-found.module.css";

export default async function NotFound() {
  // URL에서 locale 추출 시도
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // pathname에서 locale 추출
  let locale: Locale = i18n.defaultLocale;
  if (pathname) {
    const pathSegments = pathname.split("/").filter(Boolean);
    if (pathSegments.length > 0 && i18n.locales.includes(pathSegments[0] as Locale)) {
      locale = pathSegments[0] as Locale;
    }
  }

  const dictionary = await getDictionary(locale);

  return (
    <>
      <Header lang={locale} dictionary={dictionary} />
      <main id="main-content" className="main-content" role="main">
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>{dictionary.notFound.title}</h1>
            <h2 className={styles.subtitle}>{dictionary.notFound.subtitle}</h2>
            <p className={styles.description}>{dictionary.notFound.description}</p>
            <Link href={`/${locale}`} className="btn btn-primary">
              {dictionary.notFound.backHome}
            </Link>
          </div>
        </div>
      </main>
      <Footer lang={locale} dictionary={dictionary} />
    </>
  );
}

