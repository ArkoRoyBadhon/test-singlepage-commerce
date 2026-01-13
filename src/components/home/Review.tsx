'use client'

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { CircleChevronLeft, CircleChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { Fragment, useEffect, useRef, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'

import Utube from '@/icons/Utube'
import SharedHeading from '../ui/SharedHeading'

interface Review {
  id: number
  name?: string
  image?: string
  videoUrl: string
}

const Review = () => {
  const swiperRef = useRef<SwiperType | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews')
        if (res.ok) {
          const data = await res.json()
          setReviews(data)
        }
      } catch (error) {
        console.error('Failed to fetch reviews', error)
      }
    }
    fetchReviews()
  }, [])

  const getYoutubeId = (url: string) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const handleVideoClick = (url: string) => {
    const videoId = getYoutubeId(url)
    if (videoId) {
      setSelectedVideo(videoId)
    } else if (url) {
      window.open(url, '_blank')
    }
  }

  const closeVideo = () => setSelectedVideo(null)

  if (reviews.length === 0) return null

  return (
    <section className="mb-10 md:mb-20">
      <div className="wrapper relative">
        <SharedHeading sectionTitle="রিভিউ" />

        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          slidesPerView={1}
          spaceBetween={20}
          loop
          breakpoints={{
            550: {
              slidesPerView: 1.5,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1278: {
              slidesPerView: 2.5,
            },
            1400: {
              slidesPerView: 3,
            },
          }}
          className="mt-12 md:mt-16"
        >
          {reviews.map((item) => (
            <SwiperSlide key={item.id}>
              <div
                onClick={() => handleVideoClick(item.videoUrl)}
                className="group relative h-[280px] w-full cursor-pointer overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt="Product Review"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                    {/* Fallback if no image */}
                  </div>
                )}

                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <Utube />
                </div>

                {item.name && (
                  <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="truncate font-medium text-white">{item.name}</p>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation */}
        <div className="absolute top-8 right-4 flex items-center gap-2 md:top-12 md:right-10 md:gap-4 xl:top-12 xl:right-20">
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className="hover:text-primary text-gray-700 transition"
          >
            <CircleChevronLeft size={37} />
          </button>

          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            className="hover:text-primary text-gray-700 transition"
          >
            <CircleChevronRight size={37} />
          </button>
        </div>
      </div>

      <Transition appear show={!!selectedVideo} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeVideo}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-black p-1 text-left align-middle shadow-xl transition-all">
                  <div className="relative w-full bg-black pt-[56.25%]">
                    {selectedVideo && (
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-0 left-0 h-full w-full"
                      />
                    )}
                    <button
                      onClick={closeVideo}
                      className="absolute -top-10 right-0 p-2 text-white transition-colors hover:text-red-500"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </section>
  )
}

export default Review
