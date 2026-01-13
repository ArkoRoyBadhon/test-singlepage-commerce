'use client'

import { Search, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from './Button'

interface BreadCrumbItem {
  label: string
  href: string
}

interface BreadCrumbProps {
  items: BreadCrumbItem[]
  showSearch?: boolean
  showFilter?: boolean
  onFilterClick?: () => void
  searchPlaceholder?: string
}

const BreadCrumb: React.FC<BreadCrumbProps> = ({
  items,
  showSearch = false,
  showFilter = false,
  onFilterClick,
  searchPlaceholder = 'সার্চ করুন...',
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery) {
      params.set('search', searchQuery)
    } else {
      params.delete('search')
    }
    // Reset page to 1 when searching
    params.set('page', '1')

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="bg-green-700 py-4">
      <div className="wrapper flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm text-white md:text-base">
          {items.map((item, index) => (
            <div key={item.href} className="flex items-center gap-2">
              <Link href={item.href} className="transition-colors hover:text-green-200 hover:underline">
                {item.label}
              </Link>
              {index < items.length - 1 && <span className="text-green-300">/</span>}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {showSearch && (
            <div className="relative w-full md:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={searchPlaceholder}
                className="w-full rounded-md border-none bg-white py-2 pr-10 pl-4 text-sm text-gray-800 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="absolute top-1/2 right-1 -translate-y-1/2 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-green-600"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          )}

          {showFilter && onFilterClick && (
            <Button size="sm" className="bg-white text-green-700 hover:bg-green-50 lg:hidden" onClick={onFilterClick}>
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> <span>ফিল্টার</span>
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BreadCrumb
