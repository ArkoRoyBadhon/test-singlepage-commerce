import { prisma } from '@/libs/prisma/client'
import EditBlogClient from './EditBlogClient'

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const blog = await prisma.blog.findUnique({
    where: {
      id: parseInt(id),
    },
  })

  if (!blog) {
    return <div>Blog not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Edit Blog</h1>
      <EditBlogClient blog={blog} />
    </div>
  )
}
