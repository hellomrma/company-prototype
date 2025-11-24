/**
 * 메타데이터 생성 유틸리티 모듈
 * 
 * 이 모듈은 Next.js의 Metadata API를 사용하여 SEO 최적화된 메타데이터를 생성합니다.
 * Open Graph, Twitter Cards, 구조화된 데이터(JSON-LD) 등을 포함합니다.
 */

import type { Metadata } from "next";
import type { Locale } from "@/i18n-config";
import { i18n } from "@/i18n-config";
import type { Dictionary } from "@/types/dictionary";

/**
 * 기본 사이트 URL
 * 환경 변수에서 가져오거나 기본값 사용
 */
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://company.ai";

/**
 * 메타데이터 생성 옵션 타입
 * 
 * @property pageTitle - 페이지 제목 (선택적, 없으면 기본 제목 사용)
 * @property pageDescription - 페이지 설명 (선택적, 없으면 기본 설명 사용)
 * @property path - 페이지 경로 (URL 생성용)
 * @property keywords - SEO 키워드 배열 (선택적)
 * @property ogImage - Open Graph 이미지 URL (선택적)
 * @property ogType - Open Graph 타입 ("website" | "article")
 * @property noindex - 검색 엔진 인덱싱 차단 여부
 * @property customMetadata - 추가 커스텀 메타데이터 (Next.js Metadata 타입)
 */
export type MetadataOptions = {
  pageTitle?: string;
  pageDescription?: string;
  path?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: "website" | "article";
  noindex?: boolean;
  customMetadata?: Partial<Metadata>;
};

/**
 * 페이지 메타데이터 생성 함수
 * 
 * SEO 최적화를 위한 완전한 메타데이터 객체를 생성합니다.
 * Open Graph, Twitter Cards, 다국어 지원 등을 포함합니다.
 * 
 * @param lang - 현재 언어 코드
 * @param dictionary - 다국어 딕셔너리 객체
 * @param options - 메타데이터 생성 옵션
 * @returns Next.js Metadata 객체
 * 
 * @example
 * ```typescript
 * const metadata = generateMetadata("ko", dictionary, {
 *   pageTitle: "회사 소개",
 *   path: "/about"
 * });
 * ```
 */
