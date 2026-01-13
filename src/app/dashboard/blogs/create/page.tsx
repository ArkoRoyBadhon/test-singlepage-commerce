'use client'

import BlogForm from '@/components/dashboard/Blogs/BlogForm'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface BlogFormValues {
  title: string
  image: string
  description: string
}

export default function CreateBlogPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values: BlogFormValues) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (res.ok) {
        toast.success('Blog created successfully')
        router.push('/dashboard/blogs')
        router.refresh()
      } else {
        toast.error('Failed to create blog')
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Create New Blog</h1>
      <BlogForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  )
}
