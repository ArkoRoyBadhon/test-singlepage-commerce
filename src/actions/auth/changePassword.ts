'use server'

import { createServerSupabaseClient } from '@/libs/supabase/server'

export async function changePassword(prevState: unknown, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email) {
    return { success: false, message: 'Unauthorized' }
  }

  const oldPassword = formData.get('oldPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!oldPassword || !newPassword || !confirmPassword) {
    return { success: false, message: 'All fields are required' }
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: 'New passwords do not match' }
  }

  if (newPassword.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters' }
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: oldPassword,
  })

  if (signInError) {
    return { success: false, message: 'Incorrect old password' }
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (updateError) {
    return { success: false, message: updateError.message }
  }

  return { success: true, message: 'Password changed successfully' }
}
