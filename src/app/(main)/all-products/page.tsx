import AllProductsView from '@/Views/AllProductsView'
import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/libs/prisma/client'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams
  const page = Number(params.page) || 1
  const limit = 12
  const skip = (page - 1) * limit

  const minPrice = params.minPrice ? Number(params.minPrice) : undefined
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined
  const search = params.search as string | undefined

  // Construct where clause
  const where: Prisma.ProductWhereInput = {
    isAvailable: true,
  }

  if (search) {
    where.title = { contains: search, mode: 'insensitive' }
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}
    if (minPrice !== undefined) where.price.gte = minPrice
    if (maxPrice !== undefined) where.price.lte = maxPrice
  }

  // Fetch data
  const [products, totalCount] = await Promise.all([
    prisma.product
      .findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      })
      .then((products) =>
        products.map((p) => ({
          ...p,
          price: Number(p.price),
        }))
      ),
    prisma.product.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <>
      <AllProductsView products={products} currentPage={page} totalPages={totalPages} />
    </>
  )
}

export default page
