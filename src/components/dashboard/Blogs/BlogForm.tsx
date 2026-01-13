'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Trash2, Upload } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import 'react-quill-new/dist/quill.snow.css'
import { toast } from 'sonner'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

interface BlogFormData {
  title: string
  image: string
  description: string
}

interface BlogFormProps {
  initialValues?: {
    title: string
    image: string
    description: string
  }
  onSubmit: (values: BlogFormData) => Promise<void>
  isSubmitting: boolean
}

export default function BlogForm({ initialValues, onSubmit, isSubmitting }: BlogFormProps) {
  const [title, setTitle] = useState(initialValues?.title || '')
  const [image, setImage] = useState(initialValues?.image || '')
  const [description, setDescription] = useState(initialValues?.description || '')

  // State for file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  // Clean up object URL when image changes or component unmounts
  useEffect(() => {
    return () => {
      if (image && image.startsWith('blob:')) {
        URL.revokeObjectURL(image)
      }
    }
  }, [image])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]

    // Create a local preview URL
    const objectUrl = URL.createObjectURL(file)
    setImage(objectUrl)
    setSelectedFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let imageUrl = image

      // If a new file is selected, upload it first
      if (selectedFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', selectedFile)

        // Dynamic import for server action
        const { uploadFile } = await import('@/actions/upload/upload.action')
        const uploadRes = await uploadFile(uploadFormData)

        if (!uploadRes.success || !uploadRes.url) {
          toast.error(uploadRes.error || 'Image upload failed')
          setUploading(false)
          return
        }
        imageUrl = uploadRes.url
      }

      // Call parent onSubmit with the final image URL
      await onSubmit({ title, image: imageUrl, description })
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong during submission')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <div>
        <Label htmlFor="title" required>
          Title
        </Label>
        <div className="mt-2">
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            required
          />
        </div>
      </div>

      {/* Image Upload Section */}
      <div>
        <Label htmlFor="image" required>
          Image
        </Label>
        <div className="mt-2">
          {image ? (
            <div className="relative h-64 w-full overflow-hidden rounded-lg border border-gray-200">
              <Image src={image} alt="Blog Preview" fill className="object-cover" />
              <button
                type="button"
                onClick={() => {
                  setImage('')
                  setSelectedFile(null)
                }}
                className="absolute top-2 right-2 rounded-full bg-red-500 p-2 text-white shadow-sm transition-colors hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="file-upload"
              className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-300 p-12 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4 flex flex-col items-center text-sm leading-6 text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-blue-600 hover:text-blue-500 hover:underline">Upload a file</span>
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
          {uploading && (
            <div className="mt-2 flex animate-pulse items-center justify-center text-sm text-blue-500">
              Processing image...
            </div>
          )}
        </div>
      </div>

      <div>
        <Label required>Description</Label>
        <div className="mt-2 mb-12 h-64">
          <ReactQuill theme="snow" value={description} onChange={setDescription} className="h-full" />
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <Button type="submit" disabled={isSubmitting || uploading} variant="primary">
          {isSubmitting || uploading ? 'Saving...' : 'Save Blog'}
        </Button>
      </div>
    </form>
  )
}
