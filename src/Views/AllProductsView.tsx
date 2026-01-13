'use client'

import FilterBar from '@/components/AllProducts/FilterBar'
import Products from '@/components/AllProducts/Products'
import BreadCrumb from '@/components/ui/Bread-crumb'
import Pagination from '@/components/ui/pagination'
import { FilterSection, Product } from '@/interfaces/allproduct.interfaces'
import { filterData } from '@/utilis/data'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

interface AllProductsViewProps {
  products: Product[]
  currentPage: number
  totalPages: number
}

const AllProductsView = ({ products, currentPage, totalPages }: AllProductsViewProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Derive initial filter state from URL params using useMemo
  const initialFilters = useMemo(() => {
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    if (!minPrice && !maxPrice) return filterData

    return filterData.map((section) => {
      if (section.title === 'আপনার বাজেট') {
        return {
          ...section,
          options: section.options.map((opt) => {
            let checked = false
            if (opt.id === 'budget-1' && maxPrice === '1000') checked = true
            if (opt.id === 'budget-2' && minPrice === '1000' && maxPrice === '1500') checked = true
            if (opt.id === 'budget-3' && minPrice === '1500' && maxPrice === '5000') checked = true
            if (opt.id === 'budget-4' && minPrice === '5000') checked = true
            return { ...opt, checked }
          }),
        }
      }
      return section
    })
  }, [searchParams])

  const [filters, setFilters] = useState<FilterSection[]>(initialFilters)

  const breadcrumbItems = [
    { label: 'হোম', href: '/' },
    { label: 'সব পণ্য', href: '/all-products' },
  ]

  const updateURL = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleFilterChange = (sectionIndex: number, optionId: string) => {
    // Update UI state first
    let newFilters = [...filters]
    let selectedBudget: string | null = null
    let newMin: string | null = null
    let newMax: string | null = null

    newFilters = newFilters.map((section, index) => {
      if (index !== sectionIndex) return section

      if (section.title === 'আপনার বাজেট' || section.title === 'ভিউজ') {
        // Single select logic
        const updatedOptions = section.options.map((opt) => {
          const isChecked = opt.id === optionId ? !opt.checked : false
          if (isChecked) selectedBudget = opt.id
          return { ...opt, checked: isChecked }
        })
        return { ...section, options: updatedOptions }
      }

      return {
        ...section,
        options: section.options.map((opt) => (opt.id === optionId ? { ...opt, checked: !opt.checked } : opt)),
      }
    })

    setFilters(newFilters)

    // Calculate URL params based on selected budget
    // Note: This logic assumes we only care about the budget filter for now as implemented
    if (filters[sectionIndex].title === 'আপনার বাজেট') {
      if (selectedBudget === 'budget-1') {
        newMin = null
        newMax = '1000'
      } else if (selectedBudget === 'budget-2') {
        newMin = '1000'
        newMax = '1500'
      } else if (selectedBudget === 'budget-3') {
        newMin = '1500'
        newMax = '5000'
      } else if (selectedBudget === 'budget-4') {
        newMin = '5000'
        newMax = null
      } else {
        newMin = null
        newMax = null
      } // Cleared

      updateURL({ minPrice: newMin, maxPrice: newMax, page: '1' })
    }
  }

  const handleSectionToggle = (sectionIndex: number) => {
    setFilters((prev) =>
      prev.map((section, idx) => (idx === sectionIndex ? { ...section, expanded: !section.expanded } : section))
    )
  }

  const handlePageChange = (page: number) => {
    updateURL({ page: page.toString() })
  }

  return (
    <div>
      <BreadCrumb
        items={breadcrumbItems}
        showSearch={true}
        showFilter={true}
        onFilterClick={() => setIsFilterOpen(true)}
      />
      <div className="wrapper flex flex-col gap-6 py-20 lg:flex-row">
        <FilterBar
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
          onSectionToggle={handleSectionToggle}
        />
        <div className="flex-1">
          <Products products={products} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  )
}

export default AllProductsView
