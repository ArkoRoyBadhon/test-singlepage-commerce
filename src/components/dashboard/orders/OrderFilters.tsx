'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
// Ensure OrderStatus typings. Since we moved to generated, we might just use strings for filter options
const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED']

export default function OrderFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [debouncedSearch] = useDebounce(search, 500)
  const [status, setStatus] = useState(searchParams.get('status') || '')

  useEffect(() => {
    // When debounced search or status value changes, update URL
    const params = new URLSearchParams(searchParams)

    if (debouncedSearch) {
      params.set('search', debouncedSearch)
    } else {
      params.delete('search')
    }

    if (status) {
      params.set('status', status)
    } else {
      params.delete('status')
    }

    // Reset pagination if implemented later
    // params.set('page', '1')

    router.push(`?${params.toString()}`)
  }, [debouncedSearch, status, router, searchParams])

  return (
    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="w-full sm:max-w-xs">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <Input
          id="search"
          placeholder="Search by ID, Name or Phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="w-full sm:max-w-[200px]">
        <label htmlFor="status" className="sr-only">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-[#15803d] focus:ring-[#15803d] focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {(search || status) && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearch('')
            setStatus('')
            router.push('?')
          }}
        >
          Clear Filters
        </Button>
      )}
    </div>
  )
}
