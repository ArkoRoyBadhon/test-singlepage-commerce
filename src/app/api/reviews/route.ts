import { prisma } from '@/libs/prisma/client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(reviews)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const review = await prisma.review.create({
      data: body,
    })
    return NextResponse.json(review)
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
