import { configureStore } from '@reduxjs/toolkit'
import type { CartItem } from '@/types'
import { cartReducer, createInitialCartState } from './cart/slice'
import { productsReducer } from './products/slice'

const CART_STORAGE_KEY = 'pgp_cart_v1'

const safeParseCartItems = (payload: unknown): CartItem[] => {
  if (!Array.isArray(payload)) return []
  return payload.filter((item): item is CartItem => {
    if (!item || typeof item !== 'object') return false
    const candidate = item as CartItem
    return (
      typeof candidate.id === 'string' &&
      typeof candidate.name === 'string' &&
      typeof candidate.price === 'number' &&
      typeof candidate.quantity === 'number' &&
      typeof candidate.image === 'string'
    )
  })
}

const loadCartItems = (): CartItem[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    return safeParseCartItems(JSON.parse(raw))
  } catch {
    return []
  }
}

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
  preloadedState: {
    cart: createInitialCartState(loadCartItems()),
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: import.meta.env.DEV,
})

if (typeof window !== 'undefined') {
  let lastItems = JSON.stringify(store.getState().cart.items)
  store.subscribe(() => {
    const nextItems = store.getState().cart.items
    const nextSerialized = JSON.stringify(nextItems)
    if (nextSerialized !== lastItems) {
      lastItems = nextSerialized
      window.localStorage.setItem(CART_STORAGE_KEY, nextSerialized)
    }
  })
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
