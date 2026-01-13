import Image from 'next/image'
import Link from 'next/link'

interface FooterProps {
  logo?: string | null
  siteName?: string | null
}

const Footer = ({ logo, siteName }: FooterProps) => {
  return (
    <footer className="border-primary-border text-primary-text font-inter font-inter border-t pt-6 pb-4">
      <div className="wrapper flex flex-wrap items-center justify-center text-center md:justify-between">
        <Link href="/" className="flex flex-row items-center justify-center">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image src={logo || '/logo.png'} alt={siteName || 'দেশি'} fill className="object-cover" />
          </div>
          <span className="ml-2 text-[14px] font-bold">{siteName || 'দেশি'}</span>
        </Link>
        <div className="flex flex-wrap items-center justify-center md:gap-20 lg:justify-between lg:gap-43.5">
          <p className="text-primary-text flex justify-center text-lg font-medium">
            দেশি ছোঁয়ায় তৈরি, প্রতিদিনের প্রয়োজন
          </p>
          <p className="text-primary-text text-sm">
            © {new Date().getFullYear()} কপিরাইট, সর্বস্বত্ব সংরক্ষিত ক্ল্যারিটি ইউআই দ্বারা
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
