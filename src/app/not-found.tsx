/**
 * 404 Not Found 페이지 컴포넌트
 * 
 * 존재하지 않는 페이지에 접근했을 때 표시되는 페이지입니다.
 * Next.js의 not-found.tsx 파일은 자동으로 404 페이지로 사용됩니다.
 * 
 * 기능:
 * - URL에서 언어를 감지하여 적절한 언어로 표시
 * - Header와 Footer 포함
 * - 홈으로 돌아가기 링크 제공
 */

import Link from "next/link";
import { headers } from "next/headers";
import { getDictionary } from "@/get-dictionary";
import { i18n, type Locale } from "@/i18n-config";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import styles from "./not-found.module.scss";

/**
 * 404 Not Found 페이지 컴포넌트
 * 
 * @returns 404 페이지 JSX
 * 
 * @description
 * - middleware에서 설정한 x-pathname 헤더에서 언어를 추출합니다
 * - 언어를 감지할 수 없으면 기본 언어를 사용합니다
 * - 언어별로 적절한 메시지를 표시합니다
 */
export default async function NotFound() {
  // URL에서 locale 추출 시도
  // middleware에서 설정한 헤더에서 pathname 가져오기
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // pathname에서 locale 추출
  // 예: "/ko/about" -> "ko"
  let locale: Locale = i18n.defaultLocale;
  if (pathname) {
    const pathSegments = pathname.split("/").filter(Boolean);
    // 첫 번째 세그먼트가 지원하는 언어인지 확인
    if (pathSegments.length > 0 && i18n.locales.includes(pathSegments[0] as Locale)) {
      locale = pathSegments[0] as Locale;
    }
  }

  // 언어별 딕셔너리 로드
  const dictionary = await getDictionary(locale);

  return (
    <>
      <Header lang={locale} dictionary={dictionary} />
      <main id="main-content" className="main-content" role="main">
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>{dictionary.notFound.title}</h1>
            <h2 className={styles.subtitle}>{dictionary.notFound.subtitle}</h2>
            <p className={styles.description}>{dictionary.notFound.description}</p>
            <Link href={`/${locale}`} className="btn btn-primary">
              {dictionary.notFound.backHome}
            </Link>
          </div>
        </div>
      </main>
      <Footer lang={locale} dictionary={dictionary} />
    </>
  );
}

