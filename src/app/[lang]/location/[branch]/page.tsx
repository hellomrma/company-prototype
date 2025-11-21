import type { Metadata } from "next";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { generateMetadata as genMeta, generateStructuredData } from "@/lib/metadata";
import LocationTabs from "../LocationTabs";
import styles from "../page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; branch: string }>;
}): Promise<Metadata> {
  const { lang, branch } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);
  const branchName = dictionary.location.tabs[branch as keyof typeof dictionary.location.tabs] || branch;
  const locationData = dictionary.location[branch as "seoul" | "shanghai"];
  
  return genMeta(locale, dictionary, {
    pageTitle: `${branchName} - ${dictionary.location.title}`,
    pageDescription: `${dictionary.location.description} ${locationData?.address || ""}`,
    path: `/location/${branch}`,
    keywords: [
      dictionary.footer.company.name,
      branchName,
      locationData?.city || "",
      locationData?.country || "",
      "office location",
      locale === "ko" ? "오피스 위치" : "office location",
    ],
    customMetadata: {
      other: locationData
        ? {
            "geo.region": locationData.country,
            "geo.placename": locationData.city,
            "geo.position": `${locationData.latitude};${locationData.longitude}`,
            "ICBM": `${locationData.latitude}, ${locationData.longitude}`,
          }
        : {
            "geo.region": "",
            "geo.placename": "",
          },
    },
  });
}

export default async function LocationBranchPage({
  params,
}: {
  params: Promise<{ lang: string; branch: string }>;
}) {
  const { lang, branch } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  const branches = ["seoul", "shanghai"] as const;
  const currentBranch = branch as typeof branches[number];
  const locationData = dictionary.location[currentBranch] as typeof dictionary.location.seoul | typeof dictionary.location.shanghai;

  if (!locationData) {
    return <div>Location not found</div>;
  }

  // LocalBusiness 구조화된 데이터 생성
  const localBusinessData = generateStructuredData(
    locale,
    dictionary,
    "LocalBusiness",
    currentBranch,
    `/location/${branch}`
  );
  const breadcrumbData = generateStructuredData(
    locale,
    dictionary,
    "BreadcrumbList",
    undefined,
    `/location/${branch}`
  );

  // Google Maps 링크 생성
  const mapsUrl = `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`;

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
      {/* Hero Section */}
      <section className={styles.hero} aria-labelledby="location-title">
        <div className="container">
          <h1 id="location-title" className={styles.heroTitle}>
            {dictionary.location.title}
          </h1>
          <p className={styles.heroSubtitle}>{dictionary.location.subtitle}</p>
        </div>
      </section>

      {/* Tabs */}
      <LocationTabs locale={locale} currentBranch={currentBranch} dictionary={dictionary.location} />

      {/* Location Content */}
      <section className={`${styles.content} section`}>
        <div className="container">
          <div className={styles.locationCard}>
            <h2 className={styles.locationTitle}>{locationData.title}</h2>
            <div className={styles.locationInfo}>
              <div className={styles.infoItem}>
                <h3>Company</h3>
                <p>{locationData.company}</p>
              </div>
              <div className={styles.infoItem}>
                <h3>Address</h3>
                <p>
                  {locationData.address}
                  <br />
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mapLink}
                    aria-label={`View ${locationData.title} on Google Maps`}
                  >
                    📍 {locale === "ko" ? "지도에서 보기" : "View on Map"}
                  </a>
                </p>
              </div>
              <div className={styles.infoItem}>
                <h3>Phone</h3>
                <p>
                  <a href={`tel:${locationData.phone.replace(/\s/g, "")}`}>
                    {locationData.phone}
                  </a>
                </p>
              </div>
              <div className={styles.infoItem}>
                <h3>Email</h3>
                <p>
                  <a href={`mailto:${locationData.email}`}>
                    {locationData.email}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

