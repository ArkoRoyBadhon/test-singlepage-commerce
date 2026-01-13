import { getProducts } from '@/actions/product/product.action'
import ProductTable from '@/components/dashboard/products/ProductTable'

export default async function ProductsPage() {
  const res = await getProducts()
  const rawProducts = 'data' in res ? res.data : []

  const products =
    rawProducts?.map((p) => ({
      ...p,
      price: p.price.toString(),
      category: p.category ?? undefined,
      description: p.description ?? undefined,
    })) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products Management</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Manage your product inventory here.</p>
      </div>
      <ProductTable products={products} />
    </div>
  )
}
