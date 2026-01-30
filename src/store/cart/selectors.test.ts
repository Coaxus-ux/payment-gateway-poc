import type { RootState } from '@/store'
import { createInitialCheckoutData } from './slice'
import { selectCartTotalItems } from './selectors'

describe('cart selectors', () => {
  it('sums total items quantity', () => {
    const state = {
      cart: {
        items: [
          { id: 'a', name: 'A', price: 10, quantity: 2, image: '/a.png' },
          { id: 'b', name: 'B', price: 5, quantity: 3, image: '/b.png' },
        ],
        checkoutData: createInitialCheckoutData(),
      },
    } as RootState

    expect(selectCartTotalItems(state)).toBe(5)
  })
})
