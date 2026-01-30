import type { CartItem } from '@/types'

const storageKey = 'pgp_cart_v1'

jest.mock('@/store/products/slice', () => ({
  productsReducer: (state = { items: [], status: 'idle', error: null, detailStatus: 'idle', detailError: null }) => state,
}))

const savedItems: CartItem[] = [
  {
    id: 'p-1',
    name: 'Saved',
    price: 100,
    currency: 'COP',
    quantity: 2,
    image: '/saved.png',
  },
]

describe('cart persistence', () => {
  let storage: Record<string, string>

  beforeEach(() => {
    storage = {}
    const localStorageMock = {
      getItem: (key: string) => (key in storage ? storage[key] : null),
      setItem: (key: string, value: string) => {
        storage[key] = value
      },
      removeItem: (key: string) => {
        delete storage[key]
      },
      clear: () => {
        storage = {}
      },
    }

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      configurable: true,
    })

    jest.resetModules()
  })

  it('hydrates cart items from localStorage', async () => {
    localStorage.setItem(storageKey, JSON.stringify(savedItems))
    jest.resetModules()
    try {
      const { store } = await import('@/store')
      expect(store.getState().cart.items).toHaveLength(1)
      expect(store.getState().cart.items[0]?.id).toBe('p-1')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      throw error
    }
  })

  it('persists cart items to localStorage on change', async () => {
    jest.resetModules()
    try {
      const { store } = await import('@/store')
      const { addItem } = await import('./slice')
      const { baseProduct } = await import('./testUtils')
      store.dispatch(addItem(baseProduct))
      const stored = JSON.parse(localStorage.getItem(storageKey) ?? '[]') as CartItem[]
      expect(stored).toHaveLength(1)
      expect(stored[0]?.id).toBe(baseProduct.id)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      throw error
    }
  })
})
