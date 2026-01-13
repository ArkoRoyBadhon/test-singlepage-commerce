import { Banner } from '@/generated/prisma/client'
import { prisma } from '@/libs/prisma/client'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { banners } = body

    await prisma.$transaction(
      banners.map((banner: Banner) =>
        prisma.banner.update({
          where: { id: banner.id },
          data: { order: banner.order },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reorder error:', error)
    return NextResponse.json({ error: 'Failed to reorder banners' }, { status: 500 })
  }
}
