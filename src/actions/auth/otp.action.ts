'use server'

import { prisma } from '@/libs/prisma/client'

export async function sendOtp(phone: string) {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    await prisma.otpVerification.upsert({
      where: { phone },
      update: {
        otp,
        expiresAt,
      },
      create: {
        phone,
        otp,
        expiresAt,
      },
    })

    return { success: true, otp }
  } catch (error) {
    console.error('Error sending OTP:', error)
    return { success: false, error: 'Failed to send OTP' }
  }
}

export async function verifyOtpOnly(phone: string, otp: string) {
  try {
    const record = await prisma.otpVerification.findUnique({
      where: { phone },
    })

    if (!record) {
      return { success: false, error: 'OTP not found' }
    }

    if (record.otp !== otp) {
      return { success: false, error: 'Invalid OTP' }
    }

    if (new Date() > record.expiresAt) {
      return { success: false, error: 'OTP expired' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return { success: false, error: 'Failed to verify OTP' }
  }
}
