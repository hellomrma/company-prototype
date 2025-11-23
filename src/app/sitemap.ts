/**
 * sitemap.xml 생성 파일
 * 
 * 이 파일은 Next.js의 MetadataRoute API를 사용하여
 * /sitemap.xml 경로에 자동으로 XML 사이트맵을 생성합니다.
 * 
 * 검색 엔진에게 사이트의 모든 페이지를 알려주어 인덱싱을 돕습니다.
 */

import { MetadataRoute } from "next";
import { i18n } from "@/i18n-config";

/**
 * sitemap.xml 생성 함수
 * 
 * @returns 사이트맵 엔트리 배열
 * 
 * @description
 * - 모든 지원 언어에 대해 각 경로를 생성합니다
 * - 각 페이지의 우선순위와 변경 빈도를 설정합니다
 * - 다국어 대체 링크(hreflang)를 포함합니다
 * 
 * 생성되는 URL 예시:
 * - /ko, /en (홈)
 * - /ko/about, /en/about
 * - /ko/services, /en/services
 * - /ko/location, /en/location
 * - /ko/careers, /en/careers
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://company.ai";
  // 사이트맵에 포함할 경로 목록
  const routes = ["", "/about", "/services", "/location", "/careers"];
  const lastModified = new Date(); // 마지막 수정일 (현재 날짜)

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 각 언어와 경로의 조합으로 사이트맵 엔트리 생성
  i18n.locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`, // 완전한 URL
        lastModified, // 마지막 수정일
        // 변경 빈도 설정
        // 홈과 서비스는 주간 업데이트, 나머지는 월간
        changeFrequency: route === "" ? "weekly" : route === "/services" ? "weekly" : "monthly",
        // 우선순위 설정 (0.0 ~ 1.0)
        // 홈은 최우선(1.0), contact는 낮음(0.5), 나머지는 높음(0.8)
        priority: route === "" ? 1 : route === "/contact" ? 0.5 : 0.8,
        // 다국어 대체 링크 (hreflang)
        alternates: {
          languages: {
            ko: `${baseUrl}/ko${route}`, // 한국어 버전
            en: `${baseUrl}/en${route}`, // 영어 버전
            "x-default": `${baseUrl}/${i18n.defaultLocale}${route}`, // 기본 언어 버전
          },
        },
      });
    });
  });

  return sitemapEntries;
}
