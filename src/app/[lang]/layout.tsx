/**
 * 언어별 레이아웃 컴포넌트
 * 
 * 이 컴포넌트는 [lang] 동적 라우트의 레이아웃입니다.
 * 모든 언어별 페이지에 공통으로 적용됩니다.
 * - Header와 Footer 포함
 * - 언어별 메타데이터 생성
 * - 구조화된 데이터(JSON-LD) 추가
 * - 접근성 기능 (skip link)
 */

import type { Metadata } from "next";
import "../globals.scss";
// Swiper 라이브러리 스타일 import
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { i18n, type Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import { generateStructuredData } from "@/lib/metadata";

/**
 * 언어별 메타데이터 생성 함수
 * 
 * Next.js의 generateMetadata를 사용하여 동적으로 메타데이터를 생성합니다.
 * 각 언어별로 적절한 메타데이터를 제공합니다.
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://company.ai";
  const localeCode = locale === "ko" ? "ko_KR" : "en_US"; // 로케일 코드 변환
  const title = `${dictionary.footer.company.name} | ${dictionary.home.title}`;
  const description = dictionary.home.description;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords: [
      dictionary.footer.company.name.toLowerCase(),
      "business",
      "solutions",
      "digital strategy",
      "web development",
      "data analytics",
      locale === "ko" ? "기업 솔루션" : "enterprise solutions",
    ],
    authors: [{ name: dictionary.footer.company.name }],
    creator: dictionary.footer.company.name,
    publisher: dictionary.footer.company.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: localeCode,
      url: `${baseUrl}/${locale}`,
      title,
      description,
      siteName: dictionary.footer.company.name,
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: dictionary.footer.company.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        "ko-KR": `${baseUrl}/ko`,
        "en-US": `${baseUrl}/en`,
        "x-default": `${baseUrl}/${locale}`,
      },
    },
  };
}

/**
 * 정적 경로 생성 함수
 * 
 * Next.js의 generateStaticParams를 사용하여 빌드 시 모든 언어별 경로를 생성합니다.
 * 이렇게 하면 모든 언어 버전이 정적으로 생성되어 성능이 향상됩니다.
 * 
 * @returns 언어별 파라미터 배열
 */
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

/**
 * 언어별 루트 레이아웃 컴포넌트
 * 
 * @param children - 자식 컴포넌트 (페이지 콘텐츠)
 * @param params - 동적 라우트 파라미터 (lang 포함)
 * @returns 레이아웃 JSX
 * 
 * @description
 * - 언어별 딕셔너리를 로드합니다
 * - 구조화된 데이터(JSON-LD)를 생성하여 SEO를 최적화합니다
 * - 접근성을 위한 skip link를 제공합니다
 * - Header와 Footer를 포함합니다
 */
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);
  
  // 구조화된 데이터 생성 (SEO 최적화)
  // WebSite 타입: 웹사이트 전체 정보
  const structuredData = generateStructuredData(locale, dictionary, "WebSite");
  // Organization 타입: 회사 조직 정보
  const organizationData = generateStructuredData(locale, dictionary, "Organization");

  return (
    <>
      {/* JSON-LD 구조화된 데이터 (검색 엔진 최적화) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData),
        }}
      />
      {/* Skip to main content link for accessibility */}
      {/* 키보드 사용자가 네비게이션을 건너뛰고 본문으로 바로 이동할 수 있는 링크 */}
      <a
        href="#main-content"
        className="skip-link"
        aria-label={locale === "ko" ? "본문으로 건너뛰기" : "Skip to main content"}
      >
        {locale === "ko" ? "본문으로 건너뛰기" : "Skip to main content"}
      </a>
      {/* 헤더 컴포넌트 */}
      <Header lang={locale} dictionary={dictionary} />
      {/* 메인 콘텐츠 영역 */}
      <main id="main-content" className="main-content" role="main">
        {children}
      </main>
      {/* 푸터 컴포넌트 */}
      <Footer lang={locale} dictionary={dictionary} />
    </>
  );
}
