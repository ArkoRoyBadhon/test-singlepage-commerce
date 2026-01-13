'use client'

import { FilterSection } from '@/interfaces/allproduct.interfaces'
import { X } from 'lucide-react'
import { useState } from 'react'

interface FilterBarProps {
  isOpen?: boolean
  onClose?: () => void
  filters: FilterSection[]
  onFilterChange: (sectionIndex: number, optionId: string) => void
  onSectionToggle: (sectionIndex: number) => void
}

const FilterBar: React.FC<FilterBarProps> = ({ isOpen = false, onClose, filters, onFilterChange, onSectionToggle }) => {
  const [showMore, setShowMore] = useState<{ [key: string]: boolean }>({
    ভিউজ: false,
    'আপনার বাজেট': false,
  })

  const toggleShowMore = (sectionTitle: string) => {
    setShowMore((prev) => ({ ...prev, [sectionTitle]: !prev[sectionTitle] }))
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Filter Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:w-full lg:max-w-72 lg:translate-x-0 lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="rounded border-0 border-green-700 bg-white p-4 lg:border">
            {/* Header with Close Button for Mobile */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">ফিল্টারসমূহ</h2>
              {onClose && (
                <button
                  onClick={onClose}
                  className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
                  aria-label="Close filter"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {filters.map((section, sectionIndex) => (
              <div key={section.title} className="mb-4">
                <button
                  onClick={() => onSectionToggle(sectionIndex)}
                  className="mb-2 flex w-full items-center justify-between text-left"
                >
                  <span className="text-base font-medium">{section.title}</span>
                  <svg
                    className={`h-4 w-4 transition-transform ${section.expanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {section.expanded && (
                  <div className="space-y-2">
                    {section.options.map((option) => (
                      <label key={option.id} className="group flex cursor-pointer items-start gap-2">
                        <input
                          type="checkbox"
                          checked={option.checked}
                          onChange={() => onFilterChange(sectionIndex, option.id)}
                          className="mt-0.5 h-4 w-4 cursor-pointer rounded border-gray-300 text-green-600 accent-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm leading-tight text-gray-700 group-hover:text-gray-900">
                          {option.label}
                        </span>
                      </label>
                    ))}

                    <button
                      onClick={() => toggleShowMore(section.title)}
                      className="mt-2 flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700"
                    >
                      <span>আরও দেখুন</span>
                      <svg
                        className={`h-3 w-3 transition-transform ${showMore[section.title] ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterBar
