'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ProductCard from '../ui/product-card'

type TabType = 'description' | 'related'

import { Product } from '@/interfaces/allproduct.interfaces'

interface ProductDetailsAndRelatedProductProps {
  product: Product
  relatedProducts: Product[]
}

const ProductDetailsAndRelatedProduct = ({ product, relatedProducts }: ProductDetailsAndRelatedProductProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('description')
  const router = useRouter()

  return (
    <div className="wrapper w-full">
      <div className="flex border-b border-neutral-500">
        <button
          onClick={() => setActiveTab('description')}
          className={`relative px-6 py-3 text-sm font-medium transition-colors md:text-base ${
            activeTab === 'description'
              ? 'border-b-2 border-green-700 text-green-700'
              : 'text-neutral-500 hover:text-gray-900'
          }`}
        >
          পণ্যের বিবরণ
        </button>
        <button
          onClick={() => setActiveTab('related')}
          className={`relative px-6 py-3 text-sm font-medium transition-colors md:text-base ${
            activeTab === 'related'
              ? 'border-b-2 border-green-700 text-green-700'
              : 'text-neutral-500 hover:text-gray-900'
          }`}
        >
          রিলেটেড প্রোডাক্ট
        </button>
      </div>

      <div className="py-8">
        {activeTab === 'description' ? (
          <div className="space-y-4 font-light text-black">
            <p className="whitespace-pre-wrap">{product.description || 'No description available.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onViewDetails={() => router.push(`/all-products/${item.id}`)}
                  buttonText="বিস্তারিত দেখুন"
                />
              ))
            ) : (
              <p>No related products found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetailsAndRelatedProduct
