/**
 * robots.txt 생성 파일
 * 
 * 이 파일은 Next.js의 MetadataRoute API를 사용하여
 * /robots.txt 경로에 자동으로 robots.txt 파일을 생성합니다.
 * 
 * 검색 엔진 크롤러에게 어떤 페이지를 크롤링할 수 있는지 알려줍니다.
 */

import { MetadataRoute } from "next";

/**
 * robots.txt 생성 함수
 * 
 * @returns robots.txt 설정 객체
 * 
 * @description
 * - 모든 크롤러(userAgent: "*")에 대해 루트 경로(/)는 허용
 * - /api/, /_next/, /admin/ 경로는 차단
 * - sitemap.xml 위치를 알려줌
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://company.ai";

  return {
    rules: [
      {
        userAgent: "*", // 모든 크롤러에 적용
        allow: "/", // 루트 경로 허용
        disallow: [
          "/api/", // API 라우트 차단
          "/_next/", // Next.js 내부 파일 차단
          "/admin/", // 관리자 페이지 차단 (있는 경우)
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`, // 사이트맵 위치
  };
}
