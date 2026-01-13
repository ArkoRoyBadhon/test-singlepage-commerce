'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import SharedHeading from '../ui/SharedHeading'

interface FAQ {
  id: number
  question: string
  answer: string
}

const Faq = () => {
  const [openId, setOpenId] = useState<number | null>(null)
  const [faqs, setFaqs] = useState<FAQ[]>([])

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch('/api/faqs')
        if (res.ok) {
          const data = await res.json()
          setFaqs(data)
        }
      } catch (error) {
        console.error('Failed to fetch FAQs', error)
      }
    }
    fetchFaqs()
  }, [])

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  if (faqs.length === 0) return null

  return (
    <section className="bg-faq-bg font-inter mb-10 py-10 md:mb-20">
      <div className="wrapper">
        <SharedHeading sectionTitle="কাস্টমারের প্রশ্ন" />

        <div className="mt-10 space-y-4 md:mt-20">
          {faqs.map((item) => (
            <div key={item.id} className="pb-6">
              <button onClick={() => toggleFaq(item.id)} className="flex w-full items-center gap-4 text-left md:gap-6">
                {openId === item.id ? (
                  <ChevronUp className="text-primary-text h-6 w-6" />
                ) : (
                  <ChevronDown className="text-primary-text h-6 w-6" />
                )}
                <h4 className="text-primary-text text-[16px] leading-[122%] font-medium md:text-[18px] lg:text-[24px]">
                  {item.question}
                </h4>
              </button>

              {openId === item.id && <p className="text-primary-text mt-1.5 px-10 text-sm md:mt-3">{item.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Faq
