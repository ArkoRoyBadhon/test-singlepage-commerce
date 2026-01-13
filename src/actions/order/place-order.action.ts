'use server'

import { prisma } from '@/libs/prisma/client'
import { revalidatePath } from 'next/cache'

interface PlaceGuestOrderParams {
  productId: number
  quantity: number
  name: string
  phone: string
  address: string
  city?: string
  otp: string
}

export async function placeGuestOrder(data: PlaceGuestOrderParams) {
  try {
    const otpRecord = await prisma.otpVerification.findUnique({
      where: { phone: data.phone },
    })

    if (!otpRecord || otpRecord.otp !== data.otp) {
      return { success: false, error: 'Invalid OTP' }
    }

    if (new Date() > otpRecord.expiresAt) {
      return { success: false, error: 'OTP expired' }
    }

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    })

    if (!product) {
      return { success: false, error: 'Product not found' }
    }

    const user = await prisma.user.upsert({
      where: { phone: data.phone },
      update: {
        name: data.name,
      },
      create: {
        phone: data.phone,
        name: data.name,
        role: 'USER',
      },
    })

    await prisma.address.create({
      data: {
        userId: user.id,
        addressLine1: data.address,
        city: data.city,
      },
    })

    const totalAmount = Number(product.price) * data.quantity

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        name: data.name,
        phone: data.phone,
        address: `${data.address}${data.city ? ', ' + data.city : ''}`,
        totalAmount,
        status: 'PENDING',
        items: {
          create: {
            productId: product.id,
            quantity: data.quantity,
            price: product.price,
          },
        },
      },
    })

    await prisma.otpVerification.delete({
      where: { phone: data.phone },
    })

    revalidatePath('/dashboard/orders')
    revalidatePath('/dashboard/products')

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('Error placing guest order:', error)
    return { success: false, error: 'Failed to place order' }
  }
}
