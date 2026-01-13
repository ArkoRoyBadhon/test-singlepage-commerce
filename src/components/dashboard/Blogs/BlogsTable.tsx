'use client'

import { Button } from '@/components/ui/Button'
import { Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Blog } from '@/generated/prisma/client'

export default function BlogsTable({ blogs }: { blogs: Blog[] }) {
  const router = useRouter()

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog?')) return

    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Blog deleted successfully')
        router.refresh()
      } else {
        toast.error('Failed to delete blog')
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred')
    }
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
        <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3">
              Created At
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <tr
                key={blog.id}
                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{blog.title}</td>
                <td className="px-6 py-4">{new Date(blog.createdAt).toLocaleDateString()}</td>
                <td className="flex items-center gap-2 px-6 py-4">
                  <Link href={`/dashboard/blogs/edit/${blog.id}`}>
                    <Button variant="secondary" size="sm" className="bg-[#15803d] hover:bg-[#116630]">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDelete(blog.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center">
                No blogs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
