import { prisma } from '@/libs/prisma/client'
import HomeViews from '@/Views/HomeViews'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Start your shoping with us',
}

export default async function Home() {
  const [products, blogs] = await Promise.all([
    prisma.product
      .findMany({
        orderBy: { createdAt: 'desc' },
        take: 8, // Limit to 8 products for homepage
      })
      .then((products) =>
        products.map((p) => ({
          ...p,
          price: Number(p.price),
        }))
      ),
    prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6, // Limit to 6 blogs for homepage
    }),
  ])

  return (
    <>
      <HomeViews products={products} blogs={blogs} />
    </>
  )
}