export function generateMetadata(
  lang: Locale,
  dictionary: Dictionary,
  options: MetadataOptions = {}
): Metadata {
  // 옵션에서 값 추출 (기본값 설정)
  const {
    pageTitle,
    pageDescription,
    path = "",
    keywords,
    ogImage,
    ogType = "website",
    noindex = false,
    customMetadata = {},
  } = options;

  // 페이지 제목 생성 (페이지 제목이 있으면 "페이지 제목 | 회사명" 형식)
  const title = pageTitle
    ? `${pageTitle} | ${dictionary.footer.company.name}`
    : `${dictionary.footer.company.name} | ${dictionary.home.title}`;
  // 페이지 설명 (없으면 홈 설명 사용)
  const description = pageDescription || dictionary.home.description;
  // 완전한 URL 생성
  const url = `${baseUrl}/${lang}${path}`;
  // 로케일 코드 변환 (ko -> ko_KR, en -> en_US)
  const localeCode = lang === "ko" ? "ko_KR" : "en_US";

  // 기본 SEO 키워드 배열 (언어별로 다르게 설정)
  const defaultKeywords = [
    dictionary.footer.company.name.toLowerCase(),
    "mobility AI",
    "autonomous driving",
    "SDV", // Software Defined Vehicle
    "software defined vehicle",
    "TAP", // Transport Autonomous Platform
    "mobility platform",
    // 언어별 키워드
    lang === "ko" ? "모빌리티 AI" : "mobility AI",
    lang === "ko" ? "자율주행" : "autonomous vehicle",
    lang === "ko" ? "소프트웨어 정의 차량" : "software defined vehicle",
  ];

  // 기본 메타데이터 객체 생성
  const baseMetadata: Metadata = {
    // 메타데이터의 기본 URL
    metadataBase: new URL(baseUrl),
    // 페이지 제목
    title,
    // 페이지 설명
    description,
    // SEO 키워드 (사용자 제공 또는 기본값)
    keywords: keywords || defaultKeywords,
    // 작성자 정보
    authors: [{ name: dictionary.footer.company.name }],
    // 콘텐츠 생성자
    creator: dictionary.footer.company.name,
    // 출판사
    publisher: dictionary.footer.company.name,
    // 검색 엔진 크롤링 설정
    robots: noindex
      ? {
          // 인덱싱 차단
          index: false,
          follow: false,
        }
      : {
          // 인덱싱 허용
          index: true,
          follow: true,
          // Google 봇 특별 설정
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1, // 비디오 미리보기 제한 없음
            "max-image-preview": "large", // 큰 이미지 미리보기 허용
            "max-snippet": -1, // 스니펫 길이 제한 없음
          },
        },
    // Open Graph 메타데이터 (Facebook, LinkedIn 등 소셜 미디어 공유용)
    openGraph: {
      type: ogType, // "website" 또는 "article"
      locale: localeCode, // 언어 코드
      url, // 페이지 URL
      title, // 공유 시 표시될 제목
      description, // 공유 시 표시될 설명
      siteName: dictionary.footer.company.name, // 사이트 이름
      images: [
        {
          url: ogImage || `${baseUrl}/og-image.jpg`, // OG 이미지 URL
          width: 1200, // 권장 크기
          height: 630, // 권장 크기
          alt: dictionary.footer.company.name, // 대체 텍스트
        },
      ],
    },
    // Twitter Card 메타데이터 (Twitter 공유용)
    twitter: {
      card: "summary_large_image", // 큰 이미지가 있는 카드 형식
      title,
      description,
      images: [ogImage || `${baseUrl}/og-image.jpg`],
    },
    // 다국어 대체 링크 (hreflang 태그 생성)
    // 모든 언어 버전을 포함하여 검색 엔진이 언어 간 관계를 이해할 수 있도록 함
    alternates: {
      canonical: url, // 표준 URL (중복 콘텐츠 방지)
      languages: {
        // 모든 지원 언어 버전 포함
        "ko-KR": `${baseUrl}/ko${path}`, // 한국어 버전
        "en-US": `${baseUrl}/en${path}`, // 영어 버전
        // x-default: 지원하지 않는 언어/지역 사용자를 위한 기본 언어 버전 (기본 언어로 고정)
        "x-default": `${baseUrl}/${i18n.defaultLocale}${path}`,
      },
    },
  };

  // 커스텀 메타데이터로 병합 (덮어쓰기)
  // 중첩된 객체는 수동으로 병합하여 완전한 병합 보장
  return {
    ...baseMetadata,
    ...customMetadata,
    // Open Graph는 중첩 객체이므로 수동 병합
    openGraph: {
      ...baseMetadata.openGraph,
      ...(customMetadata.openGraph || {}),
      // 이미지는 커스텀 우선, 없으면 기본값 사용
      images: customMetadata.openGraph?.images || baseMetadata.openGraph?.images,
    },
    // Twitter도 중첩 객체이므로 수동 병합
    twitter: {
      ...baseMetadata.twitter,
      ...(customMetadata.twitter || {}),
    },
    // Alternates도 중첩 객체이므로 수동 병합
    alternates: {
      ...baseMetadata.alternates,
      ...(customMetadata.alternates || {}),
    },
  };
}

/**
 * 구조화된 데이터(JSON-LD) 생성 함수
 * 
 * Schema.org 표준을 따르는 구조화된 데이터를 생성합니다.
 * 검색 엔진이 콘텐츠를 더 잘 이해하고 리치 스니펫을 표시할 수 있도록 합니다.
 * 
 * @param lang - 현재 언어 코드
 * @param dictionary - 다국어 딕셔너리 객체
 * @param type - 구조화된 데이터 타입
 *   - "Organization": 조직 정보
 *   - "WebSite": 웹사이트 정보
 *   - "WebPage": 웹페이지 정보
 *   - "LocalBusiness": 지역 비즈니스 정보
 *   - "Article": 기사 정보
 *   - "Service": 서비스 정보
 *   - "BreadcrumbList": breadcrumb 네비게이션
 * @param branch - 지점 정보 (LocalBusiness 타입일 때 필요)
 * @param path - 페이지 경로
 * @returns JSON-LD 구조화된 데이터 객체
 */
