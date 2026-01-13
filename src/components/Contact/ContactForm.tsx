'use client'

import { createContactMessage } from '@/actions/contact/createContactMessage'
import { Mail, Phone } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/Button'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await createContactMessage(formData)

      if (result.success) {
        toast.success(result.message)
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        })
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('বার্তা পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।')
      console.error('Error submitting contact form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="wrapper py-20">
      <div className="border border-green-700 px-3 py-9 md:px-12">
        <p className="text-center text-base font-medium lg:text-2xl">আমাদের সাথে যোগাযোগ করুন</p>
        <h3 className="pt-6 text-center text-lg font-medium text-green-700 lg:text-5xl">
          আপনার মতামত আমাদের জন্য গুরুত্বপূর্ণ
        </h3>

        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl pt-12 lg:pt-20">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-3">
              <label className="text-base font-medium">আপনার নাম *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                className="h-14 w-full border border-stone-300 px-4 py-2 transition-colors focus:border-green-700 focus:outline-green-700"
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-base font-medium">ইমেইল ঠিকানা *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="h-14 w-full border border-stone-300 px-4 py-2 transition-colors focus:border-green-700 focus:outline-green-700"
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-base font-medium">মোবাইল নাম্বার *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="০১৭xxxxxxxx"
                className="h-14 w-full border border-stone-300 px-4 py-2 transition-colors focus:border-green-700 focus:outline-green-700"
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-base font-medium">বিষয় *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="বিষয় লিখুন"
                className="h-14 w-full border border-stone-300 px-4 py-2 transition-colors focus:border-green-700 focus:outline-green-700"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-6">
            <label className="text-base font-medium">আপনার বার্তা *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="আপনার বার্তা এখানে লিখুন..."
              className="min-h-[180px] w-full resize-y border border-stone-300 px-4 py-3 transition-colors focus:border-green-700 focus:outline-green-700"
              required
            />
          </div>

          <div className="pt-8">
            <Button size="lg" type="submit" className="w-full lg:w-auto lg:px-12" disabled={isSubmitting}>
              {isSubmitting ? 'পাঠানো হচ্ছে...' : 'বার্তা পাঠান'}
            </Button>
          </div>
        </form>

        <div className="mt-12 border-t border-stone-300 pt-12 text-center lg:pt-20">
          <p className="pb-4 text-lg font-medium lg:text-2xl">সরাসরি যোগাযোগ করুন</p>
          <div className="flex flex-col items-center justify-center gap-6 text-green-700 lg:flex-row">
            <a href="tel:01234567890" className="text-base hover:underline lg:text-xl">
              <span className="flex items-center gap-2">
                <Phone />
                ০১২৩৪৫৬৭৮৯০
              </span>
            </a>
            <span className="hidden lg:inline">|</span>
            <a href="mailto:info@example.com" className="text-base hover:underline lg:text-xl">
              <span className="flex items-center gap-2">
                <Mail />
                info@example.com
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactForm
