'use server'

import { prisma } from '@/libs/prisma/client'
import { createSupabaseAdmin } from '@/libs/supabase/admin'
import { ActionResponse } from '@/types/server-action.types'
import { revalidatePath } from 'next/cache'

export async function deleteUser(userId: number): Promise<ActionResponse> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    if (user.supabaseId) {
      const supabaseAdmin = createSupabaseAdmin()
      const { error } = await supabaseAdmin.auth.admin.deleteUser(user.supabaseId)
      if (error) {
        console.error('Failed to delete Supabase user:', error)
        // Proceed to delete from DB anyway? Yes, usually for consistency
      }
    }

    await prisma.user.delete({
      where: { id: userId },
    })

    revalidatePath('/dashboard/users')
    return { success: true, message: 'User deleted successfully' }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { success: false, error: 'Failed to delete user' }
  }
}
