'use server'

import { prisma } from '@/libs/prisma/client'
import { createServerSupabaseClient } from '@/libs/supabase/server'
import { ActionResponse } from '@/types/server-action.types'
import { formatPhoneNumber } from '@/utils/formatters'
import { revalidatePath } from 'next/cache'

export async function updateProfile(prevState: unknown, formData: FormData): Promise<ActionResponse> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const name = formData.get('name') as string
  const phone = formData.get('phone') as string

  if (!name || !phone) {
    return { success: false, error: 'Name and Phone are required' }
  }

  const formattedPhone = formatPhoneNumber(phone)

  try {
    await prisma.user.update({
      where: { supabaseId: user.id },
      data: { name, phone: formattedPhone },
    })

    await supabase.auth.updateUser({
      data: { name, phone: formattedPhone },
    })

    revalidatePath('/dashboard/profile')
    return { success: true, message: 'Profile updated successfully' }
  } catch (error) {
    console.error('Profile update error:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}
