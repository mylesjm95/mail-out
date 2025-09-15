"use client";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const Partner = () => {
  const partnerImages = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png"];

  return (
    <>
      <Swiper
        spaceBetween={10} // Adjust the spacing between items as per your preference
        slidesPerView={6} // Default number of slides per view
        breakpoints={{
          0: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          992: {
            slidesPerView: 4,
          },
          1200: {
            slidesPerView: 6,
          },
        }}
        loop={partnerImages.length > 1} // Only enable loop if there are more than 1 slides
        autoplay={{
          delay: 3000, // Adjust the autoplay delay (in milliseconds) as per your preference
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        className="swiper-container"
      >
        {partnerImages.map((imageName, index) => (
          <SwiperSlide key={index}>
            <div className="item">
              <div className="partner_item">
                <Image
                  width={122}
                  height={24}
                  style={{ objectFit: "contain", height: "auto" }}
                  className="wa m-auto"
                  src={`/images/partners/${imageName}`}
                  alt={imageName}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default Partner;
