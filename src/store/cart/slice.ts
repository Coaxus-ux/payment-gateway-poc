import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartItem, CheckoutCustomer, CheckoutData, CheckoutDelivery, CheckoutSelection, Product } from '@/types'

export interface CartState {
  items: CartItem[]
  checkoutData: CheckoutData
}

const initialCustomer: CheckoutCustomer = {
  email: '',
  fullName: '',
  phone: '',
}

const initialDelivery: CheckoutDelivery = {
  addressLine1: '',
  city: '',
  country: '',
  postalCode: '',
}

const createInitialCheckoutData = (): CheckoutData => ({
  selection: null,
  customer: { ...initialCustomer },
  delivery: { ...initialDelivery },
  transactionId: undefined,
  deliveryId: undefined,
  lastRequestId: undefined,
})

const initialState: CartState = {
  items: [],
  checkoutData: createInitialCheckoutData(),
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
        currency: product.currency,
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
    updateItemPrice(state, action: PayloadAction<{ id: string; price: number; currency?: string }>) {
      const item = state.items.find((entry) => entry.id === action.payload.id)
      if (!item) return
      item.price = action.payload.price
      item.currency = action.payload.currency
    },
    clearCart(state) {
      state.items = []
    },
    setCheckoutSelection(state, action: PayloadAction<CheckoutSelection | null>) {
      state.checkoutData.selection = action.payload
    },
    setCheckoutCustomer(state, action: PayloadAction<CheckoutCustomer>) {
      state.checkoutData.customer = action.payload
    },
    setCheckoutDelivery(state, action: PayloadAction<CheckoutDelivery>) {
      state.checkoutData.delivery = action.payload
    },
    setCheckoutIds(state, action: PayloadAction<{ transactionId?: string; deliveryId?: string }>) {
      state.checkoutData.transactionId = action.payload.transactionId
      state.checkoutData.deliveryId = action.payload.deliveryId
    },
    setCheckoutRequestId(state, action: PayloadAction<string | undefined>) {
      state.checkoutData.lastRequestId = action.payload
    },
    resetCheckoutData(state) {
      state.checkoutData = createInitialCheckoutData()
    },
  },
})

export const {
  addItem,
  updateQuantity,
  removeItem,
  updateItemPrice,
  clearCart,
  setCheckoutSelection,
  setCheckoutCustomer,
  setCheckoutDelivery,
  setCheckoutIds,
  setCheckoutRequestId,
  resetCheckoutData,
} = cartSlice.actions
export const cartReducer = cartSlice.reducer
