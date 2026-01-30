import { configureStore } from '@reduxjs/toolkit'
import type { CartItem } from '@/types'
import { cartReducer, createInitialCartState } from '@/store/cart/slice'
import { productsReducer } from '@/store/products/slice'

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

const getNodeEnv = (): string | undefined => {
  if (typeof globalThis === 'undefined') return undefined
  if (!('process' in globalThis)) return undefined
  const maybeProcess = globalThis as { process?: { env?: { NODE_ENV?: string } } }
  return maybeProcess.process?.env?.NODE_ENV
}

const isLocalHost = (): boolean => {
  if (typeof window === 'undefined') return false
  const host = window.location?.hostname
  return host === 'localhost' || host === '127.0.0.1'
}

const nodeEnv = getNodeEnv()
const isDev = nodeEnv ? nodeEnv !== 'production' : isLocalHost()

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
  preloadedState: {
    cart: createInitialCartState(loadCartItems()),
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: isDev,
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
