/**
 * 위치 탭 컴포넌트
 * 
 * 지점별 위치 페이지에서 지점을 전환할 수 있는 탭 네비게이션을 제공합니다.
 * 현재 선택된 지점은 활성화된 스타일로 표시됩니다.
 */

"use client";

import Link from "next/link";
import { Locale } from "@/i18n-config";
import styles from "./page.module.scss";

/**
 * 위치 딕셔너리 타입 정의
 */
type LocationDictionary = {
  title: string;
  subtitle: string;
  description: string;
  tabs: {
    seoul: string; // 서울 탭 라벨
    shanghai: string; // 상하이 탭 라벨
  };
  seoul: {
    title: string;
    company: string;
    address: string;
    phone: string;
    email: string;
  };
  shanghai: {
    title: string;
    company: string;
    address: string;
    phone: string;
    email: string;
  };
};

/**
 * 위치 탭 컴포넌트
 * 
 * @param locale - 현재 언어 코드
 * @param currentBranch - 현재 선택된 지점
 * @param dictionary - 위치 관련 다국어 딕셔너리
 * @returns 위치 탭 네비게이션 JSX
 * 
 * @description
 * - 서울과 상하이 지점 간 전환 가능
 * - 현재 지점은 활성화된 스타일로 표시
 * - 접근성 고려 (role="tab", aria-selected)
 */
export default function LocationTabs({
  locale,
  currentBranch,
  dictionary,
}: {
  locale: Locale;
  currentBranch: "seoul" | "shanghai";
  dictionary: LocationDictionary;
}) {
  // 지원하는 지점 목록
  const branches = ["seoul", "shanghai"] as const;

  return (
    <section className={styles.tabsSection}>
      <div className="container">
        <div className={styles.tabs} role="tablist">
          {branches.map((branchName) => (
            <Link
              key={branchName}
              href={`/${locale}/location/${branchName}`}
              className={`${styles.tab} ${
                currentBranch === branchName ? styles.tabActive : ""
              }`}
              role="tab"
              aria-selected={currentBranch === branchName}
            >
              {dictionary.tabs[branchName]}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

