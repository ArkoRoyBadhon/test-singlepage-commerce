export const products = [
  { id: 1, title: 'মেথি মিক্স', image: '/products/methi.png', price: '৳ ৫০০' },
  { id: 2, title: 'মেথি মিক্স+', image: '/products/methi1.png', price: '৳ ৫০০' },
  { id: 3, title: 'মেথি মিক্স প্যাকেজ', image: '/products/methi2.png', price: '৳ ৫০০' },
  { id: 4, title: 'সুন্দরবনের মধু', image: '/products/modho.png', price: '৳ ৫০০' },
  { id: 5, title: 'খাঁটি ঘি', image: '/products/gur.png', price: '৳ ৫০০' },
  { id: 6, title: 'দেশি সরিষার তেল', image: '/products/oil.png', price: '৳ ৫০০' },
  { id: 7, title: 'কাজু বাদাম', image: '/products/badam.png', price: '৳ ৫০০' },
  { id: 8, title: 'ক্যালসিয়াম প্রাকৃতিক সাপ্লিমেন্ট', image: '/products/medicine.png', price: '৳ ৫০০' },
]

export const filterData = [
  {
    title: 'ভিউজ',
    expanded: true,
    options: [
      { id: 'view-1', label: 'গ্রাহকদের থেকে সেরা মান', checked: true },
      { id: 'view-2', label: 'শুধুমাত্র সদস্যদের জন্য ডিলস', checked: false },
    ],
  },
  {
    title: 'আপনার বাজেট',
    expanded: true,
    options: [
      { id: 'budget-1', label: '১০০০ এর কম', checked: true },
      { id: 'budget-2', label: '১০০০ - ১৫০০', checked: false },
      { id: 'budget-3', label: '১৫০০ - ৫০০০', checked: false },
      { id: 'budget-4', label: '৫০০০ এর বেশি', checked: false },
    ],
  },
]
