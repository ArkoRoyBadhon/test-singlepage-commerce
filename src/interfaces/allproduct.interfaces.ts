export interface FilterOption {
  id: string
  label: string
  checked: boolean
}

export interface FilterSection {
  title: string
  options: FilterOption[]
  expanded: boolean
}

export interface Product {
  id: number
  title: string
  price: string | number
  image: string
  description?: string | null
  benefits?: string[]
  features?: string[]
  stock?: number
  images?: string[]
}
