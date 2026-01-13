'use server'

import { OrderStatus, Prisma } from '@/generated/prisma/client'
import { prisma } from '@/libs/prisma/client'
import { revalidatePath } from 'next/cache'

export interface OrderFilters {
  status?: OrderStatus
  search?: string
}

export async function getOrders(filters?: OrderFilters) {
  try {
    const where: Prisma.OrderWhereInput = {}

    if (filters?.status) {
      where.status = filters.status
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
        { id: { equals: parseInt(filters.search) || undefined } },
      ]
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    })
    return { success: true, data: orders }
  } catch (error) {
    console.error('Error fetching orders:', error)
    return { success: false, error: 'Failed to fetch orders' }
  }
}

export async function updateOrderStatus(orderId: number, status: OrderStatus) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })

    revalidatePath('/dashboard/orders')
    return { success: true }
  } catch (error) {
    console.error('Error updating order status:', error)
    return { success: false, error: 'Failed to update order status' }
  }
}

export async function deleteOrder(orderId: number) {
  try {
    await prisma.order.delete({
      where: { id: orderId },
    })

    revalidatePath('/dashboard/orders')
    return { success: true }
  } catch (error) {
    console.error('Error deleting order:', error)
    return { success: false, error: 'Failed to delete order' }
  }
}
