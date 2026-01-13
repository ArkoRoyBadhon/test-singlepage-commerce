import { prisma } from '@/libs/prisma/client'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.review.delete({
      where: { id: parseInt(id) },
    })
    return NextResponse.json({ message: 'Review deleted' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const review = await prisma.review.update({
      where: { id: parseInt(id) },
      data: body,
    })
    return NextResponse.json(review)
  } catch {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}
