import { prisma } from '@/libs/prisma/client'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.banner.delete({
      where: { id: parseInt(id) },
    })
    return NextResponse.json({ message: 'Banner deleted' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const banner = await prisma.banner.update({
      where: { id: parseInt(id) },
      data: body,
    })
    return NextResponse.json(banner)
  } catch {
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 })
  }
}
