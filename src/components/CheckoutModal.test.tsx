import { render, screen } from '@testing-library/react'
import type { CartItem, CheckoutCustomer, CheckoutDelivery, Product, PurchaseResult } from '@/types'
import { CheckoutModal } from './CheckoutModal'

jest.mock('@/hooks', () => ({
  useModalAnimation: () => ({
    modalRef: { current: null },
    contentRef: { current: null },
    backdropRef: { current: null },
    animateContent: () => undefined,
  }),
}))

jest.mock('./checkout', () => ({
  ProductDetailStep: () => <div>Product Detail Step</div>,
  EmailLookupStep: () => <div>Email Lookup Step</div>,
  BillingFormStep: () => <div>Billing Form Step</div>,
  OrderSummaryStep: () => <div>Order Summary Step</div>,
  CheckoutResultStep: () => <div>Checkout Result Step</div>,
}))

const product: Product = {
  id: 'p-1',
  name: 'Product',
  description: 'desc',
  price: 100,
  currency: 'COP',
  stock: 1,
  image: '/img.png',
}

const items: CartItem[] = [{ id: 'p-1', name: 'Product', price: 100, quantity: 1, image: '/img.png', currency: 'COP' }]

const customer: CheckoutCustomer = {
  email: 'test@example.com',
  fullName: 'Test User',
  phone: '3001234567',
}

const delivery: CheckoutDelivery = {
  addressLine1: 'Street',
  city: 'Bogota',
  country: 'CO',
  postalCode: '110111',
}

const purchaseResult: PurchaseResult = {
  status: 'error',
  message: 'Declined',
}

describe('CheckoutModal', () => {
  it('renders billing form step', () => {
    render(
      <CheckoutModal
        product={product}
        items={items}
        amount={100}
        currency="COP"
        customer={customer}
        delivery={delivery}
        step="FORM"
        onClose={() => undefined}
        onStartCheckout={() => undefined}
        onLookupEmail={() => undefined}
        onContinue={() => undefined}
        onConfirm={() => undefined}
        onUpdateDelivery={() => undefined}
        onBack={() => undefined}
        purchaseResult={null}
        onFinish={() => undefined}
        onRetry={() => undefined}
        onEditBilling={() => undefined}
      />
    )

    expect(screen.getByText('Billing Form Step')).toBeInTheDocument()
  })

  it('renders result step', () => {
    render(
      <CheckoutModal
        product={product}
        items={items}
        amount={100}
        currency="COP"
        customer={customer}
        delivery={delivery}
        step="RESULT"
        onClose={() => undefined}
        onStartCheckout={() => undefined}
        onLookupEmail={() => undefined}
        onContinue={() => undefined}
        onConfirm={() => undefined}
        onUpdateDelivery={() => undefined}
        onBack={() => undefined}
        purchaseResult={purchaseResult}
        onFinish={() => undefined}
        onRetry={() => undefined}
        onEditBilling={() => undefined}
      />
    )

    expect(screen.getByText('Checkout Result Step')).toBeInTheDocument()
  })
})
