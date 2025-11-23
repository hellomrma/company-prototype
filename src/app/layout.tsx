/**
 * 루트 레이아웃 컴포넌트
 * 
 * 이 컴포넌트는 Next.js App Router의 최상위 레이아웃입니다.
 * 모든 페이지에 공통으로 적용되는 구조와 스타일을 정의합니다.
 * - 폰트 로딩 및 설정
 * - 전역 CSS 적용
 * - 기본 메타데이터 설정
 */

import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Sans } from "next/font/google";
import "./globals.scss";

/**
 * Noto Sans KR 폰트 설정 (한국어용)
 * 
 * Google Fonts에서 한국어 폰트를 로드합니다.
 * - subsets: "latin" (라틴 문자 포함)
 * - weight: 다양한 굵기 지원 (400~800)
 * - variable: CSS 변수로 사용할 이름
 * - display: "swap" (폰트 로딩 중에도 텍스트 표시)
 */
const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

/**
 * Noto Sans 폰트 설정 (영어용)
 * 
 * Google Fonts에서 영어 폰트를 로드합니다.
 * 한국어와 동일한 설정을 사용합니다.
 */
const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-sans",
  display: "swap",
});

/**
 * 기본 메타데이터
 * 
 * 이 메타데이터는 언어별 레이아웃에서 오버라이드됩니다.
 */
export const metadata: Metadata = {
  title: "company",
  description: "Mobility AI Company",
};

/**
 * 루트 레이아웃 컴포넌트
 * 
 * @param children - 자식 컴포넌트 (페이지 콘텐츠)
 * @returns HTML 구조
 * 
 * @description
 * - html 태그에 기본 언어를 "ko"로 설정 (클라이언트에서 URL 기반으로 동적 변경)
 * - body에 폰트 CSS 변수를 추가하여 전역에서 사용 가능하게 함
 * - 클라이언트 스크립트로 URL의 언어 코드를 감지하여 lang 속성을 동적으로 변경
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const pathname = window.location.pathname;
                  const langMatch = pathname.match(/^\/(en|ko)(\\/|$)/);
                  if (langMatch && langMatch[1]) {
                    document.documentElement.lang = langMatch[1];
                  }
                } catch (e) {
                  // 에러 발생 시 기본값 유지
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${notoSansKR.variable} ${notoSans.variable}`}>
        {children}
      </body>
    </html>
  );
}

