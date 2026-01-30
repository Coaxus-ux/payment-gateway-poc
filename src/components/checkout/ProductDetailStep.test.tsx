import { render, screen } from '@testing-library/react'
import type { CartItem, Product } from '@/types'
import { ProductDetailStep } from './ProductDetailStep'

const product: Product = {
  id: 'p-1',
  name: 'Single Product',
  description: 'desc',
  price: 100,
  currency: 'COP',
  stock: 4,
  image: '/one.png',
  longDescription: 'Long description',
}

const items: CartItem[] = [
  { id: 'a', name: 'Item A', price: 10, quantity: 1, image: '/a.png', currency: 'COP' },
  { id: 'b', name: 'Item B', price: 20, quantity: 2, image: '/b.png', currency: 'COP' },
]

describe('ProductDetailStep', () => {
  it('renders all cart items when provided', () => {
    render(<ProductDetailStep product={product} items={items} onClose={() => undefined} onContinue={() => undefined} />)

    expect(screen.getByText('Item A')).toBeInTheDocument()
    expect(screen.getByText('Item B')).toBeInTheDocument()
  })

  it('renders product details when no cart items', () => {
    render(<ProductDetailStep product={product} items={[]} onClose={() => undefined} onContinue={() => undefined} />)

    expect(screen.getByText('Single Product')).toBeInTheDocument()
    expect(screen.getByText('Long description')).toBeInTheDocument()
  })
})
