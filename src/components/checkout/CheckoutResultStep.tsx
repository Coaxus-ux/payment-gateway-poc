import { HiCheckCircle, HiXCircle } from 'react-icons/hi'
import type { PurchaseResult } from '@/types'

interface CheckoutResultStepProps {
  result: PurchaseResult | null
  onFinish: () => void
  onRetry: () => void
  onEditBilling: () => void
  isPaying?: boolean
}

export function CheckoutResultStep({ result, onFinish, onRetry, onEditBilling, isPaying }: CheckoutResultStepProps) {
  if (result?.status === 'success') {
    return (
      <div className="p-12 text-center">
        <HiCheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
        <h2 className="text-3xl font-black mb-2">Order Confirmed</h2>
        <p className="text-dark/50 text-sm mb-6 leading-relaxed">Transaction {result.transactionId} processed successfully.</p>
        {result.requestId && <p className="text-[10px] uppercase tracking-[0.3em] text-dark/40 font-black mb-6">Request ID: {result.requestId}</p>}
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
      <p className="text-dark/50 text-sm mb-6 leading-relaxed">{result?.message}</p>
      {result?.requestId && <p className="text-[10px] uppercase tracking-[0.3em] text-dark/40 font-black mb-6">Request ID: {result.requestId}</p>}
      <div className="space-y-3">
        <button
          type="button"
          onClick={onRetry}
          disabled={isPaying}
          className="w-full py-5 rounded-2xl bg-dark text-white font-black disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPaying ? 'Retrying...' : 'Retry Payment'}
        </button>
        <button
          type="button"
          onClick={onEditBilling}
          disabled={isPaying}
          className="w-full py-5 rounded-2xl bg-white text-dark font-black border-2 border-dark/10 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Cambiar datos de facturación
        </button>
      </div>
    </div>
  )
}
