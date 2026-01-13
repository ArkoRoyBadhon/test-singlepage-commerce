import { getProductById } from '@/actions/product/product.action'
import ProductForm from '@/components/dashboard/products/ProductForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const res = await getProductById(parseInt(id))

  if (!('success' in res) || !res.success || !('data' in res) || !res.data) {
    notFound()
  }

  const rawProduct = res.data
  const product = {
    ...rawProduct,
    price: rawProduct.price.toString(),
    category: rawProduct.category ?? undefined,
    description: rawProduct.description ?? undefined,
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/dashboard/products"
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Update product details.</p>
      </div>
      <ProductForm initialData={product} />
    </div>
  )
}
