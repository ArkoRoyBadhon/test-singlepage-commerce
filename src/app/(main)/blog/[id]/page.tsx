import { prisma } from '@/libs/prisma/client'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const blog = await prisma.blog.findUnique({
    where: {
      id: parseInt(id),
    },
  })

  if (!blog) {
    notFound()
  }

  return (
    <article className="container mx-auto max-w-4xl px-4 py-8">
      {blog.image && (
        <div className="relative mb-8 h-64 w-full md:h-96">
          <Image src={blog.image} alt={blog.title} fill className="rounded-lg object-cover" priority />
        </div>
      )}
      <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-5xl dark:text-white">{blog.title}</h1>
      <div className="mb-8 text-gray-500 dark:text-gray-400">
        Published on {new Date(blog.createdAt).toLocaleDateString()}
      </div>

      <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: blog.description }}></div>
    </article>
  )
}
