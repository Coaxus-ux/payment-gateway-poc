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
  currency?: string
  stock: number
  image: string
  images?: string[]
}

export interface CartItem {
  id: string
  name: string
  price: number
  currency?: string
  quantity: number
  image: string
  longDescription?: string
}

export type CheckoutStep = 'PRODUCT_DETAIL' | 'FORM' | 'SUMMARY' | 'RESULT'

export interface CheckoutCustomer {
  email: string
  fullName: string
  phone: string
}

export interface CheckoutDelivery {
  addressLine1: string
  city: string
  country: string
  postalCode: string
}

export interface CheckoutSelection {
  items: Array<{
    id: string
    quantity: number
    price: number
    currency?: string
  }>
  amount: number
  currency: string
}

export interface CheckoutData {
  selection: CheckoutSelection | null
  customer: CheckoutCustomer
  delivery: CheckoutDelivery
  transactionId?: string
  deliveryId?: string
  lastRequestId?: string
}

export interface CardData {
  number: string
  expMonth: number
  expYear: number
  cvc: string
  holderName: string
}

export interface PurchaseResult {
  status: 'success' | 'error'
  transactionId?: string
  message?: string
  requestId?: string
}

export interface CustomerProfile {
  customer: CheckoutCustomer
  delivery: CheckoutDelivery | null
  lastTransactionId?: string | null
}

export interface AdminTransactionItem {
  id: string
  productId: string
  quantity: number
  unitPriceAmount: number
  currency: string
  productSnapshot: {
    id: string
    name: string
    description: string | null
    imageUrls: string[]
    priceAmount: number
    currency: string
  }
}

export interface AdminTransaction {
  id: string
  status: string
  amount: number
  currency: string
  createdAt: string
  customer: {
    id: string
    email: string
    fullName: string
    phone: string | null
  }
  delivery: {
    id: string
    addressLine1: string
    addressLine2: string | null
    city: string
    country: string
    postalCode: string | null
  }
  items: AdminTransactionItem[]
}
