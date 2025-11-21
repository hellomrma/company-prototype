import type { Metadata } from "next";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { generateMetadata as genMeta, generateStructuredData } from "@/lib/metadata";
import { fetchJobs } from "@/lib/jobs-api";
import CareersClient from "./CareersClient";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);
  return genMeta(locale, dictionary, {
    pageTitle: dictionary.careers.title,
    pageDescription: dictionary.careers.description,
    path: "/careers",
    keywords: [
      "company careers",
      "jobs at company",
      "hiring",
      "recruitment",
      "job openings",
      "engineering jobs",
      "AI jobs",
      "mobility jobs",
      "autonomous driving jobs",
      "software engineering",
      "career opportunities",
      lang === "ko" ? "company 채용" : "company careers",
      lang === "ko" ? "채용 공고" : "job openings",
      lang === "ko" ? "구인" : "hiring",
      lang === "ko" ? "엔지니어링 채용" : "engineering jobs",
      lang === "ko" ? "AI 채용" : "AI jobs",
      lang === "ko" ? "모빌리티 채용" : "mobility jobs",
      lang === "ko" ? "자율주행 채용" : "autonomous driving jobs",
      lang === "ko" ? "소프트웨어 엔지니어" : "software engineer",
    ],
  });
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);
  const webPageData = generateStructuredData(locale, dictionary, "WebPage", undefined, "/careers");
  const breadcrumbData = generateStructuredData(locale, dictionary, "BreadcrumbList", undefined, "/careers");
  
  // API에서 채용 공고 가져오기
  const jobs = await fetchJobs();

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
      {/* Hero Section */}
      <section className={styles.hero} aria-labelledby="careers-title">
        <div className="container">
          <h1 id="careers-title" className={styles.heroTitle}>{dictionary.careers.title}</h1>
          <p className={styles.heroSubtitle}>{dictionary.careers.subtitle}</p>
          <p className={styles.heroDescription}>{dictionary.careers.description}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className={`${styles.content} section`}>
        <div className="container">
          <CareersClient jobs={jobs} dictionary={dictionary.careers} locale={locale} />
        </div>
      </section>
    </div>
  );
}

