'use server'

import { prisma } from '@/libs/prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const contactMessageSchema = z.object({
  name: z.string().min(1, 'নাম প্রয়োজন'),
  email: z.string().email('সঠিক ইমেইল দিন'),
  phone: z.string().min(11, 'সঠিক মোবাইল নাম্বার দিন'),
  subject: z.string().optional(),
  message: z.string().min(10, 'বার্তা কমপক্ষে ১০ অক্ষরের হতে হবে'),
})

export type ContactMessageInput = z.infer<typeof contactMessageSchema>

export async function createContactMessage(data: ContactMessageInput) {
  try {
    // Validate input
    const validatedData = contactMessageSchema.parse(data)

    // Save to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        subject: validatedData.subject || null,
        message: validatedData.message,
        isRead: false,
      },
    })

    // Revalidate admin dashboard
    revalidatePath('/dashboard/contact-messages')

    return {
      success: true,
      message: 'আপনার বার্তা সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।',
      data: contactMessage,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues[0].message,
      }
    }

    console.error('Error creating contact message:', error)
    return {
      success: false,
      message: 'বার্তা পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
    }
  }
}
