import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { CheckoutCustomer, CheckoutDelivery } from '@/types'
import { BillingFormStep } from './BillingFormStep'

const baseCustomer: CheckoutCustomer = {
  email: 'test@example.com',
  fullName: 'Test User',
  phone: '3001234567',
}

const baseDelivery: CheckoutDelivery = {
  addressLine1: 'Street 123',
  city: 'Bogota',
  country: 'CO',
  postalCode: '110111',
}

describe('BillingFormStep', () => {
  it('submits when card data is valid', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()

    render(
      <BillingFormStep
        initialCustomer={baseCustomer}
        initialDelivery={baseDelivery}
        onBack={() => undefined}
        onSubmit={onSubmit}
      />
    )

    await user.clear(screen.getByPlaceholderText('Cardholder Name'))
    await user.type(screen.getByPlaceholderText('Cardholder Name'), 'Jane Doe')
    await user.clear(screen.getByPlaceholderText('0000 0000 0000 0000'))
    await user.type(screen.getByPlaceholderText('0000 0000 0000 0000'), '4242424242424242')
    await user.clear(screen.getByPlaceholderText('MM/YYYY'))
    await user.type(screen.getByPlaceholderText('MM/YYYY'), '12/2030')
    await user.clear(screen.getByPlaceholderText('CVC'))
    await user.type(screen.getByPlaceholderText('CVC'), '123')

    await user.clear(screen.getByPlaceholderText('Email'))
    await user.type(screen.getByPlaceholderText('Email'), baseCustomer.email)
    await user.clear(screen.getByPlaceholderText('Full Name'))
    await user.type(screen.getByPlaceholderText('Full Name'), baseCustomer.fullName)
    await user.clear(screen.getByPlaceholderText('Phone Number'))
    await user.type(screen.getByPlaceholderText('Phone Number'), baseCustomer.phone)

    await user.clear(screen.getByPlaceholderText('Street Address'))
    await user.type(screen.getByPlaceholderText('Street Address'), baseDelivery.addressLine1)
    await user.clear(screen.getByPlaceholderText('City'))
    await user.type(screen.getByPlaceholderText('City'), baseDelivery.city)
    await user.clear(screen.getByPlaceholderText('Postal Code'))
    await user.type(screen.getByPlaceholderText('Postal Code'), baseDelivery.postalCode)
    await user.clear(screen.getByPlaceholderText('Country'))
    await user.type(screen.getByPlaceholderText('Country'), baseDelivery.country)

    await user.click(screen.getByRole('button', { name: 'Review Order' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({
      customer: baseCustomer,
      delivery: baseDelivery,
      card: {
        number: '4242424242424242',
        expMonth: 12,
        expYear: 2030,
        cvc: '123',
        holderName: 'Jane Doe',
      },
    })
  })

  it('prevents submit with invalid card number', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()

    render(
      <BillingFormStep
        initialCustomer={baseCustomer}
        initialDelivery={baseDelivery}
        onBack={() => undefined}
        onSubmit={onSubmit}
      />
    )

    await user.type(screen.getByPlaceholderText('Cardholder Name'), 'Jane Doe')
    await user.type(screen.getByPlaceholderText('0000 0000 0000 0000'), '123')
    await user.type(screen.getByPlaceholderText('MM/YYYY'), '12/2030')
    await user.type(screen.getByPlaceholderText('CVC'), '123')
    await user.type(screen.getByPlaceholderText('Email'), baseCustomer.email)
    await user.type(screen.getByPlaceholderText('Full Name'), baseCustomer.fullName)
    await user.type(screen.getByPlaceholderText('Phone Number'), baseCustomer.phone)
    await user.type(screen.getByPlaceholderText('Street Address'), baseDelivery.addressLine1)
    await user.type(screen.getByPlaceholderText('City'), baseDelivery.city)
    await user.type(screen.getByPlaceholderText('Postal Code'), baseDelivery.postalCode)
    await user.type(screen.getByPlaceholderText('Country'), baseDelivery.country)

    await user.click(screen.getByRole('button', { name: 'Review Order' }))

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
