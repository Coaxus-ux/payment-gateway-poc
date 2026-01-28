export type WithChildren<T = object> = T & {
  children: React.ReactNode
}

export type WithClassName<T = object> = T & {
  className?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image: string
}
