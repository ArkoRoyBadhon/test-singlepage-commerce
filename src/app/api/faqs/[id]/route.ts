import { prisma } from '@/libs/prisma/client'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.faq.delete({
      where: { id: parseInt(id) },
    })
    return NextResponse.json({ message: 'FAQ deleted' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const faq = await prisma.faq.update({
      where: { id: parseInt(id) },
      data: body,
    })
    return NextResponse.json(faq)
  } catch {
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 })
  }
}
