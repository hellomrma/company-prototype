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
    pageTitle: dictionary.about.title,
    pageDescription: dictionary.about.description,
    path: "/about",
    keywords: [
      "company",
      "about company",
      "company introduction",
      "mobility AI company",
      "SDV technology",
      "mission",
      "core values",
      "innovation",
      "autonomous driving",
      lang === "ko" ? "company 소개" : "about company",
      lang === "ko" ? "회사 소개" : "company introduction",
      lang === "ko" ? "모빌리티 AI 기업" : "mobility AI company",
      lang === "ko" ? "미션" : "mission",
      lang === "ko" ? "핵심 가치" : "core values",
      lang === "ko" ? "혁신" : "innovation",
    ],
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);
  const articleData = generateStructuredData(locale, dictionary, "Article", undefined, "/about");
  const breadcrumbData = generateStructuredData(locale, dictionary, "BreadcrumbList", undefined, "/about");

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
      {/* Hero Section */}
      <section className={styles.hero} aria-labelledby="about-title">
        <div className="container">
          <h1 id="about-title" className={styles.heroTitle}>{dictionary.about.title}</h1>
          <p className={styles.heroSubtitle}>{dictionary.about.subtitle}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className={`${styles.content} section`}>
        <div className="container">
          <div className={styles.description}>
            <p>{dictionary.about.description}</p>
          </div>

          {/* Mission Section */}
          <section className={styles.mission} aria-labelledby="mission-title">
            <h2 id="mission-title" className={styles.sectionTitle}>
              {dictionary.about.mission.title}
            </h2>
            <p className={styles.sectionText}>
              {dictionary.about.mission.description}
            </p>
          </section>

          {/* Values Section */}
          <section className={styles.values} aria-labelledby="values-title">
            <h2 id="values-title" className={styles.sectionTitle}>
              {dictionary.about.values.title}
            </h2>
            <div className={styles.valuesGrid} role="list">
              <article className={styles.valueCard} role="listitem">
                <h3>{dictionary.about.values.innovation}</h3>
                <p>{dictionary.about.values.innovationDesc}</p>
              </article>
              <article className={styles.valueCard} role="listitem">
                <h3>{dictionary.about.values.excellence}</h3>
                <p>{dictionary.about.values.excellenceDesc}</p>
              </article>
              <article className={styles.valueCard} role="listitem">
                <h3>{dictionary.about.values.integrity}</h3>
                <p>{dictionary.about.values.integrityDesc}</p>
              </article>
              <article className={styles.valueCard} role="listitem">
                <h3>{dictionary.about.values.collaboration}</h3>
                <p>{dictionary.about.values.collaborationDesc}</p>
              </article>
            </div>
          </section>

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

