import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartItem, CheckoutData, Product } from '@/types'

export interface CartState {
  items: CartItem[]
  checkoutData: CheckoutData
}

const initialCheckoutData: CheckoutData = {
  cardholderName: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  fullName: '',
  phone: '',
  address: '',
  city: '',
}

const initialState: CartState = {
  items: [],
  checkoutData: initialCheckoutData,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Product>) {
      const product = action.payload
      const existing = state.items.find((item) => item.id === product.id)
      if (existing) {
        existing.quantity += 1
        return
      }
      state.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        longDescription: product.longDescription,
      })
    },
    updateQuantity(state, action: PayloadAction<{ id: string; delta: number }>) {
      const { id, delta } = action.payload
      const item = state.items.find((entry) => entry.id === id)
      if (!item) return
      const nextQuantity = item.quantity + delta
      if (nextQuantity <= 0) {
        state.items = state.items.filter((entry) => entry.id !== id)
        return
      }
      item.quantity = nextQuantity
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((entry) => entry.id !== action.payload)
    },
    clearCart(state) {
      state.items = []
    },
    setCheckoutData(state, action: PayloadAction<CheckoutData>) {
      state.checkoutData = action.payload
    },
    resetCheckoutData(state) {
      state.checkoutData = initialCheckoutData
    },
  },
})

export const { addItem, updateQuantity, removeItem, clearCart, setCheckoutData, resetCheckoutData } = cartSlice.actions
export const cartReducer = cartSlice.reducer
