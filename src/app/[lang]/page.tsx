/**
 * 홈 페이지 컴포넌트
 * 
 * 사이트의 메인 랜딩 페이지입니다.
 * - Hero 섹션
 * - 회사 소개 미리보기
 * - 통계 슬라이더
 * - 서비스 미리보기
 * - 기술 섹션
 * - 비전 섹션
 * - 채용 미리보기
 * - CTA 섹션
 */

import type { Metadata } from "next";
import styles from "./page.module.scss";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import Link from "next/link";
import { generateMetadata as genMeta, generateStructuredData } from "@/lib/metadata";
import LazySection from "@/components/common/LazySection";
import StatsSwiper from "@/components/common/StatsSwiper";

/**
 * 홈 페이지 메타데이터 생성 함수
 * 
 * SEO 최적화를 위한 메타데이터를 생성합니다.
 * 
 * @param params - 동적 라우트 파라미터 (lang 포함)
 * @returns Metadata 객체
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);
  return genMeta(locale, dictionary, {
    pageTitle: dictionary.home.title,
    pageDescription: dictionary.home.description,
    // SEO 키워드 (언어별로 다르게 설정)
    keywords: [
      "company",
      "mobility AI",
      "autonomous driving",
      "SDV", // Software Defined Vehicle
      "software defined vehicle",
      "TAP", // Transport Autonomous Platform
      "mobility platform",
      "autonomous vehicle",
      "frictionless mobility",
      // 언어별 키워드
      lang === "ko" ? "모빌리티 AI" : "mobility AI",
      lang === "ko" ? "자율주행" : "autonomous driving",
      lang === "ko" ? "소프트웨어 정의 차량" : "software defined vehicle",
      lang === "ko" ? "자율주행 모빌리티" : "autonomous mobility",
      lang === "ko" ? "모빌리티 플랫폼" : "mobility platform",
    ],
  });
}

/**
 * 홈 페이지 컴포넌트
 * 
 * @param params - 동적 라우트 파라미터 (lang 포함)
 * @returns 홈 페이지 JSX
 * 
 * @description
 * - 여러 섹션으로 구성된 랜딩 페이지
 * - LazySection을 사용하여 지연 로딩 최적화
 * - 구조화된 데이터(JSON-LD) 포함하여 SEO 최적화
 */
