import { useEffect } from 'react'
import type { CartItem, CheckoutStep, CheckoutData, PurchaseResult } from '@/types'
import { useModalAnimation } from '@/hooks'
import { ProductDetailStep, BillingFormStep, OrderSummaryStep, CheckoutResultStep } from './checkout'

interface CheckoutModalProps {
  cartItems: CartItem[]
  step: CheckoutStep
  checkoutData: CheckoutData
  onClose: () => void
  onStartCheckout: () => void
  onContinue: (data: CheckoutData) => void
  onConfirm: () => void
  onBack: () => void
  purchaseResult: PurchaseResult | null
  onFinish: () => void
  onRetry: () => void
}

export function CheckoutModal({ cartItems, step, checkoutData, onClose, onStartCheckout, onContinue, onConfirm, onBack, purchaseResult, onFinish, onRetry }: CheckoutModalProps) {
  const { modalRef, contentRef, backdropRef, animateContent } = useModalAnimation()

  useEffect(() => {
    animateContent()
  }, [step, animateContent])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div ref={backdropRef} onClick={onClose} className="absolute inset-0 bg-dark/40 backdrop-blur-md opacity-0" />
      <div ref={modalRef} className="bg-white w-full sm:max-w-xl sm:rounded-[40px] rounded-t-[40px] shadow-2xl relative z-10 overflow-hidden transform-gpu">
        <div ref={contentRef}>
          {step === 'PRODUCT_DETAIL' && <ProductDetailStep item={cartItems[0]} onClose={onClose} onContinue={onStartCheckout} />}
          {step === 'FORM' && <BillingFormStep initialData={checkoutData} onBack={onBack} onSubmit={onContinue} />}
          {step === 'SUMMARY' && <OrderSummaryStep items={cartItems} onConfirm={onConfirm} />}
          {step === 'RESULT' && <CheckoutResultStep result={purchaseResult} onFinish={onFinish} onRetry={onRetry} />}
        </div>
      </div>
    </div>
  )
}
