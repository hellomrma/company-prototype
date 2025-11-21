import type { Metadata } from "next";
import type { Locale } from "@/i18n-config";
import type { Dictionary } from "@/types/dictionary";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://company.ai";

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

export function generateMetadata(
  lang: Locale,
  dictionary: Dictionary,
  options: MetadataOptions = {}
): Metadata {
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

  const title = pageTitle
    ? `${pageTitle} | ${dictionary.footer.company.name}`
    : `${dictionary.footer.company.name} | ${dictionary.home.title}`;
  const description = pageDescription || dictionary.home.description;
  const url = `${baseUrl}/${lang}${path}`;
  const localeCode = lang === "ko" ? "ko_KR" : "en_US";

  const defaultKeywords = [
    dictionary.footer.company.name.toLowerCase(),
    "mobility AI",
    "autonomous driving",
    "SDV",
    "software defined vehicle",
    "TAP",
    "mobility platform",
    lang === "ko" ? "모빌리티 AI" : "mobility AI",
    lang === "ko" ? "자율주행" : "autonomous vehicle",
    lang === "ko" ? "소프트웨어 정의 차량" : "software defined vehicle",
  ];

  const baseMetadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords: keywords || defaultKeywords,
    authors: [{ name: dictionary.footer.company.name }],
    creator: dictionary.footer.company.name,
    publisher: dictionary.footer.company.name,
    robots: noindex
      ? {
          index: false,
          follow: false,
        }
      : {
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
      type: ogType,
      locale: localeCode,
      url,
      title,
      description,
      siteName: dictionary.footer.company.name,
      images: [
        {
          url: ogImage || `${baseUrl}/og-image.jpg`,
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
      images: [ogImage || `${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: url,
      languages: {
        "ko-KR": `${baseUrl}/ko${path}`,
        "en-US": `${baseUrl}/en${path}`,
        "x-default": `${baseUrl}/${lang}${path}`,
      },
    },
  };

  // 커스텀 메타데이터로 병합 (덮어쓰기)
  return {
    ...baseMetadata,
    ...customMetadata,
    // 중첩된 객체는 수동으로 병합
    openGraph: {
      ...baseMetadata.openGraph,
      ...(customMetadata.openGraph || {}),
      images: customMetadata.openGraph?.images || baseMetadata.openGraph?.images,
    },
    twitter: {
      ...baseMetadata.twitter,
      ...(customMetadata.twitter || {}),
    },
    alternates: {
      ...baseMetadata.alternates,
      ...(customMetadata.alternates || {}),
    },
  };
}

export function generateStructuredData(
  lang: Locale,
  dictionary: Dictionary,
  type: "Organization" | "WebSite" | "WebPage" | "LocalBusiness" | "Article" | "Service" | "BreadcrumbList" = "WebSite",
  branch?: "seoul" | "shanghai",
  path?: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://company.ai";
  const url = `${baseUrl}/${lang}`;

  if (type === "Organization") {
    // 여러 지역의 오피스 정보 포함
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
      "@context": "https://schema.org",
      "@type": "Organization",
      name: dictionary.footer.company.name,
      description: dictionary.footer.company.description,
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: dictionary.footer.phone,
        contactType: "customer service",
        email: dictionary.footer.email,
        availableLanguage: ["ko", "en"],
      },
      address: locations,
      sameAs: [
        // Add social media links here
      ],
    };
  }

  if (type === "LocalBusiness" && branch) {
    const locationData = dictionary.location[branch];
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: locationData.company,
      description: dictionary.footer.company.description,
      address: {
        "@type": "PostalAddress",
        addressCountry: locationData.country,
        addressLocality: locationData.city,
        streetAddress: locationData.address,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      },
      telephone: locationData.phone,
      email: locationData.email,
      url: `${baseUrl}/${lang}/location/${branch}`,
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    };
  }

  if (type === "WebSite") {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: dictionary.footer.company.name,
      url: baseUrl,
      alternateName: [
        {
          "@type": "WebSite",
          name: dictionary.footer.company.name,
          url: `${baseUrl}/ko`,
          inLanguage: "ko-KR",
        },
        {
          "@type": "WebSite",
          name: dictionary.footer.company.name,
          url: `${baseUrl}/en`,
          inLanguage: "en-US",
        },
      ],
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${baseUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    };
  }

  if (type === "Article") {
    const articleUrl = path ? `${baseUrl}/${lang}${path}` : url;
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: dictionary.about.title,
      description: dictionary.about.description,
      author: {
        "@type": "Organization",
        name: dictionary.footer.company.name,
      },
      publisher: {
        "@type": "Organization",
        name: dictionary.footer.company.name,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/logo.png`,
        },
      },
      datePublished: "2024-01-01",
      dateModified: new Date().toISOString().split("T")[0],
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": articleUrl,
      },
      inLanguage: lang === "ko" ? "ko_KR" : "en_US",
    };
  }

  if (type === "Service") {
    const serviceUrl = path ? `${baseUrl}/${lang}${path}` : url;
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Mobility AI Solutions",
      provider: {
        "@type": "Organization",
        name: dictionary.footer.company.name,
      },
      areaServed: {
        "@type": "Country",
        name: ["South Korea", "China", "Global"],
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: dictionary.services.title,
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: dictionary.services.digitalStrategy.title,
              description: dictionary.services.digitalStrategy.description,
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: dictionary.services.webDevelopment.title,
              description: dictionary.services.webDevelopment.description,
            },
          },
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
      url: serviceUrl,
      inLanguage: lang === "ko" ? "ko_KR" : "en_US",
    };
  }

  if (type === "BreadcrumbList") {
    const breadcrumbPath = path || "";
    const pathSegments = breadcrumbPath.split("/").filter(Boolean);
    const items = [
      {
        "@type": "ListItem",
        position: 1,
        name: dictionary.nav.home,
        item: `${baseUrl}/${lang}`,
      },
    ];

    let currentPath = `/${lang}`;
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const segmentName = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      
      items.push({
        "@type": "ListItem",
        position: index + 2,
        name: segmentName,
        item: `${baseUrl}${currentPath}`,
      });
    });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items,
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: dictionary.footer.company.name,
    url: path ? `${baseUrl}/${lang}${path}` : url,
    inLanguage: lang === "ko" ? "ko_KR" : "en_US",
    isPartOf: {
      "@type": "WebSite",
      name: dictionary.footer.company.name,
      url: baseUrl,
    },
  };
}

