'use client'

import { useEffect, useState } from 'react'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'

interface Banner {
  id: number
  image: string
  order?: number
}

const Banner = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/banners')
        if (res.ok) {
          const data = await res.json()
          if (data.length > 0) {
            setBanners(data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch banners', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [])

  if (loading) {
    return <div className="mb-10 h-[280px] w-full animate-pulse bg-gray-200 md:mb-16 md:h-[450px] xl:h-[600px]" />
  }

  if (banners.length === 0) return null

  return (
    <Swiper
      loop
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{
        clickable: true,
      }}
      className="mb-10 h-full w-full md:mb-16"
    >
      {banners.map((item) => (
        <SwiperSlide key={item.id}>
          <div
            className="h-[280px] w-full bg-cover bg-center md:h-[450px] xl:h-[600px]"
            style={{ backgroundImage: `url(${item.image})` }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default Banner
