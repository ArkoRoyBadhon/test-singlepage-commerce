import { prisma } from '@/libs/prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, image } = body

    const blog = await prisma.blog.create({
      data: {
        title,
        description,
        image,
      },
    })

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(blogs)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}
