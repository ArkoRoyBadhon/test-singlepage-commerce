'use client'
import DetailsOverview from '@/components/ProductDetails/DetailsOverview'
import OrderForm from '@/components/ProductDetails/OrderForm'
import ProductDetailsAndRelatedProduct from '@/components/ProductDetails/ProductDetailsAndRelatedProduct'
import BreadCrumb from '@/components/ui/Bread-crumb'
import { useState } from 'react'

import { Product } from '@/interfaces/allproduct.interfaces'

interface ProductDetailsViewProps {
  product: Product
  relatedProducts: Product[]
}

const ProductDetailsView = ({ product, relatedProducts }: ProductDetailsViewProps) => {
  const [selectedQuantity, setSelectedQuantity] = useState(1)

  const breadcrumbItems = [
    { label: 'হোম', href: '/' },
    { label: 'সব পণ্য', href: '/all-products' },
    { label: product.title || 'পণ্যের বিস্তারিত', href: '#' },
  ]

  return (
    <>
      <BreadCrumb items={breadcrumbItems} />
      <DetailsOverview
        selectedQuantity={selectedQuantity}
        setSelectedQuantity={setSelectedQuantity}
        product={product}
      />
      <ProductDetailsAndRelatedProduct product={product} relatedProducts={relatedProducts} />
      <OrderForm selectedQuantity={selectedQuantity} product={product} />
    </>
  )
}

export default ProductDetailsView
