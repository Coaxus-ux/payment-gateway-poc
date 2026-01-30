import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { CartItem, CheckoutCustomer, CheckoutDelivery } from '@/types'
import { OrderSummaryStep } from './OrderSummaryStep'

const items: CartItem[] = [
  {
    id: 'a',
    name: 'Item A',
    price: 100,
    currency: 'COP',
    quantity: 2,
    image: '/a.png',
  },
]

const customer: CheckoutCustomer = {
  email: 'a@test.com',
  fullName: 'User A',
  phone: '3001234567',
}

const delivery: CheckoutDelivery = {
  addressLine1: 'Street 1',
  city: 'Bogota',
  country: 'CO',
  postalCode: '110111',
}

describe('OrderSummaryStep', () => {
  it('renders items and total', () => {
    render(
      <OrderSummaryStep
        items={items}
        amount={200}
        currency="COP"
        customer={customer}
        delivery={delivery}
        onUpdateDelivery={() => undefined}
        onPay={() => undefined}
      />
    )

    expect(screen.getByText('Item A')).toBeInTheDocument()
    expect(screen.getByText('Order Summary')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  it('allows editing and saving delivery', async () => {
    const user = userEvent.setup()
    const onUpdateDelivery = jest.fn()

    render(
      <OrderSummaryStep
        items={items}
        amount={200}
        currency="COP"
        customer={customer}
        delivery={delivery}
        onUpdateDelivery={onUpdateDelivery}
        onPay={() => undefined}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    const addressInput = screen.getByPlaceholderText('Address')
    await user.clear(addressInput)
    await user.type(addressInput, 'New Street')

    await user.click(screen.getByRole('button', { name: 'Save Delivery' }))
    expect(onUpdateDelivery).toHaveBeenCalledWith({
      ...delivery,
      addressLine1: 'New Street',
    })
  })

  it('disables pay button when paying', () => {
    render(
      <OrderSummaryStep
        items={items}
        amount={200}
        currency="COP"
        customer={customer}
        delivery={delivery}
        onUpdateDelivery={() => undefined}
        onPay={() => undefined}
        isPaying
      />
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons[buttons.length - 1]).toBeDisabled()
  })
})
