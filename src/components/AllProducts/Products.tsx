import { Product } from '@/interfaces/allproduct.interfaces'
import { useRouter } from 'next/navigation'
import ProductCard from '../ui/product-card'

interface ProductsProps {
  products: Product[]
}

const Products = ({ products }: ProductsProps) => {
  const router = useRouter()
  return (
    <section className="font-mont mb-10 w-full md:mb-20">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((item) => (
          <ProductCard
            key={item.id}
            product={item}
            className="h-96 max-w-72"
            onViewDetails={() => router.push(`/all-products/${item.id}`)}
          />
        ))}
      </div>
    </section>
  )
}

export default Products
