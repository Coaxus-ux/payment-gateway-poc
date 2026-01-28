import { useState, useCallback } from 'react'
import type { CartItem, Product } from '@/types'

const INITIAL_CHECKOUT_DATA = {
  cardholderName: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  fullName: '',
  phone: '',
  address: '',
  city: '',
}

export function useCartState() {
  const [items, setItems] = useState<CartItem[]>([])
  const [checkoutData, setCheckoutData] = useState(INITIAL_CHECKOUT_DATA)

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          longDescription: product.longDescription,
        },
      ]
    })
  }, [])

  const updateQuantity = useCallback((id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + delta
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const resetCheckoutData = useCallback(() => {
    setCheckoutData(INITIAL_CHECKOUT_DATA)
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    items,
    totalItems,
    checkoutData,
    setCheckoutData,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    resetCheckoutData,
  }
}
