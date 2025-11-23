import type { Metadata } from "next";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import Link from "next/link";
import styles from "./page.module.scss";
import { generateMetadata as genMeta, generateStructuredData } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);
  return genMeta(locale, dictionary, {
    pageTitle: dictionary.services.title,
    pageDescription: dictionary.services.description,
    path: "/services",
    keywords: [
      "SDV",
      "software defined vehicle",
      "software defined fleet",
      "TAP",
      "autonomous mobility platform",
      "smart mobility",
      "vehicle software",
      "fleet management",
      "autonomous driving platform",
      lang === "ko" ? "소프트웨어 정의 차량" : "software defined vehicle",
      lang === "ko" ? "소프트웨어 정의 플릿" : "software defined fleet",
      lang === "ko" ? "자율주행 모빌리티 플랫폼" : "autonomous mobility platform",
      lang === "ko" ? "스마트 모빌리티" : "smart mobility",
      lang === "ko" ? "차량 소프트웨어" : "vehicle software",
      lang === "ko" ? "플릿 관리" : "fleet management",
    ],
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);
  const serviceData = generateStructuredData(locale, dictionary, "Service", undefined, "/services");
  const breadcrumbData = generateStructuredData(locale, dictionary, "BreadcrumbList", undefined, "/services");

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
      {/* Hero Section */}
      <section className={styles.hero} aria-labelledby="services-title">
        <div className="container">
          <h1 id="services-title" className={styles.heroTitle}>{dictionary.services.title}</h1>
          <p className={styles.heroSubtitle}>{dictionary.services.subtitle}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className={`${styles.content} section`}>
        <div className="container">
          <div className={styles.description}>
            <p>{dictionary.services.description}</p>
          </div>

          {/* Services Grid */}
          <div className={styles.servicesGrid} role="list">
            <article className={styles.serviceCard} role="listitem">
              <span className={styles.serviceIcon} aria-hidden="true">🚀</span>
              <h3 className={styles.serviceTitle}>
                {dictionary.services.digitalStrategy.title}
              </h3>
              <p className={styles.serviceDesc}>
                {dictionary.services.digitalStrategy.description}
              </p>
            </article>
            <article className={styles.serviceCard} role="listitem">
              <span className={styles.serviceIcon} aria-hidden="true">💻</span>
              <h3 className={styles.serviceTitle}>
                {dictionary.services.webDevelopment.title}
              </h3>
              <p className={styles.serviceDesc}>
                {dictionary.services.webDevelopment.description}
              </p>
            </article>
            <article className={styles.serviceCard} role="listitem">
              <span className={styles.serviceIcon} aria-hidden="true">📊</span>
              <h3 className={styles.serviceTitle}>
                {dictionary.services.dataAnalytics.title}
              </h3>
              <p className={styles.serviceDesc}>
                {dictionary.services.dataAnalytics.description}
              </p>
            </article>
          </div>

          {/* CTA */}
          <div className={styles.cta}>
            <Link 
              href={`/${locale}/location`} 
              className="btn btn-primary"
              aria-label={dictionary.location.title}
            >
              {dictionary.location.title}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

