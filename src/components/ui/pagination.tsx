import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const DOTS = '...'

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Number(totalPages) || 0
    const currentPageNum = Number(currentPage) || 1
    const siblingCount = 1

    const totalPageNumbers = siblingCount + 5

    if (totalPageCount <= totalPageNumbers) {
      return Array.from({ length: totalPageCount }, (_, i) => i + 1)
    }

    const leftSiblingIndex = Math.max(currentPageNum - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPageNum + siblingCount, totalPageCount)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPageCount

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
      return [...leftRange, DOTS, totalPageCount]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPageCount - rightItemCount + i + 1)
      return [firstPageIndex, DOTS, ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      )
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]
    }

    return []
  }, [totalPages, currentPage])

  if (currentPage === 0 || totalPages < 1) return null

  return (
    <div className="mt-10 flex justify-center">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <span key={index} className="flex h-10 w-10 items-center justify-center text-gray-400">
                &#8230;
              </span>
            )
          }

          return (
            <button
              key={index}
              onClick={() => onPageChange(pageNumber as number)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                pageNumber === currentPage
                  ? 'border-green-600 bg-green-600 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-green-600 hover:text-green-600'
              }`}
            >
              {pageNumber}
            </button>
          )
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default Pagination
