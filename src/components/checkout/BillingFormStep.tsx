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

export function BillingFormStep({ initialCustomer, initialDelivery, onBack, onSubmit, isSubmitting }: BillingFormStepProps) {
  const [customer, setCustomer] = useState<CheckoutCustomer>(initialCustomer)
  const [delivery, setDelivery] = useState<CheckoutDelivery>(initialDelivery)
  const [card, setCard] = useState<CardData>(emptyCard)
  const [touched, setTouched] = useState(false)

  const cardBrand = useMemo(() => getCardBrand(card.number), [card.number])
  const isCardNumberValid = useMemo(() => isValidLuhn(card.number), [card.number])
  const isExpiryValid = useMemo(() => isValidExpiry(card.expMonth, card.expYear), [card.expMonth, card.expYear])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)

    if (!isCardNumberValid || !isExpiryValid) return

    onSubmit({ customer, delivery, card })
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
          <input
            placeholder="0000 0000 0000 0000"
            value={card.number}
            onChange={(e) => setCard((prev) => ({ ...prev, number: sanitizeCardNumber(e.target.value) }))}
            className="w-full px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all font-mono"
            required
          />
          {touched && !isCardNumberValid && <p className="text-xs text-red-500 font-semibold">Invalid card number (Luhn).</p>}
          <div className="flex gap-3">
            <input
              placeholder="MM"
              value={card.expMonth || ''}
              onChange={(e) => setCard((prev) => ({ ...prev, expMonth: Number.parseInt(e.target.value || '0', 10) }))}
              className="flex-1 px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
              required
            />
            <input
              placeholder="YYYY"
              value={card.expYear || ''}
              onChange={(e) => setCard((prev) => ({ ...prev, expYear: Number.parseInt(e.target.value || '0', 10) }))}
              className="flex-1 px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
              required
            />
            <input
              placeholder="CVC"
              type="password"
              value={card.cvc}
              onChange={(e) => setCard((prev) => ({ ...prev, cvc: e.target.value.replace(/\D/g, '').substring(0, 4) }))}
              className="flex-1 px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
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
              className="flex-1 px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
              required
            />
            <input
              placeholder="Postal Code"
              value={delivery.postalCode}
              onChange={(e) => setDelivery((prev) => ({ ...prev, postalCode: e.target.value }))}
              className="flex-1 px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
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
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-5 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/30 active:scale-95 transition-all"
        >
          {isSubmitting ? 'Processing...' : 'Review Order'}
        </button>
      </form>
    </div>
  )
}
