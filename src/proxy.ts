/**
 * Next.js Middleware - 다국어 라우팅 및 보안 헤더 처리
 * 
 * 이 파일은 Next.js의 middleware 기능을 사용하여:
 * 1. URL에 언어 코드가 없으면 자동으로 리다이렉트
 * 2. 브라우저의 Accept-Language 헤더를 기반으로 언어 감지
 * 3. 보안 헤더 추가
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "./i18n-config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

/**
 * 요청에서 최적의 언어를 감지하는 함수
 * 
 * @param request - Next.js 요청 객체
 * @returns 감지된 언어 코드 또는 undefined
 * 
 * @description
 * - 브라우저의 Accept-Language 헤더를 분석합니다
 * - Negotiator를 사용하여 지원하는 언어 중 최적의 언어를 선택합니다
 * - intl-localematcher를 사용하여 언어 매칭을 수행합니다
 * - 매칭 실패 시 기본 언어를 반환합니다
 */
function getLocale(request: NextRequest): string | undefined {
  // Negotiator는 일반 객체를 기대하므로 헤더를 변환
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // 지원하는 언어 목록 (readonly이지만 타입 체크를 위해 변환)
  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;

  // Negotiator와 intl-localematcher를 사용하여 최적의 언어 감지
  // Accept-Language 헤더를 파싱하여 지원하는 언어 목록 반환
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  // 지원하는 언어 중 가장 적합한 언어 선택
  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}

/**
 * Next.js Middleware 핸들러 함수
 * 
 * @param request - Next.js 요청 객체
 * @returns NextResponse 객체 (리다이렉트 또는 수정된 응답)
 * 
 * @description
 * 이 함수는 모든 요청에 대해 실행되며:
 * 1. URL에 언어 코드가 있는지 확인
 * 2. 없으면 브라우저 언어를 감지하여 리다이렉트
 * 3. 보안 헤더 추가
 * 4. not-found 페이지에서 사용할 수 있도록 pathname을 헤더에 추가
 * 
 * @example
 * - 요청: /about
 * - 리다이렉트: /ko/about (한국어 브라우저인 경우)
 */
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // pathname에 지원하는 언어 코드가 있는지 확인
  // 모든 지원 언어를 확인하여 하나도 매칭되지 않으면 true
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 언어 코드가 없으면 리다이렉트
  if (pathnameIsMissingLocale) {
    // 브라우저 언어 감지
    const locale = getLocale(request);

    // 언어 코드를 URL에 추가하여 리다이렉트
    // 예: /products -> /ko/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url
      )
    );
  }

  // 언어 코드가 있으면 정상 처리
  // not-found 페이지에서 locale을 감지할 수 있도록 pathname을 헤더에 추가
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname); // pathname 저장
  response.headers.set("x-url", request.url); // 전체 URL 저장

  // 보안 헤더 추가
  // X-Frame-Options: iframe 임베딩 차단 (클릭재킹 방지)
  response.headers.set("X-Frame-Options", "DENY");
  // X-Content-Type-Options: MIME 타입 스니핑 방지
  response.headers.set("X-Content-Type-Options", "nosniff");
  // Referrer-Policy: referrer 정보 제한
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // Permissions-Policy: 브라우저 기능 사용 제한
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()" // 카메라, 마이크, 위치 정보 차단
  );

  return response;
}

/**
 * Middleware 실행 조건 설정
 * 
 * matcher는 정규식을 사용하여 어떤 경로에서 middleware를 실행할지 결정합니다.
 * 
 * 현재 설정:
 * - 모든 경로에서 실행
 * - 단, 다음 경로는 제외:
 *   - /api/* (API 라우트)
 *   - /_next/static/* (정적 파일)
 *   - /_next/image/* (이미지 최적화)
 *   - /favicon.ico (파비콘)
 * 
 * 이렇게 하면 Next.js 내부 파일과 API는 middleware를 거치지 않아 성능이 향상됩니다.
 */
export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

