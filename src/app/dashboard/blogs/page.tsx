import BlogsTable from '@/components/dashboard/Blogs/BlogsTable'
import { prisma } from '@/libs/prisma/client'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function BlogsPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Blogs</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your blog posts here</p>
        </div>
        <Link
          href="/dashboard/blogs/create"
          className="flex items-center gap-2 rounded-lg bg-[#15803d] px-4 py-2 text-white transition hover:bg-[#116630]"
        >
          <Plus className="h-5 w-5" />
          <span>Create New</span>
        </Link>
      </div>
      <BlogsTable blogs={blogs} />
    </div>
  )
}
