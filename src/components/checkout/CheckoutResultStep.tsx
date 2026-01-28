import { HiCheckCircle, HiXCircle } from 'react-icons/hi'
import type { PurchaseResult } from '@/types'

interface CheckoutResultStepProps {
  result: PurchaseResult | null
  onFinish: () => void
  onRetry: () => void
}

export function CheckoutResultStep({ result, onFinish, onRetry }: CheckoutResultStepProps) {
  if (result?.status === 'success') {
    return (
      <div className="p-12 text-center">
        <HiCheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
        <h2 className="text-3xl font-black mb-2">Order Confirmed</h2>
        <p className="text-dark/50 text-sm mb-10 leading-relaxed">Transaction {result.transactionId} processed successfully.</p>
        <button type="button" onClick={onFinish} className="w-full py-5 rounded-2xl bg-primary text-white font-black">
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="p-12 text-center">
      <HiXCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
      <h2 className="text-3xl font-black mb-2">Declined</h2>
      <p className="text-dark/50 text-sm mb-10 leading-relaxed">{result?.message}</p>
      <button type="button" onClick={onRetry} className="w-full py-5 rounded-2xl bg-dark text-white font-black">
        Retry Payment
      </button>
    </div>
  )
}
