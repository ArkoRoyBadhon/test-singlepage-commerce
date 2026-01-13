import { prisma } from '@/libs/prisma/client'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function BlogListPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold text-gray-800 dark:text-white">Our Blog</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-card-bg group">
            <div className="overflow-hidden">
              {blog.image ? (
                <div className="relative h-[320px] w-full">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              ) : (
                <div className="h-[320px] w-full bg-gray-200 dark:bg-gray-700"></div>
              )}
            </div>

            {/* Content matching the existing design: floating card */}
            <div className="bg-card-bg relative z-10 mx-4.5 -mt-12 px-7 py-5.5 text-center md:mx-6 xl:mx-[33px]">
              <h3 className="text-primary-text mb-3 text-[18px] leading-[120%] font-semibold">{blog.title}</h3>

              <div
                className="text-primary-text mb-5 line-clamp-4 text-[16px] leading-[120%] font-light"
                dangerouslySetInnerHTML={{
                  __html: blog.description.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
                }}
              />

              <Link
                href={`/blog/${blog.id}`}
                className="text-secondary-color hover:text-hover text-[16px] font-medium underline underline-offset-4 transition"
              >
                See Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
