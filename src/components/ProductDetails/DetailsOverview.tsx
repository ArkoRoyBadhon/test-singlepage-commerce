import Image from 'next/image'
import { Button } from '../ui/Button'

import { Product } from '@/interfaces/allproduct.interfaces'

interface DetailsOverviewProps {
  selectedQuantity: number
  setSelectedQuantity: (quantity: number) => void
  product: Product
}

const DetailsOverview = ({ selectedQuantity, setSelectedQuantity, product }: DetailsOverviewProps) => {
  const selectedClass =
    'text-green-700 text-base font-semibold px-5 md:px-6 py-1.5 bg-green-700/20 outline -outline-offset-1 outline-green-700 hover:bg-green-700/30'
  const defaultClass =
    'text-base font-semibold px-5 md:px-6 py-1.5 text-zinc-400 outline -outline-offset-1 bg-white outline-neutral-500 hover:bg-white/30'
  const quantities = [1, 2, 3]
  const bengaliNumerals = ['১', '২', '৩']

  return (
    <div className="wrapper flex flex-wrap gap-12 py-12 lg:flex-nowrap">
      <div className="relative h-[560px] w-full lg:w-[616px]">
        <Image src={product.image || '/placeholder.jpg'} fill className="rounded-lg object-cover" alt={product.title} />
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-medium lg:text-5xl">{product.title}</h1>
        <p className="pt-3 text-3xl lg:text-5xl">৳{product.price}</p>

        <div className="flex gap-6 pt-8">
          {quantities.map((q, index) => (
            <Button
              key={q}
              onClick={() => setSelectedQuantity(q)}
              className={selectedQuantity === q ? selectedClass : defaultClass}
            >
              {bengaliNumerals[index]} পিস
            </Button>
          ))}
        </div>

        {product.benefits && product.benefits.length > 0 && (
          <div>
            <h3 className="pt-6 pb-4 text-2xl">স্বাস্থ্য উপকারিতা:</h3>
            <ul className="list-disc pl-5">
              {product.benefits.map((benefit: string, index: number) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        {product.features && product.features.length > 0 && (
          <div>
            <h3 className="pt-3 pb-4 text-2xl">মূল বৈশিষ্ট্যসমূহ:</h3>
            <ul className="list-disc pl-5">
              {product.features.map((feature: string, index: number) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        <Button
          size="md"
          className="mt-7 w-full"
          onClick={() => {
            document.getElementById('order-form-section')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          কিনতে চাই
        </Button>
      </div>
    </div>
  )
}

export default DetailsOverview
