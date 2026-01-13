import { prisma } from '@/libs/prisma/client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    let settings = await prisma.siteSetting.findFirst()
    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: {},
      })
    }
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    let settings = await prisma.siteSetting.findFirst()

    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: body,
      })
    } else {
      settings = await prisma.siteSetting.update({
        where: { id: settings.id },
        data: body,
      })
    }

    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
