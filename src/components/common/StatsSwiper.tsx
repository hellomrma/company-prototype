"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Dictionary } from "@/types/dictionary";
import styles from "./StatsSwiper.module.css";

type StatsSwiperProps = {
  dictionary: Dictionary["home"]["stats"];
};

const statsData = [
  {
    number: "100+",
    labelKey: "vehicles",
    descKey: "vehiclesDesc",
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

export default function StatsSwiper({ dictionary }: StatsSwiperProps) {
  return (
    <div className={styles.swiperWrapper}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        navigation={{
          nextEl: `.${styles.swiperButtonNext}`,
          prevEl: `.${styles.swiperButtonPrev}`,
        }}
        pagination={{
          clickable: true,
          el: `.${styles.swiperPagination}`,
          bulletClass: "swiper-pagination-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active",
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        allowTouchMove={true}
        watchOverflow={false}
        slidesPerGroup={1}
        className={styles.swiper}
      >
        {statsData.map((stat, index) => (
          <SwiperSlide key={index}>
            <article className={styles.statCard}>
              <div className={styles.statNumber}>{stat.number}</div>
              <h3 className={styles.statLabel}>
                {dictionary[stat.labelKey as keyof typeof dictionary]}
              </h3>
              <p className={styles.statDesc}>
                {dictionary[stat.descKey as keyof typeof dictionary]}
              </p>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.swiperControls}>
        <div 
          className={`${styles.swiperButtonPrev} swiper-button-prev`} 
          aria-label="Previous slide"
        >
          ←
        </div>
        <div 
          className={styles.swiperPagination}
        ></div>
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

