import { useEffect, useState } from 'react'
import type { CheckoutCustomer, CheckoutDelivery, Product } from '@/types'
import { formatCurrency } from '@/utils/pricing'
import { CheckoutProgress } from './CheckoutProgress'

interface OrderSummaryStepProps {
  product: Product
  amount: number
  currency: string
  customer: CheckoutCustomer
  delivery: CheckoutDelivery
  onUpdateDelivery: (delivery: CheckoutDelivery) => void
  onPay: () => void
  isPaying?: boolean
  isUpdatingDelivery?: boolean
}

export function OrderSummaryStep({ product, amount, currency, customer, delivery, onUpdateDelivery, onPay, isPaying, isUpdatingDelivery }: OrderSummaryStepProps) {
  const [isEditingDelivery, setIsEditingDelivery] = useState(false)
  const [draftDelivery, setDraftDelivery] = useState<CheckoutDelivery>(delivery)

  useEffect(() => {
    setDraftDelivery(delivery)
  }, [delivery])

  const handleSaveDelivery = () => {
    onUpdateDelivery(draftDelivery)
    setIsEditingDelivery(false)
  }

  return (
    <div className="p-8">
      <CheckoutProgress currentStep="SUMMARY" />
      <h2 className="text-2xl font-black text-dark tracking-tighter mb-6 text-center">Order Summary</h2>

      <div className="flex gap-4 items-center bg-dark/5 p-4 rounded-3xl mb-6">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.3em] text-dark/40 font-black">Product</p>
          <p className="font-black text-dark text-lg leading-tight">{product.name}</p>
          <p className="text-sm text-dark/60">Stock {product.stock}</p>
        </div>
        <div className="font-black text-dark">{formatCurrency(amount, currency)}</div>
      </div>

      <div className="bg-dark text-white rounded-3xl p-6 mb-6 space-y-4 shadow-2xl">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Customer</p>
          <p className="font-black text-lg">{customer.fullName}</p>
          <p className="text-sm opacity-80">{customer.email}</p>
          <p className="text-sm opacity-80">{customer.phone}</p>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Delivery</p>
            <button
              type="button"
              onClick={() => setIsEditingDelivery((prev) => !prev)}
              className="text-[10px] uppercase tracking-[0.3em] font-black text-accent"
            >
              {isEditingDelivery ? 'Cancel' : 'Edit'}
            </button>
          </div>
          {isEditingDelivery ? (
            <div className="space-y-3 mt-3">
              <input
                value={draftDelivery.addressLine1}
                onChange={(e) => setDraftDelivery((prev) => ({ ...prev, addressLine1: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-sm outline-none"
                placeholder="Address"
              />
              <div className="flex gap-3">
                <input
                  value={draftDelivery.city}
                  onChange={(e) => setDraftDelivery((prev) => ({ ...prev, city: e.target.value }))}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-sm outline-none"
                  placeholder="City"
                />
                <input
                  value={draftDelivery.postalCode}
                  onChange={(e) => setDraftDelivery((prev) => ({ ...prev, postalCode: e.target.value }))}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-sm outline-none"
                  placeholder="Postal Code"
                />
              </div>
              <input
                value={draftDelivery.country}
                onChange={(e) => setDraftDelivery((prev) => ({ ...prev, country: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-sm outline-none"
                placeholder="Country"
              />
              <button
                type="button"
                onClick={handleSaveDelivery}
                disabled={isUpdatingDelivery}
                className="w-full py-3 rounded-xl bg-accent text-dark font-black"
              >
                {isUpdatingDelivery ? 'Saving...' : 'Save Delivery'}
              </button>
            </div>
          ) : (
            <div className="mt-2 text-sm opacity-80">
              <p>{delivery.addressLine1}</p>
              <p>
                {delivery.city}, {delivery.postalCode}
              </p>
              <p>{delivery.country}</p>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onPay}
        disabled={isPaying}
        className="w-full py-5 rounded-2xl bg-primary text-white font-black shadow-xl active:scale-95 transition-all flex items-center justify-center"
      >
        {isPaying ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Pagar'}
      </button>
    </div>
  )
}
