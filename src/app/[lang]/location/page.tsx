import type { Metadata } from "next";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { generateMetadata as genMeta } from "@/lib/metadata";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);
  return genMeta(locale, dictionary, {
    pageTitle: dictionary.location.title,
    pageDescription: dictionary.location.description,
    path: "/location",
  });
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);
  
  // 기본적으로 성남 페이지로 리다이렉트
  redirect(`/${locale}/location/seoul`);
}

