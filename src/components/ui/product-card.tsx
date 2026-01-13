import Image from 'next/image'
import React from 'react'
import { Button } from './Button'

interface Product {
  id: number
  image: string
  title: string
  price: string | number
}

interface ProductCardProps {
  product: Product
  onViewDetails?: () => void
  buttonText?: string
  className?: string
  showButton?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  buttonText = 'View Details',
  className = '',
  showButton = true,
}) => {
  const formattedPrice =
    typeof product.price === 'number' ? `৳ ${Number(product.price).toLocaleString()}` : String(product.price)

  return (
    <div className={`border-primary-border relative z-10 border ${className}`}>
      <div className="group relative mb-2 h-[302px] w-full overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          height={302}
          width={302}
          className="h-full w-full object-cover"
        />

        {showButton && (
          <Button
            size="sm"
            className="bg-secondary-color hover:bg-hover absolute bottom-0 w-full rounded-none text-white transition-all duration-300 ease-out lg:pointer-events-none lg:translate-y-3 lg:opacity-0 lg:group-hover:pointer-events-auto lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
            onClick={onViewDetails}
          >
            {buttonText}
          </Button>
        )}
      </div>

      <h3 className="text-primary-text mb-1.5 text-center text-[14px] leading-[122%] font-medium">{product.title}</h3>
      <p className="text-primary-text mb-1.5 text-center text-[14px] font-medium">{formattedPrice}</p>
    </div>
  )
}

export default ProductCard
