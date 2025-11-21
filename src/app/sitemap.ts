import { MetadataRoute } from "next";
import { i18n } from "@/i18n-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://company.ai";
  const routes = ["", "/about", "/services", "/location", "/careers"];
  const lastModified = new Date();

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate sitemap entries for each locale and route
  i18n.locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified,
        changeFrequency: route === "" ? "weekly" : route === "/services" ? "weekly" : "monthly",
        priority: route === "" ? 1 : route === "/contact" ? 0.5 : 0.8,
        alternates: {
          languages: {
            ko: `${baseUrl}/ko${route}`,
            en: `${baseUrl}/en${route}`,
            "x-default": `${baseUrl}/${i18n.defaultLocale}${route}`,
          },
        },
      });
    });
  });

  return sitemapEntries;
}
