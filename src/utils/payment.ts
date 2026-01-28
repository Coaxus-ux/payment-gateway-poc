export type CardBrand = 'visa' | 'mastercard'

export function sanitizeCardNumber(value: string): string {
  return value.replace(/\D/g, '').substring(0, 19)
}

export function getCardBrand(cardNumber: string): CardBrand | null {
  if (cardNumber.startsWith('4')) return 'visa'
  if (cardNumber.startsWith('5')) return 'mastercard'
  return null
}

export function isValidLuhn(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  if (digits.length < 12) return false
  let sum = 0
  let shouldDouble = false
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number.parseInt(digits[i], 10)
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    shouldDouble = !shouldDouble
  }
  return sum % 10 === 0
}

export function isValidExpiry(expMonth: number, expYear: number): boolean {
  if (!Number.isFinite(expMonth) || !Number.isFinite(expYear)) return false
  if (expMonth < 1 || expMonth > 12) return false
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  if (expYear < currentYear) return false
  if (expYear === currentYear && expMonth < currentMonth) return false
  return true
}
