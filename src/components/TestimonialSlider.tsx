"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Pagination, Mousewheel } from "swiper/modules";
import { Star } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";

interface TestimonialItem {
  id: string;
  name: string;
  rating: number;
  message: string;
}

interface Props {
  testimonials: TestimonialItem[];
}

export default function TestimonialSlider({ testimonials }: Props) {
  if (testimonials.length === 0) return null;

  return (
    <div className="flex justify-center">
      <Swiper
        effect="cards"
        grabCursor={true}
        mousewheel={{ forceToAxis: true }}
        modules={[EffectCards, Pagination, Mousewheel]}
        pagination={{ clickable: true }}
        className="w-[280px] py-10 sm:w-[350px]"
        style={
          {
            "--swiper-pagination-color": "#ea580c",
            "--swiper-pagination-bullet-inactive-color": "#71717a",
          } as React.CSSProperties
        }
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id}>
            <div className="flex h-full min-h-[400px] flex-col rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl">
              {/* Rating Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating
                        ? "fill-orange-500 text-orange-500"
                        : "fill-zinc-200 text-zinc-200"
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="mt-6 flex-1 text-base leading-7 text-zinc-700">
                &ldquo;{testimonial.message}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-6 border-t border-zinc-200 pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                    {testimonial.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-semibold text-zinc-900">
                    {testimonial.name}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
