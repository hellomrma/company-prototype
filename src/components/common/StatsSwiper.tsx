/**
 * 통계 슬라이더 컴포넌트
 * 
 * Swiper 라이브러리를 사용하여 통계 카드를 슬라이더로 표시합니다.
 * - 자동 재생
 * - 네비게이션 버튼
 * - 페이지네이션
 * - 반응형 디자인
 */

"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Dictionary } from "@/types/dictionary";
import styles from "./StatsSwiper.module.scss";

/**
 * StatsSwiper 컴포넌트 Props 타입
 */
type StatsSwiperProps = {
  dictionary: Dictionary["home"]["stats"]; // 통계 관련 다국어 딕셔너리
};

/**
 * 통계 데이터 배열
 * 
 * 각 통계 항목은 숫자, 라벨 키, 설명 키로 구성됩니다.
 * 실제 텍스트는 dictionary에서 가져옵니다.
 */
const statsData = [
  {
    number: "100+", // 통계 숫자
    labelKey: "vehicles", // 딕셔너리 키 (라벨)
    descKey: "vehiclesDesc", // 딕셔너리 키 (설명)
  },
  {
    number: "50K+",
    labelKey: "platform",
    descKey: "platformDesc",
  },
  {
    number: "20+",
    labelKey: "partners",
    descKey: "partnersDesc",
  },
  {
    number: "200+",
    labelKey: "technology",
    descKey: "technologyDesc",
  },
];

/**
 * 통계 슬라이더 컴포넌트
 * 
 * @param dictionary - 통계 관련 다국어 딕셔너리
 * @returns 통계 슬라이더 JSX
 * 
 * @description
 * - 모바일: 1개 슬라이드
 * - 태블릿(640px+): 2개 슬라이드
 * - 데스크톱(1024px+): 3개 슬라이드
 * - 자동 재생: 3초마다
 * - 무한 루프
 */
export default function StatsSwiper({ dictionary }: StatsSwiperProps) {
  return (
    <div className={styles.swiperWrapper}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]} // 사용할 Swiper 모듈
        spaceBetween={30} // 슬라이드 간 간격 (기본값)
        slidesPerView={1} // 기본 슬라이드 개수 (모바일)
        breakpoints={{
          // 태블릿 이상 (640px+)
          640: {
            slidesPerView: 2, // 2개 슬라이드
            spaceBetween: 20, // 간격 조정
          },
          // 데스크톱 (1024px+)
          1024: {
            slidesPerView: 3, // 3개 슬라이드
            spaceBetween: 30, // 간격 조정
          },
        }}
        navigation={{
          // 커스텀 네비게이션 버튼 선택자
          nextEl: `.${styles.swiperButtonNext}`,
          prevEl: `.${styles.swiperButtonPrev}`,
        }}
        pagination={{
          clickable: true, // 페이지네이션 클릭 가능
          el: `.${styles.swiperPagination}`, // 커스텀 페이지네이션 컨테이너
          bulletClass: "swiper-pagination-bullet", // 불릿 클래스
          bulletActiveClass: "swiper-pagination-bullet-active", // 활성 불릿 클래스
        }}
        autoplay={{
          delay: 3000, // 3초마다 자동 재생
          disableOnInteraction: false, // 사용자 상호작용 후에도 자동 재생 계속
        }}
        loop={true} // 무한 루프
        allowTouchMove={true} // 터치 제스처 허용
        watchOverflow={false} // 오버플로우 감시 비활성화
        slidesPerGroup={1} // 그룹당 슬라이드 개수
        className={styles.swiper}
      >
        {/* 통계 카드 슬라이드 생성 */}
        {statsData.map((stat, index) => (
          <SwiperSlide key={index}>
            <article className={styles.statCard}>
              {/* 통계 숫자 */}
              <div className={styles.statNumber}>{stat.number}</div>
              {/* 통계 라벨 */}
              <h3 className={styles.statLabel}>
                {dictionary[stat.labelKey as keyof typeof dictionary]}
              </h3>
              {/* 통계 설명 */}
              <p className={styles.statDesc}>
                {dictionary[stat.descKey as keyof typeof dictionary]}
              </p>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* 커스텀 컨트롤 (이전/다음 버튼, 페이지네이션) */}
      <div className={styles.swiperControls}>
        {/* 이전 버튼 */}
        <div 
          className={`${styles.swiperButtonPrev} swiper-button-prev`} 
          aria-label="Previous slide"
        >
          ←
        </div>
        {/* 페이지네이션 컨테이너 */}
        <div 
          className={styles.swiperPagination}
        ></div>
        {/* 다음 버튼 */}
        <div 
          className={`${styles.swiperButtonNext} swiper-button-next`} 
          aria-label="Next slide"
        >
          →
        </div>
      </div>
    </div>
  );
}

