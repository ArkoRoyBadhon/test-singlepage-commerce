import { prisma } from '@/libs/prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    await prisma.contactMessage.delete({
      where: { id: Number(id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact message:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete message' }, { status: 500 })
  }
}
