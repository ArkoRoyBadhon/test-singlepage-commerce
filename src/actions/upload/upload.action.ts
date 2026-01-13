'use server'

import configs from '@/configs'
import { createClient } from '@supabase/supabase-js'

export const uploadFile = async (formData: FormData) => {
  try {
    const file = formData.get('file') as File
    if (!file) {
      throw new Error('No file provided')
    }

    const supabase = createClient(
      configs.SUPABASE_URL!,
      configs.SUPABASE_SERVICE_ROLE_KEY || configs.SUPABASE_PUBLISHABLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    if (!configs.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn(
        '⚠️ SUPABASE_SERVICE_ROLE_KEY is missing. Upload falling back to ANON key. This requires RLS policies on the bucket.'
      )
    }

    const { error: uploadError } = await supabase.storage.from('products').upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      let errorMessage = uploadError.message
      const errorWithStatus = uploadError as unknown as { statusCode?: string }
      if (errorWithStatus.statusCode === '403' || uploadError.message.includes('row-level security')) {
        errorMessage =
          'Upload failed due to permissions. Add SUPABASE_SERVICE_ROLE_KEY to .env.local OR configure "products" bucket Policy to allow uploads.'
      }
      throw new Error(errorMessage)
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('products').getPublicUrl(filePath)

    return {
      success: true,
      url: publicUrl,
    }
  } catch (error) {
    console.error('Upload action error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error',
    }
  }
}
