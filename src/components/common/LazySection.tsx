"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

type LazySectionProps = {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  "aria-labelledby"?: string;
};

export default function LazySection({
  children,
  className = "",
  threshold = 0.1,
  rootMargin = "50px",
  "aria-labelledby": ariaLabelledBy,
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded) {
            setIsVisible(true);
            setHasLoaded(true);
            // 한 번 로드되면 observer 해제
            if (sectionRef.current) {
              observer.unobserve(sectionRef.current);
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

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