export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);
  
  // 구조화된 데이터 생성 (SEO 최적화)
  // WebPage 타입: 웹페이지 정보
  const webPageData = generateStructuredData(locale, dictionary, "WebPage");
  // BreadcrumbList 타입: breadcrumb 네비게이션
  const breadcrumbData = generateStructuredData(locale, dictionary, "BreadcrumbList");

  return (
    <>
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
      {/* Hero Section - 메인 히어로 섹션 */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className="container">
          <h1 id="hero-title" className={styles.heroTitle}>{dictionary.home.title}</h1>
          <p className={styles.heroSubtitle}>{dictionary.home.description}</p>
          {/* CTA 버튼 */}
          <Link 
            href={`/${locale}/location`} 
            className={`btn btn-primary ${styles.ctaButton}`}
            aria-label={dictionary.home.getStarted}
          >
            {dictionary.home.getStarted}
          </Link>
        </div>
      </section>

      {/* About Preview Section - 회사 소개 미리보기 */}
      <LazySection className={`${styles.preview} section`}>
        <div className="container">
          <div className={styles.previewContent}>
            <h2 id="about-preview-title" className="section-title">{dictionary.about.title}</h2>
            {/* 설명의 첫 150자만 표시 */}
            <p className={styles.previewText}>
              {dictionary.about.description.substring(0, 150)}...
            </p>
            <Link 
              href={`/${locale}/about`} 
              className="btn btn-primary"
              aria-label={`${dictionary.home.learnMore} - ${dictionary.about.title}`}
            >
              {dictionary.home.learnMore}
            </Link>
          </div>
        </div>
      </LazySection>

      {/* Stats Section - 통계 슬라이더 섹션 */}
      <LazySection className={`${styles.stats} section`} aria-labelledby="stats-title">
        <div className="container">
          <h2 id="stats-title" className={styles.statsTitle}>{dictionary.home.stats.title}</h2>
          <StatsSwiper dictionary={dictionary.home.stats} />
        </div>
      </LazySection>

      {/* Services Preview Section */}
      <LazySection 
        className={`${styles.preview} ${styles.servicesSection} section`}
        aria-labelledby="services-preview-title"
      >
        <div className="container">
          <h2 id="services-preview-title" className="section-title">{dictionary.services.title}</h2>
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
          <div className={styles.servicesButtonWrapper}>
            <Link 
              href={`/${locale}/services`} 
              className="btn btn-primary"
              aria-label={dictionary.home.viewAllServices}
            >
              {dictionary.home.viewAllServices}
            </Link>
          </div>
        </div>
      </LazySection>

      {/* Technology Section */}
      <LazySection className={`${styles.technology} section`} aria-labelledby="technology-title">
        <div className="container">
          <div className={styles.technologyHeader}>
            <h2 id="technology-title" className="section-title">{dictionary.home.technology.title}</h2>
            <p className={styles.technologySubtitle}>{dictionary.home.technology.subtitle}</p>
          </div>
          <div className={styles.technologyGrid} role="list">
            <article className={styles.technologyCard} role="listitem">
              <div className={styles.technologyIcon}>🤖</div>
              <h3 className={styles.technologyTitle}>
                {dictionary.home.technology.ai.title}
              </h3>
              <p className={styles.technologyDesc}>
                {dictionary.home.technology.ai.description}
              </p>
            </article>
            <article className={styles.technologyCard} role="listitem">
              <div className={styles.technologyIcon}>💾</div>
              <h3 className={styles.technologyTitle}>
                {dictionary.home.technology.software.title}
              </h3>
              <p className={styles.technologyDesc}>
                {dictionary.home.technology.software.description}
              </p>
            </article>
            <article className={styles.technologyCard} role="listitem">
              <div className={styles.technologyIcon}>🌐</div>
              <h3 className={styles.technologyTitle}>
                {dictionary.home.technology.platform.title}
              </h3>
              <p className={styles.technologyDesc}>
                {dictionary.home.technology.platform.description}
              </p>
            </article>
          </div>
        </div>
      </LazySection>

      {/* Vision Section */}
      <LazySection className={`${styles.vision} section`} aria-labelledby="vision-title">
        <div className="container">
          <div className={styles.visionContent}>
            <h2 id="vision-title" className={styles.visionTitle}>{dictionary.home.vision.title}</h2>
            <h3 className={styles.visionSubtitle}>{dictionary.home.vision.subtitle}</h3>
            <p className={styles.visionDescription}>{dictionary.home.vision.description}</p>
          </div>
        </div>
      </LazySection>

      {/* Careers Preview Section */}
      <LazySection className={`${styles.careersPreview} section`} aria-labelledby="careers-preview-title">
        <div className="container">
          <div className={styles.careersPreviewContent}>
            <h2 id="careers-preview-title" className={styles.careersPreviewTitle}>
              {dictionary.home.careersPreview.title}
            </h2>
            <p className={styles.careersPreviewDescription}>
              {dictionary.home.careersPreview.description}
            </p>
            <Link
              href={`/${locale}/careers`}
              className="btn btn-primary"
              aria-label={dictionary.home.careersPreview.button}
            >
              {dictionary.home.careersPreview.button}
            </Link>
          </div>
        </div>
      </LazySection>

      {/* CTA Section */}
      <LazySection className={`${styles.cta} section`} aria-labelledby="cta-title">
        <div className="container">
          <h2 id="cta-title" className={styles.ctaTitle}>{dictionary.location.subtitle}</h2>
          <Link
            href={`/${locale}/location`}
            className={`btn ${styles.ctaButtonAlt}`}
            aria-label={dictionary.location.title}
          >
            {dictionary.location.title}
          </Link>
        </div>
      </LazySection>
    </>
  );
}
