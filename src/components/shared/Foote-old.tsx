import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="border-primary-border text-primary-text font-inter font-inter border-t pt-12">
      <div className="wrapper">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-17 lg:grid-cols-4">
          <div>
            <h3 className="mb-6 text-[24px] leading-[122%] font-semibold">আমাদের সম্পর্কে</h3>
            <p className="text-primary-text mb-6 text-[16px] leading-[150%]">
              সততা, যত্ন এবং গ্রাহক সন্তুষ্টিকে সর্বোচ্চ গুরুত্ব দিয়ে আমরা প্রতিদিন কাজ করে যাচ্ছি।
            </p>

            <div className="flex items-center gap-5 text-gray-800">
              <Image
                className="cursor-pointer transition hover:scale-110"
                src="/social/fb.png"
                alt="facebook"
                width={24}
                height={24}
              />
              <Image
                className="cursor-pointer transition hover:scale-110"
                src="/social/linkedin.png"
                alt="pnkedin"
                width={24}
                height={24}
              />
              <Image
                className="cursor-pointer transition hover:scale-110"
                src="/social/utube.png"
                alt="youtube"
                width={24}
                height={24}
              />
              <Image
                className="cursor-pointer transition hover:scale-110"
                src="/social/x.png"
                alt="x"
                width={24}
                height={24}
              />
              <Image
                className="cursor-pointer transition hover:scale-110"
                src="/social/insta.png"
                alt="instagram"
                width={24}
                height={24}
              />
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-[24px] leading-[122%] font-semibold">আমাদের পলিসি</h3>
            <div className="text-primary-text space-y-5 text-[14px] font-medium">
              <p>সারাদেশে ক্যাশ অন ডেলিভারি</p>
              <p>পছন্দ না হলে রিটার্ন চার্জ ১০০/- টাকা</p>
              <p>আপনার সব তথ্য আমাদের কাছে নিরাপদ</p>
              <p>পণ্য হাতে পেয়ে টাকা পরিশোধ করুন</p>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-[24px] leading-[122%] font-medium font-semibold">সরাসরি যোগাযোগ</h3>
            <ul className="text-primary-text space-y-5 text-[14px] font-medium">
              <p>০১*********</p>
              <p>প্রতিদিন সকাল ১০টা - রাত ১০টা</p>
              <p>ঢাকা, বাংলাদেশ</p>
              <p className="font-medium text-black">যোগাযোগ করুন</p>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-[24px] leading-[122%] font-semibold">নিউজলেটার</h3>

            <input
              type="text"
              placeholder="মেসেজ টাইপ করুন"
              className="border-primary-border outpne-none mb-4 w-full rounded-lg border px-4 py-3 text-[16px] focus:border-green-600"
            />

            <button className="w-full rounded-lg bg-green-600 py-3 text-[16px] font-medium text-white transition hover:bg-green-700">
              মেসেজ সেন্ড
            </button>
          </div>
        </div>

        <p className="text-primary-text border-primary-border mt-6 border-t py-6 text-center text-sm">
          © {new Date().getFullYear()} কপিরাইট, সর্বস্বত্ব সংরক্ষিত ক্ল্যারিটি ইউআই দ্বারা
        </p>
      </div>
    </footer>
  )
}

export default Footer
