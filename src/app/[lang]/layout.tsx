import type { Metadata } from "next";
import "../globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { i18n, type Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import { generateStructuredData } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://company.ai";
  const localeCode = locale === "ko" ? "ko_KR" : "en_US";
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

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

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
  const structuredData = generateStructuredData(locale, dictionary, "WebSite");
  const organizationData = generateStructuredData(locale, dictionary, "Organization");

  return (
    <>
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
      <a
        href="#main-content"
        className="skip-link"
        aria-label={locale === "ko" ? "본문으로 건너뛰기" : "Skip to main content"}
      >
        {locale === "ko" ? "본문으로 건너뛰기" : "Skip to main content"}
      </a>
      <Header lang={locale} dictionary={dictionary} />
      <main id="main-content" className="main-content" role="main">
        {children}
      </main>
      <Footer lang={locale} dictionary={dictionary} />
    </>
  );
}
