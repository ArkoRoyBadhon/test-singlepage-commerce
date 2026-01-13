'use client'
import { sendOtp } from '@/actions/auth/otp.action'
import { placeGuestOrder } from '@/actions/order/place-order.action'
import OtpVerificationModal from '@/components/checkout/OtpVerificationModal'
import Image from 'next/image'

import React, { useState } from 'react'
import { toast } from 'sonner' // Assuming sonner is installed, otherwise alert
import { Button } from '../ui/Button'

import { Product } from '@/interfaces/allproduct.interfaces'

interface OrderFormProps {
  selectedQuantity: number
  product: Product
}

const OrderForm = ({ selectedQuantity, product }: OrderFormProps) => {
  const basePrice = Number(product.price)
  const subtotal = basePrice * selectedQuantity
  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']

  const toBengaliNumber = (num: number) => {
    return num
      .toString()
      .split('')
      .map((digit) => (/[0-9]/.test(digit) ? bengaliNumerals[parseInt(digit)] : digit))
      .join('')
  }

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  })

  // OTP State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false)
  const [devOtp, setDevOtp] = useState<string | null>(null)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePlaceOrderClick = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('অনুগ্রহ করে নাম, ফোন নম্বর এবং ঠিকানা পূরণ করুন।') // "Please fill name, phone, address"
      return
    }

    setIsSendingOtp(true)
    try {
      const res = await sendOtp(formData.phone)
      if (res.success && res.otp) {
        setDevOtp(res.otp)
        setIsOtpModalOpen(true)
        toast.success('আপনার ফোনে একটি ওটিপি পাঠানো হয়েছে।')
      } else {
        toast.error(res.error || 'ওটিপি পাঠাতে ব্যর্থ হয়েছে।')
      }
    } catch (error) {
      console.error(error)
      toast.error('কিছু ভুল হয়েছে। আবার চেষ্টা করুন।')
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleOtpVerify = async (otp: string) => {
    setIsVerifyingOtp(true)
    try {
      const res = await placeGuestOrder({
        productId: product.id,
        quantity: selectedQuantity,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        otp: otp,
      })

      if (res.success) {
        toast.success('অর্ডার সফল হয়েছে!') // Order Successful
        setIsOtpModalOpen(false)
        // Redirect to success page or clear form
        // For now, let's reset form and maybe redirect home after delay
        setFormData({ name: '', phone: '', address: '' })
        // You might want to redirect to a thank you page
        // router.push(`/order-success/${res.orderId}`)
      } else {
        toast.error(res.error || 'অর্ডার করতে ব্যর্থ হয়েছে।')
      }
    } catch (error) {
      console.error(error)
      toast.error('কিছু ভুল হয়েছে। আবার চেষ্টা করুন।')
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  return (
    <div className="wrapper">
      <div className="my-20 border border-green-700 px-3 py-9 md:px-12">
        <p className="text-center text-base font-medium lg:text-2xl">যোগাযোগ করুন</p>
        <h3 id="order-form-section" className="pt-6 text-center text-lg font-medium text-green-700 lg:text-5xl">
          পূর্ণ ঠিকানা দিয়ে ফর্মটি পূরণ করে অর্ডার করুন
        </h3>

        <form onSubmit={handlePlaceOrderClick} className="grid grid-cols-1 gap-12 pt-20 lg:grid-cols-2">
          <div>
            <h4 className="pb-12 text-3xl">তথ্য পূরণের ঘর</h4>
            <div className="flex flex-col gap-3">
              <label>আপনার নাম লিখুন *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="h-14 w-full border border-stone-300 p-2 focus:outline-green-700"
                placeholder="নাম"
                required
              />
            </div>
            <div className="flex flex-col gap-3 pt-6">
              <label>আপনার মোবাইল নাম্বারটি লিখুন *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="h-14 w-full border border-stone-300 p-2 focus:outline-green-700"
                placeholder="মোবাইল নাম্বার"
                required
              />
            </div>

            <div className="flex flex-col gap-3 pt-6">
              <label>আপনার ঠিকানা লিখুন *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="h-14 w-full border border-stone-300 p-2 focus:outline-green-700"
                placeholder="বাসা নং, রোড নং, এলাকা"
                required
              />
            </div>
          </div>

          <div>
            <h4 className="pb-12 text-3xl">অর্ডার সামারি</h4>
            <table className="w-full">
              <thead className="border-b border-stone-300">
                <tr>
                  <th className="text-start font-normal">পণ্য</th>
                  <th className="font-normal">সংখ্যা</th>
                  <th className="font-normal">সাবটোটাল</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-stone-300">
                  <td className="my-3 flex flex-wrap items-center gap-2 lg:gap-8">
                    <Image
                      src={product.image || '/placeholder.jpg'}
                      width={80}
                      height={80}
                      alt={product.title}
                      className="object-cover lg:h-20 lg:w-20"
                    />
                    <p>{product.title}</p>
                  </td>
                  <td className="text-center">{toBengaliNumber(selectedQuantity)}</td>
                  <td className="text-center">৳{toBengaliNumber(subtotal)}</td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-between border-b border-stone-300 py-6">
              <span>সাবটোটাল</span>
              <span className="pr-8">৳{toBengaliNumber(subtotal)}</span>
            </div>
            <div className="flex justify-between border-b border-stone-300 py-6">
              <span>সর্বমোট</span>
              <span className="pr-8 font-semibold">৳{toBengaliNumber(subtotal)}</span>
            </div>

            <Button size="md" className="w-full" type="submit" loading={isSendingOtp} loadingText="অপেক্ষা করুন...">
              অর্ডার প্লেস করুন
            </Button>
            <div className="flex justify-between pt-6">
              <span className="text-lg text-green-700 lg:text-2xl">ক্যাশ অন ডেলিভারি</span>
              <span className="text-lg text-green-700 lg:text-2xl">ডেলিভারি চার্জ ফ্রি</span>
            </div>
          </div>
        </form>

        <p className="pt-20 pb-9 text-center text-lg font-medium lg:text-3xl">
          কোন প্রশ্ন বা সাহায্য লাগলে কল করুনঃ 01234567890
        </p>
      </div>

      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        phone={formData.phone}
        onVerify={handleOtpVerify}
        isVerifying={isVerifyingOtp}
        devOtp={devOtp}
      />
    </div>
  )
}

export default OrderForm
