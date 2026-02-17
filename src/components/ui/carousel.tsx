"use client"; // if using Next.js App Router

import { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

interface CarCarouselProps {
  images: string[];
  carName: string;
}

// Helper to get image aspect ratio from a URL (sync fallback to 4/3)
function getImageAspectRatio(url: string, cb: (ratio: number) => void) {
  const img = new window.Image();
  img.onload = function () {
    if (img.naturalWidth && img.naturalHeight) {
      cb(img.naturalWidth / img.naturalHeight);
    } else {
      cb(4 / 3);
    }
  };
  img.onerror = function () {
    cb(4 / 3);
  };
  img.src = url;
}

export const CarCarousel = ({ images, carName }: CarCarouselProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [aspect, setAspect] = useState(4 / 3);

  // Only check the first image for aspect ratio
  useMemo(() => {
    if (images && images[0]) {
      getImageAspectRatio(images[0], setAspect);
    }
  }, [images && images[0]]);

  const aspectClass = useMemo(() => {
    // Clamp to common ratios for Tailwind aspect-[w/h] utility
    if (Math.abs(aspect - 16 / 9) < 0.05) return "aspect-[16/9]";
    if (Math.abs(aspect - 3 / 2) < 0.05) return "aspect-[3/2]";
    if (Math.abs(aspect - 1) < 0.05) return "aspect-square";
    if (Math.abs(aspect - 4 / 3) < 0.05) return "aspect-[4/3]";
    // Otherwise, use inline style
    return undefined;
  }, [aspect]);

  return (
    <div className="w-full">
      {/* Main Gallery */}
      <Swiper
        modules={[Navigation, Thumbs]}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        spaceBetween={10}
        slidesPerView={1}
        className="rounded-lg"
      >
        {images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <div
              className={aspectClass ? `relative overflow-hidden rounded-lg bg-muted ${aspectClass}` : "relative overflow-hidden rounded-lg bg-muted"}
              style={aspectClass ? undefined : { aspectRatio: aspect }}
            >
              <img
                src={img}
                alt={`${carName} - ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Swiper */}
      {images.length > 1 && (
        <Swiper
          modules={[FreeMode, Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView={Math.min(images.length, 6)}
          freeMode={true}
          watchSlidesProgress
          className="mt-3"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div
                className={aspectClass ? `overflow-hidden rounded-lg cursor-pointer border-2 border-transparent hover:border-primary ${aspectClass}` : "overflow-hidden rounded-lg cursor-pointer border-2 border-transparent hover:border-primary"}
                style={aspectClass ? undefined : { aspectRatio: aspect }}
              >
                <img
                  src={img}
                  alt={`Thumb ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};
