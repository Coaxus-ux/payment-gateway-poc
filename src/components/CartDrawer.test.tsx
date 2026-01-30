import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { CartItem } from '@/types'
import { CartDrawer } from './CartDrawer'

jest.mock('@/hooks', () => ({
  useDrawerAnimation: () => ({
    drawerRef: { current: null },
    backdropRef: { current: null },
  }),
  useSwipeToDelete: () => ({ current: null }),
}))

describe('CartDrawer', () => {
  it('renders empty state when no items', () => {
    render(
      <CartDrawer
        isOpen
        onClose={() => undefined}
        items={[]}
        onUpdateQuantity={() => undefined}
        onRemove={() => undefined}
        onCheckout={() => undefined}
      />
    )

    expect(screen.getByText('Bag is empty')).toBeInTheDocument()
    expect(screen.queryByText('Secure Checkout')).not.toBeInTheDocument()
  })

  it('renders items and triggers checkout', async () => {
    const user = userEvent.setup()
    const onCheckout = jest.fn()
    const items: CartItem[] = [
      {
        id: 'p-1',
        name: 'Item One',
        price: 120,
        currency: 'COP',
        quantity: 2,
        image: '/one.png',
      },
    ]

    render(
      <CartDrawer
        isOpen
        onClose={() => undefined}
        items={items}
        onUpdateQuantity={() => undefined}
        onRemove={() => undefined}
        onCheckout={onCheckout}
      />
    )

    expect(screen.getByText('Item One')).toBeInTheDocument()

    const checkoutButton = screen.getByRole('button', { name: 'Secure Checkout' })
    await user.click(checkoutButton)
    expect(onCheckout).toHaveBeenCalledTimes(1)
  })
})
