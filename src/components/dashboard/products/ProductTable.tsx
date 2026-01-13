'use client'

import { deleteProduct } from '@/actions/product/product.action'
import { Button } from '@/components/ui/Button'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { Edit, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface Product {
  id: number
  title: string
  price: string
  image: string
  stock: number
  category?: string
}

interface ProductTableProps {
  products: Product[]
}

const ProductTable = ({ products }: ProductTableProps) => {
  const router = useRouter()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (id: number) => {
    setSelectedProductId(id)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedProductId) return

    setIsDeleting(true)
    const res = await deleteProduct(selectedProductId)

    setIsDeleting(false)
    setIsDeleteModalOpen(false)
    setSelectedProductId(null)

    if ('success' in res && res.success) {
      toast.success(res.message || 'Product deleted successfully')
    } else {
      toast.error('Failed to delete product')
    }
  }

  return (
    <>
      <div className="rounded-xl bg-white shadow-sm dark:bg-gray-800">
        <div className="flex items-center justify-between border-b p-6 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">All Products</h2>
          <Link href="/dashboard/products/create">
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No products found. Add your first product!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      <div className="h-12 w-12 overflow-hidden rounded-md border border-gray-200">
                        <Image
                          src={product.image || '/placeholder.png'}
                          alt={product.title}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{product.title}</td>
                    <td className="px-6 py-4">{product.category || 'N/A'}</td>
                    <td className="px-6 py-4">৳ {product.price}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          title="Edit"
                          onClick={() => router.push(`/dashboard/products/edit/${product.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 border-red-200 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleDeleteClick(product.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  )
}

export default ProductTable
