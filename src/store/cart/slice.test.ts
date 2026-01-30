import type { Product } from '@/types'
import {
  addItem,
  cartReducer,
  clearCart,
  createInitialCheckoutData,
  removeItem,
  resetCheckoutData,
  setCheckoutSelection,
  updateItemPrice,
  updateQuantity,
} from './slice'

const baseProduct: Product = {
  id: 'p-1',
  name: 'Test Product',
  description: 'desc',
  longDescription: 'long',
  price: 120,
  currency: 'COP',
  stock: 5,
  image: '/img.png',
}

describe('cart slice', () => {
  it('adds items and increments quantity on duplicates', () => {
    const stateAfterAdd = cartReducer(undefined, addItem(baseProduct))
    expect(stateAfterAdd.items).toHaveLength(1)
    expect(stateAfterAdd.items[0]?.quantity).toBe(1)

    const stateAfterDuplicate = cartReducer(stateAfterAdd, addItem(baseProduct))
    expect(stateAfterDuplicate.items).toHaveLength(1)
    expect(stateAfterDuplicate.items[0]?.quantity).toBe(2)
  })

  it('updates quantity and removes when quantity reaches zero', () => {
    const stateWithItem = cartReducer(undefined, addItem(baseProduct))
    const incremented = cartReducer(stateWithItem, updateQuantity({ id: baseProduct.id, delta: 2 }))
    expect(incremented.items[0]?.quantity).toBe(3)

    const removed = cartReducer(incremented, updateQuantity({ id: baseProduct.id, delta: -3 }))
    expect(removed.items).toHaveLength(0)
  })

  it('removes item directly', () => {
    const stateWithItem = cartReducer(undefined, addItem(baseProduct))
    const removed = cartReducer(stateWithItem, removeItem(baseProduct.id))
    expect(removed.items).toHaveLength(0)
  })

  it('updates item price and currency', () => {
    const stateWithItem = cartReducer(undefined, addItem(baseProduct))
    const updated = cartReducer(stateWithItem, updateItemPrice({ id: baseProduct.id, price: 200, currency: 'USD' }))
    expect(updated.items[0]?.price).toBe(200)
    expect(updated.items[0]?.currency).toBe('USD')
  })

  it('sets checkout selection and resets checkout data', () => {
    const stateWithSelection = cartReducer(
      undefined,
      setCheckoutSelection({
        items: [{ id: baseProduct.id, quantity: 1, price: baseProduct.price, currency: baseProduct.currency }],
        amount: baseProduct.price,
        currency: baseProduct.currency ?? 'COP',
      })
    )

    expect(stateWithSelection.checkoutData.selection?.items).toHaveLength(1)

    const reset = cartReducer(stateWithSelection, resetCheckoutData())
    expect(reset.checkoutData).toEqual(createInitialCheckoutData())
  })

  it('clears the cart', () => {
    const stateWithItem = cartReducer(undefined, addItem(baseProduct))
    const cleared = cartReducer(stateWithItem, clearCart())
    expect(cleared.items).toHaveLength(0)
  })
})
