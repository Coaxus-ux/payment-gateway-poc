export type CardBrand = 'visa' | 'mastercard'

export function sanitizeCardNumber(value: string): string {
  return value.replace(/\D/g, '').substring(0, 16)
}

export function getCardBrand(cardNumber: string): CardBrand | null {
  if (cardNumber.startsWith('4')) return 'visa'
  if (cardNumber.startsWith('5')) return 'mastercard'
  return null
}
