import AllProducts from '@/components/home/AllProducts'
import Banner from '@/components/home/Banner'
import Blog from '@/components/home/Blog'
import Faq from '@/components/home/Faq'
import Review from '@/components/home/Review'

import { Blog as BlogType } from '@/generated/prisma/client'
import { Product } from '@/interfaces/allproduct.interfaces'

const HomeViews = ({ products, blogs }: { products: Product[]; blogs: BlogType[] }) => {
  return (
    <>
      <Banner />
      <AllProducts products={products} />
      <Review />
      <Faq />
      <Blog blogs={blogs} />
    </>
  )
}

export default HomeViews
