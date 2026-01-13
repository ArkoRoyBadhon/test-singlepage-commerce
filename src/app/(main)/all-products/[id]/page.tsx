import ProductDetailsView from '@/Views/ProductDetailsView'
import { prisma } from '@/libs/prisma/client'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  if (!id || isNaN(Number(id))) {
    notFound()
  }

  const rawProduct = await prisma.product.findUnique({
    where: { id: parseInt(id) },
  })

  if (!rawProduct) {
    notFound()
  }

  const product = {
    ...rawProduct,
    price: Number(rawProduct.price),
  }

  // Fetch related products (same category, excluding current product, or just latest)
  let relatedProducts = await prisma.product
    .findMany({
      where: {
        id: { not: product.id },
        category: product.category || undefined, // match category if exists
        isAvailable: true,
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
    })
    .then((products) => products.map((p) => ({ ...p, price: Number(p.price) })))

  // If no related products in same category, just fetch latest
  if (relatedProducts.length === 0) {
    relatedProducts = await prisma.product
      .findMany({
        where: {
          id: { not: product.id },
          isAvailable: true,
        },
        take: 4,
        orderBy: { createdAt: 'desc' },
      })
      .then((products) => products.map((p) => ({ ...p, price: Number(p.price) })))
  }

  return (
    <>
      <ProductDetailsView product={product} relatedProducts={relatedProducts} />
    </>
  )
}

export default page
