import { prisma } from '@/libs/prisma/client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(banners)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Get the current max order
    const lastBanner = await prisma.banner.findFirst({
      orderBy: { order: 'desc' },
    })
    const order = lastBanner ? lastBanner.order + 1 : 0

    const banner = await prisma.banner.create({
      data: { ...body, order },
    })
    return NextResponse.json(banner)
  } catch {
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 })
  }
}