export function generateStructuredData(
  lang: Locale,
  dictionary: Dictionary,
  type: "Organization" | "WebSite" | "WebPage" | "LocalBusiness" | "Article" | "Service" | "BreadcrumbList" = "WebSite",
  branch?: "seoul" | "shanghai",
  path?: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://company.ai";
  const url = `${baseUrl}/${lang}`;

  // Organization 타입: 회사 조직 정보
  if (type === "Organization") {
    // 여러 지역의 오피스 정보 포함 (서울, 상하이)
    const locations = [
      {
        "@type": "PostalAddress",
        addressCountry: dictionary.location.seoul.country,
        addressLocality: dictionary.location.seoul.city,
        streetAddress: dictionary.location.seoul.address,
      },
      {
        "@type": "PostalAddress",
        addressCountry: dictionary.location.shanghai.country,
        addressLocality: dictionary.location.shanghai.city,
        streetAddress: dictionary.location.shanghai.address,
      },
    ];

    return {
      "@context": "https://schema.org", // Schema.org 컨텍스트
      "@type": "Organization", // 타입: 조직
      name: dictionary.footer.company.name, // 회사명
      description: dictionary.footer.company.description, // 회사 설명
      url: baseUrl, // 회사 웹사이트 URL
      logo: `${baseUrl}/logo.png`, // 로고 이미지 URL
      contactPoint: {
        "@type": "ContactPoint", // 연락처 정보
        telephone: dictionary.footer.phone, // 전화번호
        contactType: "customer service", // 연락처 유형
        email: dictionary.footer.email, // 이메일
        availableLanguage: ["ko", "en"], // 지원 언어
      },
      address: locations, // 주소 목록
      sameAs: [
        // 소셜 미디어 링크 (필요시 추가)
        // 예: "https://www.facebook.com/company",
        //     "https://www.linkedin.com/company/company"
      ],
    };
  }

  // LocalBusiness 타입: 지역 비즈니스 정보 (지점별)
  if (type === "LocalBusiness" && branch) {
    const locationData = dictionary.location[branch];
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness", // 타입: 지역 비즈니스
      name: locationData.company, // 지점명
      description: dictionary.footer.company.description,
      address: {
        "@type": "PostalAddress", // 주소 정보
        addressCountry: locationData.country, // 국가
        addressLocality: locationData.city, // 도시
        streetAddress: locationData.address, // 상세 주소
      },
      geo: {
        "@type": "GeoCoordinates", // 지리적 좌표
        latitude: locationData.latitude, // 위도
        longitude: locationData.longitude, // 경도
      },
      telephone: locationData.phone, // 전화번호
      email: locationData.email, // 이메일
      url: `${baseUrl}/${lang}/location/${branch}`, // 지점 페이지 URL
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification", // 영업 시간
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], // 영업일
        opens: "09:00", // 오픈 시간
        closes: "18:00", // 마감 시간
      },
    };
  }

  // WebSite 타입: 웹사이트 전체 정보
  if (type === "WebSite") {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite", // 타입: 웹사이트
      name: dictionary.footer.company.name,
      url: baseUrl,
      alternateName: [
        // 다국어 버전 정보
        {
          "@type": "WebSite",
          name: dictionary.footer.company.name,
          url: `${baseUrl}/ko`, // 한국어 버전
          inLanguage: "ko-KR",
        },
        {
          "@type": "WebSite",
          name: dictionary.footer.company.name,
          url: `${baseUrl}/en`, // 영어 버전
          inLanguage: "en-US",
        },
      ],
      potentialAction: {
        "@type": "SearchAction", // 검색 기능 (Google 검색 박스에 표시 가능)
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${baseUrl}/search?q={search_term_string}`, // 검색 URL 템플릿
        },
        "query-input": "required name=search_term_string", // 검색어 입력 필수
      },
    };
  }

  // Article 타입: 기사/블로그 포스트 정보
  if (type === "Article") {
    const articleUrl = path ? `${baseUrl}/${lang}${path}` : url;
    return {
      "@context": "https://schema.org",
      "@type": "Article", // 타입: 기사
      headline: dictionary.about.title, // 헤드라인
      description: dictionary.about.description, // 설명
      author: {
        "@type": "Organization", // 작성자 (조직)
        name: dictionary.footer.company.name,
      },
      publisher: {
        "@type": "Organization", // 출판사
        name: dictionary.footer.company.name,
        logo: {
          "@type": "ImageObject", // 로고 이미지
          url: `${baseUrl}/logo.png`,
        },
      },
      datePublished: "2024-01-01", // 발행일
      dateModified: new Date().toISOString().split("T")[0], // 수정일 (오늘 날짜)
      mainEntityOfPage: {
        "@type": "WebPage", // 메인 페이지
        "@id": articleUrl, // 페이지 URL
      },
      inLanguage: lang === "ko" ? "ko_KR" : "en_US", // 언어
    };
  }

  // Service 타입: 제공 서비스 정보
  if (type === "Service") {
    const serviceUrl = path ? `${baseUrl}/${lang}${path}` : url;
    return {
      "@context": "https://schema.org",
      "@type": "Service", // 타입: 서비스
      serviceType: "Mobility AI Solutions", // 서비스 유형
      provider: {
        "@type": "Organization", // 서비스 제공자
        name: dictionary.footer.company.name,
      },
      areaServed: {
        "@type": "Country", // 서비스 지역
        name: ["South Korea", "China", "Global"], // 한국, 중국, 글로벌
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog", // 제공 서비스 카탈로그
        name: dictionary.services.title,
        itemListElement: [
          // 디지털 전략 서비스
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: dictionary.services.digitalStrategy.title,
              description: dictionary.services.digitalStrategy.description,
            },
          },
          // 웹 개발 서비스
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: dictionary.services.webDevelopment.title,
              description: dictionary.services.webDevelopment.description,
            },
          },
          // 데이터 분석 서비스
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: dictionary.services.dataAnalytics.title,
              description: dictionary.services.dataAnalytics.description,
            },
          },
        ],
      },
      url: serviceUrl, // 서비스 페이지 URL
      inLanguage: lang === "ko" ? "ko_KR" : "en_US",
    };
  }

  // BreadcrumbList 타입: breadcrumb 네비게이션 정보
  if (type === "BreadcrumbList") {
    const breadcrumbPath = path || "";
    // 경로를 세그먼트로 분할 (빈 문자열 제거)
    const pathSegments = breadcrumbPath.split("/").filter(Boolean);
    // breadcrumb 항목 배열 (홈부터 시작)
    const items = [
      {
        "@type": "ListItem", // 리스트 항목
        position: 1, // 첫 번째 위치
        name: dictionary.nav.home, // "홈"
        item: `${baseUrl}/${lang}`, // 홈 URL
      },
    ];

    // 현재 경로 추적 (언어 코드 포함)
    let currentPath = `/${lang}`;
    // 각 경로 세그먼트를 breadcrumb 항목으로 추가
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      // 세그먼트 이름 포맷팅 (kebab-case -> Title Case)
      // 예: "about-us" -> "About Us"
      const segmentName = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      
      items.push({
        "@type": "ListItem",
        position: index + 2, // 위치 (홈 다음부터)
        name: segmentName, // 세그먼트 이름
        item: `${baseUrl}${currentPath}`, // 세그먼트 URL
      });
    });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList", // 타입: breadcrumb 리스트
      itemListElement: items, // breadcrumb 항목 배열
    };
  }

  // 기본값: WebPage 타입 (다른 타입이 매칭되지 않을 때)
  return {
    "@context": "https://schema.org",
    "@type": "WebPage", // 타입: 웹페이지
    name: dictionary.footer.company.name,
    url: path ? `${baseUrl}/${lang}${path}` : url, // 페이지 URL
    inLanguage: lang === "ko" ? "ko_KR" : "en_US", // 언어
    isPartOf: {
      "@type": "WebSite", // 이 페이지가 속한 웹사이트
      name: dictionary.footer.company.name,
      url: baseUrl,
    },
  };
}

