import ProductForm from '@/components/dashboard/products/ProductForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreateProductPage() {
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Product</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Add a new product to your inventory.</p>
      </div>
      <ProductForm />
    </div>
  )
}
