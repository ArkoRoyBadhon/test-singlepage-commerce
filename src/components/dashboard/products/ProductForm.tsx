'use client'

import { createProduct } from '@/actions/product/product.action'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Plus, Trash2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface ProductFormProps {
  initialData?: {
    id: number
    title: string
    price: string | number
    stock: number
    image: string
    category?: string
    description?: string
    tags?: string[]
    features?: string[]
    benefits?: string[]
  }
}

const ProductForm = ({ initialData }: ProductFormProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    price: initialData?.price?.toString() || '',
    stock: initialData?.stock?.toString() || '',
    image: initialData?.image || '',
    category: initialData?.category || '',
    description: initialData?.description || '',
    tags: initialData?.tags?.join(', ') || '',
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [features, setFeatures] = useState<string[]>(initialData?.features || [])
  const [benefits, setBenefits] = useState<string[]>(initialData?.benefits || [])
  const [currentFeature, setCurrentFeature] = useState('')
  const [currentBenefit, setCurrentBenefit] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddItem = (
    e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    currentItem: string,
    setCurrentItem: React.Dispatch<React.SetStateAction<string>>
  ) => {
    e.preventDefault()
    if (!currentItem.trim()) return
    setList([...list, currentItem.trim()])
    setCurrentItem('')
  }

  const handleRemoveItem = (index: number, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(list.filter((_, i) => i !== index))
  }

  // Clean up object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (formData.image && formData.image.startsWith('blob:')) {
        URL.revokeObjectURL(formData.image)
      }
    }
  }, [formData.image])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]

    // Create local preview immediately
    const objectUrl = URL.createObjectURL(file)
    setFormData((prev) => ({ ...prev, image: objectUrl }))
    setSelectedFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setUploading(true)

    let imageUrl = formData.image

    // Upload image if a new one is selected
    if (selectedFile) {
      const uploadFormData = new FormData()
      uploadFormData.append('file', selectedFile)

      // Import dynamically to avoid server action issues if any
      const { uploadFile } = await import('@/actions/upload/upload.action')
      const uploadRes = await uploadFile(uploadFormData)

      if (!uploadRes.success || !uploadRes.url) {
        toast.error(uploadRes.error || 'Image upload failed')
        setLoading(false)
        setUploading(false)
        return
      }
      imageUrl = uploadRes.url
    }

    const payload = {
      ...formData,
      image: imageUrl,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      features: features,
      benefits: benefits,
      images: [imageUrl],
    }

    // If it was a blob url, we don't send it. But image field is required.
    // If upload failed above we returned. If selectedFile was null, imageUrl is existing string.

    let res
    if (initialData) {
      // Import dynamically to avoid server action issues if any
      const { updateProduct } = await import('@/actions/product/product.action')
      res = await updateProduct(initialData.id, payload)
    } else {
      res = await createProduct(payload)
    }

    setLoading(false)
    setUploading(false)

    if ('success' in res && res.success) {
      toast.success(res.message || 'Product saved successfully')
      router.push('/dashboard/products')
      router.refresh()
    } else if ('error' in res) {
      const errorMessage =
        typeof res.error === 'string'
          ? res.error
          : res.error?.data?.message || `Failed to ${initialData ? 'update' : 'create'} product`
      toast.error(errorMessage)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Product Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Premium Green Tea"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (৳)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g., 500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            placeholder="e.g., 50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Tea, Spices"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="image">Product Image</Label>
          {formData.image ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 p-6 dark:border-gray-700">
              <div className="relative h-48 w-48 overflow-hidden rounded-md border border-gray-200">
                <Image src={formData.image} alt="Product Preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, image: '' }))
                    setSelectedFile(null)
                  }}
                  className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <label
              htmlFor="file-upload"
              className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 p-6 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4 flex flex-col items-center text-sm leading-6 text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-[#15803d] hover:text-[#15803d] hover:underline">
                    Upload a file
                  </span>
                  <span className="pl-1">or drag and drop</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 5MB</p>
              </div>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploading}
              />
            </label>
          )}
          {uploading && <p className="text-sm text-[#15803d]">Uploading...</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed product description..."
            className="w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-950 placeholder:text-zinc-400 focus:outline-hidden data-[hover]:border-zinc-300 dark:border-gray-700 dark:text-white"
            rows={4}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., organic, healthy, tea"
          />
        </div>

        {/* Dynamic Features List */}
        <div className="space-y-2 md:col-span-2">
          <Label>Features</Label>
          <div className="flex gap-2">
            <Input
              value={currentFeature}
              onChange={(e) => setCurrentFeature(e.target.value)}
              placeholder="Add a feature (e.g. 100% Organic)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddItem(e, features, setFeatures, currentFeature, setCurrentFeature)
                }
              }}
            />
            <Button
              type="button"
              onClick={(e) => handleAddItem(e, features, setFeatures, currentFeature, setCurrentFeature)}
              disabled={!currentFeature.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {features.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 rounded-full bg-[#15803d]/10 px-3 py-1 text-sm font-medium text-[#15803d] dark:bg-[#15803d]/30 dark:text-blue-200"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index, features, setFeatures)}
                    className="rounded-full p-0.5 hover:bg-[#15803d]/20 dark:hover:bg-[#15803d]/50"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Benefits List */}
        <div className="space-y-2 md:col-span-2">
          <Label>Benefits</Label>
          <div className="flex gap-2">
            <Input
              value={currentBenefit}
              onChange={(e) => setCurrentBenefit(e.target.value)}
              placeholder="Add a benefit (e.g. Boosts immunity)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddItem(e, benefits, setBenefits, currentBenefit, setCurrentBenefit)
                }
              }}
            />
            <Button
              type="button"
              onClick={(e) => handleAddItem(e, benefits, setBenefits, currentBenefit, setCurrentBenefit)}
              disabled={!currentBenefit.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {benefits.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {benefits.map((benefit, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-200"
                >
                  {benefit}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index, benefits, setBenefits)}
                    className="rounded-full p-0.5 hover:bg-green-200 dark:hover:bg-green-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || uploading}>
          {loading ? (initialData ? 'Updating...' : 'Creating...') : initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  )
}

export default ProductForm
