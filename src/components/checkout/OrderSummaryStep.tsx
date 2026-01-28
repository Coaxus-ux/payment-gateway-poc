import { useState } from 'react'
import type { CartItem } from '@/types'
import { FEES } from '@/constants'
import { calculateLineTotal, calculateSubtotal, formatCurrency } from '@/utils/pricing'
import { CheckoutProgress } from './CheckoutProgress'

interface OrderSummaryStepProps {
  items: CartItem[]
  onConfirm: () => void
}

export function OrderSummaryStep({ items, onConfirm }: OrderSummaryStepProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = calculateSubtotal(items)
  const feesTotal = FEES.BASE + FEES.DELIVERY
  const totalPrice = subtotal + feesTotal

  const handleConfirm = () => {
    setIsProcessing(true)
    onConfirm()
  }

  return (
    <div className="p-8">
      <CheckoutProgress currentStep="SUMMARY" />
      <h2 className="text-2xl font-black text-dark tracking-tighter mb-6 text-center">Order Summary</h2>
      <div className="max-h-48 overflow-y-auto mb-6 pr-2 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center bg-dark/5 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-primary text-accent flex items-center justify-center text-[10px] font-black">x{item.quantity}</span>
              <span className="text-sm font-bold text-dark/70 truncate max-w-30">{item.name}</span>
            </div>
            <span className="font-black text-dark">{formatCurrency(calculateLineTotal(item))}</span>
          </div>
        ))}
      </div>
      <div className="bg-dark text-white rounded-3xl p-6 mb-8 space-y-3 shadow-2xl">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-40">
          <span>Processing & Delivery</span>
          <span>{formatCurrency(feesTotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-black text-xl tracking-tighter">Total Due</span>
          <div className="bg-accent px-4 py-2 rounded-xl text-dark font-black text-xl">{formatCurrency(totalPrice)}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={handleConfirm}
        disabled={isProcessing}
        className="w-full py-5 rounded-2xl bg-primary text-white font-black shadow-xl active:scale-95 transition-all flex items-center justify-center"
      >
        {isProcessing ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm Transaction'}
      </button>
    </div>
  )
}
