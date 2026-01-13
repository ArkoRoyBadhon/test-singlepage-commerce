'use client'

import { Button, Group, Label } from '@/components'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { ArrowLeft, ArrowRight, Plus, Trash2, UploadCloud } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Banner } from '@/generated/prisma/client'

const BannerSettings = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [reordering, setReordering] = useState(false)
  const [formData, setFormData] = useState({
    image: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners')
      if (res.ok) {
        const data = await res.json()
        setBanners(data)
      }
    } catch {
      toast.error('Failed to load banners')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    const objectUrl = URL.createObjectURL(file)
    setFormData((prev) => ({ ...prev, image: objectUrl }))
    setSelectedFile(file)
  }

  const customSort = (a: Banner, b: Banner) => (a.order ?? 0) - (b.order ?? 0)

  const handleMove = async (index: number, direction: -1 | 1) => {
    if (reordering) return
    const newBanners = [...banners]
    const targetIndex = index + direction

    if (targetIndex < 0 || targetIndex >= newBanners.length) return

    // Swap order values first
    const currentOrder = newBanners[index].order ?? index
    const targetOrder = newBanners[targetIndex].order ?? targetIndex

    newBanners[index].order = targetOrder
    newBanners[targetIndex].order = currentOrder

    // Sort locally to reflect visual change immediately
    newBanners.sort(customSort)
    setBanners(newBanners)

    setReordering(true)
    try {
      const res = await fetch('/api/banners/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banners: newBanners }),
      })

      if (res.ok) {
        // optional: toast.success('Order updated')
      } else {
        toast.error('Failed to update order')
        fetchBanners() // Revert on failure
      }
    } catch {
      toast.error('Error updating order')
      fetchBanners()
    } finally {
      setReordering(false)
    }
  }

  const handleDelete = (id: number) => {
    setDeleteId(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return

    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/banners/${deleteId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Banner deleted')
        fetchBanners()
        setIsDeleteModalOpen(false)
      } else {
        toast.error('Failed to delete banner')
      }
    } catch {
      toast.error('Error deleting banner')
    } finally {
      setDeleteLoading(false)
      setDeleteId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile && !formData.image) {
      toast.error('Please select an image')
      return
    }

    setLoading(true)
    try {
      let imageUrl = formData.image

      if (selectedFile) {
        setUploading(true)
        const uploadFormData = new FormData()
        uploadFormData.append('file', selectedFile)

        const { uploadFile } = await import('@/actions/upload/upload.action')
        const uploadRes = await uploadFile(uploadFormData)

        if (!uploadRes.success || !uploadRes.url) {
          throw new Error(uploadRes.error || 'Image upload failed')
        }
        imageUrl = uploadRes.url
      }

      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageUrl }),
      })

      if (res.ok) {
        toast.success('Banner added successfully')
        setFormData({ image: '' })
        setSelectedFile(null)
        fetchBanners()
      } else {
        toast.error('Failed to add banner')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="max-w-6xl rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">Add New Banner</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Group>
            <Label>Banner Image</Label>
            <div className="flex items-center gap-4">
              <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="mb-3 h-8 w-8 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
              {formData.image && (
                <div className="relative h-32 w-48 overflow-hidden rounded-lg">
                  <Image src={formData.image} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>
          </Group>

          <Button type="submit" loading={loading} loadingText={uploading ? 'Uploading...' : 'Saving...'}>
            <Plus className="mr-2 h-4 w-4" /> Add Banner
          </Button>
        </form>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="relative overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
          >
            <div className="relative h-40 w-full">
              <Image src={banner.image} alt={`Banner ${index + 1}`} fill className="object-cover" />
            </div>
            <div className="flex justify-between p-4">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900 dark:text-white">Banner {index + 1}</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMove(index, -1)}
                  disabled={index === 0 || reordering}
                  className="rounded p-1.5 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-700"
                  title="Move Previous"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleMove(index, 1)}
                  disabled={index === banners.length - 1 || reordering}
                  className="rounded p-1.5 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-700"
                  title="Move Next"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
                <div className="mx-1 h-4 border-l border-gray-300 dark:border-gray-600"></div>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="rounded p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Banner"
        message="Are you sure you want to delete this banner? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteLoading}
        variant="danger"
      />
    </div>
  )
}

export default BannerSettings
