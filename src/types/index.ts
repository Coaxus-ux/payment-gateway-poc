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
  longDescription?: string
  price: number
  stock: number
  image: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  longDescription?: string
}

export type CheckoutStep = 'PRODUCT_DETAIL' | 'FORM' | 'SUMMARY' | 'RESULT'

export interface CheckoutData {
  cardNumber: string
  expiryDate: string
  cvv: string
  address: string
  city: string
}

export interface PurchaseResult {
  status: 'success' | 'error'
  transactionId?: string
  message?: string
}
