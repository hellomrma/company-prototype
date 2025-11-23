/**
 * ESLint 설정 파일
 * 
 * 이 파일은 코드 품질 검사 및 스타일 가이드를 정의합니다.
 * Next.js의 기본 ESLint 설정을 사용하며, TypeScript와 Core Web Vitals 규칙을 포함합니다.
 */

import { defineConfig, globalIgnores } from "eslint/config";
// Next.js Core Web Vitals 규칙 (성능, 접근성, SEO 관련)
import nextVitals from "eslint-config-next/core-web-vitals";
// Next.js TypeScript 규칙
import nextTs from "eslint-config-next/typescript";

/**
 * ESLint 설정 구성
 * - nextVitals: Next.js Core Web Vitals 검사 규칙
 * - nextTs: Next.js TypeScript 검사 규칙
 * - globalIgnores: 린팅에서 제외할 파일/디렉토리
 */
const eslintConfig = defineConfig([
  ...nextVitals, // Core Web Vitals 규칙 적용
  ...nextTs, // TypeScript 규칙 적용
  // eslint-config-next의 기본 무시 목록을 오버라이드
  globalIgnores([
    // Next.js 빌드 출력 디렉토리 (자동 생성 파일)
    ".next/**",
    // 정적 내보내기 출력 디렉토리
    "out/**",
    // 빌드 출력 디렉토리
    "build/**",
    // Next.js 타입 정의 파일 (자동 생성)
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
