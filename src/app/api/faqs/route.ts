import { prisma } from '@/libs/prisma/client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(faqs)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const faq = await prisma.faq.create({
      data: body,
    })
    return NextResponse.json(faq)
  } catch {
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 })
  }
}
