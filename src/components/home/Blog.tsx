'use client'

import { Blog as BlogType } from '@/generated/prisma/client'
import { CircleChevronLeft, CircleChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'

import SharedHeading from '../ui/SharedHeading'

interface BlogProps {
  blogs: BlogType[]
}

const Blog = ({ blogs }: BlogProps) => {
  const swiperRef = useRef<SwiperType | null>(null)

  if (!blogs || blogs.length === 0) {
    return null
  }

  return (
    <section className="mb-10 md:mb-20">
      <div className="wrapper relative">
        <SharedHeading sectionTitle="ব্লগ" />

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

                  <div
                    className="text-primary-text mb-5 line-clamp-4 text-[16px] leading-[120%] font-light"
                    dangerouslySetInnerHTML={{
                      __html: item.description.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
                    }}
                  />

                  <Link
                    href={`/blog/${item.id}`}
                    className="text-secondary-color hover:text-hover text-[16px] font-medium underline underline-offset-4 transition"
                  >
                    See Details
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
