import type { CartItem } from '@/types'

const currencyFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export function calculateLineTotal(item: Pick<CartItem, 'price' | 'quantity'>): number {
  return item.price * item.quantity
}

export function calculateSubtotal(items: Array<Pick<CartItem, 'price' | 'quantity'>>): number {
  return items.reduce((acc, item) => acc + calculateLineTotal(item), 0)
}
