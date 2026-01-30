import { useMemo, useState } from 'react'
import { FaCcVisa, FaCcMastercard } from 'react-icons/fa'
import { HiArrowLeft } from 'react-icons/hi'
import type { CardData, CheckoutCustomer, CheckoutDelivery } from '@/types'
import { getCardBrand, isValidExpiry, isValidLuhn, sanitizeCardNumber } from '@/utils/payment'
import { CheckoutProgress } from './CheckoutProgress'

interface BillingFormStepProps {
  initialCustomer: CheckoutCustomer
  initialDelivery: CheckoutDelivery
  onBack: () => void
  onSubmit: (data: { customer: CheckoutCustomer; delivery: CheckoutDelivery; card: CardData }) => void
  isSubmitting?: boolean
}

const emptyCard: CardData = {
  number: '',
  expMonth: 0,
  expYear: 0,
  cvc: '',
  holderName: '',
}

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, '')
    .substring(0, 19)
    .replace(/(\d{4})(?=\d)/g, '$1 ')

export function BillingFormStep({ initialCustomer, initialDelivery, onBack, onSubmit, isSubmitting }: BillingFormStepProps) {
  const [customer, setCustomer] = useState<CheckoutCustomer>(initialCustomer)
  const [delivery, setDelivery] = useState<CheckoutDelivery>(initialDelivery)
  const [card, setCard] = useState<CardData>(emptyCard)
  const [expiry, setExpiry] = useState('')
  const [touched, setTouched] = useState(false)

  const cardBrand = useMemo(() => getCardBrand(card.number), [card.number])
  const isCardNumberValid = useMemo(() => isValidLuhn(card.number), [card.number])
  const [expMonth, expYear] = useMemo(() => {
    const digits = expiry.replace(/\D/g, '').substring(0, 6)
    const month = Number.parseInt(digits.slice(0, 2) || '0', 10)
    const year = Number.parseInt(digits.slice(2) || '0', 10)
    return [month, year]
  }, [expiry])
  const isExpiryValid = useMemo(() => isValidExpiry(expMonth, expYear), [expMonth, expYear])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)

    if (!isCardNumberValid || !isExpiryValid) return

    onSubmit({ customer, delivery, card: { ...card, expMonth, expYear } })
  }

  const renderCardIcon = () => {
    if (cardBrand === 'visa') return <FaCcVisa className="text-2xl text-blue-600" />
    if (cardBrand === 'mastercard') return <FaCcMastercard className="text-2xl text-orange-500" />
    return null
  }

  return (
    <div className="p-8 max-h-[85vh] overflow-y-auto">
      <CheckoutProgress currentStep="FORM" />
      <div className="flex items-center gap-4 mb-8">
        <button type="button" onClick={onBack} className="p-3 bg-dark/5 rounded-2xl">
          <HiArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-black text-dark tracking-tighter">Billing Info</h2>
        <div className="ml-auto">{renderCardIcon()}</div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <input
            placeholder="Cardholder Name"
            value={card.holderName}
            onChange={(e) => setCard((prev) => ({ ...prev, holderName: e.target.value }))}
            className="w-full px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
            required
          />
          <div className="relative">
            <input
              placeholder="0000 0000 0000 0000"
              value={formatCardNumber(card.number)}
              onChange={(e) => setCard((prev) => ({ ...prev, number: sanitizeCardNumber(e.target.value) }))}
              className="w-full px-5 py-4 pr-12 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all font-mono"
              inputMode="numeric"
              required
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">{renderCardIcon()}</div>
          </div>
          {touched && !isCardNumberValid && <p className="text-xs text-red-500 font-semibold">Invalid card number (Luhn).</p>}
          <div className="flex gap-3">
            <input
              placeholder="MM/YYYY"
              value={expiry}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').substring(0, 6)
                const next = digits.length <= 2 ? digits : `${digits.slice(0, 2)}/${digits.slice(2)}`
                setExpiry(next)
              }}
              className="flex-1 min-w-0 px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
              inputMode="numeric"
              required
            />
            <input
              placeholder="CVC"
              type="password"
              value={card.cvc}
              onChange={(e) => setCard((prev) => ({ ...prev, cvc: e.target.value.replace(/\D/g, '').substring(0, 4) }))}
              className="flex-1 min-w-0 px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
              required
            />
          </div>
          {touched && !isExpiryValid && <p className="text-xs text-red-500 font-semibold">Invalid expiration date.</p>}
        </div>
        <div className="space-y-3">
          <input
            placeholder="Email"
            type="email"
            value={customer.email}
            onChange={(e) => setCustomer((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
            required
          />
          <input
            placeholder="Full Name"
            value={customer.fullName}
            onChange={(e) => setCustomer((prev) => ({ ...prev, fullName: e.target.value }))}
            className="w-full px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
            required
          />
          <input
            placeholder="Phone Number"
            type="tel"
            value={customer.phone}
            onChange={(e) => setCustomer((prev) => ({ ...prev, phone: e.target.value }))}
            className="w-full px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
            required
          />
        </div>
        <div className="space-y-3">
          <input
            placeholder="Street Address"
            value={delivery.addressLine1}
            onChange={(e) => setDelivery((prev) => ({ ...prev, addressLine1: e.target.value }))}
            className="w-full px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
            required
          />
          <div className="flex gap-3">
            <input
              placeholder="City"
              value={delivery.city}
              onChange={(e) => setDelivery((prev) => ({ ...prev, city: e.target.value }))}
              className="flex-1 min-w-0 px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
              required
            />
            <input
              placeholder="Postal Code"
              value={delivery.postalCode}
              onChange={(e) => setDelivery((prev) => ({ ...prev, postalCode: e.target.value }))}
              className="flex-1 min-w-0 px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
              required
            />
          </div>
          <input
            placeholder="Country"
            value={delivery.country}
            onChange={(e) => setDelivery((prev) => ({ ...prev, country: e.target.value }))}
            className="w-full px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full py-5 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/30 active:scale-95 transition-all">
          {isSubmitting ? 'Processing...' : 'Review Order'}
        </button>
      </form>
    </div>
  )
}
