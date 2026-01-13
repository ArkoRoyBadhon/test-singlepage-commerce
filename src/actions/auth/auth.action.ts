'use server'

import configs from '@/configs'
import { AppError, sendResponse } from '@/libs'
import { prisma } from '@/libs/prisma/client'
import { createServerSupabaseClient } from '@/libs/supabase/server'
import type { LogInFormData } from '@/libs/validation/auth.validation'
import { revalidatePath } from 'next/cache'

export const register = async () => {
  return AppError('Registration is disabled by admin', configs.FORBIDDEN)
}

export const logIn = async ({ email, password }: LogInFormData) => {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.toLowerCase().includes('email not confirmed')) {
      await supabase.auth.resend({
        type: 'signup',
        email: email,
      })

      return AppError('EMAIL_NOT_CONFIRMED', configs.BAD_REQUEST)
    }
    return AppError(error.message, configs.UNAUTHORIZED)
  }

  if (data.user) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ supabaseId: data.user.id }, { email: email }],
      },
    })

    if (!user) {
      const placeholderPhone = `temp-${data.user.id}`
      await prisma.user.create({
        data: {
          supabaseId: data.user.id,
          email: email,
          role: 'USER',
          phone: placeholderPhone,
          name: email.split('@')[0],
        },
      })
    } else if (!user.supabaseId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { supabaseId: data.user.id },
      })
    }

    if (user && user.role !== data.user.user_metadata?.role) {
      console.log(`Syncing role for ${user.email}: ${data.user.user_metadata?.role} -> ${user.role}`)
      await supabase.auth.updateUser({
        data: { role: user.role },
      })
    }
  }

  revalidatePath('/', 'layout')
  return sendResponse({
    success: true,
    status: configs.OK,
    data: null,
    message: 'Login successful!',
  })
}

export const logOut = async () => {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return AppError(error.message, configs.INTERNAL_SERVER_ERROR)
  }

  revalidatePath('/', 'layout')
  return sendResponse({
    success: true,
    status: configs.OK,
    data: null,
    message: 'Logged out successfully!',
  })
}
