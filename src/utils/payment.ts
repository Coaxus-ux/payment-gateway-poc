import type { CheckoutData, PurchaseResult } from '@/types'

export type CardBrand = 'visa' | 'mastercard'

export function sanitizeCardNumber(value: string): string {
  return value.replace(/\D/g, '').substring(0, 16)
}

export function getCardBrand(cardNumber: string): CardBrand | null {
  if (cardNumber.startsWith('4')) return 'visa'
  if (cardNumber.startsWith('5')) return 'mastercard'
  return null
}

export async function processPayment(_data: CheckoutData): Promise<PurchaseResult> {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const isSuccess = Math.random() > 0.2

  if (isSuccess) {
    return {
      status: 'success',
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      message: 'Payment processed successfully',
    }
  }

  return {
    status: 'error',
    message: 'Payment failed. Please try again.',
  }
}
