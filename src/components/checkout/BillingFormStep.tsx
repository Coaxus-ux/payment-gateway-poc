import { useState } from 'react'
import { FaCcVisa, FaCcMastercard } from 'react-icons/fa'
import { HiArrowLeft } from 'react-icons/hi'
import type { CheckoutData } from '@/types'
import { getCardBrand, sanitizeCardNumber } from '@/utils/payment'
import { CheckoutProgress } from './CheckoutProgress'

interface BillingFormStepProps {
  initialData: CheckoutData
  onBack: () => void
  onSubmit: (data: CheckoutData) => void
}

export function BillingFormStep({ initialData, onBack, onSubmit }: BillingFormStepProps) {
  const [formData, setFormData] = useState<CheckoutData>(initialData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const updateField = <K extends keyof CheckoutData>(key: K, value: CheckoutData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('cardNumber', sanitizeCardNumber(e.target.value))
  }

  const renderCardIcon = () => {
    const brand = getCardBrand(formData.cardNumber)
    if (brand === 'visa') return <FaCcVisa className="text-2xl text-blue-600" />
    if (brand === 'mastercard') return <FaCcMastercard className="text-2xl text-orange-500" />
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
            value={formData.cardholderName}
            onChange={(e) => updateField('cardholderName', e.target.value)}
            className="w-full px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
            required
          />
          <input
            placeholder="0000 0000 0000 0000"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            className="w-full px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all font-mono"
            required
          />
          <div className="flex gap-3">
            <input
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={(e) => updateField('expiryDate', e.target.value)}
              className="flex-1 px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
              required
            />
            <input
              placeholder="CVV"
              type="password"
              value={formData.cvv}
              onChange={(e) => updateField('cvv', e.target.value)}
              className="flex-1 px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
              required
            />
          </div>
        </div>
        <div className="space-y-3">
          <input
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            className="w-full px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
            required
          />
          <input
            placeholder="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
            required
          />
          <input
            placeholder="Street Address"
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
            className="w-full px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
            required
          />
          <input
            placeholder="City"
            value={formData.city}
            onChange={(e) => updateField('city', e.target.value)}
            className="w-full px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
            required
          />
        </div>
        <button type="submit" className="w-full py-5 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/30 active:scale-95 transition-all">
          Review Order
        </button>
      </form>
    </div>
  )
}
