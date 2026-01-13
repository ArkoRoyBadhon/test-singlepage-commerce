'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SharedHeading from '../ui/SharedHeading'

import ProductCard from '../ui/product-card'

import { Product } from '@/interfaces/allproduct.interfaces'

interface AllProductsProps {
  products: Product[]
}

const AllProducts = ({ products }: AllProductsProps) => {
  const router = useRouter()

  return (
    <section className="font-mont mb-10 md:mb-20">
      <div className="wrapper">
        <SharedHeading sectionTitle="সকল পণ্য" />

        <div className="mt-10 grid grid-cols-1 gap-6 md:mt-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              className="h-full bg-white"
              buttonText="View Details"
              onViewDetails={() => router.push(`/all-products/${item.id}`)}
            />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link href="/all-products" className="bg-secondary-color inline-block px-10 py-2.5 font-medium text-white">
            সব পণ্য দেখুন
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AllProducts
