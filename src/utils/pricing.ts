import type { CartItem } from '@/types'

export function formatCurrency(value: number, currency = 'COP', locale = 'es-CO'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function calculateLineTotal(item: Pick<CartItem, 'price' | 'quantity'>): number {
  return item.price * item.quantity
}

export function calculateSubtotal(items: Array<Pick<CartItem, 'price' | 'quantity'>>): number {
  return items.reduce((acc, item) => acc + calculateLineTotal(item), 0)
}
