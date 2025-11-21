"use client";

import Link from "next/link";
import { Locale } from "@/i18n-config";
import styles from "./page.module.css";

type LocationDictionary = {
  title: string;
  subtitle: string;
  description: string;
  tabs: {
    seoul: string;
    shanghai: string;
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

export default function LocationTabs({
  locale,
  currentBranch,
  dictionary,
}: {
  locale: Locale;
  currentBranch: "seoul" | "shanghai";
  dictionary: LocationDictionary;
}) {
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

