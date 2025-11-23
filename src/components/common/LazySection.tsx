/**
 * 지연 로딩 섹션 컴포넌트
 * 
 * Intersection Observer API를 사용하여 뷰포트에 들어올 때만
 * 콘텐츠를 렌더링하는 지연 로딩 컴포넌트입니다.
 * 
 * 성능 최적화:
 * - 초기 로딩 시 보이지 않는 콘텐츠는 렌더링하지 않음
 * - 사용자가 스크롤하여 해당 섹션에 도달할 때만 렌더링
 * - 페이드인 애니메이션 제공
 */

"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

/**
 * LazySection 컴포넌트 Props 타입
 */
type LazySectionProps = {
  children: ReactNode; // 자식 컴포넌트
  className?: string; // 추가 CSS 클래스
  threshold?: number; // Intersection Observer 임계값 (0.0 ~ 1.0)
  rootMargin?: string; // Intersection Observer 루트 마진
  "aria-labelledby"?: string; // 접근성: 섹션 제목 ID
};

/**
 * 지연 로딩 섹션 컴포넌트
 * 
 * @param children - 자식 컴포넌트
 * @param className - 추가 CSS 클래스
 * @param threshold - 가시성 임계값 (기본값: 0.1 = 10%)
 * @param rootMargin - 뷰포트 마진 (기본값: "50px")
 * @param ariaLabelledBy - 섹션 제목 ID (접근성)
 * @returns 지연 로딩 섹션 JSX
 * 
 * @description
 * - 뷰포트에 10% 이상 보일 때 콘텐츠를 렌더링합니다
 * - 한 번 로드되면 observer를 해제하여 성능을 최적화합니다
 * - 페이드인 애니메이션을 제공합니다
 */
export default function LazySection({
  children,
  className = "",
  threshold = 0.1,
  rootMargin = "50px",
  "aria-labelledby": ariaLabelledBy,
}: LazySectionProps) {
  // 가시성 상태 (렌더링 여부 결정)
  const [isVisible, setIsVisible] = useState(false);
  // 로드 완료 상태 (observer 해제용)
  const [hasLoaded, setHasLoaded] = useState(false);
  // 섹션 DOM 참조
  const sectionRef = useRef<HTMLElement>(null);

  /**
   * Intersection Observer 설정
   * 
   * 섹션이 뷰포트에 들어올 때를 감지하여 콘텐츠를 로드합니다.
   */
  useEffect(() => {
    // Intersection Observer 생성
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 뷰포트에 들어왔고 아직 로드되지 않았으면
          if (entry.isIntersecting && !hasLoaded) {
            setIsVisible(true); // 가시성 활성화
            setHasLoaded(true); // 로드 완료 표시
            // 한 번 로드되면 observer 해제 (성능 최적화)
            if (sectionRef.current) {
              observer.unobserve(sectionRef.current);
            }
          }
        });
      },
      {
        threshold, // 임계값 (10% 보이면 트리거)
        rootMargin, // 뷰포트 마진 (50px 전에 미리 트리거)
      }
    );

    // 현재 ref 저장 (cleanup에서 사용)
    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef); // observer 시작
    }

    // Cleanup: 컴포넌트 언마운트 시 observer 해제
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, hasLoaded]);

  return (
    <section
      ref={sectionRef}
      className={`${className} ${isVisible ? "lazy-loaded" : "lazy-loading"}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.4s ease-in-out",
      }}
      aria-labelledby={ariaLabelledBy}
    >
      {isVisible ? children : <div style={{ minHeight: "200px" }} />}
    </section>
  );
}

