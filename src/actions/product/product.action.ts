'use server'

import configs from '@/configs'
import { AppError, sendResponse } from '@/libs'
import { prisma } from '@/libs/prisma/client'
import { revalidatePath } from 'next/cache'

export const getProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return sendResponse({
      success: true,
      status: configs.OK,
      message: 'Products fetched successfully',
      data: products,
    })
  } catch (error) {
    return AppError(error instanceof Error ? error.message : 'Unknown error', configs.INTERNAL_SERVER_ERROR)
  }
}

export const getProductById = async (id: number) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return AppError('Product not found', configs.NOT_FOUND)
    }

    return sendResponse({
      success: true,
      status: configs.OK,
      message: 'Product fetched successfully',
      data: product,
    })
  } catch (error) {
    return AppError(error instanceof Error ? error.message : 'Unknown error', configs.INTERNAL_SERVER_ERROR)
  }
}

interface ProductInput {
  title: string
  price: string | number
  image: string
  images?: string[]
  description?: string
  category?: string
  tags?: string[]
  features?: string[]
  benefits?: string[]
  stock?: string | number
}

export const createProduct = async (data: ProductInput) => {
  try {
    if (!data.title || !data.price || !data.image) {
      return AppError('Title, price, and image are required', configs.BAD_REQUEST)
    }

    const price = Number(data.price)
    const stock = Number(data.stock) || 0

    const product = await prisma.product.create({
      data: {
        title: data.title,
        price: price,
        image: data.image,
        images: data.images || [],
        description: data.description,
        category: data.category,
        tags: data.tags || [],
        features: data.features || [],
        benefits: data.benefits || [],
        stock: stock,
        isAvailable: stock > 0,
      },
    })

    revalidatePath('/dashboard/products')
    revalidatePath('/all-products')
    revalidatePath('/')

    return sendResponse({
      success: true,
      status: configs.CREATED,
      message: 'Product created successfully',
      data: product,
    })
  } catch (error) {
    console.error(error)
    return AppError(error instanceof Error ? error.message : 'Unknown error', configs.INTERNAL_SERVER_ERROR)
  }
}

export const updateProduct = async (id: number, data: ProductInput) => {
  try {
    // Basic validation
    if (!data.title || !data.price || !data.image) {
      return AppError('Title, price, and image are required', configs.BAD_REQUEST)
    }

    const price = Number(data.price)
    const stock = Number(data.stock) || 0

    const product = await prisma.product.update({
      where: { id },
      data: {
        title: data.title,
        price: price,
        image: data.image,
        images: data.images || [],
        description: data.description,
        category: data.category,
        tags: data.tags || [],
        features: data.features || [],
        benefits: data.benefits || [],
        stock: stock,
        isAvailable: stock > 0,
        updatedAt: new Date(),
      },
    })

    revalidatePath('/dashboard/products')
    revalidatePath('/all-products')
    revalidatePath('/')
    revalidatePath(`/dashboard/products/edit/${id}`)

    return sendResponse({
      success: true,
      status: configs.OK,
      message: 'Product updated successfully',
      data: product,
    })
  } catch (error) {
    console.error(error)
    return AppError(error instanceof Error ? error.message : 'Unknown error', configs.INTERNAL_SERVER_ERROR)
  }
}

export const deleteProduct = async (id: number) => {
  try {
    await prisma.product.delete({
      where: { id },
    })

    revalidatePath('/dashboard/products')
    revalidatePath('/all-products')
    revalidatePath('/')

    return sendResponse({
      success: true,
      status: configs.OK,
      message: 'Product deleted successfully',
      data: null,
    })
  } catch (error) {
    return AppError(error instanceof Error ? error.message : 'Unknown error', configs.INTERNAL_SERVER_ERROR)
  }
}
