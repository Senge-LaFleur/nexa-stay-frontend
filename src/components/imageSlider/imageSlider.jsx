// ImageSlider.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import './imageSlider.css'

const ImageSlider = ({ images }) => {
    return (
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={3}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          576: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        <div class="explore-bg">
            {images.map((src, index) => (
                <SwiperSlide key={index}>
                    <div class="explore-content">
                        <img
                            src={src}
                            alt={`Slide ${index}`}
                        />
                    </div>
                </SwiperSlide>
            ))}
        </div>
        
      </Swiper>
    );
};

export default ImageSlider;
  
  