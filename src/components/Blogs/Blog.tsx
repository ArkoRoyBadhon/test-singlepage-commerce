'use client'

import { CircleChevronLeft, CircleChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'

const blogs = [
  {
    id: 1,
    title: 'প্রাকৃতিক',
    description:
      'বর্তমান সময়ে আমরা এমন অনেক পণ্য ব্যবহার করি, যা কৃত্রিম রাসায়নিক ও সংরক্ষণকারী উপাদানে ভরা। এসব কেমিক্যাল আমাদের ত্বক, চুল এমনকি …',
    image: '/blog/blog1.jpg',
    linkText: 'See Details',
  },
  {
    id: 2,
    title: 'সুন্দর জীবন',
    description:
      'বর্তমান সময়ে আমরা এমন অনেক পণ্য ব্যবহার করি, যা কৃত্রিম রাসায়নিক ও সংরক্ষণকারী উপাদানে ভরা। এসব কেমিক্যাল আমাদের ত্বক, চুল এমনকি …',
    image: '/blog/blog2.jpg',
    linkText: 'See Details',
  },
  {
    id: 3,
    title: 'প্রাকৃতিক খাদ্য',
    description:
      'বর্তমান সময়ে আমরা এমন অনেক পণ্য ব্যবহার করি, যা কৃত্রিম রাসায়নিক ও সংরক্ষণকারী উপাদানে ভরা। এসব কেমিক্যাল আমাদের ত্বক, চুল এমনকি …',
    image: '/blog/blog3.jpg',
    linkText: 'See Details',
  },
  {
    id: 4,
    title: 'স্বাস্থ্যকর জীবন',
    description:
      'বর্তমান সময়ে আমরা এমন অনেক পণ্য ব্যবহার করি, যা কৃত্রিম রাসায়নিক ও সংরক্ষণকারী উপাদানে ভরা। এসব কেমিক্যাল আমাদের ত্বক, চুল এমনকি …',
    image: '/blog/blog1.jpg',
    linkText: 'See Details',
  },
]

const Blog = () => {
  const swiperRef = useRef<SwiperType | null>(null)

  return (
    <section className="mb-10 md:mb-20">
      <div className="wrapper relative">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          slidesPerView={1}
          spaceBetween={24}
          loop
          breakpoints={{
            550: { slidesPerView: 1.5 },
            800: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="mt-10 md:mt-16"
        >
          {blogs.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="bg-card-bg">
                <div className="overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={420}
                    height={320}
                    className="h-[320px] w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                  />
                </div>

                {/* Content */}
                <div className="bg-card-bg relative z-10 mx-4.5 -mt-12 px-7 py-5.5 text-center md:mx-6 xl:mx-[33px]">
                  <h3 className="text-primary-text mb-3 text-[18px] leading-[120%] font-semibold">{item.title}</h3>

                  <p className="text-primary-text mb-5 line-clamp-4 text-[16px] leading-[120%] font-light">
                    {item.description}
                  </p>

                  <Link
                    href="#"
                    className="text-secondary-color hover:text-hover text-[16px] font-medium underline underline-offset-4 transition"
                  >
                    {item.linkText}
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation */}
        <div className="absolute top-8 right-4 flex items-center gap-2 md:top-12 md:right-10 md:gap-4 xl:top-12 xl:right-20">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="hover:text-primary text-gray-700 transition"
          >
            <CircleChevronLeft size={38} />
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="hover:text-primary text-gray-700 transition"
          >
            <CircleChevronRight size={38} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default Blog
