'use server'

import { prisma } from '@/libs/prisma/client'
import { createSupabaseAdmin } from '@/libs/supabase/admin'
import { adminCreateUserSchema } from '@/libs/validation/admin-user.validation'
import { ActionResponse } from '@/types/server-action.types'
import { formatPhoneNumber } from '@/utils/formatters'
import { revalidatePath } from 'next/cache'
import { ZodError } from 'zod'

export async function createSystemUser(prevState: unknown, formData: FormData): Promise<ActionResponse> {
  try {
    // 1. Validate Input using Zod
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      password: formData.get('password'),
      role: formData.get('role'),
    }

    const validatedData = adminCreateUserSchema.parse(rawData)

    // 2. Format Phone
    const formattedPhone = formatPhoneNumber(validatedData.phone)

    // 3. Create in Supabase Auth (Auto-confirmed)
    const supabaseAdmin = createSupabaseAdmin()
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      email_confirm: true,
      phone: formattedPhone,
      phone_confirm: true,
      user_metadata: { name: validatedData.name },
    })

    if (authError) {
      return { success: false, error: authError.message }
    }

    if (!authData.user) {
      return { success: false, error: 'Failed to create auth user' }
    }

    // 4. Create in Database
    await prisma.user.create({
      data: {
        email: validatedData.email,
        phone: formattedPhone,
        name: validatedData.name,
        role: validatedData.role,
        supabaseId: authData.user.id,
      },
    })

    revalidatePath('/dashboard/users')
    return { success: true, message: 'User created successfully' }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      }
    }
    console.error('Create user error:', error)
    return { success: false, error: 'Internal server error' }
  }
}
