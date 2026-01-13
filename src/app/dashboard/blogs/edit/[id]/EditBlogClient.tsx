'use client'

import BlogForm from '@/components/dashboard/Blogs/BlogForm'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { Blog } from '@/generated/prisma/client'

interface BlogFormValues {
  title: string
  image: string
  description: string
}

export default function EditBlogClient({ blog }: { blog: Blog }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values: BlogFormValues) => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/blogs/${blog.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (res.ok) {
        toast.success('Blog updated successfully')
        router.push('/dashboard/blogs')
        router.refresh()
      } else {
        toast.error('Failed to update blog')
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return <BlogForm initialValues={blog} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
}
