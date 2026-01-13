'use client'

import { Button, Group, Input, Label } from '@/components'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { Edit2, Plus, Trash2, UploadCloud } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Review {
  id: number
  name: string | null
  videoUrl: string | null
  image: string | null
}

const ReviewSettings = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    videoUrl: '',
    image: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews')
      if (res.ok) {
        const data = await res.json()
        setReviews(data)
      }
    } catch {
      toast.error('Failed to load reviews')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    const objectUrl = URL.createObjectURL(file)
    setFormData((prev) => ({ ...prev, image: objectUrl }))
    setSelectedFile(file)
  }

  const handleEdit = (review: Review) => {
    setEditingId(review.id)
    setFormData({
      name: review.name || '',
      videoUrl: review.videoUrl || '',
      image: review.image || '',
    })
    setSelectedFile(null)
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ name: '', videoUrl: '', image: '' })
    setSelectedFile(null)
  }

  const handleDelete = (id: number) => {
    setDeleteId(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return

    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/reviews/${deleteId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Review deleted')
        fetchReviews()
        setIsDeleteModalOpen(false)
        setDeleteId(null)
      } else {
        toast.error('Failed to delete review')
      }
    } catch {
      toast.error('Error deleting review')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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

      const url = editingId ? `/api/reviews/${editingId}` : '/api/reviews'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, image: imageUrl || undefined }),
      })

      if (res.ok) {
        toast.success(`Review ${editingId ? 'updated' : 'added'} successfully`)
        setFormData({ name: '', videoUrl: '', image: '' })
        setSelectedFile(null)
        setEditingId(null)
        fetchReviews()
      } else {
        toast.error(`Failed to ${editingId ? 'update' : 'add'} review`)
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
        <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
          {editingId ? 'Edit Review' : 'Add New Review'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Group>
            <Label htmlFor="name">Customer Name (Optional)</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter customer name"
            />
          </Group>

          <Group>
            <Label htmlFor="videoUrl">Video URL (Optional)</Label>
            <Input
              id="videoUrl"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="https://youtube.com/..."
            />
          </Group>

          <Group>
            <Label>Review Image (Optional)</Label>
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

          <div className="flex gap-3">
            <Button type="submit" loading={loading} loadingText={uploading ? 'Uploading...' : 'Saving...'}>
              {editingId ? <Edit2 className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {editingId ? 'Update Review' : 'Add Review'}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="relative overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
          >
            <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-700">
              {review.image ? (
                <Image src={review.image} alt="Review" fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  <span className="text-sm">No Image</span>
                </div>
              )}
            </div>
            <div className="p-4">
              {review.name && <h3 className="font-medium text-gray-900 dark:text-white">{review.name}</h3>}
              {review.videoUrl && (
                <a
                  href={review.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Watch Video
                </a>
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEdit(review)}
                  className="rounded-full bg-white/80 p-2 text-blue-600 backdrop-blur-sm transition-colors hover:bg-blue-100"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="rounded-full bg-white/80 p-2 text-red-600 backdrop-blur-sm transition-colors hover:bg-red-100"
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
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteLoading}
        variant="danger"
      />
    </div>
  )
}

export default ReviewSettings
